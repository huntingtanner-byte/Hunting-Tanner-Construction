/**
 * "Add photos or plans" on the lead forms. Each picked file uploads in the
 * background, one at a time, to the private Blob store, so it's usually
 * done before the visitor taps submit. Big phone photos are shrunk first.
 * See src/lib/uploads.ts for the whole flow and the limits.
 */
import { business } from "@/config/business";
import {
  MAX_FILES,
  MAX_TOTAL_BYTES,
  UPLOAD_FOLDER,
  formatBytes,
  storageName,
  uploadTypeFor,
} from "@/lib/uploads";

type UploadState = "waiting" | "uploading" | "done" | "error";

interface UploadItem {
  file: File;
  type: string;
  /** Bytes actually stored (after shrinking), counted toward the total */
  bytes: number;
  state: UploadState;
  pathname?: string;
  controller: AbortController;
  row: HTMLLIElement;
  meta: HTMLElement;
}

export interface LeadUploads {
  /** True while a file is still waiting or uploading */
  busy(): boolean;
  /** Resolves once every queued file has finished or failed */
  settled(): Promise<void>;
  /** Value for the hidden "attachments" field */
  serialize(): string;
}

const TOO_BIG = `Too big for the form (25 MB total). Please email it to ${business.email}.`;

class TooBigError extends Error {}

/**
 * Phone photos run 3 to 6 MB. Re-encoding the big ones at 2560px, still
 * plenty to judge a room, lets ten of them fit in one email and uploads
 * them faster on cell data. Anything the browser can't decode is sent
 * as it is.
 */
async function shrinkPhoto(file: File): Promise<Blob> {
  if (file.size <= 1.5 * 1024 * 1024) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, 2560 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const smaller = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    return smaller && smaller.size < file.size ? smaller : file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function setupLeadUploads(field: HTMLElement): LeadUploads {
  const input = field.querySelector<HTMLInputElement>("[data-file-input]");
  const button = field.querySelector<HTMLButtonElement>("[data-file-button]");
  const list = field.querySelector<HTMLUListElement>("[data-file-list]");
  const error = field.querySelector<HTMLElement>("[data-file-error]");
  const live = field.querySelector<HTMLElement>("[data-file-live]");
  if (!input || !button || !list || !error || !live) {
    return { busy: () => false, settled: async () => {}, serialize: () => "" };
  }

  const items: UploadItem[] = [];
  let queue: Promise<void> = Promise.resolve();

  const showError = (message: string) => {
    error.textContent = message;
    error.hidden = message === "";
  };

  const setState = (item: UploadItem, state: UploadState, text: string) => {
    item.state = state;
    item.row.dataset.state = state;
    item.meta.textContent = text;
  };

  const isBusy = (item: UploadItem) =>
    item.state === "waiting" || item.state === "uploading";

  const storedBytes = () =>
    items.reduce((sum, item) => sum + (item.state === "error" ? 0 : item.bytes), 0);

  const uploadOne = async (item: UploadItem) => {
    if (item.controller.signal.aborted) return;
    setState(item, "uploading", "Uploading…");
    try {
      const body =
        item.type === "image/jpeg" ? await shrinkPhoto(item.file) : item.file;
      if (storedBytes() + body.size > MAX_TOTAL_BYTES) throw new TooBigError();
      item.bytes = body.size;
      // Loaded only once someone actually attaches a file
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(UPLOAD_FOLDER + storageName(item.file.name), body, {
        access: "private",
        handleUploadUrl: "/api/upload/",
        contentType: item.type,
        multipart: body.size > 10 * 1024 * 1024,
        abortSignal: item.controller.signal,
        onUploadProgress: ({ percentage }) => {
          item.meta.textContent = `Uploading… ${Math.round(percentage)}%`;
        },
      });
      item.pathname = blob.pathname;
      setState(item, "done", `Uploaded · ${formatBytes(body.size)}`);
      live.textContent = `${item.file.name} uploaded.`;
    } catch (err) {
      if (item.controller.signal.aborted) return;
      item.bytes = 0;
      const message =
        err instanceof TooBigError
          ? TOO_BIG
          : "Couldn't upload. Remove it and try again.";
      setState(item, "error", message);
      live.textContent = `${item.file.name}: ${message}`;
    }
  };

  const addFile = (file: File) => {
    const type = uploadTypeFor(file);
    if (!type) {
      showError(`"${file.name}" isn't a photo or PDF, so it wasn't added.`);
      return;
    }
    if (items.length >= MAX_FILES) {
      showError(`You can add up to ${MAX_FILES} files. Please email any others to ${business.email}.`);
      return;
    }
    // Only JPEG photos get shrunk, so anything else this big can't fit
    if (type !== "image/jpeg" && file.size > MAX_TOTAL_BYTES) {
      showError(`"${file.name}" is too big for the form (25 MB). Please email it to ${business.email}.`);
      return;
    }

    const row = document.createElement("li");
    row.className = "file-item";
    const name = document.createElement("span");
    name.className = "file-name";
    name.textContent = file.name;
    const meta = document.createElement("span");
    meta.className = "file-meta";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "file-remove";
    remove.setAttribute("aria-label", `Remove ${file.name}`);
    remove.textContent = "×";
    row.append(name, meta, remove);
    list.append(row);
    list.hidden = false;

    const item: UploadItem = {
      file,
      type,
      bytes: 0,
      state: "waiting",
      controller: new AbortController(),
      row,
      meta,
    };
    items.push(item);
    setState(item, "waiting", "Waiting…");

    // Removing a finished file just leaves it out of the email; the
    // server clears unsent uploads after a week.
    remove.addEventListener("click", () => {
      item.controller.abort();
      items.splice(items.indexOf(item), 1);
      row.remove();
      list.hidden = items.length === 0;
      showError("");
      button.focus();
    });

    queue = queue.then(() => uploadOne(item));
  };

  button.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    showError("");
    Array.from(input.files ?? []).forEach(addFile);
    // Lets the same file be picked again after it's removed
    input.value = "";
  });

  return {
    busy: () => items.some(isBusy),
    settled: async () => {
      while (items.some(isBusy)) await queue;
    },
    serialize: () => {
      const done = items.filter((item) => item.state === "done" && item.pathname);
      return done.length > 0
        ? JSON.stringify(done.map((item) => ({ pathname: item.pathname, name: item.file.name })))
        : "";
    },
  };
}

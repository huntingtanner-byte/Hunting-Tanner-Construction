/**
 * IndexNow: tells Bing (and the other IndexNow search engines: Yandex,
 * Seznam, Naver, Yep) which pages changed, so updates reach Bing, Copilot,
 * and ChatGPT search without waiting for a recrawl. Google doesn't use
 * IndexNow; use Search Console for Google.
 *
 * Run after a PRODUCTION deploy (the key file must already be live):
 *   npm run indexnow                                   every URL in the live sitemap
 *   npm run indexnow -- /lehi-basement-finishing/ /faq/  just these paths
 *
 * The key is public by design. It must match public/<key>.txt, which proves
 * the site owner sent the request. Only submit pages that actually changed.
 */
const HOST = "utahcountybasementpros.com";
const KEY = "cf79b5e9451fd04ca3db770f4780e6ec";
const ORIGIN = `https://${HOST}`;

async function sitemapUrls() {
  const index = await (await fetch(`${ORIGIN}/sitemap-index.xml`)).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const sitemap of sitemaps) {
    const xml = await (await fetch(sitemap)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => new URL(p, ORIGIN).href)
  : await sitemapUrls();

if (urlList.length === 0) {
  console.error("No URLs to submit.");
  process.exit(1);
}

// The key file has to be reachable before IndexNow will accept anything
const keyCheck = await fetch(`${ORIGIN}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file ${ORIGIN}/${KEY}.txt isn't live yet. Deploy first.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted while the key is being verified
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}

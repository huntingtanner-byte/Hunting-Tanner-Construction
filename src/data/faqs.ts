/**
 * FAQ content. Every answer here appears verbatim on the site, so answers
 * must stay accurate and free of unverified claims. Editorial notes about
 * items needing confirmation live in CONTENT-TODO.md, not in this copy.
 */

export interface FAQ {
  question: string;
  answer: string;
}

/** Homepage FAQ (6–8 high-level questions) */
export const homeFaqs: FAQ[] = [
  {
    question: "How much does it cost to finish a basement in Utah County?",
    answer:
      "It depends on square footage, the number of bathrooms and bedrooms, and the level of finish — which is why we don't quote from a phone call alone. After a walkthrough, you'll receive a written scope and an itemized proposal so you can see exactly what drives the number. If you share a budget range early, we'll plan the scope around it honestly.",
  },
  {
    question: "How long does a basement finish take?",
    answer:
      "Most full basement finishes take a few months from start of construction to final walkthrough, depending on size, scope, and inspection scheduling. You'll receive an estimated timeline with your proposal, and regular updates while work is underway — including when anything shifts and why.",
  },
  {
    question: "Do I need a permit to finish my basement?",
    answer:
      "In nearly all Utah cities, yes — finishing a basement involves framing, electrical, and often plumbing work that requires permits and inspections. Handling permits correctly protects your home's value and safety. Permit coordination is part of how projects are planned; we'll walk you through what applies to your city during the consultation.",
  },
  {
    question: "Who will actually be working in my home?",
    answer:
      "Qualified trade partners — electricians, plumbers, HVAC, drywall, and finish crews — coordinated and scheduled by Hunting Tanner Construction. You'll know who is expected, on which days, and what they're doing. One point of contact stays accountable to you for the entire project: Hunting.",
  },
  {
    question: "What makes a basement bedroom \"legal\"?",
    answer:
      "Bedrooms generally need an egress window — an opening large enough to exit through in an emergency — plus proper smoke detection and minimum ceiling heights. If your basement doesn't have egress windows yet, that's a normal part of scope planning, not a dealbreaker. We'll assess what your space needs during the walkthrough.",
  },
  {
    question: "Can you work with the plumbing rough-in my builder left?",
    answer:
      "Usually, yes. Many newer Utah County homes come with under-slab plumbing rough-ins for a future bathroom. We evaluate what's stubbed in during the walkthrough and plan the bathroom around it — or discuss options if the rough-in doesn't match the layout you want.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments follow a written schedule tied to project milestones, spelled out in your proposal before anything is signed. You'll never be asked to pay for work that hasn't been defined in writing, and change orders are priced and approved in writing before that work proceeds.",
  },
  {
    question: "Is Hunting Tanner Construction taking on new projects?",
    answer:
      "We're currently scheduling basement consultations for homeowners in Saratoga Springs, Lehi, Herriman, and communities throughout Utah County. The best first step is a short conversation about your space — call (801) 901-8349 or send the consultation form.",
  },
];

/** Full FAQ page — grouped questions */
export interface FAQGroup {
  title: string;
  faqs: FAQ[];
}

export const faqPageGroups: FAQGroup[] = [
  {
    title: "Cost & Payments",
    faqs: [
      {
        question: "What will my basement cost?",
        answer:
          "Honest answer: it depends on the size of the space, how many rooms and bathrooms you're adding, and the finishes you choose. Rather than throwing out a number that changes later, we build a written scope after walking your basement, then price that scope line by line. You'll see where the money goes before you commit to anything.",
      },
      {
        question: "What is included in your proposals?",
        answer:
          "The proposal is built from the written scope: the work included room by room, allowances for selections like flooring and fixtures, the payment schedule, an estimated timeline, and what is specifically excluded. The goal is that nothing important lives in someone's head — it's all on paper.",
      },
      {
        question: "How are payments structured?",
        answer:
          "Payments are tied to defined milestones and laid out in the proposal before signing. Change orders are documented and priced in writing before the changed work proceeds, so the final invoice reflects decisions you already approved.",
      },
      {
        question: "Do you share a budget field on your form — will I be judged by it?",
        answer:
          "The investment-range field on our contact form is optional, and it exists so we can give you useful guidance faster — for example, telling you honestly if your goals and range don't line up, and what trade-offs could close the gap. It's never used to decide whether you're \"worth\" a callback.",
      },
    ],
  },
  {
    title: "Timeline & Process",
    faqs: [
      {
        question: "How long will my project take?",
        answer:
          "A full basement finish typically runs a few months of construction, driven by scope, inspection scheduling, and material lead times. Your proposal includes an estimated timeline, and weekly communication keeps you current on progress and what's coming next.",
      },
      {
        question: "What happens when the scope changes mid-project?",
        answer:
          "Changes happen — you might decide to add a built-in, or an inspection may require something unexpected. Every change is documented as a written change order with pricing before the work proceeds. You approve it, then it happens. No verbal \"we'll settle up later.\"",
      },
      {
        question: "How will I receive updates?",
        answer:
          "You'll have a direct line to Hunting, plus regular scheduled updates covering what happened, what's next, and any decisions needed from you. If you text or call with a question, you get an answer — responsiveness is one of the main reasons this company exists.",
      },
      {
        question: "What happens during inspections?",
        answer:
          "Permitted work is inspected at defined stages — typically after framing, rough electrical and plumbing, and again at completion. We schedule and attend inspections, handle any corrections, and keep you informed. Inspections are a feature, not a nuisance: they're independent verification that work in your home is done right.",
      },
    ],
  },
  {
    title: "Permits, Codes & Safety",
    faqs: [
      {
        question: "Who handles permits?",
        answer:
          "Permit coordination is planned into the project from the start. Requirements vary by city — Saratoga Springs, Lehi, Herriman, and each Utah County city run their own building departments — and we'll walk you through what applies to your address during the consultation.",
      },
      {
        question: "What are egress requirements for basement bedrooms?",
        answer:
          "Sleeping rooms need an emergency escape opening — usually an egress window with a window well — sized so an adult can exit. Adding egress windows to a basement without them is common work and is scoped up front, including excavation and window wells where needed.",
      },
      {
        question: "How is my home protected during construction?",
        answer:
          "Floor and pathway protection on work routes, dust containment at the basement entry, and defined work hours. Crews use an agreed entrance, and the site is left secure at the end of each work day. If something isn't being handled the way you expect, you tell Hunting directly and it gets fixed.",
      },
    ],
  },
  {
    title: "Design & Selections",
    faqs: [
      {
        question: "How are selections (flooring, fixtures, colors) made?",
        answer:
          "Your proposal includes allowances for each selection category. We'll give you a decision list with deadlines that keep the schedule on track, guidance on where spending more actually shows, and where standard products perform just as well. You make the choices; we keep them organized.",
      },
      {
        question: "Can you design the layout, or do I need my own plans?",
        answer:
          "Layout planning is part of the process. During the walkthrough and scope phase we work out room placement around the realities of your space — mechanical rooms, ceiling heights, windows, and plumbing rough-ins. For projects requiring drawings for permits, we coordinate what the city needs.",
      },
      {
        question: "Do you build wet bars, theaters, and built-ins?",
        answer:
          "Yes — wet bars, kitchenettes, media walls, built-in shelving, and finish carpentry are some of the most rewarding parts of a basement. See the basement finishing page for what's possible, and bring your ideas to the consultation.",
      },
    ],
  },
  {
    title: "About the Company",
    faqs: [
      {
        question: "Is Hunting Tanner Construction a new company?",
        answer:
          "Yes, and we're straightforward about it. Hunting Tanner Construction is a Utah County company built around organized project management, financial discipline, responsive communication, and qualified trade partners — with experienced construction mentorship behind it. What we won't do is invent a history we don't have. What we will do is run your project like it's the one that builds our reputation, because it is.",
      },
      {
        question: "Which areas do you serve?",
        answer:
          "Saratoga Springs, Lehi, and communities throughout Utah County — including Eagle Mountain, American Fork, Vineyard, Pleasant Grove, Highland, Alpine, Lindon, Orem, and Provo — plus Herriman in southwest Salt Lake County.",
      },
      {
        question: "How do I get started?",
        answer:
          "Call (801) 901-8349, email office@huntingtanner.com, or send the consultation form. You'll get a conversation about your space and clear next steps — see how the process works from first call to final walkthrough.",
      },
    ],
  },
];

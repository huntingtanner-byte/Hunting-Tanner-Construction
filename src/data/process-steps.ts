/** The six-step HTC process, used on the homepage preview and /process/ page. */

export interface ProcessStep {
  title: string;
  /** One-line summary for the homepage preview */
  summary: string;
  /** Fuller explanation for /process/ */
  detail: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Initial Conversation",
    summary:
      "A short call to understand your space, your goals, and your rough timeline.",
    detail:
      "It starts with a phone call or a form submission. We'll talk through what you have (square footage, what's roughed in, what you want the space to become) and whether the project is a good fit. You'll get straight answers about what's realistic, and no pressure. If it makes sense to move forward, we schedule a walkthrough.",
  },
  {
    title: "On-Site Walkthrough",
    summary:
      "We meet at your home, measure the space, and talk through options in person.",
    detail:
      "Standing in the actual basement changes the conversation. We look at ceiling heights, mechanical locations, plumbing rough-ins, window sizes, and access: the things that shape what's possible and what it will cost. You'll hear practical options, including ones that save money, and we'll take the measurements and photos needed to build a real scope.",
  },
  {
    title: "Scope & Planning",
    summary:
      "Your project gets a written scope: what's included, what isn't, and what decisions are needed.",
    detail:
      "This is where organization pays off. We define the project room by room (framing, electrical, plumbing, HVAC, insulation, drywall, trim, doors, flooring, and fixtures) so there's a shared, written understanding of exactly what's being built. Open questions and selections you'll need to make are listed, not left to be discovered mid-project.",
  },
  {
    title: "Detailed Proposal",
    summary:
      "A clear, itemized proposal priced from the written scope, not a napkin estimate.",
    detail:
      "You receive a proposal built directly from the scope: pricing, allowances for selections, payment schedule, and an estimated timeline. We walk through it together so every line makes sense before anything is signed. If the scope changes later, changes are documented in writing with pricing before work proceeds. No surprise invoices.",
  },
  {
    title: "Construction & Communication",
    summary:
      "Qualified trades, an organized schedule, and regular updates while work is underway.",
    detail:
      "Work is sequenced and coordinated with qualified trade partners, with inspections built into the schedule. You'll know what's happening in your home each week, who will be there, and what's next. Questions get answered quickly. Responsiveness is a core commitment, not a slogan.",
  },
  {
    title: "Final Walkthrough & Closeout",
    summary:
      "A punch-list walkthrough together, final details completed, and your documents handed over.",
    detail:
      "Before the project is called done, we walk the space together and list anything that needs attention. Punch-list items get completed, the space gets cleaned, and you receive closeout information for your records. The goal is a finished basement you're glad to show off, and a contractor you'd call again.",
  },
];

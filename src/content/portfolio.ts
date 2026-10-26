export interface Panel {
  id: string;
  heading: string;
  body: string;
}
export type SectorId = "arrival" | "systems" | "workshop" | "agents" | "career";
export const destinations: { id: SectorId; label: string }[] = [
  { id: "systems", label: "Delivery systems" },
  { id: "workshop", label: "Robotics workshop" },
  { id: "agents", label: "Agent lab" },
  { id: "career", label: "Career and contact" },
];
export const profile = {
  name: "Mohsen Esmaeili",
  role: "Software engineer · Helsinki",
  introduction:
    "I build platforms, integrations, and tools that connect software to the physical world.",
  links: [
    { label: "GitHub", href: "https://github.com/m-esm" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/m-esm" },
  ],
};
export const delivery = {
  id: "delivery-systems",
  title: "Delivery systems",
  publication: "public" as const,
  category: "professional" as const,
  evidence: [{ kind: "cv", reference: "Supplied CV, pp. 1–2" }],
  panels: [
    {
      id: "context",
      heading: "Connecting the last mile",
      body: "At Starship Technologies, I architected and built the Delivery-as-a-Service platform, connecting external partners with autonomous last-mile delivery robots.",
    },
    {
      id: "responsibility",
      heading: "From API to operations",
      body: "My work included the partner API, an operational console, integrations with partner engineering teams, and developer tooling for integration and testing.",
    },
    {
      id: "tooling",
      heading: "Tools for the ecosystem",
      body: "I built end-to-end testing systems, watchdog services, and an integration playground to support the partner ecosystem.",
    },
  ] satisfies Panel[],
  caption:
    "Illustrative delivery flow. This model is not a production architecture diagram or a live system.",
};
export interface Exhibit {
  id: string;
  title: string;
  sector: SectorId;
  publication: "public";
  category: "professional" | "personal" | "illustration";
  evidence: { kind: string; reference: string }[];
  panels: Panel[];
  caption?: string;
}
export const exhibits: Exhibit[] = [
  { ...delivery, sector: "systems" },
  {
    id: "workshop",
    title: "Robotics workshop",
    sector: "workshop",
    publication: "public",
    category: "illustration",
    evidence: [
      {
        kind: "design",
        reference:
          "Original station illustration; historical framework from supplied CV and old portfolio",
      },
    ],
    panels: [
      {
        id: "mechanisms",
        heading: "From software to mechanisms",
        body: "A repair bench explores the boundary between code and moving parts. The articulated mechanism is an original station illustration, not a named personal robot or a shipped product.",
      },
      {
        id: "framework",
        heading: "Reusable backend tools",
        body: "Serendip Framework is one of my historical personal projects: a reusable backend framework and tooling effort. It belongs here as an example of building tools for other software, alongside the physical workshop's tools and fixtures.",
      },
    ],
    caption:
      "Illustrative mechanism. Historical project context does not imply current maintenance.",
  },
  {
    id: "agent-lab",
    title: "Agent lab",
    sector: "agents",
    publication: "public",
    category: "illustration",
    evidence: [
      {
        kind: "design",
        reference:
          "Original routing illustration; Multi Branch from supplied CV and old portfolio",
      },
    ],
    panels: [
      {
        id: "routing",
        heading: "Work moving through a system",
        body: "A token travels between request, worker and review stations. This deterministic sculpture illustrates handoffs and feedback. It does not run AI agents or access live infrastructure.",
      },
      {
        id: "branches",
        heading: "One instance per branch",
        body: "Multi Branch is a historical personal project built around an instance for each branch. The small branch rack beside this board illustrates that idea. The model is conceptual; it is not connected to repositories or running deployments.",
      },
    ],
    caption:
      "Illustrative experiment. No live agents, repository access or production topology.",
  },
  {
    id: "career",
    title: "Career and contact",
    sector: "career",
    publication: "public",
    category: "professional",
    evidence: [
      {
        kind: "owner-context",
        reference: "Owner-provided current role; supplied CV for previous work",
      },
    ],
    panels: [
      {
        id: "career-now",
        heading: "Engineering across systems",
        body: "I am a Staff Engineer at Songtradr, based in Helsinki. My engineering background spans backend platforms, integrations and developer tools. At Starship Technologies, I architected and built the Delivery-as-a-Service platform explored in the systems yard.",
      },
      {
        id: "contact",
        heading: "Continue the conversation",
        body: "For professional background and a way to get in touch, visit my LinkedIn profile. You can also explore my public repositories on GitHub. The station is an invitation to look around; there is no task to finish before reaching out.",
      },
    ],
  },
];
export function exhibitForBoard(id: string) {
  return exhibits.find((exhibit) =>
    exhibit.panels.some((panel) => panel.id === id),
  );
}
export const boardIds = [
  "arrival",
  "directory",
  ...exhibits.flatMap((e) => e.panels.map((p) => p.id)),
] as const;
export type BoardId = (typeof boardIds)[number];
export function validateContent() {
  if (new Set(boardIds).size !== boardIds.length)
    throw Error("Duplicate panel ID");
  if (exhibits.some((e) => e.publication !== "public" || !e.evidence.length))
    throw Error("Only curated public content can ship");
  for (const link of profile.links)
    if (new URL(link.href).protocol !== "https:")
      throw Error("Unsupported link");
  return true;
}

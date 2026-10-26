export interface Panel {
  id: string;
  heading: string;
  body: string;
  link?: { label: string; href: string };
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
  role: "Staff Engineer · Helsinki",
  introduction:
    "Staff Engineer at Songtradr. Previously, I architected and built Starship’s Delivery-as-a-Service platform.",
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
      body: "I designed the unified partner API and built the Next.js operational console. I led technical integrations with partner teams including Uber, Bolt, Wolt, S-Group, Foodora, Grubhub, Deliveroo and Bringg.",
    },
    {
      id: "tooling",
      heading: "Tools for the ecosystem",
      body: "I built end-to-end testing systems, watchdog services and an integration playground. I also contributed to centralizing marketplace cart, tax and fee calculations in Go.",
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
    title: "Parviz / Robotics",
    sector: "workshop",
    publication: "public",
    category: "personal",
    evidence: [
      {
        kind: "design",
        reference:
          "Public m-esm/Parviz and m-esm/mechlib READMEs, reviewed 26 October 2026",
      },
    ],
    panels: [
      {
        id: "mechanisms",
        heading: "Parviz: a desk robot",
        body: "A tracked robot designed around a Raspberry Pi 5, a touchscreen face and a camera eye. Parametric Python CAD connects printed parts, a pan/tilt neck and drive tracks. The mechanical assembly is a CAD prototype; the repository also contains a working software spike.",
        link: {
          label: "Explore Parviz",
          href: "https://github.com/m-esm/Parviz",
        },
      },
      {
        id: "framework",
        heading: "Mechlib: code into parts",
        body: "A Python library of parametric mechanical components: gears, cams, linkages, ratchets, couplings and flexures. The interactive gallery lets you inspect mechanisms and retune parameters in the browser with Pyodide.",
        link: {
          label: "Open mechanical gallery",
          href: "https://m-esm.github.io/mechlib/",
        },
      },
    ],
    caption:
      "Enlarged source CAD, with a lightweight loading model. Not yet printed or assembled. Click the robot to separate its assemblies.",
  },
  {
    id: "agent-lab",
    title: "Smart subagents / AI tools",
    sector: "agents",
    publication: "public",
    category: "personal",
    evidence: [
      {
        kind: "design",
        reference:
          "Public m-esm/smart-subagents and m-esm/node-multi-branch READMEs, reviewed 26 October 2026",
      },
    ],
    panels: [
      {
        id: "routing",
        heading: "The right agent for the work",
        body: "Smart subagents routes coding tasks using CLI quota headroom and task difficulty. Work runs in an isolated Git worktree, with diff verification before reporting back. Task size and reasoning difficulty are treated separately.",
        link: {
          label: "View smart-subagents",
          href: "https://github.com/m-esm/smart-subagents",
        },
      },
      {
        id: "branches",
        heading: "One instance per branch",
        body: "Multi Branch runs an instance for each branch of a Node.js repository and selects between them using an HTTP header. It is an earlier exploration of isolated development environments, a theme that also appears in my agent tooling.",
        link: {
          label: "View Multi Branch",
          href: "https://github.com/m-esm/node-multi-branch",
        },
      },
    ],
    caption:
      "The routing exhibit is a deterministic illustration of the public project. No live agents or account access.",
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

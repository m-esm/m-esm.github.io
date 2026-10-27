import { editorial } from "./editorial";
import { chronology, type TimelineEntry } from "./chronology";
export type ProjectCategory =
  | "Music & play"
  | "Useful products"
  | "Robotics & making"
  | "AI tools"
  | "Systems";
export interface PersonalProject {
  id: string;
  title: string;
  year: string;
  category: ProjectCategory;
  tagline: string;
  body: string;
  detail: string;
  source: string;
  demo?: string;
  demoLabel?: string;
  image?: string;
  imageAlt?: string;
  sketch?: "handpan" | "trajectory" | "torque" | "cad" | "agents" | "nutrition";
  related?: { label: string; href: string }[];
}
export const personalProjects: PersonalProject[] = [
  {
    id: "handpan",
    title: "Alamut",
    year: "2026 · October",
    category: "Music & play",
    tagline: "A practice space for the handpan.",
    body: "A playable D Kurd handpan, a searchable pattern library and phrase-by-phrase practice, set in Persian-inspired mountain courtyards.",
    detail:
      "Play and Learn share the same score. Practice can isolate a phrase, slow it down, highlight notes and respond to screen taps. The full app also offers optional microphone input; this small sketch only synthesizes notes when you tap.",
    source: "https://github.com/m-esm/handpan",
    demo: "https://m-esm.github.io/handpan/",
    demoLabel: "Open Alamut",
    image: "/assets/projects/alamut.webp",
    imageAlt:
      "Alamut at dusk, original cover artwork from the handpan repository",
    sketch: "handpan",
  },
  {
    id: "my-inventory",
    title: "My Inventory",
    year: "2026 · June",
    category: "Useful products",
    tagline: "Find the part. Keep the stack small.",
    body: "A photo-first inventory for electronics, fasteners and small parts. Capture a photo, record a quantity and location, then find it again through search or the storage map.",
    detail:
      "One Python server using the standard library, with JSON storage, read-only sharing, authenticated editing and an MCP interface. It reflects an engineering choice I value: use a small, understandable stack when it fits the problem.",
    source: "https://github.com/m-esm/my-inventory",
    demo: "https://m-esm.github.io/my-inventory/",
    demoLabel: "Project page",
    image: "/assets/projects/inventory-dashboard.png",
    imageAlt:
      "The public My Inventory dashboard screenshot from its repository",
  },
  {
    id: "hillshot",
    title: "Hillshot",
    year: "2026 · September",
    category: "Music & play",
    tagline: "A game with the physics on the server.",
    body: "A turn-based browser artillery game with destructible terrain, wind, multiple weapons and room codes for playing together.",
    detail:
      "The server resolves physics, damage and turn order; Phaser presents the resulting trajectories. Bots simulate candidate shots against a copy of the game state. The sketch here demonstrates aiming, not the full game or its physics implementation.",
    source: "https://github.com/m-esm/hillshot",
    sketch: "trajectory",
  },
  {
    id: "macros",
    title: "Macros",
    year: "2026 · February",
    category: "Useful products",
    tagline: "A better view of the grocery shelf.",
    body: "A Chrome extension that adds a sortable nutrition table to Wolt Market, with product search, nutrient filters and configurable scoring.",
    detail:
      "Built in vanilla JavaScript with Manifest V3. A page interceptor captures category data, the content script builds the table, and a service worker fetches nutrition details. This is my independent extension, separate from my Starship partner work.",
    source: "https://github.com/m-esm/macros",
    demo: "https://chromewebstore.google.com/detail/macros/mmhjcmjpihgmgkeiiadkfgnndbbnkplj",
    demoLabel: "Chrome Web Store",
    image: "/assets/projects/macros-table.png",
    imageAlt: "Macros nutrition table, from the extension’s repository",
    sketch: "nutrition",
  },
  ...editorial.projects
    .filter((p) => p.id !== "socket-cluster")
    .map((p) => ({
      id: p.id,
      title: p.title,
      year: "2026 · " + (p.id === "parviz" ? "July" : "August"),
      category: (p.id === "smart-subagents"
        ? "AI tools"
        : "Robotics & making") as ProjectCategory,
      tagline:
        p.id === "parviz"
          ? "A desk robot, from code to CAD."
          : p.id === "mechlib"
            ? "Mechanisms you can generate."
            : "Give each coding task the right worker.",
      body: p.body,
      detail: p.detail,
      source: p.source,
      demo: p.demo,
      demoLabel: p.demoLabel,
      image:
        p.id === "parviz"
          ? "/assets/projects/parviz-cad.jpg"
          : p.id === "mechlib"
            ? "/assets/projects/mechlib-gallery.png"
            : undefined,
      imageAlt:
        p.id === "parviz"
          ? "Parviz source CAD, not an assembled physical robot"
          : "Mechanism renders from the Mechlib gallery",
      sketch: p.id === "smart-subagents" ? ("agents" as const) : undefined,
    })),
  {
    id: "cad-workflows",
    title: "Code → CAD → print",
    year: "2026 · June–July",
    category: "Robotics & making",
    tagline: "A connected set of fabrication tools.",
    body: "Three companion tools turn parametric Python into inspected geometry and sliceable Bambu Studio projects. Imported STEP, IGES and STL files can join the same workflow.",
    detail:
      "3d-print-modeling supplies assembly and parts viewers; foreign-cad-import covers imported geometry and measurements; bambu-3mf-export packages named plates and print settings. The important handoff is usable geometry and configuration, not just a mesh file.",
    source: "https://github.com/m-esm/3d-print-modeling",
    image: "/assets/projects/cad-workflow.png",
    imageAlt: "Parts viewer from the 3d-print-modeling repository",
    sketch: "cad",
    related: [
      {
        label: "CAD import",
        href: "https://github.com/m-esm/foreign-cad-import",
      },
      {
        label: "Bambu export",
        href: "https://github.com/m-esm/bambu-3mf-export",
      },
    ],
  },
  {
    id: "claude-code-cockpit",
    title: "Claude Code Cockpit",
    year: "2026 · October",
    category: "AI tools",
    tagline: "See what the agent workflow is doing.",
    body: "A cockpit for interview clarity, CLI quota, hook activity and background worker outcomes, with a compact status band above the prompt.",
    detail:
      "The interface connects visible workflow state with interview rules and optional background planning. It supports SVG charts in the desktop app and text bars in the terminal. This is an independent modification, not an official Anthropic feature.",
    source: "https://github.com/m-esm/claude-code-cockpit",
    related: [
      {
        label: "Questioning skill",
        href: "https://github.com/m-esm/questioning",
      },
    ],
  },
  {
    id: "jev-model-router",
    title: "Jev Model Router",
    year: "2026 · October",
    category: "AI tools",
    tagline: "Match reasoning effort to the prompt.",
    body: "A Claude Code plugin that uses TypeSafe Jev scores to select model and reasoning effort, with explicit routing rules.",
    detail:
      "It distinguishes prompt difficulty from continuation, preserves model-scoped cache considerations and applies routing through hooks. This is a separate decision from smart-subagents, which chooses a worker with available quota.",
    source: "https://github.com/m-esm/jev-model-router",
  },
  {
    id: "torque-lever",
    title: "Torque lever",
    year: "2026 · July",
    category: "Robotics & making",
    tagline: "A small print that answers a real question.",
    body: "A printable lever for measuring a door-lock tailpiece’s operating torque with a luggage scale, to inform actuator motor selection.",
    detail:
      "The primary measurement hole is 102 mm from the axis. For a perpendicular pull, torque is scale mass × 9.81 × lever length: roughly 1 Nm per kilogram at that hole. The second hole is 51 mm from the axis.",
    source: "https://github.com/m-esm/torque-lever",
    sketch: "torque",
  },
  {
    id: "whichui",
    title: "Which UI?",
    year: "2024 · March",
    category: "Useful products",
    tagline: "Compare React component libraries.",
    body: "A comparison tool for React UI frameworks, their component coverage and framework details.",
    detail:
      "An earlier Next.js project exploring a practical developer decision: which component library fits the interface being built. Repository features are described as implemented, not a claim that its comparison data is current.",
    source: "https://github.com/m-esm/whichui",
  },
  ...editorial.projects
    .filter((p) => p.id === "socket-cluster")
    .map((p) => ({
      id: p.id,
      title: p.title,
      year: "2020 · April",
      category: "Systems" as ProjectCategory,
      tagline: "One user, several connected clients.",
      body: p.body,
      detail: p.detail,
      source: p.source,
      demo: p.demo,
      demoLabel: "Read the article",
    })),
  {
    id: "e2db",
    title: "E2DB",
    year: "2020 · August",
    category: "Systems",
    tagline: "Exploring field-level encryption.",
    body: "An educational Node.js example for encrypting selected database fields and stored files, with AES secrets wrapped by RSA keys.",
    detail:
      "Historical cryptography exploration with an accompanying public implementation. Presented as an engineering example, not a security-audited recommendation for new systems.",
    source: "https://github.com/m-esm/e2db",
  },
  {
    id: "node-multi-branch",
    title: "Multi Branch",
    year: "2019 · December",
    category: "Systems",
    tagline: "An environment for each Git branch.",
    body: "A Node.js tool that starts a project instance per branch and routes requests using a header.",
    detail:
      "Earlier developer-tooling work on making parallel versions of an application available through a common entry point.",
    source: "https://github.com/m-esm/node-multi-branch",
  },
];
export const projectCategories: ProjectCategory[] = [
  "Music & play",
  "Useful products",
  "Robotics & making",
  "AI tools",
  "Systems",
];

// Public project dates describe repository creation, not invented project start dates.
export const portfolioTimeline: TimelineEntry[] = [
  ...chronology.filter(
    (c) =>
      c.track === "professional" ||
      [
        "Independent software work",
        "Second Brain",
        "The orbital portfolio",
      ].includes(c.title),
  ),
  ...personalProjects.map((p) => ({
    year: p.year,
    title: p.title,
    body: p.body,
    track: "independent" as const,
    kind: (p.category === "Robotics & making"
      ? "mechanical"
      : p.category === "AI tools"
        ? "agents"
        : "code") as TimelineEntry["kind"],
    href: p.source,
    focus: [p.category],
  })),
].sort((a, b) => timelineDate(b.year) - timelineDate(a.year));
function timelineDate(date: string) {
  const year = Number(date.match(/\d{4}/)?.[0] || 0);
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const match = date
    .toLowerCase()
    .match(
      /january|february|march|april|may|june|july|august|september|october|november|december/,
    );
  return year * 12 + (match ? months.indexOf(match[0]) : 0);
}

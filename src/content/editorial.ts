/** Public editorial content verified against the CV, public LinkedIn and public repositories on 26 October 2026. */
export const editorial = {
  headline: "From delivery robots to music technology.",
  summary:
    "I'm Mohsen, a Staff Engineer at Songtradr in Helsinki. Previously, I architected and built Starship’s Delivery-as-a-Service platform: partner APIs, operational tools, and integrations that connect businesses to autonomous delivery.",
  current: "Staff Engineer at Songtradr",
  delivery: {
    title: "Connecting a partner's software to a robot's delivery.",
    introduction:
      "At Starship Technologies, I architected and built the Delivery-as-a-Service platform. The work spanned the partner-facing API, the operational console, integrations with partner engineering teams, and the tools used to integrate and test.",
    context:
      "Autonomous delivery sits at the meeting point of two worlds: a partner's digital service and robots moving through the physical world. The platform connects those worlds; the surrounding tools make that connection usable by engineers and operators.",
    scope: [
      {
        title: "Partner API",
        body: "The software interface connecting external partners with autonomous last-mile delivery robots.",
      },
      {
        title: "Operational console",
        body: "A Next.js console for operational teams to track orders, manage workflows and access insights.",
      },
      {
        title: "Integration tooling",
        body: "Technical integrations with partner teams including Uber, Bolt, Wolt, S-Group, Foodora, Grubhub, Deliveroo and Bringg, supported by an integration playground.",
      },
      {
        title: "Testing and monitoring",
        body: "End-to-end testing systems and watchdog services supporting the partner ecosystem.",
      },
    ],
    perspective:
      "Alongside DaaS, I contributed to rewriting and centralizing cart, tax and fee calculations in Go. Earlier marketplace work covered billing flows and the order lifecycle. This is the thread through my work: making complex systems easier to integrate, operate and evolve.",
  },
  projects: [
    {
      id: "parviz",
      title: "Parviz",
      kind: "Robotics / CAD prototype",
      body: "A desk robot designed from software to mechanics: tracked drive, a Raspberry Pi touchscreen face, a camera eye, and a pan/tilt neck. Parametric Python generates the assembly; the software spike includes face rendering, motion and camera integration.",
      detail:
        "The design explores a self-locking worm-drive tilt mechanism, a captured-ball pan race, and positive-drive tracks. The repository documents interference checks, assembly order and cable routing. The mechanical design is not yet printed or assembled.",
      sector: "workshop",
      link: "Visit the robotics workshop",
      source: "https://github.com/m-esm/Parviz",
      demo: "https://m-esm.github.io/Parviz/viewer_glb.html",
      demoLabel: "Inspect the actual CAD assembly",
    },
    {
      id: "smart-subagents",
      title: "Smart subagents",
      kind: "AI engineering / Developer tools",
      body: "A quota-aware task router for coding CLIs. It considers available headroom, task size and reasoning difficulty, dispatches work in an isolated Git worktree, and verifies the resulting diff before reporting back.",
      detail:
        "Size and difficulty are separate decisions: a broad rename and a small concurrency fix demand different kinds of work. The public implementation includes worker eligibility, fallback selection, cooldowns and outcome-based routing feedback.",
      sector: "agents",
      link: "Visit the agent lab",
      source: "https://github.com/m-esm/smart-subagents",
      demo: "",
      demoLabel: "",
    },
    {
      id: "mechlib",
      title: "Mechlib",
      kind: "Mechanical design / Python",
      body: "Reusable parametric parts for FDM printing: gears, cams, linkages, ratchets, couplings and flexures. Built with trimesh, Shapely and manifold3d.",
      detail:
        "An interactive browser gallery combines mechanism animations with editable parameters, running the Python library through Pyodide. Bought-part envelopes are kept separate from printed geometry.",
      sector: "workshop",
      link: "Visit the fabrication bench",
      source: "https://github.com/m-esm/mechlib",
      demo: "https://m-esm.github.io/mechlib/",
      demoLabel: "Open the interactive gallery",
    },
    {
      id: "socket-cluster",
      title: "WebSocket clustering",
      kind: "Distributed systems / Technical writing",
      body: "A public NestJS and Redis example accompanying my article on WebSocket clustering: handling users with several clients connected to different instances.",
      detail:
        "The repository gives the article a concrete implementation readers can explore. It sits alongside earlier open-source work on end-to-end encryption, backend frameworks and per-branch environments.",
      sector: "systems",
      link: "Visit the systems yard",
      source: "https://github.com/m-esm/socket-cluster-app",
      demo: "https://medium.com/@mohsenes/websocket-cluster-with-nestjs-and-redis-a18882d418ed",
      demoLabel: "Read the article",
    },
  ],
  recommendation: {
    quote:
      "The most time sensitive and complex projects in the DaaS team landed on his table",
    author: "Taavi Pungas",
    context:
      "Public LinkedIn recommendation, reflecting on our work at Starship",
    href: "https://www.linkedin.com/in/m-esm",
  },
  earlier: [
    {
      id: "serendip-story", years: "February 2018–June 2019",
      title: "Tools for working with data", company: "Serendip",
      text: "Co-founded Serendip Agency and built data dashboards, NoSQL browsing tools, services and reusable Node.js packages.",
    },
    {
      id: "tripema-story", years: "June–August 2019",
      title: "Connecting a travel marketplace", company: "TripeMa",
      text: "Worked on integrating TripeMa following its acquisition. The focus was connecting an existing travel product with the systems around it.",
    },
    {
      title: "Hotel inventory and financial integrations",
      company: "Alibaba.aero",
      id: "alibaba-story", years: "August 2019–August 2020",
      text: "Integrated more than ten hotel inventory systems, built billing and invoicing integrations, and developed software to detect financial discrepancies.",
    },
    {
      title: "Video platform infrastructure",
      company: "BoomFit",
      id: "boomfit-story", years: "August 2020–February 2021",
      text: "Backend APIs, streaming, data processing and video intelligence on Google Cloud, alongside architecture documentation and a move toward a test-driven codebase.",
    },
  ],
};
export const sectorStories = [
  {
    id: "arrival",
    title: "Arrival",
    description: "Meet the engineer. Find your bearings.",
    x: 156,
    y: 202,
  },
  {
    id: "systems",
    title: "Delivery systems",
    description:
      "Starship Technologies · Platform, API and integration tooling",
    x: 62,
    y: 143,
  },
  {
    id: "workshop",
    title: "Robotics workshop",
    description: "Parviz desk robot and Mechlib parametric mechanisms",
    x: 62,
    y: 58,
  },
  {
    id: "agents",
    title: "Agent lab",
    description: "Smart subagents: quota-aware coding-agent routing",
    x: 230,
    y: 47,
  },
  {
    id: "career",
    title: "Career garden",
    description: "Background, public repositories and contact",
    x: 254,
    y: 161,
  },
] as const;

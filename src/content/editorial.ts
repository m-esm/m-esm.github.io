/** Public editorial content derived from the approved portfolio brief. */
export const editorial = {
  headline: "Software that reaches beyond the screen.",
  summary:
    "I'm Mohsen, a software engineer in Helsinki. My work connects platforms, partner integrations, developer tools, and the physical systems they serve.",
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
        body: "An operational interface alongside the partner-facing platform.",
      },
      {
        title: "Integration tooling",
        body: "An integration playground and developer tools for partner engineering teams.",
      },
      {
        title: "Testing and monitoring",
        body: "End-to-end testing systems and watchdog services supporting the partner ecosystem.",
      },
    ],
    perspective:
      "The project brings together the areas represented throughout this portfolio: platform architecture, integration work, operational software, and tools that help other engineers build.",
  },
  projects: [
    {
      id: "framework",
      title: "Serendip Framework",
      kind: "Historical personal project",
      body: "A reusable backend framework and tooling effort. An exploration of software infrastructure that other software can build on.",
      sector: "workshop",
      link: "Explore the workshop",
    },
    {
      id: "branches",
      title: "Multi Branch",
      kind: "Historical personal project",
      body: "An instance-per-branch project. The station's branch rack gives this idea a physical form: separate branches represented as separate environments.",
      sector: "agents",
      link: "Explore the agent lab",
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
    description: "Reusable backend tools and an illustrative repair bench",
    x: 62,
    y: 58,
  },
  {
    id: "agents",
    title: "Agent lab",
    description: "Branch environments and a kinetic routing illustration",
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

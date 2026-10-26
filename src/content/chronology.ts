/** Employment dates: supplied CV; 2026 role: owner-confirmed. Public-project dates: GitHub repository creation. */
export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  track: "professional" | "independent";
  kind: "code" | "data" | "travel" | "video" | "robot" | "agents" | "mechanical";
  href?: string;
  image?: string;
  imageAlt?: string;
  focus?: string[];
  logo?: string;
}
export const chronology: TimelineEntry[] = [
  { year: "2013–2018", title: "Independent software work", track: "independent", kind: "code", body: "Business applications, automation, IoT backends and web products for freelance and contract clients." },
  { year: "February 2018–June 2019", title: "Serendip", logo: "/assets/brands/serendip.png", track: "professional", kind: "data", body: "Co-founded Serendip Agency; built data dashboards, NoSQL browsing tools, services and reusable Node.js packages.", href: "https://github.com/serendip-archive" },
  { year: "June–August 2019", title: "TripeMa · Connecting travel platforms", logo: "/assets/brands/tripema.webp", track: "professional", kind: "travel", body: "Worked on integrating TripeMa following its acquisition. A distinct chapter in travel technology: connecting an existing product with the systems around it.", href: "#tripema-story", focus: ["Travel technology", "Post-acquisition integration"] },
  { year: "August 2019–August 2020", title: "Alibaba.aero · Behind the booking", logo: "/assets/brands/alibaba.webp", track: "professional", kind: "travel", body: "Integrated more than ten hotel inventory systems, connected billing and invoicing, and built software to detect financial discrepancies. The work linked the customer-facing travel business to the inventory and financial systems behind it.", href: "#alibaba-story", focus: ["Hotel inventory", "Billing & invoicing", "Financial reconciliation"] },
  { year: "2019", title: "Multi Branch", track: "independent", kind: "code", body: "A per-branch Node.js environment tool. The public repository opened in December 2019.", href: "https://github.com/m-esm/node-multi-branch" },
  { year: "2020", title: "WebSocket clustering", track: "independent", kind: "data", body: "A NestJS and Redis example for clients connected across multiple application instances. Public repository opened in April 2020.", href: "https://github.com/m-esm/socket-cluster-app" },
  { year: "August 2020–February 2021", title: "BoomFit", track: "professional", kind: "video", body: "Video marketplace APIs, streaming infrastructure and video intelligence on Google Cloud." },
  { year: "2021", title: "Starship · The consumer platform", logo: "/assets/brands/starship.svg", focus: ["Marketplace services", "Billing", "Order lifecycle"], track: "professional", kind: "robot", body: "Started in March on consumer experience: marketplace services, billing and the order lifecycle." },
  { year: "Around 2022", title: "Starship · Delivery-as-a-Service", focus: ["Platform architecture", "Partner APIs", "Developer experience"], track: "professional", kind: "robot", body: "Moved into DaaS architecture, partner integrations, the operational console and developer tooling after the first year and a half at Starship.", href: "#delivery-systems" },
  { year: "2026", title: "Staff Engineer at Songtradr", logo: "/assets/brands/songtradr.svg", focus: ["AI engineering", "Music technology"], track: "professional", kind: "agents", body: "A new chapter in platform and AI engineering, based in Helsinki.", href: "#current-role" },
  { year: "July 2026", title: "Parviz", track: "independent", kind: "robot", body: "Tracked desk robot, parametric mechanical design and a working software spike. The mechanical assembly remains a CAD design.", image: "/assets/projects/parviz-cad.jpg", imageAlt: "Parviz source CAD render, not an assembled prototype", href: "https://github.com/m-esm/Parviz" },
  { year: "August 2026", title: "Mechlib", track: "independent", kind: "mechanical", body: "Reusable parametric mechanisms with an interactive Python-powered browser gallery.", image: "/assets/projects/mechlib-gallery.png", imageAlt: "Mechanism renders from the public Mechlib gallery", href: "https://github.com/m-esm/mechlib" },
  { year: "August 2026", title: "Smart subagents", track: "independent", kind: "agents", body: "Quota-aware coding-agent routing, isolated Git worktrees and verification of the resulting diff.", href: "https://github.com/m-esm/smart-subagents" },
  { year: "October 2026", title: "Second Brain", track: "independent", kind: "data", body: "A personal knowledge-map prototype combining project sources into a schema-validated model. It preserves source provenance, supports human merge/split corrections, and lays out project relationships over time. Private repository; architecture summary only." },
  { year: "October 2026", title: "The orbital portfolio", track: "independent", kind: "mechanical", body: "The threads meet here: a playable engineering habitat and interactive explanations of the work behind it.", href: "/" },
];
export const projectYears: Record<string, string> = {
  parviz: "2026 · public repository opened July",
  "smart-subagents": "2026 · public repository opened August",
  mechlib: "2026 · public repository opened August",
  "socket-cluster": "2020 · public repository opened April",
};
export const recommendations = [
  {quote: "I'd gladly work with him again.", author: "Taavi Pungas", body: "Taavi highlights delivery on complex DaaS projects, developer tooling and early adoption of agentic engineering practices."},
  {quote: "Mohsen is the most productive engineer I have seen", author: "Pekka Kosonen", body: "Pekka describes a productive engineer and an easygoing, supportive teammate."},
];

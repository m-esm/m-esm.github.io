import { lazy, Suspense, useState } from "react";
const Diagram = lazy(() => import("./SystemDiagram"));
const scope = [
  {
    title: "Partner API",
    audience: "For partner engineers",
    stack: "NestJS",
    text: "I architected and built the API that connects a partner’s service to Starship delivery. It was the integration surface shared across the DaaS partner ecosystem.",
    artifact: "A common delivery interface",
    relationship: ["Partner software", "DaaS API", "Robot delivery"],
    note: "The public-facing part of the platform: where partner software meets the delivery service.",
  },
  {
    title: "Operational console",
    audience: "For operational teams",
    stack: "Next.js",
    text: "I built the Partner Console for tracking orders, managing operational workflows and accessing insights. The same delivery operation needed to be understandable to people as well as software.",
    artifact: "An operational view of delivery",
    relationship: ["Delivery activity", "Partner Console", "Operations team"],
    note: "The human interface: orders and operational workflows presented in one place.",
  },
  {
    title: "Integration tooling",
    audience: "With partner engineering teams",
    stack: "Partner integrations",
    text: "I worked directly with partner engineers on integrations, supported by a playground for exploring the interface. The work included Uber, Bolt, Wolt, S-Group, foodora, Grubhub, Deliveroo and Bringg.",
    artifact: "Tools to make integration practical",
    relationship: ["Partner engineers", "Playground", "Integration"],
    note: "The developer experience around the API, including a place to explore and integrate it.",
  },
  {
    title: "Testing & monitoring",
    audience: "For the partner ecosystem",
    stack: "End-to-end tests · watchdogs",
    text: "I built end-to-end testing systems and watchdog services around the partner ecosystem. Integration work extended beyond the API into checking and observing the surrounding flows.",
    artifact: "Checks around the delivery flow",
    relationship: [
      "Integration flow",
      "Tests & watchdogs",
      "Operational visibility",
    ],
    note: "The supporting checks and services around the integrations.",
  },
];
const partners = [
  ["uber-eats.avif", "Uber Eats"],
  ["wolt.avif", "Wolt"],
  ["bolt.avif", "Bolt"],
  ["grubhub.avif", "Grubhub"],
  ["s-kaupat.avif", "S-Group"],
  ["deliveroo.png", "Deliveroo"],
  ["foodora.svg", "foodora"],
];
export function MusicChapter() {
  return (
    <section
      id="work"
      className="motion-chapter current-chapter"
      data-chapter="Music & intelligence"
    >
      <div className="current-copy">
        <div className="company-line">
          <img src="/assets/brands/songtradr.svg" alt="Songtradr" />
          <span>Current role · 2026–present</span>
        </div>
        <h2>
          Staff Engineer.
          <span>Music technology & AI engineering</span>
        </h2>
        <p>
          My current role at Songtradr, building on a background in backend
          platforms, partner integrations and developer tools.
        </p>
        <a className="text-link" href="https://www.songtradr.com/about">
          About Songtradr <span>↗</span>
        </a>
      </div>
      <figure className="current-image">
        <img
          src="/assets/companies/music-performance.webp"
          alt="A live performance, from MassiveMusic’s official company photography"
          loading="lazy"
        />
        <figcaption>
          <span>
            MassiveMusic, part of Songtradr. Official company photography.
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
export function DeliveryChapter({ paused }: { paused: boolean }) {
  const [active, setActive] = useState(0);
  const item = scope[active];
  return (
    <section
      id="starship"
      className="motion-chapter delivery-chapter"
      data-chapter="Software → physical world"
    >
      <header className="case-heading">
        <div className="company-line">
          <img src="/assets/brands/starship.svg" alt="Starship Technologies" />
          <span>
            Joined 2021
            <br />
            DaaS from around 2022
          </span>
        </div>
        <h2>
          The software behind
          <br />a robot delivery.
        </h2>
        <p>
          I architected and built Starship’s Delivery-as-a-Service platform: the
          partner API, operational console and tools used to integrate with the
          delivery service.
        </p>
      </header>
      <figure className="delivery-photo">
        <img
          src="/assets/companies/starship-delivery.avif"
          alt="Loading groceries into a Starship delivery robot"
          loading="lazy"
        />
        <figcaption>Starship Technologies / autonomous delivery</figcaption>
      </figure>
      <div className="case-work">
        <div className="case-index">
          <h3>My work on DaaS</h3>
          <div className="scope-viewer">
            <Suspense fallback={<p>Loading model…</p>}>
              <Diagram
                kind="delivery"
                selected={active}
                onSelect={setActive}
                paused={paused}
              />
            </Suspense>
          </div>
          <div role="tablist" aria-label="Starship engineering scope">
            {scope.map((s, i) => (
              <button
                role="tab"
                id={"scope-tab-" + i}
                aria-selected={active === i}
                aria-controls="scope-panel"
                key={s.title}
                onClick={() => setActive(i)}
              >
                <span>
                  {s.title}
                  <small>{s.audience}</small>
                </span>
                <span aria-hidden="true">{active === i ? "●" : "→"}</span>
              </button>
            ))}
          </div>
          <p className="scope-caption">
            Select a part of the platform. Drag the illustration to rotate.
          </p>
        </div>
        <article
          id="scope-panel"
          role="tabpanel"
          aria-labelledby={"scope-tab-" + active}
          className="case-panel"
        >
          <span className="implementation-label">{item.stack}</span>
          <h3>{item.artifact}</h3>
          <p>{item.text}</p>
          <div
            className="scope-relationship"
            aria-label="Conceptual relationship"
          >
            {item.relationship.map((label, i) => (
              <span key={label}>
                {i > 0 && <i aria-hidden="true">→</i>}
                {label}
              </span>
            ))}
          </div>
        </article>
      </div>
      <div className="partner-strip">
        <p>Integration partners I worked with</p>
        <div>
          {partners.map(([file, label]) => (
            <figure key={label}>
              <div className="partner-mark">
                <img src={"/assets/brands/" + file} alt="" loading="lazy" />
              </div>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
          <figure>
            <div className="partner-mark partner-wordmark">Bringg</div>
            <figcaption>Bringg</figcaption>
          </figure>
        </div>
      </div>
      <div className="case-footnote">
        <p>
          Before DaaS, I worked on marketplace services, billing and the order
          lifecycle. I also contributed to centralizing cart, tax and fee
          calculations in Go.
        </p>
        <a className="text-link" href="/reading.html#delivery-systems">
          Read the full case study <span>↗</span>
        </a>
      </div>
    </section>
  );
}

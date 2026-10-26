import { lazy, Suspense, useState } from "react";
import { editorial } from "../content/editorial";
const Diagram = lazy(() => import("./SystemDiagram"));
const partners = [
  ["foodora.svg", "foodora"],
  ["uber-eats.avif", "Uber Eats"],
  ["wolt.avif", "Wolt"],
  ["bolt.avif", "Bolt"],
  ["grubhub.avif", "Grubhub"],
  ["s-kaupat.avif", "S-Group"],
  ["deliveroo.png", "Deliveroo"],
];

export function MusicChapter() {
  return (
    <section
      id="work"
      className="motion-chapter motion-song"
      data-chapter="Music & intelligence"
    >
      <div className="motion-section-heading">
        <p>
          Songtradr <span>2026 — current</span>
        </p>
        <h2>
          Where intelligence
          <br />
          meets music.
        </h2>
      </div>
      <div className="music-composition">
        <figure className="motion-photo music">
          <img
            src="/assets/companies/music-performance.webp"
            alt="Live performance from MassiveMusic’s official company imagery"
            loading="lazy"
          />
          <figcaption>
            Image:{" "}
            <a href="https://massivemusic.com/about">
              MassiveMusic / Songtradr group
            </a>
            . Company context.
          </figcaption>
        </figure>
        <div className="music-vinyl" aria-hidden="true">
          <div className="vinyl-grooves">
            <div className="vinyl-label">
              <span>Software</span>
              <i />
              <span>Music</span>
            </div>
          </div>
        </div>
        <article className="music-role">
          <img src="/assets/brands/songtradr.svg" alt="Songtradr" />
          <h3>
            Staff Engineer.
            <br />
            AI engineering.
          </h3>
          <p>
            I’m bringing a background in platforms, integrations and developer
            tools into music technology.
          </p>
          <p>
            Songtradr’s brand portfolio includes MassiveMusic and Bandcamp. My
            current chapter connects software, music and complex commercial
            workflows.
          </p>
          <a
            className="motion-text-link"
            href="https://www.songtradr.com/about"
          >
            About Songtradr <span>↗</span>
          </a>
        </article>
        <div className="music-frequency" aria-hidden="true">
          {Array.from({ length: 48 }, (_, i) => (
            <i
              key={i}
              style={{
                height: `${18 + Math.abs(Math.sin(i * 0.39) * Math.cos(i * 0.14)) * 80}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliveryChapter({ paused }: { paused: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <section
      id="starship"
      className="motion-chapter motion-starship"
      data-chapter="Software → physical world"
    >
      <div className="motion-section-heading">
        <p>
          Starship Technologies <span>Joined 2021 · DaaS from around 2022</span>
        </p>
        <h2>
          Code that moves
          <br />
          the physical world.
        </h2>
      </div>
      <figure className="motion-photo wide">
        <img
          src="/assets/companies/starship-delivery.avif"
          alt="Starship robot being loaded for a grocery delivery"
          loading="lazy"
        />
        <figcaption>
          Autonomous delivery in the real world. Image: Starship Technologies.
        </figcaption>
        <span className="motion-image-label">
          A digital request. A physical delivery.
        </span>
      </figure>
      <div className="motion-case-copy">
        <h3>
          From the architecture
          <br />
          to the integrations.
        </h3>
        <div>
          <p>{editorial.delivery.introduction}</p>
          <p>{editorial.delivery.perspective}</p>
          <a className="motion-text-link" href="/reading.html#delivery-systems">
            Read the complete story <span>↗</span>
          </a>
        </div>
      </div>
      <div className="delivery-system">
        <div className="system-heading">
          <div>
            <p>Inside the platform</p>
            <h3>Every connection counts.</h3>
          </div>
          <p>Choose a layer to explore the work.</p>
        </div>
        <Suspense
          fallback={
            <div className="system-loading">Preparing the platform model…</div>
          }
        >
          <Diagram
            kind="delivery"
            selected={active}
            onSelect={setActive}
            paused={paused}
          />
        </Suspense>
        <div
          className="system-controls"
          role="group"
          aria-label="Delivery platform layers"
        >
          {editorial.delivery.scope.map((s, i) => (
            <button
              key={s.title}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <span className="system-control-dot" />
              {s.title}
            </button>
          ))}
        </div>
        <div className="system-detail" aria-live="polite">
          <span>{editorial.delivery.scope[active].title}</span>
          <p>{editorial.delivery.scope[active].body}</p>
        </div>
        <p className="motion-source-note">
          Conceptual model of my engineering scope, not a production
          architecture diagram. Drag to rotate.
        </p>
      </div>
      <div className="motion-partners">
        <p>Built in collaboration with partner engineering teams</p>
        <div>
          {partners.map(([asset, name]) => (
            <div className="partner-mark" key={name}>
              <img src={"/assets/brands/" + asset} alt={name} loading="lazy" />
            </div>
          ))}
          <div className="partner-mark partner-wordmark">Bringg</div>
        </div>
      </div>
    </section>
  );
}

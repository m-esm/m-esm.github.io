import { chronology, type TimelineEntry } from "../content/chronology";
const eras = [
  {
    id: "foundations",
    years: "2013–2020",
    title: "Building the foundations",
    description:
      "Business software, data tools, travel integrations and video infrastructure.",
    entries: chronology.slice(0, 7),
  },
  {
    id: "robotics",
    years: "2021–2025",
    title: "Software meets the street",
    description:
      "From the consumer platform to the systems connecting partners with autonomous delivery.",
    entries: chronology.slice(7, 9),
  },
  {
    id: "new-dimensions",
    years: "2026",
    title: "New dimensions",
    description:
      "Music technology at work. Mechanisms, agents and knowledge systems in the workshop.",
    entries: chronology.slice(9),
  },
];
function Story({ entry: c }: { entry: TimelineEntry }) {
  const href = c.href?.startsWith("#")
    ? "/reading.html" + c.href
    : c.href === "/"
      ? "#/sector/arrival"
      : c.href;
  return (
    <li className={"career-story " + c.kind}>
      <time>{c.year}</time>
      <article>
        {c.logo && (
          <div className="career-logo">
            <img src={c.logo} alt="" loading="lazy" />
          </div>
        )}
        <h4>{c.title}</h4>
        <p>{c.body}</p>
        {c.image && (
          <a className="career-image" href={href}>
            <img src={c.image} alt={c.imageAlt} loading="lazy" />
          </a>
        )}
        {c.focus && (
          <div className="motion-tags">
            {c.focus.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        )}
        {href && (
          <a className="career-story-link" href={href}>
            Explore this chapter <span>↗</span>
          </a>
        )}
      </article>
    </li>
  );
}
export function CareerJourney() {
  return (
    <section
      id="journey"
      className="motion-chapter motion-journey"
      data-chapter="The journey"
    >
      <div className="motion-section-heading">
        <p>
          The career thread <span>2013 — 2026</span>
        </p>
        <h2>
          One thread.
          <br />
          Many worlds.
        </h2>
        <p className="motion-deck">
          Different domains. A growing systems practice.
        </p>
      </div>
      <div className="career-layout">
        <nav className="career-index" aria-label="Timeline eras">
          {eras.map((e) => (
            <a href={"#era-" + e.id} key={e.id}>
              <span>{e.years}</span>
              {e.title}
            </a>
          ))}
          <p>
            Two connected paths:
            <br />
            the teams I’ve worked with,
            <br />
            and the things I make.
          </p>
        </nav>
        <div className="career-eras">
          {eras.map((era) => (
            <section className="career-era" id={"era-" + era.id} key={era.id}>
              <header>
                <span>{era.years}</span>
                <h3>{era.title}</h3>
                <p>{era.description}</p>
              </header>
              <div className="career-tracks">
                {(["professional", "independent"] as const).map((track) => {
                  const entries = era.entries.filter((c) => c.track === track);
                  return (
                    entries.length > 0 && (
                      <div className={"career-track " + track} key={track}>
                        <h5>
                          {track === "professional"
                            ? "With a team"
                            : "In my workshop"}
                        </h5>
                        <ol>
                          {entries.map((entry) => (
                            <Story key={entry.title} entry={entry} />
                          ))}
                        </ol>
                      </div>
                    )
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      <p className="motion-source-note">
        Employment dates follow my CV. The DaaS transition is approximate;
        public-project dates indicate repository creation. Second Brain is a
        private prototype, described only at architecture level.
      </p>
    </section>
  );
}

import { useState } from "react";
import { recommendations } from "../content/chronology";
import { sectorStories } from "../content/editorial";

export function Recommendations() {
  const [selected, setSelected] = useState(0);
  const quote = recommendations[selected];
  return (
    <section
      className="motion-quotes"
      data-chapter="People behind the systems"
      aria-label="Colleague recommendations"
    >
      <div className="quote-context">
        <p>People I’ve worked with.</p>
        <span>From colleagues at Starship</span>
        <div className="quote-choices" aria-label="Choose a recommendation">
          {recommendations.map((r, i) => (
            <button
              key={r.author}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              <span>
                {r.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              {r.author}
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      </div>
      <figure key={quote.author} aria-live="polite">
        <div className="quote-mark" aria-hidden="true">
          “
        </div>
        <blockquote>{quote.quote}</blockquote>
        <figcaption>
          <strong>{quote.author}</strong>
          <span>{quote.body}</span>
          <a
            className="motion-text-link"
            href="https://fi.linkedin.com/in/m-esm"
          >
            Read on LinkedIn <span>↗</span>
          </a>
        </figcaption>
      </figure>
    </section>
  );
}

export function WorldEntrance() {
  const [selected, setSelected] = useState("arrival");
  const current = sectorStories.find((s) => s.id === selected)!;
  return (
    <section className="motion-world" data-chapter="Step inside">
      <div className="world-invitation">
        <p>The playable portfolio / 2026</p>
        <h2>Walk around my portfolio.</h2>
        <p>
          A maintenance robot. An orbital habitat.
          <br />
          Five places to explore. No tasks to finish.
        </p>
        <a className="motion-pill" href={"#/sector/" + selected}>
          Enter {current.title.toLowerCase()} <span>↗</span>
        </a>
        <a className="motion-text-link" href="/reading.html">
          Prefer a quiet read?
        </a>
      </div>
      <div className="world-directory">
        <div className="world-portal" aria-hidden="true">
          <div className="portal-orbit" />
          <div className="portal-orbit second" />
          <div className="portal-planet" />
          <svg viewBox="0 0 320 260">
            <path d="M156 202L62 143V58L230 47L254 161Z M62 143L254 161 M156 202L230 47" />
            {sectorStories.map((s) => (
              <g key={s.id} className={s.id === selected ? "selected" : ""}>
                <circle cx={s.x} cy={s.y} r={s.id === selected ? 10 : 5} />
                <circle className="map-halo" cx={s.x} cy={s.y} r="18" />
              </g>
            ))}
          </svg>
        </div>
        <div
          className="world-destinations"
          aria-label="Choose a station destination"
        >
          {sectorStories.map((s) => (
            <button
              key={s.id}
              aria-pressed={s.id === selected}
              onClick={() => setSelected(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
        <p className="world-destination-description" aria-live="polite">
          {current.description}
        </p>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <footer
      id="contact"
      className="motion-contact"
      data-chapter="Let’s build something"
    >
      <div className="contact-heading">
        <p>Mohsen Esmaeili · Helsinki, Finland</p>
        <h2>A little more about me.</h2>
      </div>
      <div className="personal-note">
        <p>
          I’m Mohsen Esmaeili—Moshe for short—a software engineer based in
          Helsinki.
        </p>
        <p>
          My projects often start with an ordinary question: where did I put
          that component, how can I practise this rhythm, or what would make a
          coding workflow easier to understand?
        </p>
        <p>
          This site brings those experiments together with my professional work.
          The source, sketches and rough edges are part of the story.
        </p>
      </div>
      <div className="contact-links">
        <a href="https://www.linkedin.com/in/m-esm">
          <span>
            <small>Start a conversation</small>LinkedIn
          </span>
          <i aria-hidden="true">↗</i>
        </a>
        <a href="https://github.com/m-esm">
          <span>
            <small>Look under the hood</small>GitHub
          </span>
          <i aria-hidden="true">↗</i>
        </a>
        <a href="/reading.html">
          <span>
            <small>Take your time</small>The reading version
          </span>
          <i aria-hidden="true">↗</i>
        </a>
      </div>
      <div className="contact-colophon">
        <span>A personal website by Mohsen Esmaeili.</span>
        <a href="/assets/licenses/project-credits.html">
          Image & asset credits
        </a>
        <a href="#top">Back to the beginning ↑</a>
      </div>
    </footer>
  );
}

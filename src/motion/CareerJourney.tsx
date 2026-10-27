import { useState } from "react";
import { portfolioTimeline } from "../content/projects";
export function CareerJourney() {
  const [track, setTrack] = useState("career"),
    [period, setPeriod] = useState("all");
  const rows = portfolioTimeline.filter(
    (c) =>
      (track === "all" ||
        (track === "career"
          ? c.track === "professional" ||
            c.title === "Independent software work"
          : c.track === "independent")) &&
      (period === "all" ||
        (period === "2026"
          ? c.year.includes("2026")
          : period === "2021"
            ? Number(c.year.match(/\d{4}/)?.[0]) >= 2021 &&
              Number(c.year.match(/\d{4}/)?.[0]) < 2026
            : Number(c.year.match(/\d{4}/)?.[0]) < 2021)),
  );

  return (
    <section
      id="journey"
      className="motion-chapter motion-journey"
      data-chapter="The journey"
    >
      <div className="motion-section-heading">
        <p>
          The timeline <span>2013–2026</span>
        </p>
        <h2>How I got here.</h2>
        <p className="motion-deck">
          Different domains, connected by platform engineering. Open a chapter
          for the details.
        </p>
      </div>
      <div className="journey-controls">
        <div className="sketch-switch" aria-label="Timeline track">
          {[
            ["career", "Career"],
            ["projects", "Independent work"],
            ["all", "Both"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={track === id}
              onClick={() => setTrack(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          Started in{" "}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Timeline period"
          >
            <option value="all">All years</option>
            <option value="2026">2026</option>
            <option value="2021">2021–2025</option>
            <option value="earlier">2013–2020</option>
          </select>
        </label>
      </div>
      <ol className="compact-timeline">
        {rows.map((c) => {
          const href = c.href?.startsWith("#")
            ? "/reading.html" + c.href
            : c.href === "/"
              ? "#/sector/arrival"
              : c.href;
          return (
            <li key={c.title} className={c.track}>
              <details>
                <summary>
                  <time>{c.year}</time>
                  <span className="timeline-identity">
                    {c.logo && <img src={c.logo} alt="" />}
                    <strong>{c.title}</strong>
                  </span>
                  <span className="timeline-expand" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="timeline-story">
                  <p>{c.body}</p>
                  {c.focus && (
                    <div className="motion-tags">
                      {c.focus.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>
                  )}
                  {href && (
                    <a className="motion-text-link" href={href}>
                      More about this chapter ↗
                    </a>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
      {!rows.length && (
        <p>No entries in this period. Choose another year or track.</p>
      )}
      <p className="motion-source-note">
        Employment dates follow my CV; the DaaS transition is approximate.
        Independent-project dates refer to public repositories. Second Brain
        remains an architecture-only summary of a private prototype.
      </p>
    </section>
  );
}

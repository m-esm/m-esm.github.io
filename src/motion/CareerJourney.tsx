import { useState } from "react";
import { portfolioTimeline } from "../content/projects";
import type { TimelineEntry } from "../content/chronology";
function Chapter({
  chapter,
  inline = false,
}: {
  chapter: TimelineEntry;
  inline?: boolean;
}) {
  const href = chapter.href?.startsWith("#")
    ? "/reading.html" + chapter.href
    : chapter.href === "/"
      ? "#/sector/arrival"
      : chapter.href;
  return (
    <article
      className={
        "career-detail " + (inline ? "career-inline" : "career-desktop")
      }
    >
      <div className="career-detail-top">
        <time>{chapter.year}</time>
        {chapter.logo && <img src={chapter.logo} alt="" />}
      </div>
      <h3>{chapter.title}</h3>
      <p>{chapter.body}</p>
      {chapter.focus && (
        <ul>
          {chapter.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      {chapter.image && (
        <img
          className="career-project-image"
          src={chapter.image}
          alt={chapter.imageAlt || chapter.title}
          loading="lazy"
        />
      )}
      {href && (
        <a className="text-link" href={href}>
          {href.includes("github.com") ? "View the source" : "Read this story"}{" "}
          ↗
        </a>
      )}
    </article>
  );
}
export function CareerJourney() {
  const [track, setTrack] = useState("career"),
    [selected, setSelected] = useState("Staff Engineer at Songtradr");
  const rows = portfolioTimeline.filter((c) =>
    track === "career"
      ? c.track === "professional" || c.title === "Independent software work"
      : c.track === "independent",
  );
  const chapter = rows.find((c) => c.title === selected) || rows[0];
  return (
    <section
      id="journey"
      className="motion-chapter career-section"
      data-chapter="The journey"
    >
      <header className="section-header">
        <div>
          <h2>Work over time.</h2>
          <p>From independent software work in 2013 to Songtradr today.</p>
        </div>
        <div className="segmented" aria-label="Timeline track">
          {[
            ["career", "Career"],
            ["projects", "Independent work"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={track === id}
              onClick={() => {
                setTrack(id);
                setSelected("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <div className="career-layout">
        <ol className="career-rail" aria-label="Career chapters">
          {rows.map((c) => (
            <li
              key={c.title}
              className={chapter.title === c.title ? "current-chapter-row" : ""}
            >
              <button
                onClick={() => setSelected(c.title)}
                aria-pressed={chapter.title === c.title}
              >
                <time>{c.year}</time>
                <strong>{c.title}</strong>
                <span aria-hidden="true">
                  {chapter.title === c.title ? "−" : "+"}
                </span>
              </button>
              {chapter.title === c.title && <Chapter chapter={c} inline />}
            </li>
          ))}
        </ol>
        <Chapter chapter={chapter} />
      </div>
      <p className="source-note">
        Employment dates follow my CV. The DaaS transition is approximate;
        project dates refer to public repository creation.
      </p>
    </section>
  );
}

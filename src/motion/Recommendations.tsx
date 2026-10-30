import { useState } from "react";
import {
  recommendations,
  recommendationSource,
} from "../content/recommendations";
import "./recommendations.css";

function Arrow() {
  return (
    <svg className="ui-arrow" viewBox="0 0 20 20" aria-hidden="true" fill="none">
      <path d="M5 15 15 5M5 5h10v10" />
    </svg>
  );
}

export function Recommendations() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const allOpen = expanded.length === recommendations.length;
  const toggle = (id: string) =>
    setExpanded((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  return (
    <section
      id="recommendations"
      className="motion-chapter recommendation-section"
      aria-labelledby="recommendations-heading"
      data-chapter="Colleague recommendations"
    >
      <header className="section-header">
        <div>
          <h2 id="recommendations-heading">In their words.</h2>
          <p>From the people who have managed me, built alongside me, and seen the work up close.</p>
        </div>
        <a className="text-link" href={recommendationSource}>
          View on LinkedIn <Arrow />
        </a>
      </header>
      <div className="recommendation-tools">
        <p>{recommendations.length} recommendations · 2020–2026</p>
        <button
          className="text-link"
          onClick={() =>
            setExpanded(allOpen ? [] : recommendations.map((r) => r.id))
          }
        >
          {allOpen ? "Collapse all" : "Read all in full"}
          <span aria-hidden="true">{allOpen ? "−" : "+"}</span>
        </button>
      </div>
      <div className={`recommendation-grid ${allOpen ? "reading-all" : ""}`}>
        {recommendations.map((item) => {
          const open = expanded.includes(item.id);
          return (
            <article
              className={`recommendation-note ${open ? "is-expanded" : ""}`}
              key={item.id}
            >
              <header className="quote-person">
                <span className="person-initials" aria-hidden="true">
                  {item.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <a href={item.profile}>
                    {item.author}
                    <Arrow />
                  </a>
                  <p>{item.role}</p>
                </div>
              </header>
              <div className="quote-meta">
                <span>{item.relationship}</span>
                <time dateTime={item.date}>{item.dateLabel}</time>
              </div>
              <blockquote className="quote-excerpt">“{item.quote}”</blockquote>
              <button
                className="quote-toggle"
                aria-expanded={open}
                aria-controls={`recommendation-${item.id}`}
                onClick={() => toggle(item.id)}
              >
                {open ? "Close full recommendation" : "Read full recommendation"}
                <span aria-hidden="true">{open ? "−" : "+"}</span>
              </button>
              <div
                className="quote-full"
                id={`recommendation-${item.id}`}
                hidden={!open}
              >
                <blockquote>
                  {item.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </blockquote>
                <a className="text-link" href={recommendationSource}>
                  Original on LinkedIn <Arrow />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

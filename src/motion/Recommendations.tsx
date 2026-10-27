import { useRef, useState } from "react";
import { recommendations } from "../content/chronology";
import "./recommendations.css";

export function Recommendations() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const recommendation = recommendations[selected];
  const selectRelative = (direction: number) =>
    setSelected((current) =>
      (current + direction + recommendations.length) % recommendations.length,
    );

  return (
    <section
      id="recommendations"
      className="motion-chapter recommendation-section"
      aria-labelledby="recommendations-heading"
      data-chapter="Colleague recommendations"
    >
      <header className="recommendation-heading">
        <div>
          <h2 id="recommendations-heading">In their words.</h2>
          <p>Recommendations from people I’ve worked with.</p>
        </div>
        <a href="https://fi.linkedin.com/in/m-esm">
          <span className="recommendation-linkedin" aria-hidden="true">in</span>
          View on LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="recommendation-reader">
        <div className="recommendation-authors" role="tablist" aria-label="Recommendation authors">
          {recommendations.map((item, index) => (
            <button
              key={item.author}
              ref={(element) => { tabs.current[index] = element; }}
              role="tab"
              id={`recommendation-author-${index}`}
              aria-controls="recommendation-letter"
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                const movement = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
                if (movement === undefined && event.key !== "Home" && event.key !== "End") return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? recommendations.length - 1 :
                  (index + (movement ?? 0) + recommendations.length) % recommendations.length;
                setSelected(next);
                tabs.current[next]?.focus();
              }}
            >
              <span className="recommendation-initials" aria-hidden="true">
                {item.author.split(" ").map((part) => part[0]).join("")}
              </span>
              <span className="recommendation-author-name">
                <strong>{item.author}</strong>
                <small>Starship colleague</small>
              </span>
              <span className="recommendation-selected" aria-hidden="true">↗</span>
            </button>
          ))}
          <div className="recommendation-source-note">
            <span aria-hidden="true">“</span>
            <p>Selected excerpts from LinkedIn recommendations.</p>
          </div>
        </div>

        <div
          id="recommendation-letter"
          className="recommendation-letter"
          role="tabpanel"
          aria-labelledby={`recommendation-author-${selected}`}
          tabIndex={0}
        >
          <figure key={recommendation.author} className="recommendation-content">
            <span className="recommendation-opening" aria-hidden="true">“</span>
            <blockquote>{recommendation.quote}</blockquote>
            <figcaption>
              <strong>{recommendation.author}</strong>
              <span>On working together at Starship</span>
            </figcaption>
            <div className="recommendation-context">
              <span>In the recommendation</span>
              <p>{recommendation.body}</p>
            </div>
          </figure>
          <div className="recommendation-reader-footer">
            <span>{selected + 1} of {recommendations.length}</span>
            <div>
              <button onClick={() => selectRelative(-1)} aria-label="Previous recommendation">←</button>
              <button onClick={() => selectRelative(1)} aria-label="Next recommendation">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

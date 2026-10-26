import { lazy, Suspense, useState } from "react";
import { editorial } from "../content/editorial";
import { projectYears } from "../content/chronology";
const Diagram = lazy(() => import("./SystemDiagram"));
const agentStages = [
  [
    "Task",
    "Task size and reasoning difficulty are separate decisions. A broad rename and a small concurrency fix demand different kinds of work.",
  ],
  [
    "Route",
    "Available quota, worker eligibility and task fit guide the choice of coding CLI.",
  ],
  [
    "Verify",
    "The work runs in an isolated Git worktree. The resulting diff is checked before reporting back.",
  ],
];

function ClusterDiagram() {
  return (
    <div
      className="cluster-diagram"
      aria-label="Conceptual WebSocket cluster: clients connect to application instances that communicate through Redis."
    >
      <div className="cluster-clients">
        {["Browser", "Phone", "Desktop"].map((s) => (
          <span key={s}>
            <i />
            {s}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 500 180" aria-hidden="true">
        <path
          className="cluster-connection"
          d="M85 0V35Q85 50 100 50H235Q250 50 250 65V180M250 0V180M415 0V35Q415 50 400 50H265Q250 50 250 65"
        />
        <circle cx="250" cy="120" r="4" className="cluster-packet" />
      </svg>
      <div className="cluster-instances">
        <span>Instance A</span>
        <span>Instance B</span>
      </div>
      <div className="cluster-bus">
        <i />
        Redis
      </div>
      <p>One user. Multiple connections.</p>
    </div>
  );
}

export function ProjectGallery({ paused }: { paused: boolean }) {
  const [stage, setStage] = useState(0);
  return (
    <section
      id="experiments"
      className="motion-chapter"
      data-chapter="Independent experiments"
    >
      <div className="motion-section-heading">
        <p>
          Independent work <span>2020–2026</span>
        </p>
        <h2>
          Curiosity.
          <br />
          Made tangible.
        </h2>
        <p className="motion-deck">
          A workshop for ideas that won’t stay on paper.
        </p>
      </div>
      <div className="motion-projects">
        {editorial.projects.map((p) => (
          <article className={"motion-project project-" + p.id} key={p.id}>
            <div className="motion-project-visual">
              {p.id === "parviz" || p.id === "mechlib" ? (
                <a
                  href={p.demo}
                  className="project-image-link"
                  aria-label={p.demoLabel}
                >
                  <img
                    src={
                      p.id === "parviz"
                        ? "/assets/projects/parviz-cad.jpg"
                        : "/assets/projects/mechlib-gallery.png"
                    }
                    alt={
                      p.id === "parviz"
                        ? "Source CAD for Parviz, a tracked desk robot. Not yet physically assembled."
                        : "Parametric mechanisms from the Mechlib gallery"
                    }
                    loading="lazy"
                  />
                  <span>
                    {p.id === "parviz"
                      ? "Inspect the assembly"
                      : "Explore the mechanisms"}{" "}
                    ↗
                  </span>
                </a>
              ) : p.id === "smart-subagents" ? (
                <div className="agent-diagram">
                  <Suspense fallback={null}>
                    <Diagram
                      kind="agents"
                      selected={stage}
                      onSelect={setStage}
                      paused={paused}
                    />
                  </Suspense>
                  <div
                    className="agent-stage-controls"
                    aria-label="Agent routing stages"
                  >
                    {agentStages.map(([name], i) => (
                      <button
                        key={name}
                        aria-pressed={stage === i}
                        onClick={() => setStage(i)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <p aria-live="polite">{agentStages[stage][1]}</p>
                  <small>Conceptual model · drag to rotate</small>
                </div>
              ) : (
                <ClusterDiagram />
              )}
              {(p.id === "parviz" || p.id === "mechlib") && (
                <div className="project-art-caption">
                  {p.id === "parviz"
                    ? "Source CAD / Python → mechanics"
                    : "Parametric design / code → motion"}
                </div>
              )}
            </div>
            <div className="motion-project-info">
              <p>{projectYears[p.id]}</p>
              <span className="project-kind">{p.kind}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <details>
                <summary>
                  Inside the project <span>+</span>
                </summary>
                <p>{p.detail}</p>
              </details>
              <div className="project-links">
                <a className="motion-text-link" href={p.source}>
                  View source <span>↗</span>
                </a>
                {p.demo && (
                  <a className="motion-text-link" href={p.demo}>
                    {p.id === "socket-cluster"
                      ? "Read the article"
                      : "Open the live demo"}{" "}
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

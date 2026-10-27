import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  personalProjects,
  projectCategories,
  type PersonalProject,
} from "../content/projects";
const Sketch = lazy(() => import("./ProjectSketches"));
const featured = [
  "handpan",
  "my-inventory",
  "parviz",
  "macros",
  "mechlib",
  "smart-subagents",
];
const diagrams: Record<string, string[]> = {
  "smart-subagents": ["Task", "Worker selection", "Verified diff"],
  hillshot: ["Aim", "Server simulation", "Shared game state"],
  "claude-code-cockpit": ["Prompt", "Workflow state", "Visible progress"],
  "jev-model-router": ["Prompt", "Difficulty score", "Model & effort"],
  "socket-cluster": ["Client", "Redis", "Application instances"],
  e2db: ["Selected fields", "Encryption", "Stored data"],
  "node-multi-branch": ["Git branches", "App instances", "Request routing"],
  whichui: ["Libraries", "Components", "Comparison"],
  "torque-lever": ["Scale reading", "Lever arm", "Torque"],
};
function ProjectArt({ project }: { project: PersonalProject }) {
  return project.image ? (
    <img
      src={project.image}
      alt={project.imageAlt || project.title}
      loading="lazy"
    />
  ) : (
    <div className="project-schema" aria-label="Project concept">
      {(diagrams[project.id] || ["Model", "Inspect", "Print"]).map(
        (label, i) => (
          <span key={label}>
            <i aria-hidden="true">{i === 1 ? "◇" : i === 0 ? "○" : "□"}</i>
            {label}
          </span>
        ),
      )}
    </div>
  );
}
export function ProjectGallery({ paused }: { paused: boolean }) {
  const initial = new URLSearchParams(location.search).get("project");
  const [selected, setSelected] = useState<string | null>(
      personalProjects.some((p) => p.id === initial) ? initial : null,
    ),
    [filter, setFilter] = useState("All"),
    [query, setQuery] = useState(""),
    [expanded, setExpanded] = useState(false),
    [trySketch, setTrySketch] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const project = personalProjects.find((p) => p.id === selected);
  const matches = personalProjects.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      [p.title, p.body, p.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const visible =
    expanded || filter !== "All" || query
      ? matches
      : featured.map((id) => personalProjects.find((p) => p.id === id)!);
  useEffect(() => {
    if (!project) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [project]);
  function open(id: string) {
    setTrySketch(false);
    setSelected(id);
    const url = new URL(location.href);
    url.searchParams.set("project", id);
    history.replaceState(null, "", url);
  }
  function close() {
    dialog.current?.close();
    setSelected(null);
    const url = new URL(location.href);
    url.searchParams.delete("project");
    history.replaceState(null, "", url);
  }
  return (
    <section
      id="experiments"
      className="motion-chapter project-section"
      data-chapter="Independent experiments"
    >
      <header className="section-header">
        <div>
          <h2>On my own time.</h2>
          <p>
            Music, small useful products and a growing collection of mechanical
            and developer tools.
          </p>
        </div>
        <a className="text-link" href="https://github.com/m-esm">
          All repositories ↗
        </a>
      </header>
      <div className="catalog-tools">
        <div className="catalog-filters" aria-label="Project categories">
          {["All", ...projectCategories].map((c) => (
            <button
              key={c}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Find a project"
          placeholder="Find a project"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="project-grid">
        {visible.map((p) => (
          <button
            className={"project-tile tile-" + p.id}
            key={p.id}
            onClick={() => open(p.id)}
          >
            <div className="project-tile-art">
              <ProjectArt project={p} />
              <span className="project-open" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="project-tile-copy">
              <p>
                {p.category}
                <time>{p.year.slice(0, 4)}</time>
              </p>
              <h3>{p.title}</h3>
              <span>{p.tagline}</span>
            </div>
          </button>
        ))}
      </div>
      {!visible.length && (
        <p className="empty-catalog">
          No matching projects.{" "}
          <button
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
          >
            Clear filters
          </button>
        </p>
      )}
      {filter === "All" && !query && (
        <button
          className="catalog-expand"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? "Show selected projects"
            : `Browse all ${personalProjects.length} projects`}{" "}
          <span>{expanded ? "−" : "+"}</span>
        </button>
      )}
      <p className="source-note">
        Personal projects, 2019–2026. Dates indicate when the public
        repositories opened.
      </p>
      {project && (
        <dialog
          ref={dialog}
          className="project-dialog"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="project-sheet">
            <header>
              <div>
                <span>
                  {project.category} / {project.year}
                </span>
                <h2>{project.title}</h2>
              </div>
              <button
                className="sheet-close"
                onClick={close}
                aria-label="Close project"
              >
                Close <span>×</span>
              </button>
            </header>
            <div className={"sheet-visual sheet-" + project.id}>
              {trySketch &&
              ["handpan", "torque", "agents"].includes(project.sketch || "") ? (
                <Suspense fallback={<p>Loading interaction…</p>}>
                  <Sketch kind={project.sketch} paused={paused} />
                </Suspense>
              ) : (
                <ProjectArt project={project} />
              )}
            </div>
            <div className="sheet-body">
              <div className="sheet-actions">
                {project.demo && (
                  <a className="motion-pill" href={project.demo}>
                    {project.demoLabel || "Open project"} ↗
                  </a>
                )}
                <a className="text-link" href={project.source}>
                  Source on GitHub ↗
                </a>
                {["handpan", "torque", "agents"].includes(
                  project.sketch || "",
                ) && (
                  <button
                    className="text-link"
                    onClick={() => setTrySketch(!trySketch)}
                  >
                    {trySketch
                      ? "Back to overview"
                      : project.sketch === "handpan"
                        ? "Play the notes here"
                        : project.sketch === "torque"
                          ? "Try the torque calculation"
                          : "Explore the routing model"}
                  </button>
                )}
              </div>
              <p className="sheet-summary">{project.body}</p>
              <h3>Inside the project</h3>
              <p>{project.detail}</p>
              {project.related && (
                <div className="sheet-related">
                  {project.related.map((l) => (
                    <a className="text-link" key={l.href} href={l.href}>
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
              {project.image && (
                <p className="source-note">
                  {project.imageAlt}.{" "}
                  <a href="/assets/licenses/project-credits.html">
                    Image credits
                  </a>
                </p>
              )}
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}

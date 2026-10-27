import { lazy, Suspense, useState } from "react";
import { personalProjects, projectCategories } from "../content/projects";
const Sketch = lazy(() => import("./ProjectSketches"));

export function ProjectGallery({ paused }: { paused: boolean }) {
  const initial = new URLSearchParams(location.search).get("project");
  const [selected, setSelected] = useState(initial || "handpan"),
    [filter, setFilter] = useState("All"),
    [query, setQuery] = useState(""),
    [view, setView] = useState("sketch");
  const visible = personalProjects.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      [p.title, p.tagline, p.body, p.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const project = visible.find((p) => p.id === selected) || visible[0];
  function select(id: string) {
    setSelected(id);
    setView("sketch");
    const url = new URL(location.href);
    url.searchParams.set("project", id);
    url.hash = "experiments";
    history.replaceState(null, "", url);
  }
  function changeFilter(nextFilter: string, nextQuery: string) {
    setFilter(nextFilter);
    setQuery(nextQuery);
    setView("sketch");
    const matches = personalProjects.filter(
      (p) =>
        (nextFilter === "All" || p.category === nextFilter) &&
        [p.title, p.tagline, p.body, p.category]
          .join(" ")
          .toLowerCase()
          .includes(nextQuery.toLowerCase()),
    );
    if (!matches.some((p) => p.id === selected)) {
      if (matches[0]) select(matches[0].id);
      else {
        const url = new URL(location.href);
        url.searchParams.delete("project");
        history.replaceState(null, "", url);
      }
    }
  }
  return (
    <section
      id="experiments"
      className="motion-chapter project-explorer"
      data-chapter="Independent experiments"
    >
      <div className="motion-section-heading">
        <p>
          My projects <span>2019–2026</span>
        </p>
        <h2>Things I’ve made.</h2>
        <p className="motion-deck">
          Music, useful little products, agent tools and physical things. Pick
          something to look inside.
        </p>
      </div>
      <div className="project-toolbar">
        <div className="project-filters" aria-label="Project categories">
          {["All", ...projectCategories].map((c) => (
            <button
              key={c}
              aria-pressed={filter === c}
              onClick={() => changeFilter(c, query)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="project-search">
          <span>Find a project</span>
          <input
            type="search"
            placeholder="Search projects…"
            value={query}
            onChange={(e) => changeFilter(filter, e.target.value)}
          />
        </label>
      </div>
      <div className="project-explorer-layout">
        <div className="project-index">
          <p>
            {visible.length} projects <span>Choose to explore</span>
          </p>
          <div className="project-index-list" aria-label="Select a project">
            {visible.map((p) => (
              <button
                key={p.id}
                aria-pressed={project?.id === p.id}
                onClick={() => select(p.id)}
              >
                <span>
                  {p.title}
                  <small>{p.tagline}</small>
                </span>
                <span className="project-list-year">{p.year.slice(0, 4)}</span>
              </button>
            ))}
          </div>
          {!visible.length && (
            <div className="project-empty">
              <p>No projects match this search.</p>
              <button
                onClick={() => {
                  changeFilter("All", "");
                }}
              >
                Show all projects
              </button>
            </div>
          )}
        </div>
        {project && (
          <article className="project-workspace" key={project.id}>
            <header>
              <div>
                <p>
                  {project.category} / {project.year}
                </p>
                <h3>{project.title}</h3>
              </div>
              {project.sketch && project.image && (
                <div className="project-view-switch">
                  <button
                    aria-pressed={view === "sketch"}
                    onClick={() => setView("sketch")}
                  >
                    Try a sketch
                  </button>
                  <button
                    aria-pressed={view === "image"}
                    onClick={() => setView("image")}
                  >
                    Project image
                  </button>
                </div>
              )}
            </header>
            {(project.sketch || project.image) && (
              <div className={"project-stage stage-" + project.id}>
                {project.sketch && view === "sketch" ? (
                  <Suspense
                    fallback={
                      <p className="sketch-loading">
                        Opening the project sketch…
                      </p>
                    }
                  >
                    <Sketch kind={project.sketch} paused={paused} />
                  </Suspense>
                ) : (
                  <figure>
                    <img src={project.image} alt={project.imageAlt} />
                    <figcaption>
                      {project.imageAlt}.{" "}
                      <a href="/assets/licenses/project-credits.html">
                        Source & credits
                      </a>
                    </figcaption>
                  </figure>
                )}
              </div>
            )}
            <div className="project-writeup">
              <p>{project.body}</p>
              <details>
                <summary>
                  Engineering notes <span>+</span>
                </summary>
                <p>{project.detail}</p>
              </details>
              <div className="project-links">
                {project.demo && (
                  <a className="motion-text-link" href={project.demo}>
                    {project.demoLabel} ↗
                  </a>
                )}
                <a className="motion-text-link" href={project.source}>
                  Read the source ↗
                </a>
                {project.related?.map((link) => (
                  <a
                    className="motion-text-link"
                    key={link.href}
                    href={link.href}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </article>
        )}
      </div>
      <p className="motion-source-note">
        Selected from my public GitHub work. Dates refer to repository creation.
        Sketches are simplified illustrations; source links lead to the actual
        implementations.
      </p>
    </section>
  );
}

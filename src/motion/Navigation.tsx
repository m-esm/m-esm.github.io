import { lazy, Suspense, useEffect, useState } from "react";

const Scene = lazy(() => import("./MotionScene"));
const links = [
  ["work", "Selected work"],
  ["experiments", "Projects"],
  ["journey", "Timeline"],
  ["contact", "About & contact"],
];

export function Navigation({ chapter }: { chapter: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className={`motion-nav ${open ? "menu-open" : ""}`}>
      <a
        className="motion-signature"
        href="#top"
        onClick={() => setOpen(false)}
        aria-label="Mohsen Esmaeili, introduction"
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M5 29V11l15 18 15-18v18M5 20h30" />
        </svg>
        <span>
          <strong>Mohsen Esmaeili</strong>
          <small>Personal website</small>
        </span>
      </a>
      <nav aria-label="Portfolio" id="portfolio-navigation">
        {links.map(([id, label]) => (
          <a
            key={id}
            href={"#" + id}
            onClick={() => setOpen(false)}
            aria-current={
              (id === "work" &&
                ["Music & intelligence", "Software → physical world"].includes(
                  chapter,
                )) ||
              (id === "experiments" && chapter === "Independent experiments") ||
              (id === "journey" && chapter === "The journey") ||
              (id === "contact" && chapter === "Let’s build something")
                ? "location"
                : undefined
            }
          >
            {label}
          </a>
        ))}
        <a className="mobile-world-nav" href="#/sector/arrival">
          Enter the orbital habitat ↗
        </a>
      </nav>
      <a className="motion-world-link" href="#/sector/arrival">
        Play the portfolio <span aria-hidden="true">↗</span>
      </a>
      <button
        className="motion-menu-toggle"
        aria-expanded={open}
        aria-controls="portfolio-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
    </header>
  );
}

export function Hero({ paused }: { paused: boolean }) {
  const [focus, setFocus] = useState<import("./MotionScene").WorkFocus>("both");
  const [running, setRunning] = useState(false);
  return (
    <section id="top" className="motion-hero" data-chapter="Introduction">
      <div className="personal-intro">
        <p className="motion-intro">Software engineer / Helsinki, Finland</p>
        <h1>
          Hi, I’m Mohsen.
          <br />
          <span>Call me Moshe.</span>
        </h1>
        <p className="hero-summary">
          I build backend platforms, developer tools and things I can use
          myself.
        </p>
        <p className="hero-role">
          Staff Engineer at <a href="#work">Songtradr</a>. Previously, I built
          the Delivery-as-a-Service platform at <a href="#starship">Starship</a>
          .
        </p>
        <div className="hero-links">
          <a className="motion-pill" href="#starship">
            Selected work <span>↓</span>
          </a>
          <a className="text-link" href="#experiments">
            Personal projects <span>↓</span>
          </a>
        </div>
        <div className="intro-profiles">
          <a href="https://github.com/m-esm">GitHub</a>
          <a href="https://linkedin.com/in/m-esm">LinkedIn</a>
          <a href="/reading.html">Reading version</a>
        </div>
      </div>
      <div className="hero-workbench" data-focus={focus}>
        <div className="workbench-canvas">
          <Suspense
            fallback={
              <div className="workbench-fallback">
                Loading the interactive scene…
              </div>
            }
          >
            <Scene
              focus={focus}
              onFocus={setFocus}
              running={running}
              paused={paused}
            />
          </Suspense>
        </div>
        <div className="workbench-controls">
          <div className="workbench-tabs" aria-label="Workbench view">
            {(
              [
                ["both", "Overview"],
                ["robotics", "Starship"],
                ["music", "Songtradr"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                aria-pressed={focus === id}
                onClick={() => setFocus(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="workbench-run"
            onClick={() => setRunning(!running)}
            disabled={paused}
            aria-pressed={running}
          >
            {paused ? "Motion paused" : running ? "Ⅱ Stop" : "▷ Animate"}
          </button>
        </div>
        <div className="workbench-caption" aria-live="polite">
          <p>
            {focus === "both"
              ? "Delivery robotics and music technology. Two chapters of my work."
              : focus === "robotics"
                ? "Starship: partner APIs, operational tools and delivery integrations."
                : "Songtradr: my current role in AI engineering and music technology."}
          </p>
          <span>Original 3D illustration · drag to orbit</span>
        </div>
      </div>
    </section>
  );
}

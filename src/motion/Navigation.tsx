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
          Mohsen
          <br />
          <strong>Esmaeili</strong>
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
  const copy = {
    both: [
      "Two chapters of my work",
      "Delivery platforms at Starship. AI engineering at Songtradr. Two chapters of my career, illustrated on one workbench.",
      "#work",
      "Explore my work",
    ],
    robotics: [
      "Starship · delivery systems",
      "I architected and built the DaaS platform: partner APIs, operational tools and the integrations behind autonomous deliveries.",
      "#starship",
      "See my Starship work",
    ],
    music: [
      "Songtradr · music & AI",
      "I’m a Staff Engineer at Songtradr, bringing platform engineering and AI into music technology.",
      "#work",
      "My current role",
    ],
  };
  return (
    <section id="top" className="motion-hero" data-chapter="Introduction">
      <div className="personal-intro">
        <p className="motion-intro">
          My corner of the internet / Helsinki, Finland
        </p>
        <h1>
          Hi, I’m Mohsen.
          <br />
          <span>You can call me Moshe.</span>
        </h1>
        <p className="hero-summary">
          I’m a software engineer who likes making things work—from platforms
          behind delivery robots to tools for music, agents and my own
          workbench.
        </p>
        <p className="hero-role">
          Currently <strong>Staff Engineer at Songtradr.</strong>
          <br />
          Previously, I built Starship’s Delivery-as-a-Service platform.
        </p>
        <div className="hero-links">
          <a className="motion-pill" href="#experiments">
            Explore my projects <span>↓</span>
          </a>
          <a className="motion-text-link" href="https://github.com/m-esm">
            GitHub ↗
          </a>
          <a className="motion-text-link" href="https://linkedin.com/in/m-esm">
            LinkedIn ↗
          </a>
        </div>
        <div className="motion-current">
          <a href="#work">
            <span>Now / 2026</span>
            <img src="/assets/brands/songtradr.svg" alt="Songtradr" />
          </a>
          <a href="#starship">
            <span>Previously / joined 2021</span>
            <img
              src="/assets/brands/starship.svg"
              alt="Starship Technologies"
            />
          </a>
        </div>
      </div>
      <div className="hero-workbench">
        <div className="workbench-label">
          <span>A little interactive workbench</span>
          <button
            onClick={() => setRunning(!running)}
            disabled={paused}
            aria-pressed={running}
          >
            {paused
              ? "Motion paused"
              : running
                ? "Stop the sketch"
                : "Run the sketch"}
          </button>
        </div>
        <div className="workbench-canvas">
          <Suspense
            fallback={
              <div className="workbench-fallback">
                Assembling the workbench…
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
        <div
          className="workbench-tabs"
          aria-label="Explore two chapters of my work"
        >
          {(
            [
              ["both", "Both worlds"],
              ["robotics", "Delivery robotics"],
              ["music", "Music & AI"],
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
        <div className="workbench-caption" aria-live="polite">
          <strong>{copy[focus][0]}</strong>
          <p>{copy[focus][1]}</p>
          <a href={copy[focus][2]}>{copy[focus][3]} ↗</a>
        </div>
        <small>
          Click an object to explore it. Drag to change the view. No sound.
        </small>
      </div>
    </section>
  );
}

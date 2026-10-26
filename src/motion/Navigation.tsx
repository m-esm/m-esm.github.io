import { useEffect, useState } from "react";

const links = [
  ["work", "Selected work"],
  ["experiments", "The workshop"],
  ["journey", "My journey"],
  ["contact", "Get in touch"],
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

export function Hero() {
  return (
    <section id="top" className="motion-hero" data-chapter="Introduction">
      <p className="motion-intro">Staff Engineer. Systems thinker. Maker.</p>
      <h1>
        Systems.
        <br />
        With a life
        <br />
        of their own.
      </h1>
      <div className="motion-hero-bottom">
        <p>
          From robots moving through cities
          <br />
          to the technology behind music.
          <br />I build the systems that connect them.
        </p>
        <a
          href="#work"
          className="motion-orbit-button"
          aria-label="Explore my work"
        >
          <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="motion-current">
        <a href="#work">
          <span>Current chapter</span>
          <img src="/assets/brands/songtradr.svg" alt="Songtradr" />
        </a>
        <a href="#starship">
          <span>Previously</span>
          <img src="/assets/brands/starship.svg" alt="Starship Technologies" />
        </a>
      </div>
      <div className="hero-object-caption">
        <span className="status-dot" />
        An exploration of connected systems
        <span>Move your pointer. Follow the thread.</span>
      </div>
    </section>
  );
}

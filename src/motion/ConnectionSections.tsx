import { useState } from "react";
import { sectorStories } from "../content/editorial";
export function WorldEntrance() {
  const [selected, setSelected] = useState("arrival");
  const current = sectorStories.find((s) => s.id === selected)!;
  return (
    <section
      className="motion-chapter habitat-section"
      data-chapter="Step inside"
    >
      <a
        className="habitat-preview"
        href={"#/sector/" + selected}
        aria-label={"Explore " + current.title}
      >
        <img
          src={
            selected === "arrival"
              ? "/assets/projects/orbital-habitat.jpg"
              : `/assets/projects/habitat-${selected}.jpg`
          }
          alt={`Actual in-game view of ${current.title.toLowerCase()}, with physical portfolio exhibits`}
          loading="lazy"
        />
        <span className="habitat-play">
          Enter {current.title.toLowerCase()} <span aria-hidden="true">↗</span>
        </span>
        <small>Captured from the playable portfolio</small>
      </a>
      <div className="habitat-copy">
        <p className="section-date">Personal project / 2026</p>
        <h2>
          A portfolio you
          <br />
          can walk around.
        </h2>
        <p>
          Drive a maintenance robot through a small orbital settlement. The
          projects are exhibits; the writing lives on physical boards.
        </p>
        <div
          className="habitat-destinations"
          aria-label="Choose a station destination"
        >
          {sectorStories.map((s) => (
            <button
              key={s.id}
              aria-pressed={selected === s.id}
              onClick={() => setSelected(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
        <p className="destination-note" aria-live="polite">
          {current.description}
        </p>
        <p className="habitat-controls">
          WASD or arrows to drive. Drag to look. Touch controls on mobile.
        </p>
      </div>
    </section>
  );
}
export function Contact({
  paused,
  onPause,
}: {
  paused: boolean;
  onPause: () => void;
}) {
  return (
    <footer
      id="contact"
      className="motion-chapter personal-footer"
      data-chapter="Let’s build something"
    >
      <div>
        <h2>Say hello.</h2>
        <p>I’m Mohsen — Moshe, for short. Based in Helsinki.</p>
        <p>
          Outside work: music practice, mechanical design and tools for my own
          projects. You’ll find the source for most of them on GitHub.
        </p>
      </div>
      <nav aria-label="Contact and profiles">
        <a className="contact-primary" href="https://www.linkedin.com/in/m-esm">
          <span>
            Message me on LinkedIn
            <small>Work, projects or a conversation</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href="https://github.com/m-esm">
          <span>
            GitHub<small>Source code & ongoing projects</small>
          </span>
          ↗
        </a>
        <a href="/reading.html">
          <span>
            Reading version<small>The work, without the 3D</small>
          </span>
          ↗
        </a>
      </nav>
      <div className="footer-bottom">
        <span>A personal website, built by Moshe.</span>
        <a href="/assets/licenses/project-credits.html">
          Image & asset credits
        </a>
        <button
          className="footer-motion"
          onClick={onPause}
          aria-pressed={paused}
        >
          {paused ? "Resume animation" : "Pause animation"}
        </button>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

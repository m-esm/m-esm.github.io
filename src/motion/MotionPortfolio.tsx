import { useEffect, useState } from "react";
import { Navigation, Hero } from "./Navigation";
import { MusicChapter, DeliveryChapter } from "./ProfessionalChapters";
import { ProjectGallery } from "./ProjectGallery";
import { CareerJourney } from "./CareerJourney";
import { Recommendations, WorldEntrance, Contact } from "./ConnectionSections";
import "./motion.css";

export default function MotionPortfolio() {
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [chapter, setChapter] = useState("Introduction");
  useEffect(() => {
    document.body.classList.add("motion-mode");
    const target = document.getElementById(location.hash.slice(1));
    if (target)
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "instant" }),
      );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setChapter(
              (e.target as HTMLElement).dataset.chapter || "Introduction",
            );
      },
      { rootMargin: "-20% 0px -45% 0px" },
    );
    document
      .querySelectorAll("[data-chapter]")
      .forEach((el) => observer.observe(el));
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => setPaused(media.matches);
    media.addEventListener("change", reduce);
    return () => {
      document.body.classList.remove("motion-mode");
      observer.disconnect();
      media.removeEventListener("change", reduce);
    };
  }, []);
  return (
    <div
      className={`motion-site ${paused ? "motion-paused" : ""}`}
      data-scene={chapter}
    >
      <Navigation chapter={chapter} />
      <aside className="motion-indicator">
        <a href="#top" aria-label="Back to introduction">
          <span className="status-dot" />
          {chapter}
        </a>
        <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </aside>
      <main>
        <Hero paused={paused} />
        <MusicChapter />
        <DeliveryChapter paused={paused} />
        <Recommendations />
        <ProjectGallery paused={paused} />
        <CareerJourney />
        <WorldEntrance />
        <Contact />
      </main>
    </div>
  );
}

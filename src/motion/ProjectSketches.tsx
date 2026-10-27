import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { PersonalProject } from "../content/projects";
const Diagram = lazy(() => import("./SystemDiagram"));
const notes = [
  ["D3", 146.83],
  ["A3", 220],
  ["B♭3", 233.08],
  ["C4", 261.63],
  ["D4", 293.66],
  ["E4", 329.63],
  ["F4", 349.23],
  ["G4", 392],
  ["A4", 440],
  ["C5", 523.25],
] as const;
function Handpan() {
  const audio = useRef<AudioContext | null>(null),
    [last, setLast] = useState("Tap a note"),
    [error, setError] = useState(false);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  async function strike(i: number) {
    setLast(notes[i][0]);
    try {
      const ctx = audio.current ?? (audio.current = new AudioContext());
      await ctx.resume();
      const time = ctx.currentTime;
      [1, 2, 3].forEach((partial, j) => {
        const tone = ctx.createOscillator(),
          gain = ctx.createGain();
        tone.type = "sine";
        tone.frequency.value = notes[i][1] * partial;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.16 / (j + 1), time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.4 / (j + 1));
        tone.connect(gain).connect(ctx.destination);
        tone.start(time);
        tone.stop(time + 1.6);
      });
    } catch {
      setError(true);
    }
  }
  return (
    <div className="handpan-sketch">
      <div className="mini-pan">
        {notes.map(([name], i) => {
          const a = ((i - 1) / 9) * Math.PI * 2 - Math.PI / 2;
          return (
            <button
              key={name}
              className={last === name ? "struck" : ""}
              style={
                i === 0
                  ? { left: "50%", top: "50%" }
                  : {
                      left: `${50 + 35 * Math.cos(a)}%`,
                      top: `${50 + 35 * Math.sin(a)}%`,
                    }
              }
              onClick={() => void strike(i)}
              aria-label={"Play " + name}
            >
              {name}
            </button>
          );
        })}
      </div>
      <p aria-live="polite">
        {error
          ? "Audio isn’t available in this browser. Open Alamut for the complete experience."
          : last === "Tap a note"
            ? "Tap a note to hear it. Sound starts only on tap."
            : last + " · D Kurd scale"}
      </p>
      <small>A synthesized sketch, not a recording of the instrument.</small>
    </div>
  );
}
function Torque() {
  const [mass, setMass] = useState(1),
    [length, setLength] = useState(102);
  return (
    <div className="torque-sketch">
      <svg viewBox="0 0 500 210" aria-hidden="true">
        <path
          d="M70 100H410"
          stroke="#8fa4b9"
          strokeWidth="25"
          strokeLinecap="round"
        />
        <circle
          cx="70"
          cy="100"
          r="25"
          fill="#1b2e45"
          stroke="#b5cfde"
          strokeWidth="6"
        />
        <circle cx="240" cy="100" r="6" fill="#1b2e45" />
        <circle cx="410" cy="100" r="6" fill="#1b2e45" />
        <path
          d={`M${length === 102 ? 410 : 240} 105v70m-8-10 8 10 8-10`}
          stroke="#ebc1a4"
          strokeWidth="3"
          fill="none"
        />
        <path d={`M70 53H${length === 102 ? 410 : 240}`} stroke="#819cb8" />
        <text x="220" y="40" fill="#bbd5e5" textAnchor="middle" fontSize="16">
          {length} mm lever arm
        </text>
      </svg>
      <div className="torque-result">
        <strong>
          {((mass * 9.81 * length) / 1000).toFixed(2)} <span>Nm</span>
        </strong>
        <p>
          {mass.toFixed(1)} kg × 9.81 × {(length / 1000).toFixed(3)} m
        </p>
      </div>
      <label className="mass-slider">
        Luggage-scale reading
        <input
          type="range"
          aria-label="Scale reading in kilograms"
          min="0.1"
          max="3"
          step="0.1"
          value={mass}
          onChange={(e) => setMass(+e.target.value)}
        />
      </label>
      <div className="sketch-switch">
        {[102, 51].map((n) => (
          <button
            key={n}
            aria-pressed={length === n}
            onClick={() => setLength(n)}
          >
            {n} mm hole
          </button>
        ))}
      </div>
      <small>
        Assumes a perpendicular pull. Based on the repository’s geometry.
      </small>
    </div>
  );
}
function Agents({ paused }: { paused: boolean }) {
  const [stage, setStage] = useState(0),
    descriptions = [
      "Separate the amount of work from the reasoning difficulty.",
      "Choose a worker using task fit and available quota.",
      "Isolate the change in a Git worktree, then check the diff.",
    ];
  return (
    <div className="agent-diagram">
      <Suspense fallback={null}>
        <Diagram
          kind="agents"
          selected={stage}
          onSelect={setStage}
          paused={paused}
        />
      </Suspense>
      <div className="sketch-switch">
        {["Task", "Route", "Verify"].map((name, i) => (
          <button
            key={name}
            aria-pressed={stage === i}
            onClick={() => setStage(i)}
          >
            {name}
          </button>
        ))}
      </div>
      <p aria-live="polite">{descriptions[stage]}</p>
      <small>Conceptual model · drag to rotate</small>
    </div>
  );
}
export default function ProjectSketch({
  kind,
  paused,
}: {
  kind: PersonalProject["sketch"];
  paused: boolean;
}) {
  switch (kind) {
    case "handpan":
      return <Handpan />;
    case "torque":
      return <Torque />;
    case "agents":
      return <Agents paused={paused} />;
    default:
      return null;
  }
}

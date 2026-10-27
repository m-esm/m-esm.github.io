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
function Trajectory() {
  const [angle, setAngle] = useState(48),
    [power, setPower] = useState(96),
    [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false);
  const speed = power * 1.3,
    a = (angle * Math.PI) / 180,
    duration = (2 * speed * Math.sin(a)) / 70;
  const point = (t: number) => [
    40 + speed * Math.cos(a) * t,
    190 - (speed * Math.sin(a) * t - 35 * t * t),
  ];
  const end = point(duration),
    points = Array.from({ length: 61 }, (_, i) =>
      point((i / 60) * duration).join(","),
    ).join(" "),
    current = point(progress * duration);
  useEffect(() => {
    if (!playing) return;
    let frame: number, start: number;
    const step = (now: number) => {
      start ??= now;
      const p = Math.min(1, (now - start) / 1400);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(step);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  return (
    <div className="trajectory-sketch">
      <svg
        viewBox="0 0 500 230"
        role="img"
        aria-label="An adjustable ballistic arc from a small tank toward a target"
      >
        <path d="M0 191Q120 160 240 191T500 191V230H0Z" fill="#253c4d" />
        <path d="M0 191H500" stroke="#50657f" />
        <polyline
          points={points}
          fill="none"
          stroke="#9ad8de"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
        <g transform="translate(40 190)">
          <rect x="-18" y="-12" width="36" height="12" rx="5" fill="#a1bdcd" />
          <path
            d={`M0 -12L${Math.cos(a) * 27} ${-12 - Math.sin(a) * 27}`}
            stroke="#c2dae4"
            strokeWidth="6"
          />
        </g>
        <path d="M420 190v-28h18l-18 12" fill="#d6ad90" stroke="#d6ad90" />
        <circle cx={current[0]} cy={current[1]} r="4" fill="#eff8ff" />
      </svg>
      <div className="sketch-sliders">
        <label>
          Angle <strong>{angle}°</strong>
          <input
            aria-label="Shot angle"
            type="range"
            min="20"
            max="75"
            value={angle}
            onChange={(e) => {
              setAngle(+e.target.value);
              setPlaying(false);
              setProgress(0);
            }}
          />
        </label>
        <label>
          Power <strong>{power}</strong>
          <input
            aria-label="Shot power"
            type="range"
            min="45"
            max="130"
            value={power}
            onChange={(e) => {
              setPower(+e.target.value);
              setPlaying(false);
              setProgress(0);
            }}
          />
        </label>
      </div>
      <button
        className="sketch-action"
        disabled={playing}
        onClick={() => {
          setProgress(0);
          setPlaying(true);
        }}
      >
        Try this shot
      </button>
      <p>
        {Math.abs(end[0] - 420) < 18
          ? "On target."
          : end[0] < 420
            ? "Short of the target. Try more power."
            : "Past the target. Try less power."}
      </p>
      <small>
        Original aiming sketch. Hillshot has its own server-side physics.
      </small>
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
function Nutrition() {
  const [sort, setSort] = useState<"protein" | "sugar">("protein");
  const rows = [
    { name: "Example A", protein: 8, sugar: 4 },
    { name: "Example B", protein: 19, sugar: 8 },
    { name: "Example C", protein: 12, sugar: 2 },
  ].sort((a, b) =>
    sort === "protein" ? b.protein - a.protein : a.sugar - b.sugar,
  );
  return (
    <div className="nutrition-sketch">
      <p>Make a different tradeoff.</p>
      <div className="sketch-switch">
        <button
          aria-pressed={sort === "protein"}
          onClick={() => setSort("protein")}
        >
          More protein
        </button>
        <button
          aria-pressed={sort === "sugar"}
          onClick={() => setSort("sugar")}
        >
          Less sugar
        </button>
      </div>
      <table>
        <caption>Fictional sample products · grams per 100 g</caption>
        <thead>
          <tr>
            <th>Product</th>
            <th>Protein</th>
            <th>Sugar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <th>{r.name}</th>
              <td>{r.protein}</td>
              <td>{r.sugar}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small>A sorting sketch. Open the extension for real product data.</small>
    </div>
  );
}
function Cad() {
  const [stage, setStage] = useState(0);
  const stages = [
    [
      "Model",
      "Parametric Python defines parts and assemblies. Inspect the geometry in a browser viewer.",
      "/assets/projects/cad-workflow.png",
    ],
    [
      "Import",
      "Bring external STEP, IGES and STL geometry into the same measurement and inspection workflow.",
      "/assets/projects/cad-workflow.png",
    ],
    [
      "Prepare to print",
      "Package parts onto named plates with print settings in a Bambu Studio project.",
      "/assets/projects/bambu-plates.png",
    ],
  ];
  return (
    <div className="cad-sketch">
      <img
        src={stages[stage][2]}
        alt={
          stage === 2
            ? "Diagram of named print plates from the Bambu export repository"
            : "Parametric parts viewer"
        }
      />
      <div className="sketch-switch">
        {stages.map(([label], i) => (
          <button
            key={label}
            aria-pressed={stage === i}
            onClick={() => setStage(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <p aria-live="polite">{stages[stage][1]}</p>
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
    case "trajectory":
      return <Trajectory />;
    case "torque":
      return <Torque />;
    case "nutrition":
      return <Nutrition />;
    case "cad":
      return <Cad />;
    case "agents":
      return <Agents paused={paused} />;
    default:
      return null;
  }
}

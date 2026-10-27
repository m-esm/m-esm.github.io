import type { PersonalProject } from "../content/projects";

/** Original explanatory drawings, never presented as screenshots of the projects. */
export function ProjectArtwork({ project }: { project: PersonalProject }) {
  if (project.image)
    return (
      <img
        src={project.image}
        alt={project.imageAlt || project.title}
        loading="lazy"
      />
    );
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    accent = false,
  ) => (
    <g key={label}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        className={accent ? "art-accent" : "art-box"}
      />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle">
        {label}
      </text>
    </g>
  );
  let drawing;
  switch (project.id) {
    case "smart-subagents":
      drawing = (
        <>
          <path
            className="art-line"
            d="M150 98H223V160M150 222H223V160H270M410 160h50"
          />
          {box(30, 70, 120, 56, "Task fit")}
          {box(30, 194, 120, 56, "Quota")}
          {box(270, 120, 140, 80, "Select worker", true)}
          <path
            className="art-diff"
            d="M480 108v104m-20-78h64m-64 26h46m-46 26h58"
          />
          <text x="490" y="249" textAnchor="middle">
            Verified diff
          </text>
        </>
      );
      break;
    case "hillshot":
      drawing = (
        <>
          <path
            className="art-terrain"
            d="M0 248 55 220 95 180 145 194 190 252 260 265 320 225 380 230 442 177 515 205 600 188V320H0Z"
          />
          <path className="art-trajectory" d="M105 176Q290 -20 452 176" />
          <circle cx="105" cy="176" r="6" className="art-dot" />
          <path className="art-line" d="m440 169 12 7-2-14" />
          <text x="35" y="53">
            Server resolves the shot
          </text>
          <text x="350" y="288">
            Clients render the result
          </text>
          <path className="art-line" d="M420 80h70m-10-6 10 6-10 6" />
          <text x="421" y="64">
            Wind
          </text>
        </>
      );
      break;
    case "socket-cluster":
      drawing = (
        <>
          <path
            className="art-line"
            d="M95 75v65h85m-85 105v-65h85m130-20h60m130-20h45V75m-45 105h45v65"
          />
          {[75, 245].flatMap((y) =>
            [95, 545].map((x) => (
              <circle
                key={x + ":" + y}
                cx={x}
                cy={y}
                r="15"
                className="art-client"
              />
            )),
          )}
          {box(180, 120, 130, 80, "Instance")}
          {box(370, 120, 130, 80, "Instance")}
          <ellipse cx="340" cy="68" rx="38" ry="13" className="art-accent" />
          <path
            className="art-line"
            d="M302 68v24c0 17 76 17 76 0V68m-38 37v55"
          />
          <text x="340" y="45" textAnchor="middle">
            Redis
          </text>
          <text x="50" y="288">
            Connected clients
          </text>
        </>
      );
      break;
    case "e2db":
      drawing = (
        <>
          {box(35, 72, 150, 176, "Fields")}
          <path
            className="art-line"
            d="M65 111h88m-88 99h88m32-50h60m104 0h55"
          />
          <rect
            x="250"
            y="139"
            width="94"
            height="78"
            rx="10"
            className="art-accent"
          />
          <path className="art-line" d="M270 139v-29a27 27 0 0 1 54 0v29" />
          <circle cx="297" cy="174" r="5" className="art-dot" />
          {box(405, 72, 150, 176, "Encrypted")}
          <path
            className="art-cipher"
            d="M430 110h12m8 0h25m8 0h13m8 0h24m-98 100h22m9 0h12m9 0h25m8 0h13"
          />
        </>
      );
      break;
    case "node-multi-branch":
      drawing = (
        <>
          <path
            className="art-line"
            d="M160 62H460M160 160H460M160 258H460M225 62v98m0-98v196"
          />
          {["main", "feature", "fix"].map((name, i) => (
            <g key={name}>
              <text x="42" y={67 + i * 98}>
                {name}
              </text>
              <circle cx="160" cy={62 + i * 98} r="8" className="art-dot" />
              {box(370, 40 + i * 98, 170, 44, "App instance", i === 1)}
            </g>
          ))}
        </>
      );
      break;
    case "jev-model-router":
      drawing = (
        <>
          <path
            className="art-line"
            d="M165 160h70m130 0h48V74h55m-55 86h55m-55 0v86h55"
          />
          {box(25, 130, 140, 60, "Prompt")}
          {box(235, 110, 130, 100, "Difficulty", true)}
          {["Lower effort", "More effort", "Deep reasoning"].map((label, i) => (
            <g key={label}>
              <path
                className="art-meter"
                d={`M475 ${71 + i * 86}h${30 + i * 20}`}
              />
              <text x="415" y={102 + i * 86}>
                {label}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case "claude-code-cockpit":
      drawing = (
        <>
          <rect
            x="60"
            y="55"
            width="480"
            height="210"
            rx="10"
            className="art-box"
          />
          <path className="art-line" d="M60 113h480" />
          <circle cx="88" cy="84" r="4" className="art-dot" />
          <text x="108" y="89">
            Prompt
          </text>
          <text x="90" y="151">
            Clarity
          </text>
          <text x="240" y="151">
            Hooks
          </text>
          <text x="390" y="151">
            Outcomes
          </text>
          <path
            className="art-line"
            d="M95 190h120m30 0h120m30 0h110M95 215h70m80 0h60m90 0h90"
          />
          <path className="art-diff" d="M90 183v15m150-15v15m150-15v15" />
        </>
      );
      break;
    case "whichui":
      drawing = (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={35 + i * 185}
                y="60"
                width="160"
                height="200"
                rx="8"
                className="art-box"
              />
              <path className="art-line" d={`M${35 + i * 185} 96h160`} />
              <rect
                x={57 + i * 185}
                y={120 + i * 7}
                width="116"
                height={i === 1 ? 45 : 70}
                rx={i === 2 ? 20 : 3}
                className={i === 1 ? "art-accent" : "art-client"}
              />
              <path
                className="art-line"
                d={`M${57 + i * 185} 215h90m-90 18h60`}
              />
            </g>
          ))}
          <text x="300" y="294" textAnchor="middle">
            Compare component libraries
          </text>
        </>
      );
      break;
    case "torque-lever":
      drawing = (
        <>
          <path className="art-lever" d="M85 180h420" />
          <circle cx="85" cy="180" r="28" className="art-box" />
          <circle cx="295" cy="180" r="7" className="art-dot" />
          <circle cx="505" cy="180" r="7" className="art-dot" />
          <path
            className="art-line"
            d="M85 106h420m-420-9v18m420-18v18M505 190v73m-8-10 8 10 8-10"
          />
          <text x="295" y="85" textAnchor="middle">
            102 mm
          </text>
          <text x="350" y="290">
            Perpendicular pull
          </text>
        </>
      );
      break;
    default:
      drawing = (
        <>
          {box(70, 110, 180, 100, "Source")}
          {box(350, 110, 180, 100, "Implementation", true)}
          <path className="art-line" d="M250 160h100" />
        </>
      );
  }
  return (
    <div className={"project-illustration illustration-" + project.id}>
      <svg
        viewBox="0 0 600 320"
        role="img"
        aria-label={project.title + ": conceptual illustration"}
      >
        {drawing}
      </svg>
      <span>Concept illustration</span>
    </div>
  );
}

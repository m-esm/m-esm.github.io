import { sectorStories } from "../content/editorial";
import type { SectorId } from "../content/portfolio";
export function StationMap({
  current,
  onGo,
}: {
  current: SectorId;
  onGo: (id: SectorId) => void;
}) {
  return (
    <div className="station-atlas">
      <svg
        viewBox="0 0 320 245"
        role="img"
        aria-label="Station layout: a connected loop around a planted courtyard"
      >
        <ellipse
          cx="160"
          cy="125"
          rx="149"
          ry="112"
          fill="none"
          stroke="currentColor"
          opacity=".2"
        />
        <path
          d="M156 202 62 143 62 58 230 47 254 161Z M62 143 155 130 254 161"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity=".4"
        />
        <circle cx="155" cy="130" r="22" fill="#617c57" opacity=".2" />
        <text
          x="155"
          y="134"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
        >
          Garden
        </text>
        {sectorStories.map((s) => (
          <g key={s.id}>
            <circle
              cx={s.x}
              cy={s.y}
              r={current === s.id ? 10 : 6}
              fill={current === s.id ? "#397ca5" : "#617c57"}
              stroke="#e4e9e3"
              strokeWidth="3"
            />
            <text
              x={s.x}
              y={s.y + (s.id === "arrival" ? 23 : -16)}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
            >
              {s.title}
            </text>
          </g>
        ))}
      </svg>
      <div className="atlas-destinations">
        {sectorStories.map((s) => (
          <button
            key={s.id}
            onClick={() => onGo(s.id)}
            aria-current={current === s.id ? "location" : undefined}
          >
            <span>{s.title}</span>
            <small>{s.description}</small>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </div>
  );
}

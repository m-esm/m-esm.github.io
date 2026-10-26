import { useRef, useState } from "react";
import { input } from "../app/state";
export function TouchControls() {
  const center = useRef({ x: 0, y: 0 }),
    [thumb, setThumb] = useState({ x: 0, y: 0 });
  return (
    <div className="touch-controls">
      <div
        className="joystick"
        role="group"
        aria-label="Touch movement control"
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          const r = e.currentTarget.getBoundingClientRect();
          center.current = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          e.stopPropagation();
          let x = e.clientX - center.current.x,
            y = e.clientY - center.current.y;
          const d = Math.hypot(x, y);
          if (d > 38) {
            x = (x / d) * 38;
            y = (y / d) * 38;
          }
          input.touch = { x: x / 38, z: y / 38 };
          setThumb({ x, y });
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          input.clear();
          setThumb({ x: 0, y: 0 });
        }}
        onPointerCancel={() => {
          input.clear();
          setThumb({ x: 0, y: 0 });
        }}
      >
        <span className="joystick-ring" />
        <span
          className="joystick-thumb"
          style={{ transform: `translate(${thumb.x}px,${thumb.y}px)` }}
        />
        <span className="joystick-label">Move</span>
      </div>
      <span className="look-hint">Drag the view to look</span>
    </div>
  );
}

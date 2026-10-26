import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { boardRoute, input, parseRoute } from "./state";
import type { Route } from "./state";
import { runtime } from "./runtime";
import { exhibitForBoard } from "../content/portfolio";
import type { SectorId } from "../content/portfolio";
import { nearestSector } from "../world/layout";
import { TouchControls } from "../ui/TouchControls";
import { StationMap } from "../ui/StationMap";
import { editorial } from "../content/editorial";
const World = lazy(() => import("../world/World"));
class Boundary extends Component<
  { children: ReactNode; onError: () => void },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}
function canRender() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash)),
    [ready, setReady] = useState(false),
    [error, setError] = useState(() => !canRender()),
    [near, setNear] = useState<string | null>(null),
    [menu, setMenu] = useState(false),
    [welcome, setWelcome] = useState(
      !location.hash || location.hash === "#/sector/arrival",
    ),
    [portrait, setPortrait] = useState(innerWidth < 700),
    [low, setLow] = useState(innerWidth < 700),
    [reduced, setReduced] = useState(
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [paused, setPaused] = useState(false),
    [hidden, setHidden] = useState(document.hidden);
  const surface = useRef<HTMLDivElement>(null),
    pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const selected = route.kind === "inspect" ? route.board : null;
  const applyRoute = useCallback((next: Route, transfer: boolean) => {
    input.clear();
    if (next.kind === "read") {
      location.assign("/reading.html");
      return;
    }
    if (transfer) {
      runtime.anchor =
        next.kind === "inspect" &&
        !["arrival", "directory"].includes(next.board)
          ? exhibitForBoard(next.board)!.sector
          : next.kind === "explore"
            ? next.sector
            : "arrival";
      runtime.teleport++;
    }
    setRoute(next);
  }, []);
  useEffect(() => {
    applyRoute(parseRoute(location.hash), true);
    const pop = () => applyRoute(parseRoute(location.hash), true);
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, [applyRoute]);
  const go = useCallback(
    (id: SectorId) => {
      const hash = `#/sector/${id}`;
      history.pushState(null, "", hash);
      applyRoute(parseRoute(hash), true);
      setMenu(false);
      setWelcome(false);
      surface.current?.focus();
    },
    [applyRoute],
  );
  const inspect = useCallback(
    (id: string, replace = false) => {
      const hash = boardRoute(id);
      replace
        ? history.replaceState(null, "", hash)
        : history.pushState(null, "", hash);
      applyRoute(parseRoute(hash), false);
      setMenu(false);
      setWelcome(false);
    },
    [applyRoute],
  );
  const leave = useCallback(() => {
    const sector = nearestSector(runtime.position);
    history.pushState(null, "", `#/sector/${sector}`);
    applyRoute({ kind: "explore", sector }, false);
    surface.current?.focus();
  }, [applyRoute]);
  const fail = useCallback(() => {
    input.clear();
    setError(true);
  }, []);
  const readyCallback = useCallback(() => {
    setReady(true);
    if (parseRoute(location.hash).kind === "explore")
      surface.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (ready || error || hidden) return;
    const timer = setTimeout(fail, 20000);
    return () => clearTimeout(timer);
  }, [ready, error, hidden, fail]);
  useEffect(() => {
    const resize = () => setPortrait(innerWidth < 700);
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const change = () => {
      input.clear();
      setHidden(document.hidden);
    };
    const blur = () => input.clear();
    addEventListener("blur", blur);
    document.addEventListener("visibilitychange", change);
    return () => {
      removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", change);
    };
  }, []);
  useEffect(() => {
    input.clear();
  }, [selected, menu]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) {
          e.preventDefault();
          leave();
        } else setMenu(false);
        return;
      }
      const el = e.target as HTMLElement;
      if (el.closest("button,a,input,select,textarea") || selected || menu)
        return;
      const k = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "q",
          "e",
          "r",
          "pageup",
          "pagedown",
        ].includes(k)
      ) {
        e.preventDefault();
        if (k === "e" && near && !e.repeat) {
          inspect(near);
          return;
        }
        if (k === "r" && !e.repeat) {
          runtime.recenter++;
          return;
        }
        input.keys.add(k);
      }
    };
    const keyup = (e: KeyboardEvent) => input.keys.delete(e.key.toLowerCase());
    addEventListener("keydown", keydown);
    addEventListener("keyup", keyup);
    return () => {
      removeEventListener("keydown", keydown);
      removeEventListener("keyup", keyup);
    };
  }, [selected, near, menu, inspect, leave]);
  // Read-only diagnostics are available only on explicit local validation URLs.
  useEffect(() => {
    if (!new URLSearchParams(location.search).has("debug")) return;
    Object.assign(window, { __station: { runtime, input, go, inspect } });
    return () => {
      delete (window as unknown as { __station?: unknown }).__station;
    };
  }, [go, inspect]);
  if (route.kind === "read")
    return (
      <main className="failure">
        <a href="/reading.html">Read portfolio</a>
      </main>
    );
  if (error)
    return (
      <main className="failure">
        <div className="fallback-symbol" aria-hidden="true">
          ⌁
        </div>
        <h1>The reading view is ready.</h1>
        <p>
          The 3D station could not start or its graphics connection was lost.
          All portfolio content is available in the reading view.
        </p>
        <a href="/reading.html">Read portfolio</a>
        <button onClick={() => location.reload()}>Try the station again</button>
      </main>
    );
  return (
    <main className={`station ${selected ? "inspecting" : ""}`}>
      <div
        ref={surface}
        className="world-surface"
        tabIndex={0}
        role="region"
        aria-label="Explore the orbital station"
        aria-describedby="world-help"
        onPointerDown={(e) => {
          if (selected || menu || (e.target as HTMLElement).closest("button,a"))
            return;
          surface.current?.focus({ preventScroll: true });
          pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const a = pointer.current;
          if (!a || selected) return;
          input.yaw -= (e.clientX - a.x) * 0.006;
          input.pitch = Math.max(
            -0.4,
            Math.min(0.65, input.pitch + (e.clientY - a.y) * 0.003),
          );
          pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        }}
        onPointerUp={() => {
          pointer.current = null;
        }}
        onPointerCancel={() => {
          pointer.current = null;
          input.clear();
        }}
      >
        <Boundary onError={fail}>
          <Suspense fallback={null}>
            <World
              selected={selected}
              portrait={portrait}
              low={low}
              reduced={reduced}
              paused={paused}
              hidden={hidden}
              onReady={readyCallback}
              onNear={setNear}
              onInspect={inspect}
              onLeave={leave}
              onGo={go}
              onPause={() => setPaused((v) => !v)}
              onFailure={fail}
            />
          </Suspense>
        </Boundary>
      </div>
      <p id="world-help" className="sr-only">
        WASD or arrow keys drive. Drag to look; Q and E rotate. Page Up and Page
        Down tilt. E inspects a nearby sign. Escape leaves a sign. R recenters
        the view. Station controls offer shortcuts and named camera buttons.
      </p>
      <div className="utility-bar">
        <button
          aria-expanded={menu}
          aria-controls="station-menu"
          onClick={() => setMenu((v) => !v)}
        >
          ☷ <span>Map & controls</span>
        </button>
        <a href="/reading.html">Read portfolio</a>
      </div>
      {menu && (
        <aside
          id="station-menu"
          className="utility-menu"
          aria-label="Station controls"
        >
          <div className="menu-top">
            <strong>Station controls</strong>
            <button aria-label="Close controls" onClick={() => setMenu(false)}>
              ×
            </button>
          </div>
          <p>
            WASD / arrows to drive. Drag to look.
            <br />E to inspect a nearby sign. Esc to leave.
          </p>
          <StationMap current={nearestSector(runtime.position)} onGo={go} />
          <details className="camera-controls">
            <summary>Camera & display</summary>
            <div className="menu-grid">
              <button
                onClick={() => {
                  runtime.recenter++;
                }}
              >
                Recenter camera
              </button>
              <button onClick={() => inspect("arrival")}>
                Inspect identity sign
              </button>
              <button
                aria-label="Rotate camera left"
                onClick={() => {
                  input.yaw += 0.3;
                }}
              >
                Look left
              </button>
              <button
                aria-label="Rotate camera right"
                onClick={() => {
                  input.yaw -= 0.3;
                }}
              >
                Look right
              </button>
              <button
                onClick={() => {
                  input.pitch = Math.min(0.65, input.pitch + 0.15);
                }}
              >
                Look up
              </button>
              <button
                onClick={() => {
                  input.pitch = Math.max(-0.4, input.pitch - 0.15);
                }}
              >
                Look down
              </button>
            </div>
            <label>
              Detail{" "}
              <select
                value={low ? "low" : "standard"}
                onChange={(e) => setLow(e.target.value === "low")}
              >
                <option value="standard">Standard</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduce motion
            </label>
            <label>
              <input
                type="checkbox"
                checked={paused}
                onChange={(e) => setPaused(e.target.checked)}
              />{" "}
              Pause exhibit models
            </label>
          </details>
          <p className="menu-foot">
            Sound is off. Free exploration; nothing to unlock.
          </p>
        </aside>
      )}
      {ready && welcome && !selected && !menu && (
        <aside className="arrival-introduction" aria-label="Welcome">
          <button
            className="intro-dismiss"
            aria-label="Dismiss introduction"
            onClick={() => setWelcome(false)}
          >
            ×
          </button>
          <p className="intro-name">
            Mohsen Esmaeili <span>Staff Engineer at Songtradr</span>
          </p>
          <h1>{editorial.headline}</h1>
          <p>
            Previously, I built Starship’s Delivery-as-a-Service platform.
            Explore the engineering behind my work.
          </p>
          <div className="intro-actions">
            <button
              onClick={() => {
                setWelcome(false);
                surface.current?.focus();
              }}
            >
              Explore freely
            </button>
            <a href="/reading.html">Read my work</a>
          </div>
          <button
            className="intro-feature"
            onClick={() => {
              go("systems");
              inspect("context");
            }}
          >
            Featured work <strong>Delivery-as-a-Service at Starship</strong>
          </button>
          <div className="intro-projects">
            <button onClick={() => go("workshop")}>
              Parviz <span>Robotics</span>
            </button>
            <button onClick={() => go("agents")}>
              Smart subagents <span>AI engineering</span>
            </button>
          </div>
        </aside>
      )}
      {!ready && (
        <div className="loading" role="status">
          <span className="loading-mark" />
          <p>Preparing the station</p>
          <a href="/reading.html">Read portfolio while it loads</a>
        </div>
      )}
      {ready && !selected && !menu && (
        <>
          <div className="explore-hint" aria-live="polite">
            {near ? (
              <button onClick={() => inspect(near)}>
                Inspect sign <kbd>E</kbd>
              </button>
            ) : (
              <span className="desktop-hint">
                WASD to drive <span>·</span> Drag to look
              </span>
            )}
          </div>
          <TouchControls />
        </>
      )}
      {selected && (
        <div className="inspection-utility">
          <button onClick={leave}>
            Leave sign <kbd>Esc</kbd>
          </button>
        </div>
      )}
      {route.kind === "explore" && route.invalid && (
        <p className="route-notice" role="status">
          That destination isn’t available. You’re at arrival.
        </p>
      )}
    </main>
  );
}

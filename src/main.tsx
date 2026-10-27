import { createRoot } from "react-dom/client";
import { Component, lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import "./ui/style.css";
import { LoadingScreen } from "./ui/LoadingScreen";
const Station = lazy(() =>
  import("./app/App").then((m) => ({ default: m.App })),
);
const Portfolio = lazy(() => import("./motion/MotionPortfolio"));
class EntryBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="failure">
        <h1>This view needs a refresh.</h1>
        <p>
          The interactive files could not load. Refresh to try again, or open
          the complete reading version.
        </p>
        <button onClick={() => location.reload()}>Refresh this page</button>
        <a href="/reading.html">Open the reading version</a>
      </main>
    );
  }
}
function Entry() {
  const [station, setStation] = useState(location.hash.startsWith("#/"));
  useEffect(() => {
    const update = () => setStation(location.hash.startsWith("#/"));
    addEventListener("hashchange", update);
    addEventListener("popstate", update);
    return () => {
      removeEventListener("hashchange", update);
      removeEventListener("popstate", update);
    };
  }, []);
  return (
    <EntryBoundary key={station ? "station" : "portfolio"}>
      <Suspense fallback={<LoadingScreen station={station} />}>
        {station ? <Station /> : <Portfolio />}
      </Suspense>
    </EntryBoundary>
  );
}
createRoot(document.getElementById("root")!).render(<Entry />);

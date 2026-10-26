import { createRoot } from "react-dom/client";
import { lazy, Suspense, useEffect, useState } from "react";
import "./ui/style.css";
import { LoadingScreen } from "./ui/LoadingScreen";
const Station = lazy(() =>
  import("./app/App").then((m) => ({ default: m.App })),
);
const Portfolio = lazy(() => import("./motion/MotionPortfolio"));
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
    <Suspense fallback={<LoadingScreen station={station} />}>
      {station ? (
        <>
          <Station />
          <a href="/" className="station-portfolio-link">
            Back to portfolio
          </a>
        </>
      ) : (
        <Portfolio />
      )}
    </Suspense>
  );
}
createRoot(document.getElementById("root")!).render(<Entry />);

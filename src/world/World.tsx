import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment } from "./Environment";
import { Settlement } from "./Settlement";
import { Controller } from "../player/Controller";
import { PhysicalBoard, BoardFrames } from "../signage/PhysicalBoard";
import { DeliveryModel } from "../exhibits/DeliveryModel";
import { boards } from "./layout";
import type { SectorId } from "../content/portfolio";
import { Expansion } from "./Expansion";
import { OrbitalLife } from "./OrbitalLife";
import { ArchitecturePass } from "./ArchitecturePass";
import { WorldDetails } from "./WorldDetails";
function RenderLifecycle({
  onFailure,
  hidden,
}: {
  onFailure: () => void;
  hidden: boolean;
}) {
  const { gl, setFrameloop, invalidate } = useThree();
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => {
    setFrameloop(hidden ? "never" : "always");
    if (!hidden) invalidate();
  }, [hidden, setFrameloop, invalidate]);
  return null;
}
export interface WorldProps {
  selected: string | null;
  portrait: boolean;
  low: boolean;
  reduced: boolean;
  paused: boolean;
  hidden: boolean;
  onReady: () => void;
  onNear: (id: string | null) => void;
  onInspect: (id: string, replace?: boolean) => void;
  onLeave: () => void;
  onGo: (id: SectorId) => void;
  onPause: () => void;
  onFailure: () => void;
}
export default function World(props: WorldProps) {
  const [ready, setReady] = useState(false);
  return (
    <Canvas
      shadows={!props.low}
      dpr={props.low ? 1 : [1, 1.5]}
      camera={{ fov: 70, near: 0.1, far: 250, position: [2, 7.5, 29.5] }}
      gl={{ antialias: !props.low, powerPreference: "high-performance" }}
      fallback={
        <div>
          3D unavailable. <a href="/reading.html">Read portfolio</a>
        </div>
      }
      onCreated={({ gl }) => {
        gl.setClearColor("#030509");
      }}
    >
      <RenderLifecycle onFailure={props.onFailure} hidden={props.hidden} />
      <Suspense fallback={null}>
        <Environment low={props.low} reduced={props.reduced} />
        <Physics timeStep={1 / 60} paused={props.hidden} interpolate>
          <Settlement />
          <ArchitecturePass />
          <OrbitalLife paused={props.paused} reduced={props.reduced} />
          <WorldDetails paused={props.paused} reduced={props.reduced} />
          <Expansion paused={props.paused} reduced={props.reduced} />
          <DeliveryModel paused={props.paused} reduced={props.reduced} />
          <BoardFrames portrait={props.portrait} />
          {boards.map((b) => (
            <PhysicalBoard key={b.id} board={b} {...props} />
          ))}
          <Controller
            {...props}
            onReady={() => {
              if (!ready) {
                setReady(true);
                props.onReady();
              }
            }}
          />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

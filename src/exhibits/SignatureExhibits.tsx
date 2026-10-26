import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ExtrudeGeometry, Group, Shape, Path, MathUtils } from "three";
import { Bake, Beam, Box, Cyl, mat } from "../world/kit";
import { Label } from "../world/Settlement";

type Motion = { paused: boolean; reduced: boolean };
const amber = "#d88b45",
  graphite = "#29383c",
  alloy = "#8d9e9c";
function Belt({ side }: { side: number }) {
  const geometry = useMemo(() => {
    const s = new Shape();
    s.moveTo(-0.48, -0.32);
    s.lineTo(0.48, -0.32);
    s.absarc(0.48, 0, 0.32, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(-0.48, 0.32);
    s.absarc(-0.48, 0, 0.32, Math.PI / 2, Math.PI * 1.5, false);
    const h = new Path();
    h.moveTo(-0.48, -0.24);
    h.absarc(-0.48, 0, 0.24, -Math.PI / 2, -Math.PI * 1.5, true);
    h.lineTo(0.48, 0.24);
    h.absarc(0.48, 0, 0.24, Math.PI / 2, -Math.PI / 2, true);
    h.lineTo(-0.48, -0.24);
    s.holes.push(h);
    return new ExtrudeGeometry(s, {
      depth: 0.31,
      bevelEnabled: true,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      bevelSegments: 2,
      curveSegments: 20,
    });
  }, []);
  return (
    <group position={[side * 0.83, 0.37, 0]}>
      <Bake>
        <mesh
          geometry={geometry}
          material={mat("#252a29")}
          rotation={[0, Math.PI / 2, 0]}
          position={[-0.155, 0, 0]}
          castShadow
        />
        {[-0.48, 0, 0.48].map((z, i) => (
          <group key={z} position={[0, 0, z]}>
            <Cyl
              size={[i === 1 ? 0.19 : 0.255, 0.34, i === 1 ? 0.19 : 0.255]}
              rotation={[0, 0, Math.PI / 2]}
              color={graphite}
            />
            <Cyl
              at={[side * 0.19, 0, 0]}
              size={[0.16, 0.05, 0.16]}
              rotation={[0, 0, Math.PI / 2]}
              color={amber}
            />
            <Cyl
              at={[side * 0.23, 0, 0]}
              size={[0.055, 0.04, 0.055]}
              rotation={[0, 0, Math.PI / 2]}
              color={alloy}
            />
            {Array.from({ length: 6 }, (_, j) => (
              <Cyl
                key={j}
                at={[
                  side * 0.225,
                  Math.sin((j * Math.PI) / 3) * 0.105,
                  Math.cos((j * Math.PI) / 3) * 0.105,
                ]}
                size={[0.014, 0.02, 0.014]}
                rotation={[0, 0, Math.PI / 2]}
                color={graphite}
              />
            ))}
          </group>
        ))}
        {[-1, 1].flatMap((y) =>
          Array.from({ length: 10 }, (_, j) => (
            <Box
              key={`${y}-${j}`}
              at={[0, y * 0.34, -0.48 + j * 0.107]}
              size={[0.37, 0.043, 0.065]}
              color="#303733"
              round
            />
          )),
        )}
        {[-1, 1].flatMap((end) =>
          Array.from({ length: 10 }, (_, j) => {
            const a = -Math.PI / 2 + (j * Math.PI) / 9;
            return (
              <Box
                key={`${end}-${j}`}
                at={[0, Math.sin(a) * 0.34, end * (0.48 + Math.cos(a) * 0.34)]}
                rotation={[end * a, 0, 0]}
                size={[0.37, 0.065, 0.045]}
                color="#303733"
                round
              />
            );
          }),
        )}
      </Bake>
    </group>
  );
}
/** Original enlarged interpretation of the public Parviz design, not production CAD. */
export function ParvizExhibit({ paused, reduced }: Motion) {
  const [exploded, setExploded] = useState(false);
  const head = useRef<Group>(null),
    left = useRef<Group>(null),
    right = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (!head.current || !left.current || !right.current) return;
    const d = Math.min(dt, 0.05);
    if (!paused && !reduced) time.current += d;
    head.current.position.y = MathUtils.damp(
      head.current.position.y,
      exploded ? 2.35 : 1.38,
      8,
      reduced ? 1 : d,
    );
    head.current.rotation.y =
      paused || reduced ? 0 : Math.sin(time.current * 0.35) * 0.22;
    left.current.position.x = MathUtils.damp(
      left.current.position.x,
      exploded ? -0.5 : 0,
      8,
      reduced ? 1 : d,
    );
    right.current.position.x = -left.current.position.x;
  });
  return (
    <group position={[-32, 4.31, -13]} rotation={[0, 0.2, 0]}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          setExploded((v) => !v);
        }}
      >
        <Bake>
          <Box
            at={[0, 0.4, 0]}
            size={[1.5, 0.48, 1.25]}
            color={graphite}
            round
          />
          <Box
            at={[0, 0.68, 0]}
            size={[1.38, 0.12, 1.18]}
            color={amber}
            round
          />
          <Box
            at={[0, 0.46, 0.65]}
            size={[1.04, 0.22, 0.06]}
            color="#1a2932"
            round
          />
          {[-0.49, 0.49].map((x) => (
            <group key={x}>
              <Box
                at={[x, 0.52, 0.695]}
                size={[0.18, 0.075, 0.025]}
                color="#b6e4df"
                round
              />
              <Box
                at={[x, 0.2, 0.65]}
                size={[0.16, 0.08, 0.11]}
                color={alloy}
                round
              />
            </group>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <Box
              key={i}
              at={[-0.42 + i * 0.12, 0.75, -0.3]}
              size={[0.045, 0.025, 0.3]}
              color={graphite}
            />
          ))}
          <Cyl at={[0, 0.8, 0]} size={[0.4, 0.14, 0.4]} color={graphite} />
          <Cyl at={[0, 0.9, 0]} size={[0.32, 0.06, 0.32]} color={alloy} />
          {[-0.25, 0.25].map((x) => (
            <Box
              key={x}
              at={[x, 1.1, 0]}
              size={[0.12, 0.43, 0.34]}
              color={amber}
              round
            />
          ))}
          <Cyl
            at={[0, 1.2, 0]}
            size={[0.18, 0.69, 0.18]}
            rotation={[0, 0, Math.PI / 2]}
            color={graphite}
          />
          <Cyl
            at={[0.37, 1.2, 0]}
            size={[0.11, 0.04, 0.11]}
            rotation={[0, 0, Math.PI / 2]}
            color={alloy}
          />
          <Beam
            from={[0.48, 0.72, -0.3]}
            to={[0.43, 1.18, -0.22]}
            r={0.035}
            color="#252a29"
          />
          <Beam
            from={[-0.55, 0.65, -0.4]}
            to={[-0.55, 1.1, -0.4]}
            r={0.018}
            color={alloy}
          />
          <Cyl
            at={[-0.55, 1.15, -0.4]}
            size={[0.045, 0.13, 0.045]}
            color={graphite}
          />
        </Bake>
        <group ref={left}>
          <Belt side={-1} />
        </group>
        <group ref={right}>
          <Belt side={1} />
        </group>
        <group ref={head} position={[0, 1.38, 0]}>
          <Bake>
            <Box
              at={[0, 0.37, 0]}
              size={[2.05, 1.2, 0.35]}
              color={graphite}
              round
            />
            <Box
              at={[0, 0.37, 0.19]}
              size={[1.91, 1.06, 0.06]}
              color={amber}
              round
            />
            <Box
              at={[0, 0.37, 0.23]}
              size={[1.76, 0.91, 0.035]}
              color="#142732"
              round
            />
            {[-0.4, 0.4].map((x) => (
              <group key={x}>
                <Box
                  at={[x, 0.43, 0.255]}
                  size={[0.3, 0.29, 0.015]}
                  color="#4b929f"
                  round
                />
                <Box
                  at={[x + 0.04, 0.43, 0.267]}
                  size={[0.14, 0.2, 0.015]}
                  color="#b6e4df"
                  round
                />
              </group>
            ))}
            <Box
              at={[0, 0.16, 0.26]}
              size={[0.36, 0.025, 0.015]}
              color="#b6e4df"
              round
            />
            <Cyl
              at={[0, 0.94, 0.205]}
              size={[0.055, 0.06, 0.055]}
              rotation={[Math.PI / 2, 0, 0]}
              color={alloy}
            />
            <Cyl
              at={[0, 0.94, 0.24]}
              size={[0.034, 0.02, 0.034]}
              rotation={[Math.PI / 2, 0, 0]}
              color="#142732"
            />
            {[-0.87, 0.87].flatMap((x) =>
              [-0.09, 0.83].map((y) => (
                <Cyl
                  key={`${x}${y}`}
                  at={[x, y, 0.24]}
                  size={[0.018, 0.015, 0.018]}
                  rotation={[Math.PI / 2, 0, 0]}
                  color={alloy}
                />
              )),
            )}
            {Array.from({ length: 10 }, (_, i) => (
              <Box
                key={i}
                at={[-0.64 + i * 0.14, 0.35, -0.19]}
                size={[0.055, 0.45, 0.025]}
                color="#252a29"
                round
              />
            ))}
          </Bake>
        </group>
      </group>
      <Label at={[0, -0.06, 1.03]} size={0.16}>
        Parviz / CAD prototype
      </Label>
      <Label at={[0, -0.28, 1.03]} size={0.12}>
        {exploded
          ? "Click robot to reassemble"
          : "Click robot for exploded view"}
      </Label>
    </group>
  );
}

function Gear({
  radius = 0.4,
  teeth = 16,
  color = amber,
}: {
  radius?: number;
  teeth?: number;
  color?: string;
}) {
  const geo = useMemo(() => {
    const shape = new Shape();
    for (let i = 0; i <= teeth * 4; i++) {
      const a = (i * Math.PI * 2) / (teeth * 4),
        r = radius * (i % 4 === 0 || i % 4 === 3 ? 0.86 : 1);
      const x = Math.cos(a) * r,
        y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const hole = new Path();
    hole.absarc(0, 0, radius * 0.24, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return new ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      bevelSegments: 2,
    });
  }, [radius, teeth]);
  return <mesh geometry={geo} material={mat(color)} castShadow receiveShadow />;
}
export function MechanicalGallery({ paused, reduced }: Motion) {
  const gears = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (paused || reduced || !gears.current) return;
    time.current += Math.min(dt, 0.05);
    gears.current.children[0].rotation.z = time.current * 0.3;
    gears.current.children[1].rotation.z = -time.current * 0.6 + Math.PI / 12;
  });
  return (
    <group position={[-34, 5.5, -19]}>
      <Bake>
        <Box size={[2.6, 2.2, 0.18]} color={graphite} round />
        <Box at={[0, 0, 0.1]} size={[2.35, 1.95, 0.05]} color="#66817d" round />
        <Beam from={[-1, -1.1, 0]} to={[-1, -2.45, 0]} r={0.06} />
        <Beam from={[1, -1.1, 0]} to={[1, -2.45, 0]} r={0.06} />
      </Bake>
      <group ref={gears}>
        <group position={[-0.35, 0, 0.18]}>
          <Gear radius={0.65} teeth={24} />
        </group>
        <group position={[0.57, 0, 0.18]}>
          <Gear radius={0.325} teeth={12} color={alloy} />
        </group>
      </group>
      <Label at={[0, 0.81, 0.16]} size={0.16} color="#e4e9e3">
        Mechlib / Parametric parts
      </Label>
      <Label at={[0, -0.85, 0.16]} size={0.12} color="#e4e9e3">
        Illustrative 2:1 gear pair
      </Label>
    </group>
  );
}

export function AgentRoutingExhibit({ paused, reduced }: Motion) {
  const pulse = useRef<Group>(null),
    time = useRef(0);
  const points = [
    [-3, 0.55, 0.5],
    [-1, 0.55, 0.5],
    [-1, 0.55, -0.4],
    [1, 0.55, -0.4],
    [1, 0.55, 0.5],
    [3, 0.55, 0.5],
  ];
  useFrame((_, dt) => {
    if (paused || reduced || !pulse.current) return;
    time.current += Math.min(dt, 0.05) * 0.65;
    const segment = Math.floor(time.current) % points.length;
    const a = points[segment],
      b = points[(segment + 1) % points.length],
      t = time.current % 1;
    pulse.current.position.set(
      a[0] + (b[0] - a[0]) * t,
      a[1],
      a[2] + (b[2] - a[2]) * t,
    );
  });
  return (
    <group position={[21, 7.4, -29]}>
      <Bake>
        <Box size={[8, 0.2, 2.4]} color={graphite} round />
        <Box at={[0, 0.13, 0]} size={[7.8, 0.05, 2.2]} color="#75908a" round />
        {[-3, -1, 1, 3].map((x, i) => (
          <group key={x}>
            <Box
              at={[x, 0.31, 0]}
              size={[1.35, 0.29, 1.35]}
              color={i === 2 ? amber : alloy}
              round
            />
            <Box
              at={[x, 0.65, -0.35]}
              size={[1.04, 0.5, 0.1]}
              color={graphite}
              round
            />
            <Box
              at={[x, 0.65, -0.285]}
              size={[0.87, 0.33, 0.025]}
              color="#142732"
              round
            />
            {[0, 1, 2].map((j) => (
              <Box
                key={j}
                at={[x - 0.26 + j * 0.25, 0.57, -0.265]}
                size={[0.13, 0.08 + j * 0.065, 0.012]}
                color={i === 1 ? "#b6e4df" : "#86a888"}
              />
            ))}
            <Cyl
              at={[x, 0.5, 0.4]}
              size={[0.12, 0.08, 0.12]}
              color={graphite}
            />
          </group>
        ))}
        {points.map((a, i) => {
          const b = points[(i + 1) % points.length];
          return (
            <Beam
              key={i}
              from={[a[0], 0.46, a[2]]}
              to={[b[0], 0.46, b[2]]}
              r={0.022}
              color="#b6e4df"
            />
          );
        })}
      </Bake>
      <group ref={pulse} position={[-3, 0.55, 0.5]}>
        <Box size={[0.24, 0.14, 0.18]} color={amber} round />
      </group>
      {["Brief", "Quota + fit", "Worktree", "Verify diff"].map((s, i) => (
        <Label key={s} at={[-3 + i * 2, 0.28, 1.22]} size={0.15}>
          {s}
        </Label>
      ))}
      <Label at={[0, -0.18, 1.22]} size={0.14}>
        Smart subagents / Illustrative dispatch cycle
      </Label>
    </group>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Group } from "three";
import { Bake, Beam, Box, Cyl, Orb, Planter, Rail } from "./kit";
import type { V3 } from "./kit";
import { palette as p } from "./layout";
import { Label } from "./Settlement";

const angle = Math.atan(3 / 22),
  length = Math.hypot(22, 3);
const decks: { at: V3; size: V3 }[] = [
  { at: [-29, 1.5, -17], size: [14, 3, 22] },
  { at: [-29, 1.5, -33], size: [14, 3, 10] },
  { at: [-15, 1.5, -34], size: [14, 3, 8] },
  { at: [25, 3, -32], size: [22, 6, 12] },
  { at: [31, 1.5, 11], size: [14, 3, 30] },
  { at: [19.5, 1.5, 23], size: [9, 3, 6] },
];
const ramps: { at: V3; size: V3; rotation: V3 }[] = [
  {
    at: [-28, 1.32, 5],
    size: [6, 0.36, length + 0.08],
    rotation: [angle, 0, 0],
  },
  {
    at: [3, 4.32, -34],
    size: [length + 0.08, 0.36, 6],
    rotation: [0, 0, angle],
  },
  {
    at: [27, 4.32, -15],
    size: [6, 0.36, length + 0.08],
    rotation: [angle, 0, 0],
  },
  {
    at: [13, 1.32, 7],
    size: [length + 0.08, 0.36, 6],
    rotation: [0, 0, angle],
  },
];
const rails: [V3, V3][] = [
  [
    [-36, 3, -38],
    [-36, 3, -6],
  ],
  [
    [-36, 3, -6],
    [-31, 3, -6],
  ],
  [
    [-25, 3, -6],
    [-22, 3, -6],
  ],
  [
    [-22, 3, -6],
    [-22, 3, -30],
  ],
  [
    [-36, 3, -38],
    [-8, 3, -38],
  ],
  [
    [-22, 3, -30],
    [-8, 3, -30],
  ],
  [
    [-8, 3, -38],
    [-8, 3, -37],
  ],
  [
    [-8, 3, -31],
    [-8, 3, -30],
  ],
  [
    [-31, 3, -6],
    [-31, 0, 16],
  ],
  [
    [-25, 3, -6],
    [-25, 0, 16],
  ],
  [
    [-8, 3, -37],
    [14, 6, -37],
  ],
  [
    [-8, 3, -31],
    [14, 6, -31],
  ],
  [
    [14, 6, -38],
    [36, 6, -38],
  ],
  [
    [14, 6, -38],
    [14, 6, -37],
  ],
  [
    [14, 6, -31],
    [14, 6, -26],
  ],
  [
    [14, 6, -26],
    [24, 6, -26],
  ],
  [
    [30, 6, -26],
    [36, 6, -26],
  ],
  [
    [36, 6, -38],
    [36, 6, -26],
  ],
  [
    [24, 6, -26],
    [24, 3, -4],
  ],
  [
    [30, 6, -26],
    [30, 3, -4],
  ],
  [
    [30, 3, -4],
    [38, 3, -4],
  ],
  [
    [38, 3, -4],
    [38, 3, 26],
  ],
  [
    [15, 3, 26],
    [38, 3, 26],
  ],
  [
    [15, 3, 20],
    [24, 3, 20],
  ],
  [
    [24, 3, -4],
    [24, 3, 4],
  ],
  [
    [24, 3, 10],
    [24, 3, 20],
  ],
  [
    [2, 0, 4],
    [24, 3, 4],
  ],
  [
    [2, 0, 10],
    [24, 3, 10],
  ],
];
function RailCollider({ a, b }: { a: V3; b: V3 }) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    dz = b[2] - a[2];
  // Every authored route edge is axis-aligned in plan, including the sloped ones.
  return (
    <CuboidCollider
      position={[
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2 + 0.55,
        (a[2] + b[2]) / 2,
      ]}
      args={
        dx
          ? [Math.hypot(dx, dy) / 2, 0.6, 0.09]
          : [0.09, 0.6, Math.hypot(dz, dy) / 2]
      }
      rotation={
        dx ? [0, 0, Math.atan(dy / dx)] : [-Math.atan(dy / (dz || 1)), 0, 0]
      }
    />
  );
}
function Mechanism({ paused, reduced }: { paused: boolean; reduced: boolean }) {
  const arm = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (paused || reduced || !arm.current) return;
    time.current += Math.min(dt, 0.1);
    arm.current.rotation.z = Math.sin(time.current * 0.6) * 0.25;
  });
  return (
    <group position={[-32, 4.35, -13]}>
      <Bake>
        <Box
          at={[0, -0.04, 0]}
          size={[1.2, 0.14, 1.05]}
          color={p.slate}
          round
        />
        <Cyl size={[0.43, 0.18, 0.43]} color={p.green} />
        <Cyl at={[0, 0.12, 0]} size={[0.34, 0.08, 0.34]} color="#8d9e9c" />
        {Array.from({ length: 6 }, (_, i) => (
          <Cyl
            key={i}
            at={[
              Math.cos((i * Math.PI) / 3) * 0.35,
              0.14,
              Math.sin((i * Math.PI) / 3) * 0.35,
            ]}
            size={[0.035, 0.035, 0.035]}
            color={p.slate}
          />
        ))}
      </Bake>
      <group ref={arm}>
        <Bake>
          <Cyl at={[0, 0.27, 0]} size={[0.23, 0.32, 0.23]} color={p.orange} />
          <Box
            at={[0.28, 0.76, 0]}
            size={[0.28, 1.03, 0.25]}
            rotation={[0, 0, -0.53]}
            color={p.chalk}
            round
          />
          <Beam
            from={[-0.1, 0.39, 0.18]}
            to={[0.47, 1.33, 0.18]}
            r={0.052}
            color={p.slate}
          />
          <Cyl
            at={[0.6, 1.35, 0]}
            size={[0.22, 0.4, 0.22]}
            rotation={[Math.PI / 2, 0, 0]}
            color={p.slate}
          />
          <Cyl
            at={[0.6, 1.35, 0.22]}
            size={[0.13, 0.06, 0.13]}
            rotation={[Math.PI / 2, 0, 0]}
            color={p.orange}
          />
          <Box
            at={[0.97, 1.28, 0]}
            size={[0.76, 0.2, 0.24]}
            rotation={[0, 0, -0.2]}
            color={p.green}
            round
          />
          <Beam
            from={[0.64, 1.47, 0.17]}
            to={[1.33, 1.33, 0.17]}
            r={0.025}
            color="#8d9e9c"
          />
          <Cyl
            at={[1.36, 1.2, 0]}
            size={[0.13, 0.2, 0.13]}
            rotation={[0, 0, Math.PI / 2]}
            color="#8d9e9c"
          />
          <Box
            at={[1.46, 1.14, 0]}
            size={[0.24, 0.2, 0.32]}
            color={p.slate}
            round
          />
          {[-0.16, 0.16].map((z) => (
            <group key={z}>
              <Box
                at={[1.52, 0.91, z]}
                size={[0.1, 0.35, 0.08]}
                color={p.orange}
                round
              />
              <Box
                at={[1.47, 0.74, z]}
                size={[0.18, 0.06, 0.09]}
                color="#8d9e9c"
              />
            </group>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <Cyl
              key={i}
              at={[
                0.6 + Math.cos((i * Math.PI * 2) / 5) * 0.17,
                1.35 + Math.sin((i * Math.PI * 2) / 5) * 0.17,
                0.23,
              ]}
              size={[0.022, 0.025, 0.022]}
              rotation={[Math.PI / 2, 0, 0]}
              color={p.metal}
            />
          ))}
          <Beam
            from={[0.1, 0.28, -0.19]}
            to={[-0.1, 0.65, -0.19]}
            r={0.022}
            color={p.orange}
          />
          <Beam
            from={[-0.1, 0.65, -0.19]}
            to={[0.5, 1.55, -0.19]}
            r={0.022}
            color={p.orange}
          />
          <Beam
            from={[0.5, 1.55, -0.19]}
            to={[1.35, 1.4, -0.19]}
            r={0.022}
            color={p.orange}
          />
        </Bake>
      </group>
    </group>
  );
}
function RoutingModel({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  const token = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (paused || reduced || !token.current) return;
    time.current += Math.min(dt, 0.1);
    const t = (time.current * 0.16) % 4;
    token.current.position.set(
      t < 2 ? -3 + t * 3 : 3 - (t - 2) * 3,
      0.7,
      t < 2 ? -0.55 : 0.55,
    );
  });
  return (
    <group position={[21, 7.4, -29]}>
      <Bake>
        <Box size={[8, 0.18, 2.4]} color={p.slate} round />
        {[-3, 0, 3].map((x, i) => (
          <group key={x} position={[x, 0, 0]}>
            <Box
              at={[0, 0.27, 0]}
              size={[1.4, 0.45, 1.2]}
              color={[p.metal, p.green, p.orange][i]}
              round
            />
            <Cyl at={[0, 0.6, 0]} size={[0.22, 0.22, 0.22]} color={p.chalk} />
          </group>
        ))}
        <Beam
          from={[-3, 0.3, -0.55]}
          to={[3, 0.3, -0.55]}
          r={0.035}
          color={p.chalk}
        />
        <Beam
          from={[-3, 0.3, 0.55]}
          to={[3, 0.3, 0.55]}
          r={0.035}
          color={p.chalk}
        />
        {[-3, 0, 3].map((x, i) => (
          <group key={`hardware${x}`} position={[x, 0, 0]}>
            <Box
              at={[0, 0.52, 0]}
              size={[1.08, 0.05, 0.65]}
              color="#8d9e9c"
              round
            />
            {i === 0 ? (
              [-0.22, 0, 0.22].map((dx) => (
                <Box
                  key={dx}
                  at={[dx, 0.73, 0]}
                  size={[0.14, 0.35, 0.24]}
                  rotation={[0, 0, -0.18]}
                  color={p.chalk}
                  round
                />
              ))
            ) : i === 1 ? (
              Array.from({ length: 7 }, (_, j) => (
                <Box
                  key={j}
                  at={[-0.42 + j * 0.14, 0.71, 0]}
                  size={[0.055, 0.32, 0.53]}
                  color={p.slate}
                />
              ))
            ) : (
              <>
                <Box
                  at={[0, 0.64, 0]}
                  size={[0.7, 0.16, 0.45]}
                  color={p.chalk}
                  round
                />
                <Box
                  at={[0, 0.73, 0]}
                  size={[0.42, 0.025, 0.3]}
                  color={p.green}
                />
              </>
            )}
            <Box
              at={[0, 0.29, 0.62]}
              size={[0.7, 0.09, 0.035]}
              color="#b6e4df"
            />
          </group>
        ))}
      </Bake>
      <group ref={token} position={[-3, 0.7, -0.55]}>
        <Orb at={[0, 0, 0]} size={[0.15, 0.15, 0.15]} color={p.blue} />
      </group>
    </group>
  );
}
export function Expansion({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        {decks.map((d, i) => (
          <CuboidCollider
            key={`deck${i}`}
            position={d.at}
            args={d.size.map((v) => v / 2) as V3}
          />
        ))}
        {ramps.map((r, i) => (
          <CuboidCollider
            key={`ramp${i}`}
            position={r.at}
            rotation={r.rotation}
            args={r.size.map((v) => v / 2) as V3}
          />
        ))}
        {rails.map(([a, b], i) => (
          <RailCollider key={`rail${i}`} a={a} b={b} />
        ))}
        <CuboidCollider position={[-32, 3.65, -13]} args={[2, 0.65, 1]} />
        <CuboidCollider position={[21, 6.7, -29]} args={[4, 0.7, 1.2]} />
        <CuboidCollider position={[35, 3.6, 18]} args={[2, 0.6, 0.7]} />
        {[-36, 36].map((x) => (
          <CuboidCollider
            key={x}
            position={[x, 6, -37.5]}
            args={[0.13, 6, 0.13]}
          />
        ))}
      </RigidBody>
      <Bake>
        {decks.map((d, i) => (
          <group key={i}>
            <Box at={d.at} size={d.size} color="#99a7a4" round />
            <Box
              at={[d.at[0], d.at[1] + d.size[1] / 2, d.at[2]]}
              size={[d.size[0], 0.08, d.size[2]]}
              color="#c4cbc3"
            />
          </group>
        ))}
        {ramps.map((r, i) => (
          <group key={i}>
            <Box
              at={r.at}
              size={r.size}
              rotation={r.rotation}
              color="#bec7bf"
            />
            <Box
              at={[r.at[0], r.at[1] + 0.2, r.at[2]]}
              size={
                r.size[0] > 10
                  ? [length - 0.3, 0.012, 0.06]
                  : [0.06, 0.012, length - 0.3]
              }
              rotation={r.rotation}
              color={p.chalk}
            />
          </group>
        ))}
        {rails.map(([a, b], i) => (
          <Rail key={i} a={a} b={b} />
        ))}
        {/* Open repair bay: a high sawtooth canopy and a tool wall behind the bench. */}
        {[-36, -22].map((x) => (
          <group key={x}>
            <Box at={[x, 6.3, -26]} size={[0.18, 6.6, 0.18]} color={p.slate} />
            <Box at={[x, 6.3, -10]} size={[0.18, 6.6, 0.18]} color={p.slate} />
          </group>
        ))}
        {[-22, -18].map((z) => (
          <group key={z}>
            <Box
              at={[-29, 9.55, z]}
              size={[14.5, 0.18, 3.7]}
              color={p.metal}
              rotation={[0.12, 0, 0]}
            />
            <Beam
              from={[-36, 9.5, z + 1.8]}
              to={[-22, 9.5, z + 1.8]}
              r={0.09}
            />
          </group>
        ))}
        <Box at={[-32, 4.2, -13]} size={[4, 0.18, 2]} color="#9b8e6c" round />
        {[-33.5, -30.5].map((x) => (
          <Box
            key={x}
            at={[x, 3.6, -13]}
            size={[0.16, 1.2, 1.7]}
            color={p.slate}
          />
        ))}
        <Box
          at={[-35, 4.1, -17]}
          size={[1.3, 2.2, 0.9]}
          color={p.green}
          round
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            at={[-35, 3.3 + i * 0.4, -16.52]}
            size={[0.7, 0.05, 0.06]}
            color={p.metal}
          />
        ))}
        <Cyl
          at={[-33.5, 4.5, -12.7]}
          size={[0.13, 0.35, 0.13]}
          color={p.chalk}
        />
        <Box at={[-31, 4.35, -12.4]} size={[0.6, 0.08, 0.4]} color={p.orange} />
        <Planter at={[-34, 3, -8]} long={2} />
        {/* Upper computing pavilion: open sides, branch rack and a slender communications mast. */}
        {[15, 35].map((x) => (
          <Box
            key={x}
            at={[x, 9, -37.5]}
            size={[0.18, 6, 0.18]}
            color={p.slate}
          />
        ))}
        <Box at={[25, 12, -36.5]} size={[21, 0.2, 3]} color={p.slate} round />
        <Box at={[25, 12.15, -36.5]} size={[20, 0.1, 2.5]} color={p.green} />
        <Cyl at={[34, 14, -36]} size={[0.09, 6, 0.09]} />
        <Beam from={[32.5, 16, -36]} to={[35.5, 16, -36]} r={0.06} />
        {[18, 24].map((x) => (
          <Box
            key={x}
            at={[x, 6.65, -29]}
            size={[0.15, 1.3, 2]}
            color={p.slate}
          />
        ))}
        <Box at={[33, 7.2, -33]} size={[2.6, 2.4, 1]} color={p.metal} round />
        {[-0.7, 0, 0.7].map((x) => (
          <group key={x}>
            <Box
              at={[33 + x, 7.5, -32.4]}
              size={[0.5, 1.4, 0.35]}
              color={p.green}
              round
            />
            <Box
              at={[33 + x, 7.5, -32.2]}
              size={[0.32, 0.05, 0.02]}
              color={p.chalk}
            />
          </group>
        ))}
        {/* Contact garden: pergola, planted edges, quiet bench and a jacket. */}
        {[25, 37].map((x) =>
          [0, 16].map((z) => (
            <group key={`${x}${z}`}>
              <Box at={[x, 5.6, z]} size={[0.16, 5.2, 0.16]} color={p.slate} />
              <Box
                at={[x, 3.15, z]}
                size={[0.55, 0.16, 0.55]}
                color={p.slate}
                round
              />
              <Box
                at={[x, 3.38, z]}
                size={[0.27, 0.45, 0.27]}
                color="#8d9e9c"
                round
              />
              <Box
                at={[x, 8.08, z]}
                size={[0.44, 0.3, 0.44]}
                color="#8d9e9c"
                round
              />
              {[-0.18, 0.18].flatMap((dx) =>
                [-0.18, 0.18].map((dz) => (
                  <Cyl
                    key={`${dx}${dz}`}
                    at={[x + dx, 3.25, z + dz]}
                    size={[0.035, 0.07, 0.035]}
                    color={p.metal}
                  />
                )),
              )}
              <Beam
                from={[x, 7.2, z]}
                to={[x + (x === 25 ? 1 : -1), 8.06, z]}
                r={0.06}
                color="#7e9390"
              />
              <Beam
                from={[x, 7.2, z]}
                to={[x, 8.06, z + (z === 0 ? 1.1 : -1.1)]}
                r={0.06}
                color="#7e9390"
              />
            </group>
          )),
        )}
        {Array.from({ length: 7 }, (_, i) => (
          <Box
            key={i}
            at={[25 + i * 2, 8.3, 8]}
            size={[0.12, 0.15, 17]}
            color={p.metal}
          />
        ))}
        {[0, 16].map((z) => (
          <Box
            key={z}
            at={[31, 8.15, z]}
            size={[12.5, 0.34, 0.18]}
            color={p.slate}
          />
        ))}
        {[4, 8, 12].map((z) => (
          <Box
            key={`cross-member-${z}`}
            at={[31, 8.08, z]}
            size={[12.2, 0.26, 0.13]}
            color={p.slate}
          />
        ))}
        {[25, 37].map((x) => (
          <Box
            key={`longitudinal-${x}`}
            at={[x, 8.12, 8]}
            size={[0.2, 0.28, 16.4]}
            color={p.slate}
          />
        ))}
        <Beam
          from={[25, 8.28, 0]}
          to={[37, 8.28, 16]}
          r={0.013}
          color="#8d9e9c"
        />
        <Beam
          from={[37, 8.28, 0]}
          to={[25, 8.28, 16]}
          r={0.013}
          color="#8d9e9c"
        />
        <Planter at={[34, 3, -2]} long={5} />
        <Planter at={[31, 3, 24.5]} long={9} />
        <Planter at={[36.5, 3, 11]} long={2} />
        <Box at={[35, 3.65, 18]} size={[4, 0.22, 1.3]} color="#9b8e6c" round />
        <Box at={[35, 4.2, 17.5]} size={[4, 1, 0.12]} color={p.green} round />
        {[33.5, 36.5].map((x) => (
          <Box
            key={x}
            at={[x, 3.3, 18]}
            size={[0.12, 0.6, 1]}
            color={p.slate}
          />
        ))}
        <Box
          at={[35.7, 4.3, 17.6]}
          size={[0.75, 0.9, 0.17]}
          color="#6f8676"
          round
        />
        <Box at={[32, 3.4, 18]} size={[0.7, 0.8, 0.7]} color={p.slate} round />
        <Cyl at={[32, 3.95, 18]} size={[0.12, 0.3, 0.12]} color={p.chalk} />
        <Planter at={[5, 0, -2]} long={4} />
      </Bake>
      <Mechanism paused={paused} reduced={reduced} />
      <RoutingModel paused={paused} reduced={reduced} />
      <Label at={[-29, 8.8, -19.9]} size={0.42}>
        Robotics / Workshop
      </Label>
      <Label at={[25, 11.5, -34.9]} size={0.44}>
        Agent lab / Experiments
      </Label>
      <Label at={[31, 7.6, 16.12]} size={0.38}>
        Career / Contact garden
      </Label>
      <Label at={[-28, 0.04, 19]} rotation={[-Math.PI / 2, 0, 0]} size={0.3}>
        Workshop ramp
      </Label>
      <Label at={[12, 0.04, 12]} rotation={[-Math.PI / 2, 0, 0]} size={0.3}>
        Garden via courtyard ramp
      </Label>
      <Label at={[-32, 3.04, -10]} rotation={[-Math.PI / 2, 0, 0]} size={0.2}>
        Illustrative mechanism
      </Label>
      <Label at={[21, 7.42, -27.78]} size={0.2}>
        Request / Worker / Review
      </Label>
    </>
  );
}

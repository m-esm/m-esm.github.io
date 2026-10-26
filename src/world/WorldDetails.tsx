import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, LatheGeometry, TorusGeometry, Vector2 } from "three";
import { Bake, Beam, Box, Cyl, Leaf, Plant, Orb, mat } from "./kit";
import type { V3 } from "./kit";
import { palette as p } from "./layout";
import { Label } from "./Settlement";
import { GroundShades } from "./Landscape";

const hoop = new TorusGeometry(1, 0.035, 5, 32);
const dish = new LatheGeometry(
  [
    new Vector2(0, 0),
    new Vector2(0.35, 0.025),
    new Vector2(0.85, 0.15),
    new Vector2(1.35, 0.42),
    new Vector2(1.8, 0.8),
  ],
  32,
);
function Paving({
  at,
  size,
  tile = 3,
  warm = false,
}: {
  at: V3;
  size: [number, number];
  tile?: number;
  warm?: boolean;
}) {
  const nx = Math.ceil(size[0] / tile),
    nz = Math.ceil(size[1] / tile),
    w = size[0] / nx,
    d = size[1] / nz;
  const colors = warm
    ? ["#c0c7b9", "#c6cbbf", "#bfc7bb"]
    : ["#c1c9c4", "#c8cdc5", "#c0c8c2"];
  return (
    <group position={at}>
      {Array.from({ length: nx * nz }, (_, i) => {
        const x = i % nx,
          z = Math.floor(i / nx),
          color = colors[(x * 7 + z * 11) % 3];
        return (
          <Box
            key={i}
            at={[-size[0] / 2 + (x + 0.5) * w, 0, -size[1] / 2 + (z + 0.5) * d]}
            size={[w - 0.035, 0.014, d - 0.035]}
            color={color}
          />
        );
      })}
    </group>
  );
}
function Flange({ at, rotation = [0, 0, 0] }: { at: V3; rotation?: V3 }) {
  return (
    <group position={at} rotation={rotation}>
      <Cyl size={[0.18, 0.075, 0.18]} color="#80918c" />
      {Array.from({ length: 6 }, (_, i) => (
        <Cyl
          key={i}
          at={[
            Math.cos((i * Math.PI) / 3) * 0.135,
            0.05,
            Math.sin((i * Math.PI) / 3) * 0.135,
          ]}
          size={[0.022, 0.04, 0.022]}
          color={p.metal}
        />
      ))}
    </group>
  );
}
function Panel({
  at,
  size = [1.7, 1.2, 0.15],
  color = p.green,
}: {
  at: V3;
  size?: V3;
  color?: string;
}) {
  return (
    <group position={at}>
      <Box size={size} color={p.slate} round />
      <Box
        at={[0, 0, size[2] / 2 + 0.01]}
        size={[size[0] - 0.1, size[1] - 0.1, 0.035]}
        color={color}
        round
      />
      <Box
        at={[size[0] * 0.31, 0, size[2] / 2 + 0.05]}
        size={[0.045, 0.3, 0.06]}
        color={p.metal}
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => (
          <Cyl
            key={`${x}${y}`}
            at={[
              x * (size[0] / 2 - 0.12),
              y * (size[1] / 2 - 0.12),
              size[2] / 2 + 0.04,
            ]}
            size={[0.025, 0.025, 0.025]}
            rotation={[Math.PI / 2, 0, 0]}
            color={p.metal}
          />
        )),
      )}
    </group>
  );
}
function SolarPanel({ at, rotation = [0, 0, 0] }: { at: V3; rotation?: V3 }) {
  return (
    <group position={at} rotation={rotation}>
      <Box size={[2.4, 0.12, 1.55]} color={p.metal} round />
      <Box at={[0, 0.07, 0]} size={[2.27, 0.02, 1.43]} color="#355a68" />
      {[-0.72, 0, 0.72].map((x) => (
        <Box
          key={x}
          at={[x, 0.086, 0]}
          size={[0.014, 0.006, 1.39]}
          color="#8ba5ab"
        />
      ))}
      {[-0.48, 0, 0.48].map((z) => (
        <Box
          key={z}
          at={[0, 0.086, z]}
          size={[2.2, 0.006, 0.012]}
          color="#8ba5ab"
        />
      ))}
    </group>
  );
}
function VentFan({
  at,
  reduced,
  paused,
}: {
  at: V3;
  reduced: boolean;
  paused: boolean;
}) {
  const rotor = useRef<Group>(null);
  useFrame((_, dt) => {
    if (rotor.current && !reduced && !paused)
      rotor.current.rotation.z += Math.min(dt, 0.05) * 0.8;
  });
  return (
    <group position={at}>
      <Bake>
        <Box size={[1.05, 1.05, 0.18]} color={p.slate} round />
        <Cyl
          size={[0.44, 0.04, 0.44]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#263b3f"
        />
        <mesh
          geometry={hoop}
          material={mat(p.metal)}
          scale={0.44}
          position={[0, 0, 0.12]}
        />
        {[-0.22, 0, 0.22].map((x) => (
          <Box
            key={x}
            at={[x, 0, 0.17]}
            size={[0.025, 0.78, 0.04]}
            color={p.metal}
          />
        ))}
      </Bake>
      <group ref={rotor} position={[0, 0, 0.1]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
            <Leaf
              at={[0, 0.02, 0]}
              size={[0.55, 0.36, 0.6]}
              rotation={[0.35, 0, 0]}
              color="#7f928d"
            />
          </group>
        ))}
      </group>
    </group>
  );
}
function SettlementMap() {
  const nodes: V3[] = [
    [0, 0.25, 0.5],
    [-1, 0.1, 0.2],
    [-1, 0.35, -0.45],
    [0.6, 0.55, -0.45],
    [1.1, 0.25, 0.5],
  ];
  return (
    <group position={[12.4, 3.87, 19]}>
      <Box size={[3.5, 0.16, 1.8]} color={p.slate} round />
      <Box at={[0, 0.09, 0]} size={[3.25, 0.04, 1.57]} color="#a3b6ad" />
      {nodes.map((v, i) => (
        <group key={i}>
          <Beam
            from={v}
            to={nodes[(i + 1) % nodes.length]}
            r={0.028}
            color={p.orange}
          />
          <Box
            at={v}
            size={i === 0 ? [0.42, 0.25, 0.33] : [0.55, 0.15 + v[1] / 3, 0.38]}
            color={i === 3 ? p.blue : i === 4 ? p.green : p.chalk}
            round
          />
          <Box
            at={[v[0], v[1] + 0.14, v[2]]}
            size={[0.32, 0.035, 0.2]}
            color={p.slate}
          />
        </group>
      ))}
      <Box
        at={[0, -0.12, 0.91]}
        size={[2.4, 0.28, 0.07]}
        color={p.chalk}
        round
      />
      <Label at={[0, -0.12, 0.956]} size={0.12}>
        Settlement model
      </Label>
    </group>
  );
}
export function WorldDetails({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  return (
    <>
      <Bake castShadow={false}>
        <Paving at={[0, 0.035, -5.5]} size={[76, 69]} tile={4} />
        <Paving at={[0, 3.05, 20]} size={[29.7, 11.7]} />
        <Paving at={[-29, 3.055, -17]} size={[13.75, 21.75]} />
        <Paving at={[-29, 3.055, -33]} size={[13.75, 9.8]} />
        <Paving at={[-15, 3.055, -34]} size={[13.8, 7.8]} />
        <Paving at={[25, 6.055, -32]} size={[21.8, 11.8]} />
        <Paving at={[31, 3.055, 11]} size={[13.8, 29.8]} warm />
        <Paving at={[19.5, 3.055, 23]} size={[8.9, 5.8]} warm />
        {[-12, -8, 2, 6, 10].map((x) => (
          <Box
            key={x}
            at={[x, 3.066, 14.3]}
            size={[0.7, 0.012, 0.06]}
            color={p.orange}
          />
        ))}
        {[-31, -25].map((x) => (
          <Box
            key={x}
            at={[x, 3.075, -6.5]}
            size={[0.08, 0.012, 1.6]}
            color={p.orange}
          />
        ))}
        {[-1, 1].map((s) => (
          <Box
            key={s}
            at={[-10 + s * 1.35, 3.066, 21]}
            size={[0.05, 0.016, 3]}
            color={p.chalk}
          />
        ))}
        <Box
          at={[-10, 3.066, 22.5]}
          size={[2.75, 0.016, 0.06]}
          color={p.chalk}
        />
        {Array.from({ length: 14 }, (_, i) => (
          <Box
            key={i}
            at={[-19, 0.067, -23 + i * 0.82]}
            size={[0.32, 0.015, 0.025]}
            color="#263b3f"
          />
        ))}
      </Bake>
      <GroundShades />
      <Bake>
        {[-11, 0, 11].map((x) => (
          <group key={x}>
            <Box
              at={[x, 1.4, 13.88]}
              size={[0.14, 2.7, 0.14]}
              color="#8d9f99"
            />
            {[-0.7, 0, 0.7].map((y) => (
              <Box
                key={y}
                at={[x + 0.07, 1.5 + y, 13.84]}
                size={[0.3, 0.08, 0.07]}
                color={p.slate}
              />
            ))}
          </group>
        ))}
        <Panel at={[5.5, 1.6, 13.85]} color="#b3bfae" />
        <Panel at={[10, 1.6, 13.85]} size={[2.4, 1.2, 0.15]} color={p.metal} />
        <Beam
          from={[-14, 2.6, 13.8]}
          to={[-8.4, 2.6, 13.8]}
          r={0.055}
          color={p.orange}
        />
        <Beam
          from={[-1.5, 2.6, 13.8]}
          to={[14, 2.6, 13.8]}
          r={0.055}
          color={p.orange}
        />
        <Beam
          from={[-21.8, 1.1, -27]}
          to={[-21.8, 1.1, -6.5]}
          r={0.12}
          color={p.orange}
        />
        {[-24, -20, -16, -12, -8].map((z) => (
          <group key={z}>
            <Box
              at={[-21.9, 1.5, z]}
              size={[0.16, 2.8, 0.15]}
              color="#879b94"
            />
            <Flange at={[-21.8, 1.1, z]} rotation={[Math.PI / 2, 0, 0]} />
          </group>
        ))}
        <Box
          at={[18.8, 4.45, -25.87]}
          size={[8.9, 0.14, 0.15]}
          color={p.slate}
        />
        {Array.from({ length: 5 }, (_, i) => (
          <Beam
            key={i}
            from={[14.5 + i * 1.8, 3, -25.84]}
            to={[15.3 + i * 1.8, 5.8, -25.84]}
            r={0.065}
            color="#8d9f99"
          />
        ))}
        {[-1, 1].map((s) => (
          <group key={s}>
            <Beam
              from={[-12, 5.55, -5 + s * 1.13]}
              to={[2, 5.55, -5 + s * 1.13]}
              r={0.09}
            />
            {Array.from({ length: 7 }, (_, i) => (
              <Beam
                key={i}
                from={[-12 + i * 2, 5.55, -5 + s * 1.13]}
                to={[-11 + i * 2, 6.17, -5 + s * 1.13]}
                r={0.045}
                color="#81948f"
              />
            ))}
          </group>
        ))}
        <Beam
          from={[-12, 5.42, -5.25]}
          to={[2, 5.42, -5.25]}
          r={0.09}
          color={p.orange}
        />
        <Beam
          from={[-12, 5.42, -4.9]}
          to={[2, 5.42, -4.9]}
          r={0.055}
          color="#9eafa9"
        />
        {[-12, 2].map((x) => (
          <group key={x}>
            <Box
              at={[x, 0.09, -5]}
              size={[0.85, 0.15, 0.85]}
              color={p.slate}
              round
            />
            {[-0.28, 0.28].flatMap((a) =>
              [-0.28, 0.28].map((b) => (
                <Cyl
                  key={`${a}${b}`}
                  at={[x + a, 0.2, -5 + b]}
                  size={[0.055, 0.06, 0.055]}
                  color={p.metal}
                />
              )),
            )}
          </group>
        ))}
        {[-18.9, 3.9].map((x) => (
          <group key={x}>
            <Beam from={[x, 6, -23]} to={[x, 7.7, -20]} r={0.07} />
            <Box at={[x, 7.5, -20]} size={[0.35, 0.4, 0.2]} color={p.slate} />
            <Box
              at={[x, 7.43, -19.88]}
              size={[0.25, 0.08, 0.045]}
              color="#b6e4df"
            />
          </group>
        ))}
        <Beam
          from={[-18.8, 6.7, -23]}
          to={[3.8, 6.7, -23]}
          r={0.08}
          color={p.orange}
        />
        {[-17, -11, -5, 1].map((x) => (
          <group key={x}>
            <Flange at={[x, 6.7, -23]} rotation={[0, 0, Math.PI / 2]} />
            <Box at={[x, 6.9, -23]} size={[0.05, 0.4, 0.05]} color={p.slate} />
          </group>
        ))}
        <Box
          at={[-10, 3.15, 20.4]}
          size={[2.5, 0.2, 0.35]}
          color={p.slate}
          round
        />
        <Box
          at={[-10, 3.52, 20.5]}
          size={[1.1, 0.65, 0.25]}
          color={p.metal}
          round
        />
        <Box at={[-10, 3.72, 20.65]} size={[0.6, 0.12, 0.04]} color="#b6e4df" />
        <Box
          at={[-10, 3.38, 20.68]}
          size={[0.4, 0.15, 0.025]}
          color={p.green}
        />
        {[-11.9, -7.9].map((x) => (
          <Box
            key={x}
            at={[x, 5.1, 25.5]}
            size={[0.16, 4.2, 0.16]}
            color={p.slate}
          />
        ))}
        <Box
          at={[-9.9, 7.2, 24.2]}
          size={[5.2, 0.15, 3.1]}
          rotation={[-0.08, 0, 0]}
          color={p.metal}
          round
        />
        <SolarPanel at={[-9.9, 7.35, 24.2]} rotation={[-0.08, 0, 0]} />
        <Box
          at={[-13.4, 3.32, 20.7]}
          size={[0.85, 0.6, 1.2]}
          color={p.green}
          round
        />
        <Box at={[-13.4, 3.66, 20.7]} size={[0.7, 0.08, 1]} color={p.metal} />
        <Beam from={[-13.7, 3.76, 20.5]} to={[-13.1, 3.76, 20.5]} r={0.025} />
        {[-0.25, 0.25].flatMap((x) =>
          [-0.4, 0.4].map((z) => (
            <Cyl
              key={`${x}${z}`}
              at={[-13.4 + x, 3.12, 20.7 + z]}
              size={[0.1, 0.07, 0.1]}
              rotation={[0, 0, Math.PI / 2]}
              color="#29383c"
            />
          )),
        )}
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i}>
            <Box
              at={[-35.38, 3.26 + i * 0.22, -17]}
              size={[0.035, 0.05, 0.7]}
              color={p.metal}
            />
            <Box
              at={[-33.5 + i * 0.37, 4.32, -13.8]}
              size={[0.12, 0.06, 0.28]}
              color={i % 2 ? p.metal : p.orange}
            />
          </group>
        ))}
        <Box
          at={[-30.4, 4.45, -13.5]}
          size={[0.55, 0.35, 0.42]}
          color={p.slate}
          round
        />
        <Box
          at={[-30.4, 4.7, -13.5]}
          size={[0.65, 0.09, 0.35]}
          color={p.metal}
        />
        <Beam
          from={[-30.4, 4.5, -13.5]}
          to={[-30.4, 4.5, -12.9]}
          r={0.035}
          color={p.metal}
        />
        <Cyl
          at={[-30.4, 4.5, -12.85]}
          size={[0.07, 0.03, 0.07]}
          rotation={[Math.PI / 2, 0, 0]}
          color={p.orange}
        />
        <Box
          at={[-35.1, 3.32, -11]}
          size={[1.1, 0.6, 1.4]}
          color={p.orange}
          round
        />
        <Box at={[-35.1, 3.66, -11]} size={[0.9, 0.1, 1.2]} color="#a0b1a6" />
        <Box
          at={[-35.1, 3.86, -11]}
          size={[0.55, 0.3, 0.7]}
          color={p.slate}
          round
        />
        <Cyl
          at={[-34.8, 3.85, -9.7]}
          size={[0.43, 0.28, 0.43]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#29383c"
        />
        <Cyl
          at={[-34.8, 3.85, -9.52]}
          size={[0.22, 0.08, 0.22]}
          rotation={[Math.PI / 2, 0, 0]}
          color={p.metal}
        />
        <Box at={[-35.7, 6.5, -20]} size={[0.18, 3, 0.18]} color={p.slate} />
        <Beam from={[-35.7, 8, -20]} to={[-33.7, 8, -20]} r={0.07} />
        <Cyl at={[-33.7, 7.8, -20]} size={[0.3, 0.2, 0.3]} color={p.green} />
        <Cyl
          at={[-33.7, 7.68, -20]}
          size={[0.24, 0.025, 0.24]}
          color="#b6e4df"
        />
        <Panel
          at={[33, 7.2, -32.38]}
          size={[2.35, 2.15, 0.09]}
          color="#8da493"
        />
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <Box
              at={[32.3 + i * 0.7, 7.8, -32.3]}
              size={[0.5, 0.09, 0.05]}
              color="#b6e4df"
            />
            {Array.from({ length: 7 }, (_, j) => (
              <Box
                key={j}
                at={[32.3 + i * 0.7, 6.4 + j * 0.13, -32.26]}
                size={[0.4, 0.025, 0.03]}
                color={p.slate}
              />
            ))}
          </group>
        ))}
        <Beam
          from={[33, 6.2, -33]}
          to={[33, 6.2, -36]}
          r={0.055}
          color={p.orange}
        />
        <Beam
          from={[33, 6.2, -36]}
          to={[34, 6.2, -36]}
          r={0.055}
          color={p.orange}
        />
        <Beam
          from={[34, 6.2, -36]}
          to={[34, 13, -36]}
          r={0.045}
          color={p.orange}
        />
        {Array.from({ length: 6 }, (_, i) => (
          <Box
            key={i}
            at={[35, 3.8, 17.5 + i * 0.18]}
            size={[3.8, 0.09, 0.12]}
            color={i % 2 ? "#a69a73" : "#938866"}
          />
        ))}
        <Box
          at={[35, 3.87, 18]}
          size={[0.6, 0.04, 0.8]}
          rotation={[0, 0.12, 0]}
          color={p.green}
        />
        <Box
          at={[35, 3.9, 18]}
          size={[0.54, 0.018, 0.74]}
          rotation={[0, 0.12, 0]}
          color="#dedfc5"
        />
        {Array.from({ length: 64 }, (_, i) => (
          <Box
            key={i}
            at={[
              31.79 + (i % 8) * 0.055,
              3.824,
              17.79 + Math.floor(i / 8) * 0.055,
            ]}
            size={[0.054, 0.009, 0.054]}
            color={(Math.floor(i / 8) + (i % 8)) % 2 ? p.slate : p.chalk}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <group
            key={i}
            position={[
              31.82 + (i % 6) * 0.055,
              3.86,
              17.82 + (i < 6 ? 0 : 0.33),
            ]}
          >
            <Cyl
              size={[0.015, 0.05, 0.015]}
              color={i < 6 ? p.slate : p.chalk}
            />
            <Cyl
              at={[0, 0.035, 0]}
              size={[0.02, 0.015, 0.02]}
              color={i < 6 ? p.slate : p.chalk}
            />
          </group>
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <group
            key={i}
            position={[36.96, 3.5 + i * 0.36, (i % 2) * 0.25]}
            rotation={[0, i * 1.7, 0]}
          >
            <Beam
              from={[0, 0, 0]}
              to={[0.1, 0.5, 0.08]}
              r={0.014}
              color="#6e8055"
            />
            <Leaf
              at={[0, 0.1, 0]}
              size={[0.9, 0.5, 0.9]}
              rotation={[0.6, 0, 0.7]}
              color="#7d9668"
            />
            <Leaf
              at={[0.1, 0.2, 0.08]}
              size={[1, 0.55, 1]}
              rotation={[-0.8, 1, 0.9]}
              color="#5e815e"
            />
          </group>
        ))}
        <Plant at={[36, 3.2, 22]} scale={1.6} seed={5} />
        <Cyl at={[36, 3.35, 22]} size={[0.6, 0.7, 0.6]} color="#a6aa8b" />
        {[-3, 0, 3].flatMap((x) =>
          [-1.6, 1.6].map((z) => (
            <SolarPanel
              key={`${x}${z}`}
              at={[4 + x, 9.5, -50 + z]}
              rotation={[0.3, 0, 0]}
            />
          )),
        )}
        {[41.5, 44.5].map((x) => (
          <group key={x}>
            <Cyl at={[x, 14, -46]} size={[1.2, 4, 1.2]} color={p.metal} />
            <Cyl
              at={[x, 16.1, -46]}
              size={[1.28, 0.16, 1.28]}
              color={p.slate}
            />
            <Cyl at={[x, 12, -46]} size={[1.35, 0.3, 1.35]} color={p.slate} />
            <Beam
              from={[x, 13, -46]}
              to={[x, 13, -43]}
              r={0.17}
              color={p.green}
            />
            <Flange at={[x, 13, -43]} rotation={[Math.PI / 2, 0, 0]} />
            <Beam
              from={[x, 13, -43]}
              to={[x, 10, -43]}
              r={0.17}
              color={p.green}
            />
            {[-1, 1].map((s) => (
              <Beam
                key={s}
                from={[x + s * 0.9, 12, -46]}
                to={[x + s * 0.9, 16, -46]}
                r={0.035}
                color="#899b95"
              />
            ))}
          </group>
        ))}
        <group position={[11, 18.2, -47]} rotation={[0, 0, 0.5]}>
          <Cyl at={[0, -0.65, 0]} size={[0.23, 1.3, 0.23]} color={p.slate} />
          <mesh geometry={dish} material={mat(p.chalk)} castShadow />
          {[0, 1, 2].map((i) => (
            <Beam
              key={i}
              from={[
                Math.cos((i * Math.PI * 2) / 3) * 1.4,
                0.5,
                Math.sin((i * Math.PI * 2) / 3) * 1.4,
              ]}
              to={[0, 1.5, 0]}
              r={0.04}
            />
          ))}
          <Cyl at={[0, 1.5, 0]} size={[0.14, 0.3, 0.14]} color={p.orange} />
        </group>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6,
            x = Math.cos(a) * 61,
            z = -2 + Math.sin(a) * 61;
          return (
            <group key={i} position={[x, 0, z]} rotation={[0, -a, 0]}>
              <Box
                at={[0, 0.7, 0]}
                size={[1.4, 1.4, 2.5]}
                color="#809891"
                round
              />
              <Box at={[0, 1.4, 0]} size={[1, 0.12, 2]} color={p.slate} />
            </group>
          );
        })}
        {[-36, -22].map((x) => (
          <group key={`bay-brace${x}`}>
            <Beam
              from={[x, 7.8, -13]}
              to={[x, 9.45, -10]}
              r={0.075}
              color={p.slate}
            />
            <Beam
              from={[x, 7.8, -23]}
              to={[x, 9.45, -26]}
              r={0.075}
              color={p.slate}
            />
            <Beam
              from={[x, 9.45, -26]}
              to={[x, 9.45, -10]}
              r={0.1}
              color={p.slate}
            />
          </group>
        ))}
        <Beam
          from={[-36, 9.45, -10]}
          to={[-22, 9.45, -10]}
          r={0.1}
          color={p.slate}
        />
        <Box at={[-29, 9.6, -11]} size={[14.5, 0.15, 1.6]} color={p.metal} />
        {[0, 1, 2].map((i) => (
          <mesh
            key={`aerial${i}`}
            position={[34, 14 + i * 0.35, -36]}
            rotation={[Math.PI / 2, 0, 0]}
            geometry={hoop}
            material={mat(p.metal)}
            scale={0.6 - i * 0.1}
          />
        ))}
        {[1.5, 14.5].map((z) => (
          <group key={`garden-hanging${z}`} position={[35, 6.55, z]}>
            <Cyl size={[0.38, 0.45, 0.38]} color={p.green} />
            {[-1, 1].map((side) => (
              <Beam
                key={side}
                from={[side * 0.23, 0.18, 0]}
                to={[0, 1.7, 0]}
                r={0.012}
                color="#8d9e9c"
              />
            ))}
            <Plant at={[0, 0.15, 0]} scale={0.65} seed={3} />
            {[0, 1, 2, 3].map((i) => (
              <Leaf
                key={i}
                at={[Math.cos(i * 1.57) * 0.2, 0.2, Math.sin(i * 1.57) * 0.2]}
                rotation={[1.8, i * 1.57, 0]}
                size={[1.1, 0.9, 1.1]}
                color="#78956e"
              />
            ))}
          </group>
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <group
            key={`vine${i}`}
            position={[36.95, 3.6 + i * 0.32, 15.95]}
            rotation={[0, i * 1.7, 0]}
          >
            <Beam
              from={[0, 0, 0]}
              to={[0.03, 0.4, 0.02]}
              r={0.015}
              color="#6e8055"
            />
            <Leaf
              at={[0, 0.1, 0]}
              size={[0.9, 0.5, 0.9]}
              rotation={[0.9, 0, 0.5]}
              color="#729167"
            />
            <Leaf
              at={[0, 0.2, 0.03]}
              size={[1, 0.6, 1]}
              rotation={[-0.6, 2, 0.5]}
              color="#91a578"
            />
          </group>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <group
            key={`flower${i}`}
            position={[32.2 + i * 0.7, 4.75, -1.9 + (i % 2) * 0.25]}
          >
            <Beam
              from={[0, -0.8, 0]}
              to={[0, 0, 0]}
              r={0.012}
              color="#729167"
            />
            {Array.from({ length: 5 }, (_, j) => (
              <Orb
                key={j}
                at={[
                  Math.cos((j * Math.PI * 2) / 5) * 0.075,
                  0,
                  Math.sin((j * Math.PI * 2) / 5) * 0.075,
                ]}
                size={[0.07, 0.025, 0.05]}
                color="#ddd4aa"
              />
            ))}
            <Orb
              at={[0, 0.018, 0]}
              size={[0.035, 0.025, 0.035]}
              color={p.orange}
            />
          </group>
        ))}
      </Bake>
      <SettlementMap />
      <VentFan at={[11.1, 1.5, -11.3]} paused={paused} reduced={reduced} />
      <Label at={[-10, 3.08, 23.1]} rotation={[-Math.PI / 2, 0, 0]} size={0.22}>
        Maintenance berth
      </Label>
      <Label at={[-4, 3.08, 25]} rotation={[-Math.PI / 2, 0, 0]} size={0.2}>
        Arrival terrace
      </Label>
      <Label
        at={[-11, 0.075, -10.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={0.25}
      >
        Systems yard
      </Label>
      <Label at={[-34, 3.08, -19.5]} rotation={[-Math.PI / 2, 0, 0]} size={0.2}>
        Assembly bay
      </Label>
    </>
  );
}

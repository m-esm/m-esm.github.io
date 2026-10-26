import { useEffect, useMemo } from "react";
import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  DoubleSide,
} from "three";
import { Bake, Beam, Box, Cyl, mat, Planter } from "./kit";
import type { V3 } from "./kit";
import { Label } from "./Settlement";

function pavingTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#b6beb8";
  g.fillRect(0, 0, 512, 512);
  let seed = 841;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 4; x++) {
      const shade = 174 + Math.floor(random() * 13);
      g.fillStyle = `rgb(${shade},${shade + 7},${shade + 1})`;
      g.fillRect(x * 128 + 1, y * 128 + 1, 126, 126);
      g.strokeStyle = "#99a59d";
      g.lineWidth = 1.2;
      g.strokeRect(x * 128 + 1, y * 128 + 1, 126, 126);
      g.strokeStyle = "#d0d5cd";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x * 128 + 3, y * 128 + 125);
      g.lineTo(x * 128 + 3, y * 128 + 3);
      g.lineTo(x * 128 + 125, y * 128 + 3);
      g.stroke();
    }
  for (let i = 0; i < 16000; i++) {
    g.fillStyle = random() > 0.5 ? "#ffffff0b" : "#14251e09";
    g.fillRect(random() * 512, random() * 512, random() * 2 + 1, 1);
  }
  return c;
}
function Paving({
  at,
  size,
  color,
}: {
  at: V3;
  size: [number, number];
  color: string;
}) {
  const map = useMemo(() => {
    const t = new CanvasTexture(pavingTexture());
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(size[0] / 6, size[1] / 6);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [size[0], size[1]]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={at} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={map}
        color={color}
        roughness={0.92}
        metalness={0.02}
        bumpMap={map}
        bumpScale={0.018}
      />
    </mesh>
  );
}
function Base({ at }: { at: V3 }) {
  return (
    <group position={at}>
      <Box at={[0, 0.1, 0]} size={[0.72, 0.2, 0.72]} color="#5b706e" round />
      <Box at={[0, 0.4, 0]} size={[0.37, 0.6, 0.37]} color="#8d9e9c" round />
      {[-0.24, 0.24].flatMap((x) =>
        [-0.24, 0.24].map((z) => (
          <Cyl
            key={`${x}${z}`}
            at={[x, 0.23, z]}
            size={[0.035, 0.08, 0.035]}
            color="#394b56"
          />
        )),
      )}
    </group>
  );
}
function WorkshopShell() {
  return (
    <>
      <Bake>
        {[-26, -18, -10].map((z) => (
          <group key={z}>
            {[-36, -22].map((x) => (
              <group key={x}>
                <Base at={[x, 3, z]} />
                <Box
                  at={[x, 5.8, z]}
                  size={[0.24, 5.6, 0.3]}
                  color="#394b56"
                  round
                />
                <Beam
                  from={[x, 7.45, z]}
                  to={[x + (x === -36 ? 1.7 : -1.7), 9.05, z]}
                  r={0.085}
                  color="#8d9e9c"
                />
              </group>
            ))}
            <Beam
              from={[-36, 8.6, z]}
              to={[-29, 10.15, z]}
              r={0.15}
              color="#394b56"
            />
            <Beam
              from={[-29, 10.15, z]}
              to={[-22, 8.6, z]}
              r={0.15}
              color="#394b56"
            />
            <Beam
              from={[-36, 8.55, z]}
              to={[-22, 8.55, z]}
              r={0.065}
              color="#8d9e9c"
            />
            {[-34, -32, -30, -28, -26, -24].map((x) => (
              <Beam
                key={x}
                from={[x, 8.55, z]}
                to={[x, 10.15 - Math.abs(x + 29) * 0.221, z]}
                r={0.035}
                color="#8d9e9c"
              />
            ))}
          </group>
        ))}
        {[-1, 1].map((side) => (
          <group key={side}>
            <Box
              at={[-29 + side * 4.3, 9.18, -18]}
              size={[5.8, 0.15, 16.5]}
              rotation={[0, 0, -side * 0.218]}
              color="#8d9e9c"
              round
            />
            {Array.from({ length: 23 }, (_, i) => (
              <Box
                key={i}
                at={[-29 + side * 4.3, 9.29, -26 + i * 0.73]}
                size={[5.8, 0.065, 0.04]}
                rotation={[0, 0, -side * 0.218]}
                color="#b9c3c5"
              />
            ))}
            <Box
              at={[-29 + side * 6.9, 8.65, -18]}
              size={[0.18, 0.32, 17]}
              color="#536b68"
              round
            />
            <Beam
              from={[-29 + side * 6.9, 8.45, -25.9]}
              to={[-29 + side * 6.9, 3.6, -25.9]}
              r={0.06}
              color="#8d9e9c"
            />
          </group>
        ))}
        <Box
          at={[-29, 8.43, -9.9]}
          size={[6.8, 0.64, 0.2]}
          color="#394b56"
          round
        />
        <Box
          at={[-29, 8.02, -9.86]}
          size={[3.7, 0.12, 0.09]}
          color="#b6e4df"
          round
        />
        {[-32, -26].map((x) => (
          <group key={`task-lamp-${x}`}>
            <Beam
              from={[x, 9.4, -13]}
              to={[x, 8, -13]}
              r={0.016}
              color="#394b56"
            />
            <Box
              at={[x, 8, -13]}
              size={[1.4, 0.12, 0.4]}
              color="#394b56"
              round
            />
            <Box
              at={[x, 7.93, -13]}
              size={[1.25, 0.025, 0.29]}
              color="#b6e4df"
              round
            />
          </group>
        ))}
        {/* Rear workshop cladding sits beyond the board plane; the bay stays open. */}
        {[-34, -30, -26].map((x, i) => (
          <group key={x}>
            <Box
              at={[x, 5.3, -27.6]}
              size={[3.85, 4.55, 0.15]}
              color={i === 1 ? "#687d73" : "#8f9c90"}
              round
            />
            {[4, 5.1, 6.2].map((y) => (
              <Box
                key={y}
                at={[x, y, -27.48]}
                size={[3.75, 0.04, 0.05]}
                color="#b9c3c5"
              />
            ))}
          </group>
        ))}
        <Box
          at={[-29, 3.3, -27.45]}
          size={[14, 0.6, 0.5]}
          color="#536b68"
          round
        />
      </Bake>
      <Label at={[-29, 8.43, -9.77]} size={0.32} color="#e4e9e3">
        Parviz / Fabrication workshop
      </Label>
    </>
  );
}
function ComputingShell() {
  return (
    <>
      <Bake>
        {[15, 35].map((x) => (
          <group key={x}>
            <Base at={[x, 6, -37.5]} />
            <Box
              at={[x, 8.9, -37.5]}
              size={[0.34, 5.8, 0.34]}
              color="#394b56"
              round
            />
            <Beam
              from={[x, 10.8, -37.5]}
              to={[x + (x === 15 ? 1.7 : -1.7), 12.1, -37.5]}
              r={0.09}
              color="#8d9e9c"
            />
          </group>
        ))}
        <Box
          at={[25, 12, -36.5]}
          size={[21, 0.35, 3.7]}
          color="#394b56"
          round
        />
        <Box
          at={[25, 12.2, -36.5]}
          size={[20.8, 0.1, 3.5]}
          color="#8b9d92"
          round
        />
        {Array.from({ length: 11 }, (_, i) => (
          <Box
            key={i}
            at={[15.4 + i * 1.9, 12.3, -36.5]}
            size={[0.1, 0.16, 3.5]}
            color="#b9c3c5"
          />
        ))}
        <Box
          at={[25, 11.55, -34.63]}
          size={[10.8, 0.7, 0.12]}
          color="#355a68"
          round
        />
        {[16, 34].map((x) => (
          <group key={x}>
            <Box
              at={[x, 8.1, -36.9]}
              size={[1.3, 4.2, 0.7]}
              color="#394b56"
              round
            />
            {Array.from({ length: 9 }, (_, j) => (
              <group key={j}>
                <Box
                  at={[x, 6.45 + j * 0.4, -36.5]}
                  size={[1.1, 0.28, 0.12]}
                  color="#8d9e9c"
                  round
                />
                <Box
                  at={[x - 0.36, 6.45 + j * 0.4, -36.42]}
                  size={[0.07, 0.05, 0.025]}
                  color="#b6e4df"
                />
              </group>
            ))}
          </group>
        ))}
      </Bake>
      <Label at={[25, 11.55, -34.55]} size={0.36} color="#e4e9e3">
        Agent engineering / Smart subagents
      </Label>
    </>
  );
}
function CourtyardBasin() {
  return (
    <>
      <Bake>
        {/* Landscape is contained in the existing tree island, away from the ramps. */}
        <Cyl at={[9, 0.16, -9]} size={[3.8, 0.3, 3.8]} color="#536b68" />
        <Cyl at={[9, 0.34, -9]} size={[3.65, 0.09, 3.65]} color="#263f43" />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * Math.PI * 2) / 36;
          return (
            <Box
              key={i}
              at={[9 + Math.cos(a) * 3.72, 0.36, -9 + Math.sin(a) * 3.72]}
              rotation={[0, -a, 0]}
              size={[0.22, 0.12, 0.58]}
              color="#a9b4aa"
              round
            />
          );
        })}
        {[-1, 1].map((side) => (
          <group key={side}>
            <Box
              at={[9 + side * 4.4, 0.38, -9]}
              size={[0.8, 0.65, 3.7]}
              color="#5b706e"
              round
            />
            {Array.from({ length: 6 }, (_, i) => (
              <Box
                key={i}
                at={[9 + side * 4.4, 0.75, -10.6 + i * 0.64]}
                size={[0.97, 0.13, 0.53]}
                color="#9b8e6c"
                round
              />
            ))}
          </group>
        ))}
      </Bake>
      <mesh
        position={[9, 0.4, -9]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <ringGeometry args={[2.55, 3.55, 80]} />
        <meshPhysicalMaterial
          color="#396f72"
          roughness={0.16}
          metalness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </>
  );
}
export function ArchitecturePass() {
  return (
    <>
      <Paving at={[0, 0.038, -5.5]} size={[75.8, 68.8]} color="#b7c0b9" />
      <Paving at={[0, 3.05, 20]} size={[29.8, 11.8]} color="#e1ded0" />
      <Paving at={[-29, 3.05, -17]} size={[13.8, 21.8]} color="#b5bcb2" />
      <Paving at={[-29, 3.05, -33]} size={[13.8, 9.8]} color="#b5bcb2" />
      <Paving at={[-15, 3.05, -34]} size={[13.8, 7.8]} color="#c3cbc2" />
      <Paving at={[25, 6.05, -32]} size={[21.8, 11.8]} color="#bdcbd0" />
      <Paving at={[31, 3.05, 11]} size={[13.8, 29.8]} color="#d2d0b9" />
      <Paving at={[19.5, 3.05, 23]} size={[8.8, 5.8]} color="#d2d0b9" />
      <WorkshopShell />
      <ComputingShell />
      <CourtyardBasin />
      <Bake>
        {/* Raised slab edges are assembled pressure-deck walls, not solid concrete blocks. */}
        {[
          [-29, 1.5, -5.94, 14, 3],
          [25, 3, -25.94, 22, 6],
          [0, 1.5, 26.08, 30, 3],
        ].map(([x, y, z, w, h], i) => (
          <group key={i}>
            <Box
              at={[x, y, z]}
              size={[w - 0.2, h - 0.2, 0.1]}
              color="#718680"
            />
            {Array.from({ length: Math.floor(w / 2) }, (_, j) => (
              <group key={j}>
                <Box
                  at={[x - w / 2 + 1 + j * 2, y, z + 0.07]}
                  size={[1.85, h - 0.6, 0.05]}
                  color={i === 1 ? "#81959b" : "#8f9e91"}
                  round
                />
                <Box
                  at={[x - w / 2 + 1 + j * 2, y - h / 2 + 0.35, z + 0.12]}
                  size={[1.3, 0.09, 0.025]}
                  color="#394b56"
                />
              </group>
            ))}
            <Box
              at={[x, y + h / 2 - 0.13, z + 0.1]}
              size={[w, 0.13, 0.12]}
              color="#b9c3c5"
            />
          </group>
        ))}
      </Bake>
    </>
  );
}

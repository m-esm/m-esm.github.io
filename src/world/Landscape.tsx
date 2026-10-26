import { useMemo } from "react";
import { CanvasTexture } from "three";
import { Bake, Beam, Box, Cyl, Leaf, Plant } from "./kit";
import type { V3 } from "./kit";
export function HabitatTree() {
  return (
    <Bake>
      <group position={[9, 0, -9]}>
        <Cyl at={[0, 0.18, 0]} size={[2.5, 0.36, 2.5]} color="#6f8078" />
        <Cyl at={[0, 0.37, 0]} size={[2.3, 0.06, 2.3]} color="#5c5c46" />
        <Beam
          from={[0, 0.35, 0]}
          to={[0.3, 3.4, -0.2]}
          r={0.27}
          color="#776e56"
        />
        <Beam
          from={[0.3, 2.8, -0.2]}
          to={[-0.2, 5.7, -0.3]}
          r={0.16}
          color="#85785d"
        />
        {Array.from({ length: 9 }, (_, i) => {
          const angle = i * 2.399,
            r = 1.45 + (i % 3) * 0.5,
            y = 4.2 + (i % 4) * 0.55;
          const x = Math.cos(angle) * r,
            z = Math.sin(angle) * r;
          return (
            <group key={i}>
              <Beam
                from={[0.15, 2.5 + (i % 3) * 0.6, 0]}
                to={[x, y, z]}
                r={0.11 - i * 0.006}
                color="#81745a"
              />
              <Beam
                from={[x, y, z]}
                to={[x + 0.45, y + 0.7, z + 0.2]}
                r={0.045}
                color="#948263"
              />
              {Array.from({ length: 24 }, (_, j) => {
                const a = j * 2.399 + i,
                  radius = 0.3 + (j % 5) * 0.24;
                return (
                  <group
                    key={j}
                    position={[
                      x + Math.cos(a) * radius,
                      y + Math.sin(j * 1.8) * 0.4,
                      z + Math.sin(a) * radius,
                    ]}
                    rotation={[0.2, a, 0]}
                  >
                    <Leaf
                      rotation={[0.6, 0, -0.9]}
                      size={[1.5, 0.85, 1.5]}
                      color={
                        ["#536f59", "#6c8962", "#8fa174", "#769470"][
                          (i + j) % 4
                        ]
                      }
                    />
                    <Leaf
                      rotation={[-0.8, 1.2, 0.7]}
                      size={[1.3, 0.7, 1.3]}
                      color={["#617d60", "#9daa7b", "#7b976d"][(i + j) % 3]}
                    />
                  </group>
                );
              })}
            </group>
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => (
          <Plant
            key={i}
            at={[Math.cos(i * 1.9) * 1.8, 0.4, Math.sin(i * 1.9) * 1.8]}
            scale={0.55}
            seed={i + 2}
          />
        ))}
      </group>
    </Bake>
  );
}
export function GroundShades() {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!,
      g = ctx.createRadialGradient(64, 64, 3, 64, 64, 64);
    g.addColorStop(0, "rgba(31,48,44,.38)");
    g.addColorStop(0.4, "rgba(31,48,44,.18)");
    g.addColorStop(1, "rgba(31,48,44,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  }, []);
  const shades: { at: V3; size: [number, number] }[] = [
    { at: [9, 0.045, -9], size: [12, 10] },
    { at: [-7, 0.046, -14], size: [10, 5] },
    { at: [-32, 3.09, -13], size: [6, 4] },
    { at: [21, 6.09, -29], size: [11, 5] },
    { at: [35, 3.09, 18], size: [7, 4] },
    { at: [12.4, 3.09, 19], size: [7, 4] },
    { at: [-17, 0.046, -16], size: [6, 4] },
  ];
  return (
    <>
      {shades.map((s, i) => (
        <mesh
          key={i}
          position={s.at}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={1}
        >
          <planeGeometry args={s.size} />
          <meshBasicMaterial
            map={map}
            transparent
            depthWrite={false}
            opacity={0.65}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      ))}
    </>
  );
}

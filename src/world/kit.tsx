import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
  Matrix4,
  Float32BufferAttribute,
  DoubleSide,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { palette as p } from "./layout";
export type V3 = [number, number, number];
const cube = new BoxGeometry(1, 1, 1),
  cylinder = new CylinderGeometry(1, 1, 1, 24),
  sphere = new SphereGeometry(1, 16, 12);
const bevels = new Map<string, BufferGeometry>();
function beveledBox(size: V3) {
  const key = size.join(",");
  if (!bevels.has(key)) {
    // A metal edge has a physical radius; stretching a unit bevel rounded whole walls.
    const radius = Math.min(0.065, ...size.map((n) => n * 0.24));
    bevels.set(key, new RoundedBoxGeometry(...size, 2, radius));
  }
  return bevels.get(key)!;
}
const materials = new Map<string, MeshStandardMaterial>();
export function mat(color: string) {
  if (!materials.has(color)) {
    const dark = [p.slate, "#29383c", "#222f37", "#1a2932"].includes(color);
    const glass = ["#60787e", "#355a68", "#b6e4df"].includes(color);
    const rubber = ["#252a29", "#303733"].includes(color);
    const alloy = [p.metal, "#8d9e9c", "#a8b5b5", "#85949c"].includes(color);
    const m = new MeshStandardMaterial({
      color,
      roughness: rubber
        ? 0.94
        : glass
          ? 0.24
          : alloy
            ? 0.45
            : dark
              ? 0.58
              : 0.8,
      metalness: rubber ? 0 : glass ? 0.48 : alloy ? 0.72 : dark ? 0.58 : 0.06,
      ...(color === "#b6e4df"
        ? { emissive: color, emissiveIntensity: 0.7 }
        : {}),
    });
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vSurfacePosition;",
        )
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\nvSurfacePosition = (modelMatrix * vec4(transformed, 1.0)).xyz;",
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
        varying vec3 vSurfacePosition;
        float surfaceHash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      `,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
        float grain = surfaceHash(floor(vSurfacePosition * 195.0));
        float patina = surfaceHash(floor(vSurfacePosition * 3.5));
        diffuseColor.rgb *= .963 + grain * .055 + patina * .022;
      `,
        );
    };
    m.customProgramCacheKey = () => "station-surface-v1";
    materials.set(color, m);
  }
  return materials.get(color)!;
}
export function Box({
  at = [0, 0, 0],
  size = [1, 1, 1],
  color = p.metal,
  rotation = [0, 0, 0],
  round = false,
}: {
  at?: V3;
  size?: V3;
  color?: string;
  rotation?: V3;
  round?: boolean;
}) {
  return (
    <mesh
      position={at}
      scale={round ? 1 : size}
      rotation={rotation}
      geometry={round ? beveledBox(size) : cube}
      material={mat(color)}
      castShadow
      receiveShadow
    />
  );
}
export function Cyl({
  at = [0, 0, 0],
  size = [1, 1, 1],
  color = p.slate,
  rotation = [0, 0, 0],
}: {
  at?: V3;
  size?: V3;
  color?: string;
  rotation?: V3;
}) {
  return (
    <mesh
      position={at}
      scale={size}
      rotation={rotation}
      geometry={cylinder}
      material={mat(color)}
      castShadow
      receiveShadow
    />
  );
}
export function Orb({
  at,
  size,
  color = p.green,
}: {
  at: V3;
  size: V3;
  color?: string;
}) {
  return (
    <mesh
      position={at}
      scale={size}
      geometry={sphere}
      material={mat(color)}
      castShadow
    />
  );
}
export function Beam({
  from,
  to,
  r = 0.05,
  color = p.slate,
}: {
  from: V3;
  to: V3;
  r?: number;
  color?: string;
}) {
  const a = new Vector3(...from),
    b = new Vector3(...to),
    q = new Vector3().subVectors(b, a);
  return (
    <mesh
      position={a.add(b).multiplyScalar(0.5)}
      quaternion={new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        q.clone().normalize(),
      )}
      scale={[r, q.length(), r]}
      geometry={cylinder}
      material={mat(color)}
      castShadow
    />
  );
}
// Shared geometry/materials and one-time static batching keep the authored kit inexpensive.
import { Quaternion } from "three";
export function Bake({
  children,
  castShadow = true,
}: {
  children: ReactNode;
  castShadow?: boolean;
}) {
  const source = useRef<Group>(null),
    result = useRef<Group>(null);
  useLayoutEffect(() => {
    const g = source.current!,
      out = result.current!;
    g.updateWorldMatrix(true, true);
    const inverse = new Matrix4().copy(out.parent!.matrixWorld).invert();
    const sets = new Map<MeshStandardMaterial, BufferGeometry[]>();
    g.traverse((o) => {
      if (o instanceof Mesh && o.material instanceof MeshStandardMaterial) {
        const geometry = o.geometry.index
          ? o.geometry.toNonIndexed()
          : o.geometry.clone();
        geometry.applyMatrix4(
          new Matrix4().multiplyMatrices(inverse, o.matrixWorld),
        );
        const list = sets.get(o.material) || [];
        list.push(geometry);
        sets.set(o.material, list);
      }
    });
    for (const [material, parts] of sets) {
      const merged = mergeGeometries(parts, false);
      parts.forEach((x) => x.dispose());
      if (merged) {
        const mesh = new Mesh(merged, material);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = true;
        out.add(mesh);
      }
    }
    g.visible = false;
    return () => {
      out.children.forEach((o) => {
        if (o instanceof Mesh) o.geometry.dispose();
      });
      out.clear();
    };
  }, []);
  return (
    <>
      <group ref={source}>{children}</group>
      <group ref={result} />
    </>
  );
}
const leafGeometry = new BufferGeometry();
{
  const vertices: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10,
      w = Math.pow(Math.sin(t * Math.PI), 0.9) * 0.19;
    vertices.push(
      -w,
      t,
      Math.sin(t * Math.PI) * 0.06,
      0,
      t,
      Math.sin(t * Math.PI) * 0.11,
      w,
      t,
      Math.sin(t * Math.PI) * 0.06,
    );
    if (i < 10)
      for (let j = 0; j < 2; j++) {
        const a = i * 3 + j;
        indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4);
      }
  }
  leafGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(vertices, 3),
  );
  leafGeometry.setIndex(indices);
  leafGeometry.computeVertexNormals();
}
const leafMaterials = new Map<string, MeshStandardMaterial>();
export function Leaf({
  at = [0, 0, 0],
  size = [1, 1, 1],
  rotation = [0, 0, 0],
  color = "#648360",
}: {
  at?: V3;
  size?: V3;
  rotation?: V3;
  color?: string;
}) {
  if (!leafMaterials.has(color))
    leafMaterials.set(
      color,
      new MeshStandardMaterial({
        color,
        side: DoubleSide,
        roughness: 0.92,
        metalness: 0,
      }),
    );
  return (
    <mesh
      position={at}
      rotation={rotation}
      scale={size}
      geometry={leafGeometry}
      material={leafMaterials.get(color)}
      castShadow
      receiveShadow
    />
  );
}
export function Plant({
  at = [0, 0, 0],
  seed = 1,
  scale = 1,
}: {
  at?: V3;
  seed?: number;
  scale?: number;
}) {
  return (
    <group position={at} scale={scale} rotation={[0, seed * 2.399, 0]}>
      {[0, 1, 2].map((stem) => (
        <group
          key={stem}
          rotation={[0.12 * stem, stem * 2.399, 0.12 - stem * 0.12]}
        >
          <Beam
            from={[0, 0, 0]}
            to={[0.03, 1.05, 0]}
            r={0.012}
            color="#6b8054"
          />
          {Array.from({ length: 7 }, (_, i) => (
            <group
              key={i}
              position={[0, 0.16 + i * 0.115, 0]}
              rotation={[0, i * 2.399 + seed, 0]}
            >
              <Leaf
                rotation={[0.85, 0, -0.65]}
                size={[0.9 - i * 0.07, 0.48 - i * 0.035, 0.9]}
                color={["#4e705b", "#74936d", "#91a47a"][(i + stem) % 3]}
              />
              <Leaf
                rotation={[-0.85, Math.PI, 0.65]}
                size={[0.8 - i * 0.05, 0.4 - i * 0.025, 0.8]}
                color={["#66845e", "#81966c", "#54745d"][(i + seed) % 3]}
              />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
export function Planter({
  at = [0, 0, 0],
  long = 3,
}: {
  at?: V3;
  long?: number;
}) {
  return (
    <group position={at}>
      <Box at={[0, 0.3, 0]} size={[long, 0.6, 1.1]} color={p.slate} round />
      <Box at={[0, 0.57, 0]} size={[long - 0.12, 0.12, 0.97]} color="#534f40" />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            at={[0, 0.63, side * 0.52]}
            size={[long + 0.06, 0.09, 0.08]}
            color="#8c9d92"
          />
          <Box
            at={[side * (long / 2 - 0.08), 0.63, 0]}
            size={[0.1, 0.09, 1.08]}
            color="#8c9d92"
          />
          <Box
            at={[side * (long / 2 - 0.2), 0.07, 0]}
            size={[0.12, 0.14, 1.2]}
            color={p.slate}
          />
        </group>
      ))}
      {Array.from({ length: Math.ceil(long * 1.1) }, (_, i) => (
        <group key={i}>
          <Plant
            at={[-long / 2 + 0.3 + i * 0.85, 0.62, ((i % 2) - 0.5) * 0.16]}
            scale={0.75 + (i % 3) * 0.12}
            seed={i + 1}
          />
          <Box
            at={[-long / 2 + 0.3 + i * 0.85, 0.28, 0.556]}
            size={[0.035, 0.4, 0.016]}
            color="#6a7b75"
          />
        </group>
      ))}
      <Beam
        from={[-long / 2 + 0.1, 0.66, 0]}
        to={[long / 2 - 0.1, 0.66, 0]}
        r={0.018}
        color="#394c43"
      />
    </group>
  );
}
export function Rail({ a, b, y }: { a: V3; b: V3; y?: number }) {
  const floor = y ?? a[1];
  const length = new Vector3(...a).distanceTo(new Vector3(...b));
  return (
    <>
      <Beam
        from={[a[0], floor + 0.95, a[2]]}
        to={[b[0], (y ?? b[1]) + 0.95, b[2]]}
        r={0.055}
      />
      <Beam
        from={[a[0], floor + 0.42, a[2]]}
        to={[b[0], (y ?? b[1]) + 0.42, b[2]]}
        r={0.025}
      />
      {Array.from({ length: Math.ceil(length / 2.5) + 1 }, (_, i) => {
        const t = i / Math.ceil(length / 2.5);
        const x = a[0] + (b[0] - a[0]) * t,
          z = a[2] + (b[2] - a[2]) * t,
          h = a[1] + (b[1] - a[1]) * t;
        return <Box key={i} at={[x, h + 0.5, z]} size={[0.09, 1, 0.09]} />;
      })}
    </>
  );
}

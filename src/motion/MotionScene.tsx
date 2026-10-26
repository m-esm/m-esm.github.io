import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
} from "three";

function Ribbon({ phase, color }: { phase: number; color: string }) {
  const geometry = useMemo(() => {
    const g = new BufferGeometry(),
      p: number[] = [],
      n: number[] = [];
    for (let i = 0; i <= 320; i++) {
      const a = (i / 320) * Math.PI * 2,
        r = 2.35 + 0.24 * Math.sin(a * 3 + phase);
      for (const side of [-1, 1]) {
        const w = side * 0.15,
          twist = a * 2 + phase;
        p.push(
          (r + w * Math.cos(twist)) * Math.cos(a),
          0.55 * Math.sin(a * 2 + phase) + w * Math.sin(twist),
          (r + w * Math.cos(twist)) * Math.sin(a),
        );
      }
      if (i < 320) {
        const b = i * 2;
        n.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }
    g.setAttribute("position", new Float32BufferAttribute(p, 3));
    g.setIndex(n);
    g.computeVertexNormals();
    return g;
  }, [phase]);
  return (
    <mesh geometry={geometry} rotation={[phase, 0.2, phase * 0.5]}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.78}
        roughness={0.2}
        clearcoat={1}
        iridescence={1}
        iridescenceIOR={1.4}
        side={2}
      />
    </mesh>
  );
}
function Sculpture({ paused, chapter }: { paused: boolean; chapter: string }) {
  const group = useRef<Group>(null),
    time = useRef(0);
  const cursor = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      cursor.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: 1 - (e.clientY / innerHeight) * 2,
      };
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const dust = useMemo(() => {
    const a = [];
    for (let i = 0; i < 240; i++) {
      const v = Math.sin(i * 127.1) * 43758.5453;
      const f = v - Math.floor(v);
      a.push(Math.sin(i * 2.4) * 8, Math.cos(i * 4.7) * 6, -3 - f * 12);
    }
    return new Float32Array(a);
  }, []);
  useFrame((_, dt) => {
    const pointer = cursor.current;
    if (!group.current) return;
    if (!paused) time.current += Math.min(dt, 0.04);
    const scroll =
      window.scrollY /
      Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const t = time.current;
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      scroll * 6 + pointer.x * 0.18 + t * 0.08,
      3,
      dt,
    );
    group.current.rotation.z = MathUtils.damp(
      group.current.rotation.z,
      0.25 + Math.sin(scroll * 7) * 0.4 + pointer.y * 0.08,
      3,
      dt,
    );
    group.current.position.x = MathUtils.damp(
      group.current.position.x,
      innerWidth < 760 ? 0 : 1.6 * Math.cos(scroll * Math.PI * 3),
      2,
      dt,
    );
    group.current.position.y = Math.sin(t * 0.3) * 0.1;
    const targetScale =
      chapter === "Introduction"
        ? 1
        : chapter === "Music & intelligence"
          ? 0.7
          : chapter === "Step inside" || chapter === "Let’s build something"
            ? 0.22
            : 0.5;
    const scale = MathUtils.damp(group.current.scale.x, targetScale, 2, dt);
    group.current.scale.setScalar(scale);
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 4, 4]} color="#9ddcff" intensity={35} />
      <pointLight position={[-4, -2, 2]} color="#b39bff" intensity={25} />
      <Environment resolution={128}>
        <Lightformer position={[0, 4, 0]} scale={[10, 2, 1]} intensity={6} />
        <Lightformer
          position={[-4, 0, 2]}
          rotation={[0, Math.PI / 2, 0]}
          color="#9d9aff"
          scale={[4, 8, 1]}
          intensity={5}
        />
        <Lightformer
          position={[4, 1, -2]}
          rotation={[0, -Math.PI / 2, 0]}
          color="#91e6f5"
          scale={[3, 8, 1]}
          intensity={5}
        />
      </Environment>
      <group ref={group} rotation={[0.25, 0, 0.2]}>
        <Ribbon phase={0.2} color="#a7b5ff" />
        <Ribbon phase={1.5} color="#83d3e9" />
        <Ribbon phase={2.8} color="#d2a9ef" />
        <mesh>
          <icosahedronGeometry args={[1.13, 4]} />
          <meshPhysicalMaterial
            color="#bbbcf4"
            metalness={0.65}
            roughness={0.12}
            clearcoat={1}
            iridescence={1}
          />
        </mesh>
        <mesh rotation={[0.8, 0.3, 0.4]}>
          <torusGeometry args={[3.1, 0.012, 8, 180]} />
          <meshBasicMaterial color="#7b9fdf" transparent opacity={0.5} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos(i * 1.8) * 3,
              Math.sin(i * 2.1) * 1.8,
              Math.sin(i * 1.8) * 2,
            ]}
          >
            <sphereGeometry args={[i === 0 ? 0.17 : 0.075, 20, 20]} />
            <meshStandardMaterial
              color="#d5eaff"
              emissive="#7d91e9"
              emissiveIntensity={0.5}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.017}
          color="#c8d6ff"
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
    </>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function MotionScene({
  paused,
  chapter,
}: {
  paused: boolean;
  chapter: string;
}) {
  return (
    <SceneBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 9.6], fov: 43 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Sculpture paused={paused} chapter={chapter} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}

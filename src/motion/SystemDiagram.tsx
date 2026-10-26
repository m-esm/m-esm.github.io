import { Component, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Line,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { Group, MathUtils, OrthographicCamera } from "three";

type Props = {
  kind: "delivery" | "agents";
  selected: number;
  onSelect: (n: number) => void;
  paused: boolean;
};
const colors = ["#89e4ee", "#c4adff", "#ffc7a8", "#a0c8ff"];
function Block({
  position = [0, 0, 0],
  size,
  color = "#687aab",
}: {
  position?: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <RoundedBox args={size} position={position} radius={0.06} smoothness={3}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.65}
        roughness={0.24}
        clearcoat={1}
      />
    </RoundedBox>
  );
}
function Module({
  index,
  selected,
  onSelect,
  kind,
  paused,
}: Props & { index: number }) {
  const object = useRef<Group>(null),
    time = useRef(0);
  const active = selected === index,
    color = colors[index];
  const count = kind === "delivery" ? 4 : 3;
  useFrame((_, dt) => {
    if (!object.current) return;
    if (!paused) time.current += Math.min(dt, 0.05);
    object.current.position.y = MathUtils.damp(
      object.current.position.y,
      (active ? 0.3 : 0) +
        (paused ? 0 : Math.sin(time.current * 0.7 + index) * 0.04),
      5,
      dt,
    );
  });
  return (
    <group
      position={[(index - (count - 1) / 2) * 2.8, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
        <ringGeometry args={[0.91, 1.02, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.95 : 0.22}
        />
      </mesh>
      <group ref={object}>
        <Block
          position={[0, -0.22, 0]}
          size={[1.9, 0.18, 1.8]}
          color={active ? "#7776b8" : "#2b3b64"}
        />
        {index === 0 ? (
          <>
            <Block size={[1.5, 1.1, 0.18]} position={[0, 0.64, 0]} />
            <Block
              size={[1.32, 0.92, 0.03]}
              position={[0, 0.64, 0.11]}
              color="#101f42"
            />
            <Line
              points={[
                [-0.28, 0.9, 0.14],
                [-0.52, 0.65, 0.14],
                [-0.28, 0.4, 0.14],
              ]}
              color={color}
              lineWidth={2}
            />
            <Line
              points={[
                [0.28, 0.9, 0.14],
                [0.52, 0.65, 0.14],
                [0.28, 0.4, 0.14],
              ]}
              color={color}
              lineWidth={2}
            />
            <Block size={[0.12, 0.4, 0.18]} position={[0, -0.02, 0]} />
          </>
        ) : index === 1 && kind === "delivery" ? (
          <>
            <Block size={[1.75, 1.15, 0.2]} position={[0, 0.7, 0]} />
            <Block
              size={[1.55, 0.95, 0.03]}
              position={[0, 0.7, 0.12]}
              color="#1b2947"
            />
            {[0, 1, 2, 3].map((i) => (
              <Block
                key={i}
                size={[0.17, 0.18 + i * 0.12, 0.04]}
                position={[-0.5 + i * 0.33, 0.58 + i * 0.06, 0.16]}
                color={color}
              />
            ))}
            <Block size={[0.15, 0.38, 0.25]} position={[0, 0, 0]} />
          </>
        ) : index === 2 && kind === "delivery" ? (
          <>
            {[-1, 0, 1].map((i) => (
              <group
                key={i}
                position={[i * 0.51, 0.38 + Math.abs(i) * 0.34, 0]}
              >
                <Block
                  size={[0.4, 0.4, 0.5]}
                  color={i === 0 ? color : "#b1b6e0"}
                />
              </group>
            ))}
            <Line
              points={[
                [-0.51, 0.7, 0.3],
                [0, 0.38, 0.3],
                [0.51, 0.7, 0.3],
              ]}
              color={color}
              lineWidth={2}
            />
            <Line
              points={[
                [0, 0.38, 0.3],
                [0, 0.96, 0.3],
              ]}
              color={color}
              lineWidth={2}
            />
            <Block
              size={[0.4, 0.4, 0.5]}
              position={[0, 1.07, 0]}
              color={color}
            />
          </>
        ) : kind === "agents" && index === 1 ? (
          <>
            {[0, 1, 2].map((i) => (
              <Block
                key={i}
                size={[1.35, 0.28, 1.05]}
                position={[0, 0.2 + i * 0.38, 0]}
                color={i === 1 ? color : "#6b79aa"}
              />
            ))}
          </>
        ) : kind === "agents" ? (
          <>
            <Block
              size={[1.3, 1.3, 0.18]}
              position={[0, 0.65, 0]}
              color="#25385b"
            />
            <Line
              points={[
                [-0.4, 0.65, 0.13],
                [-0.1, 0.35, 0.13],
                [0.45, 0.95, 0.13],
              ]}
              color={color}
              lineWidth={4}
            />
          </>
        ) : (
          <>
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.34, 32, 24]} />
              <meshPhysicalMaterial
                color={color}
                metalness={0.7}
                roughness={0.16}
              />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh
                key={i}
                position={[0, 0.65, 0]}
                rotation={[i * 0.8, 0.6 + i, 0.4]}
              >
                <torusGeometry args={[0.72, 0.012, 8, 64]} />
                <meshBasicMaterial color={color} />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
  );
}
function Model(props: Props) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.min(size.width / 13, size.height / 5.3);
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 5]} intensity={3} color="#c8dfff" />
      <Environment resolution={64}>
        <Lightformer intensity={4} position={[0, 5, 1]} scale={[10, 3, 1]} />
        <Lightformer
          intensity={3}
          position={[-4, 2, 4]}
          scale={[4, 4, 1]}
          color="#c5a7ff"
        />
      </Environment>
      <group rotation={[0, -0.15, 0]}>
        <Line
          points={[
            [-5, -0.42, 0],
            [5, -0.42, 0],
          ]}
          color="#6079b7"
          lineWidth={1}
        />
        {Array.from({ length: props.kind === "delivery" ? 4 : 3 }, (_, i) => (
          <Module key={i} index={i} {...props} />
        ))}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.5}
        maxPolarAngle={1.4}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
      />
    </>
  );
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="system-loading">
        Explore the platform using the controls below.
      </p>
    ) : (
      this.props.children
    );
  }
}
export default function SystemDiagram(props: Props) {
  const element = useRef<HTMLDivElement>(null),
    [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="system-canvas"
      ref={element}
      aria-label="Three-dimensional conceptual model. Select a layer below, or drag to rotate the model."
    >
      {visible && (
        <Boundary>
          <Canvas
            orthographic
            dpr={[1, 1.5]}
            camera={{ position: [2, 5, 10], zoom: 70 }}
          >
            <Suspense fallback={null}>
              <Model {...props} />
            </Suspense>
          </Canvas>
        </Boundary>
      )}
    </div>
  );
}

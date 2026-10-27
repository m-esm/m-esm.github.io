import { Component, Suspense, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Line,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { Group, MathUtils, OrthographicCamera } from "three";
import { useEffect } from "react";

export type WorkFocus = "both" | "robotics" | "music";
type Props = {
  focus: WorkFocus;
  onFocus: (value: WorkFocus) => void;
  running: boolean;
  paused: boolean;
};
function Part({
  at = [0, 0, 0],
  size,
  color = "#e7e9ec",
  radius = 0.08,
}: {
  at?: [number, number, number];
  size: [number, number, number];
  color?: string;
  radius?: number;
}) {
  return (
    <RoundedBox
      position={at}
      args={size}
      radius={radius}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.35}
        roughness={0.3}
        clearcoat={0.6}
      />
    </RoundedBox>
  );
}
function Robot({
  active,
  running,
  onClick,
}: {
  active: boolean;
  running: boolean;
  onClick: () => void;
}) {
  const body = useRef<Group>(null),
    lid = useRef<Group>(null),
    wheels = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (running) time.current += Math.min(dt, 0.04);
    if (body.current)
      body.current.position.x =
        -1.8 + (running ? Math.sin(time.current * 0.65) * 0.35 : 0);
    if (lid.current)
      lid.current.rotation.z = MathUtils.damp(
        lid.current.rotation.z,
        active ? 0.55 : 0,
        5,
        dt,
      );
    if (wheels.current && running)
      wheels.current.children.forEach(
        (w) => (w.rotation.z -= dt * Math.cos(time.current * 0.65) * 0.875),
      );
  });
  return (
    <group
      ref={body}
      position={[-1.8, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Part at={[0, 0.48, 0]} size={[1.7, 0.38, 1.1]} color="#1a2943" />
      <Part at={[0, 0.85, 0]} size={[1.65, 0.72, 1.08]} radius={0.2} />
      <Part
        at={[0.79, 0.81, 0]}
        size={[0.06, 0.22, 0.84]}
        color="#101b30"
        radius={0.025}
      />
      {[-0.24, 0.24].map((z) => (
        <mesh key={z} position={[0.83, 0.83, z]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 24]} />
          <meshPhysicalMaterial
            color="#81dfe8"
            emissive="#629fac"
            emissiveIntensity={0.35}
            metalness={0.4}
            roughness={0.15}
          />
        </mesh>
      ))}
      <Part
        at={[0, 1.205, 0]}
        size={[1.38, 0.025, 0.86]}
        color="#25323a"
        radius={0.06}
      />
      <Part
        at={[-0.72, 1.16, 0]}
        size={[0.07, 0.1, 0.74]}
        color="#7e939a"
        radius={0.025}
      />
      <group ref={lid} position={[-0.73, 1.25, 0]}>
        <Part
          at={[0.73, -0.045, 0]}
          size={[1.38, 0.035, 0.82]}
          color="#abbab9"
          radius={0.03}
        />
        <Part
          at={[0.73, 0, 0]}
          size={[1.58, 0.1, 1.02]}
          color="#eff4f6"
          radius={0.045}
        />
        <Part
          at={[0.72, 0.065, 0]}
          size={[0.36, 0.04, 0.12]}
          color="#567184"
          radius={0.02}
        />
      </group>
      <group ref={wheels}>
        {[-0.59, 0, 0.59].flatMap((x) =>
          [-0.59, 0.59].map((z) => (
            <group key={`${x}${z}`} position={[x, 0.3, z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.26, 0.15, 32]} />
                <meshStandardMaterial color="#0d172a" roughness={0.85} />
              </mesh>
              <mesh
                position={[0, 0, Math.sign(z) * 0.08]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.14, 0.14, 0.025, 24]} />
                <meshStandardMaterial
                  color="#697d98"
                  metalness={0.75}
                  roughness={0.28}
                />
              </mesh>
              {Array.from({ length: 18 }, (_, i) => (
                <group key={i} rotation={[0, 0, (i * Math.PI) / 9]}>
                  <mesh position={[0, 0.255, 0]}>
                    <boxGeometry args={[0.035, 0.019, 0.155]} />
                    <meshStandardMaterial color="#26323a" roughness={0.95} />
                  </mesh>
                </group>
              ))}
              <mesh position={[0, 0, Math.sign(z) * 0.091]}>
                <torusGeometry args={[0.197, 0.009, 6, 40]} />
                <meshStandardMaterial color="#35414a" roughness={0.9} />
              </mesh>
              <Part
                at={[0.05, 0.03, Math.sign(z) * 0.1]}
                size={[0.13, 0.04, 0.02]}
                radius={0.01}
                color="#a5dce7"
              />
            </group>
          )),
        )}
      </group>
      <Part
        at={[-0.58, 1.59, -0.33]}
        size={[0.035, 0.85, 0.035]}
        color="#91a4bd"
        radius={0.01}
      />
      <Part
        at={[-0.38, 1.92, -0.33]}
        size={[0.42, 0.22, 0.025]}
        color="#df9463"
        radius={0.015}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Line
            points={[
              [-0.62, 1.07, side * 0.548],
              [0.58, 1.07, side * 0.548],
            ]}
            color="#a6b4b9"
            lineWidth={0.8}
          />
          {[-0.5, 0.5].map((x) => (
            <mesh key={x} position={[x, 0.62, side * 0.557]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshStandardMaterial
                color="#809399"
                metalness={0.8}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      ))}
      <Line
        points={[
          [-0.5, 0.71, 0.552],
          [0.48, 0.71, 0.552],
        ]}
        color="#9fbbcc"
        lineWidth={1}
      />
    </group>
  );
}
function Music({
  active,
  running,
  onClick,
}: {
  active: boolean;
  running: boolean;
  onClick: () => void;
}) {
  const bars = useRef<Group>(null),
    record = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (running) time.current += Math.min(dt, 0.04);
    if (record.current && running) record.current.rotation.y += dt * 0.8;
    if (bars.current)
      bars.current.children.forEach((m, i) => {
        const target = running
          ? 0.3 + Math.abs(Math.sin(i * 0.65 + time.current * 2)) * 1.1
          : 0.22 + Math.abs(Math.sin(i * 0.85)) * (active ? 1 : 0.55);
        m.scale.y = MathUtils.damp(m.scale.y, target, 6, dt);
        m.position.y = 0.2 + m.scale.y / 2;
      });
  });
  return (
    <group
      position={[1.65, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Part
        at={[0, 0.22, 0]}
        size={[2.45, 0.3, 2.15]}
        color="#a38e73"
        radius={0.12}
      />
      {[-0.92, 0.92].flatMap((x) =>
        [-0.77, 0.77].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.035, z]}>
            <cylinderGeometry args={[0.13, 0.15, 0.15, 24]} />
            <meshStandardMaterial color="#101c23" roughness={0.7} />
          </mesh>
        )),
      )}
      <mesh position={[-0.2, 0.38, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.07, 80]} />
        <meshStandardMaterial
          color="#b6c1c4"
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0.88, 0.49, -0.72]}>
        <cylinderGeometry args={[0.13, 0.14, 0.18, 32]} />
        <meshStandardMaterial
          color="#d7d1c3"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      {[0.3, 0.58].map((x) => (
        <mesh key={x} position={[x, 0.4, 0.77]}>
          <cylinderGeometry args={[0.05, 0.05, 0.065, 24]} />
          <meshStandardMaterial
            color="#2e4049"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      <group ref={record} position={[-0.2, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.84, 0.84, 0.055, 80]} />
          <meshPhysicalMaterial
            color="#142033"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {[0.42, 0.5, 0.58, 0.66, 0.74, 0.8].map((r) => (
          <mesh key={r} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
            <torusGeometry args={[r, 0.004, 6, 80]} />
            <meshStandardMaterial
              color="#34434b"
              metalness={0.65}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.036, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.01, 48]} />
          <meshStandardMaterial color="#d0aa7c" roughness={0.5} />
        </mesh>
        <Part
          at={[0.1, 0.05, 0.04]}
          size={[0.08, 0.01, 0.13]}
          color="#efd0ad"
          radius={0.005}
        />
      </group>
      <mesh position={[-0.2, 0.49, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
        <meshStandardMaterial
          color="#cbd3d0"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
      <Part
        at={[0.92, 0.53, -0.79]}
        size={[0.16, 0.12, 0.27]}
        color="#6c777a"
        radius={0.025}
      />
      <Line
        points={[
          [0.88, 0.5, -0.72],
          [0.88, 0.58, -0.37],
          [0.45, 0.58, 0.25],
          [0.25, 0.54, 0.28],
        ]}
        color="#d5dded"
        lineWidth={3}
      />
      <Part
        at={[0.2, 0.53, 0.27]}
        size={[0.16, 0.09, 0.09]}
        color="#ebc7a4"
        radius={0.02}
      />
      <group ref={bars} position={[0, 0, -1.35]}>
        {Array.from({ length: 15 }, (_, i) => (
          <mesh key={i} position={[-1.1 + i * 0.16, 0.5, 0]} castShadow>
            <boxGeometry args={[0.055, 1, 0.09]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#c6aa88" : "#8db4c0"}
              emissive="#7396b9"
              emissiveIntensity={0.15}
              metalness={0.45}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>
      <mesh position={[0.9, 0.4, 0.7]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
        <meshStandardMaterial
          color="#83e8ef"
          emissive="#69b3bf"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
function Workbench(props: Props) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.min(size.width / 7.4, size.height / 4.9);
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[-4, 8, 5]}
        intensity={3}
        color="#dceeff"
        castShadow
      />
      <Environment resolution={64}>
        <Lightformer position={[0, 5, 2]} scale={[8, 4, 1]} intensity={3} />
        <Lightformer
          position={[4, 2, -2]}
          color="#d4c2a2"
          scale={[5, 4, 1]}
          intensity={2}
        />
      </Environment>
      <group position={[0, -0.6, 0]}>
        <Part
          at={[-1.8, -0.09, 0]}
          size={[3.2, 0.18, 2.55]}
          color="#40555e"
          radius={0.1}
        />
        <Part
          at={[1.65, -0.09, -0.12]}
          size={[2.95, 0.18, 3.05]}
          color="#45565b"
          radius={0.1}
        />
        <Part
          at={[-0.03, -0.13, 0]}
          size={[0.55, 0.1, 1]}
          color="#72868c"
          radius={0.03}
        />
        {[-1, 1].map((z) => (
          <Line
            key={z}
            points={[
              [-3.13, 0.012, z * 0.83],
              [-0.47, 0.012, z * 0.83],
            ]}
            color={props.focus === "robotics" ? "#dfad83" : "#738f97"}
            lineWidth={1.3}
          />
        ))}
        {[-1.8, 1.65].flatMap((x) =>
          [-1, 1].map((z) => (
            <mesh
              key={`${x}${z}`}
              position={[x - 1.22, 0.016, z * (x < 0 ? 1.05 : 1.26)]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.034, 12]} />
              <meshStandardMaterial
                color="#bdc7c7"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          )),
        )}
        <Line
          points={[
            [0.3, 0.016, 1.27],
            [2.98, 0.016, 1.27],
          ]}
          color={props.focus === "music" ? "#dfad83" : "#738f97"}
          lineWidth={1.3}
        />
        <Robot
          active={props.focus === "robotics"}
          running={props.running && !props.paused && props.focus !== "music"}
          onClick={() => props.onFocus("robotics")}
        />
        <Music
          active={props.focus === "music"}
          running={props.running && !props.paused && props.focus !== "robotics"}
          onClick={() => props.onFocus("music")}
        />
      </group>
      <ContactShadows
        position={[0, -0.81, 0]}
        opacity={0.5}
        scale={12}
        blur={2.5}
        far={5}
        color="#030a18"
        resolution={256}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.55}
        maxPolarAngle={1.25}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.7}
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
      <div className="workbench-fallback">
        <span>Delivery robotics</span>
        <span>Music & AI</span>
        <p>Explore these chapters using the controls below.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function MotionScene(props: Props) {
  return (
    <Boundary>
      <Canvas
        orthographic
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.5, 5.8, 9], zoom: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Workbench {...props} />
        </Suspense>
      </Canvas>
    </Boundary>
  );
}

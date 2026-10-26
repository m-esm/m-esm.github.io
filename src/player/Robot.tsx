import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group, TorusGeometry, MathUtils } from "three";
import { Box, Cyl, Beam, Bake, mat } from "../world/kit";
import { palette as p } from "../world/layout";
const tire = new TorusGeometry(0.166, 0.065, 8, 24);
const eyeRing = new TorusGeometry(0.054, 0.01, 6, 20);
function Wheel({ side }: { side: number }) {
  return (
    <Bake>
      <mesh
        geometry={tire}
        material={mat("#252a29")}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      />
      <Cyl
        size={[0.155, 0.145, 0.155]}
        rotation={[0, 0, Math.PI / 2]}
        color="#8d9e9c"
      />
      <Cyl
        size={[0.108, 0.159, 0.108]}
        rotation={[0, 0, Math.PI / 2]}
        color={p.slate}
      />
      <Cyl
        size={[0.05, 0.18, 0.05]}
        rotation={[0, 0, Math.PI / 2]}
        color={p.orange}
      />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i * Math.PI * 2) / 14;
        return (
          <Box
            key={i}
            at={[0, Math.cos(a) * 0.221, Math.sin(a) * 0.221]}
            size={[0.15, 0.026, 0.067]}
            rotation={[a, 0, 0]}
            color="#303733"
            round
          />
        );
      })}
      {Array.from({ length: 5 }, (_, i) => (
        <Cyl
          key={i}
          at={[
            side * 0.083,
            Math.cos((i * Math.PI * 2) / 5) * 0.079,
            Math.sin((i * Math.PI * 2) / 5) * 0.079,
          ]}
          size={[0.012, 0.018, 0.012]}
          rotation={[0, 0, Math.PI / 2]}
          color={p.metal}
        />
      ))}
    </Bake>
  );
}
export function Robot({
  travel,
  small = false,
  reduced = false,
}: {
  travel?: { current: number };
  small?: boolean;
  reduced?: boolean;
}) {
  const wheels = useRef<Group>(null),
    body = useRef<Group>(null),
    last = useRef(0),
    lastSpeed = useRef(0);
  useFrame((_, dt) => {
    if (wheels.current && travel)
      wheels.current.children.forEach(
        (w) => (w.rotation.x = travel.current / 0.225),
      );
    if (body.current && travel && dt > 0) {
      const speed = (travel.current - last.current) / dt;
      const tilt = reduced
        ? 0
        : MathUtils.clamp((speed - lastSpeed.current) * -0.004, -0.035, 0.035);
      body.current.rotation.x = MathUtils.damp(
        body.current.rotation.x,
        tilt,
        8,
        dt,
      );
      last.current = travel.current;
      lastSpeed.current = speed;
    }
  });
  return (
    <group scale={small ? 0.38 : 1}>
      <Bake>
        <Box
          at={[0, 0.27, 0]}
          size={[0.52, 0.12, 0.87]}
          color="#222f37"
          round
        />
        {[-1, 1].flatMap((side) =>
          [-0.34, 0.34].map((z) => (
            <group key={`${side}${z}`}>
              <Beam
                from={[side * 0.2, 0.31, z]}
                to={[side * 0.45, 0.235, z]}
                r={0.047}
                color="#8d9e9c"
              />
              <Beam
                from={[side * 0.32, 0.29, z - 0.09]}
                to={[side * 0.32, 0.47, z + 0.03]}
                r={0.024}
                color={p.orange}
              />
              <Box
                at={[side * 0.43, 0.51, z]}
                size={[0.25, 0.055, 0.46]}
                color={p.slate}
                round
              />
              <Box
                at={[side * 0.43, 0.544, z]}
                size={[0.15, 0.012, 0.25]}
                color={side < 0 ? p.orange : p.metal}
              />
            </group>
          )),
        )}
      </Bake>
      <group ref={wheels}>
        {[-1, 1].flatMap((side) =>
          [-0.34, 0.34].map((z) => (
            <group position={[side * 0.44, 0.235, z]} key={`${side}${z}`}>
              <Wheel side={side} />
            </group>
          )),
        )}
      </group>
      <group ref={body}>
        <Bake>
          <Box
            at={[0, 0.44, 0]}
            size={[0.76, 0.32, 1.04]}
            color={p.slate}
            round
          />
          <Box
            at={[0, 0.655, -0.015]}
            size={[0.65, 0.19, 0.83]}
            color={p.chalk}
            round
          />
          <Box
            at={[0, 0.75, -0.045]}
            size={[0.45, 0.025, 0.6]}
            color="#aab9af"
            round
          />
          <Box
            at={[0, 0.771, -0.045]}
            size={[0.4, 0.017, 0.55]}
            color={p.chalk}
            round
          />
          <Box
            at={[0, 0.785, 0.13]}
            size={[0.21, 0.012, 0.05]}
            color={p.orange}
          />
          <Beam
            from={[-0.065, 0.8, 0.13]}
            to={[0.065, 0.8, 0.13]}
            r={0.012}
            color={p.slate}
          />
          <Box
            at={[-0.39, 0.43, 0.12]}
            size={[0.035, 0.24, 0.49]}
            color={p.orange}
            round
          />
          <Box
            at={[0.4, 0.51, 0.16]}
            size={[0.15, 0.27, 0.36]}
            color={p.green}
            round
          />
          {[-0.11, 0.12].map((z) => (
            <Box
              key={z}
              at={[0.482, 0.52, z + 0.15]}
              size={[0.018, 0.28, 0.035]}
              color="#4b6554"
            />
          ))}
          <Box
            at={[0.49, 0.58, 0.16]}
            size={[0.018, 0.06, 0.15]}
            color="#a0b39b"
          />
          {[-0.34, 0.34].flatMap((x) =>
            [-0.4, 0.4].map((z) => (
              <Cyl
                key={`${x}${z}`}
                at={[x, 0.6, z]}
                size={[0.018, 0.025, 0.018]}
                color="#8d9e9c"
              />
            )),
          )}
          {Array.from({ length: 5 }, (_, i) => (
            <Box
              key={i}
              at={[-0.22 + i * 0.11, 0.586, 0.4]}
              size={[0.063, 0.018, 0.16]}
              color="#222f37"
            />
          ))}
          <Box
            at={[0, 0.44, -0.545]}
            size={[0.61, 0.12, 0.065]}
            color="#222f37"
            round
          />
          {[-0.2, 0.2].map((x) => (
            <group key={x}>
              <Box
                at={[x, 0.455, -0.585]}
                size={[0.14, 0.065, 0.02]}
                color="#b6e4df"
                round
              />
              <Box
                at={[x, 0.365, 0.54]}
                size={[0.12, 0.035, 0.025]}
                color={p.orange}
              />
            </group>
          ))}
          <Box
            at={[0, 0.31, 0.54]}
            size={[0.54, 0.065, 0.06]}
            color="#8d9e9c"
            round
          />
          <Cyl
            at={[0, 0.31, 0.59]}
            size={[0.04, 0.045, 0.04]}
            rotation={[Math.PI / 2, 0, 0]}
            color={p.slate}
          />
          <Beam
            from={[0.13, 0.72, -0.27]}
            to={[0.13, 1.08, -0.27]}
            r={0.035}
            color="#8d9e9c"
          />
          <Cyl
            at={[0.13, 0.79, -0.27]}
            size={[0.052, 0.08, 0.052]}
            color={p.slate}
          />
          <Box
            at={[0.13, 1.105, -0.29]}
            size={[0.29, 0.18, 0.22]}
            color={p.slate}
            round
          />
          <Box
            at={[0.13, 1.11, -0.415]}
            size={[0.26, 0.15, 0.06]}
            color="#222f37"
            round
          />
          <Cyl
            at={[0.13, 1.12, -0.452]}
            size={[0.056, 0.03, 0.056]}
            rotation={[Math.PI / 2, 0, 0]}
            color="#355a68"
          />
          <mesh
            position={[0.13, 1.12, -0.471]}
            geometry={eyeRing}
            material={mat("#8d9e9c")}
          />
          <Box
            at={[0.13, 1.211, -0.34]}
            size={[0.32, 0.025, 0.27]}
            color={p.chalk}
            round
          />
          <Cyl
            at={[-0.2, 0.78, 0.24]}
            size={[0.075, 0.05, 0.075]}
            color={p.slate}
          />
          <Beam
            from={[-0.19, 0.8, 0.24]}
            to={[-0.22, 1.01, 0.05]}
            r={0.045}
            color={p.orange}
          />
          <Cyl
            at={[-0.22, 1.01, 0.05]}
            size={[0.065, 0.09, 0.065]}
            rotation={[0, 0, Math.PI / 2]}
            color={p.slate}
          />
          <Beam
            from={[-0.22, 1.01, 0.05]}
            to={[-0.26, 0.79, -0.14]}
            r={0.035}
            color="#8d9e9c"
          />
          <Box
            at={[-0.26, 0.79, -0.16]}
            size={[0.14, 0.09, 0.18]}
            color={p.slate}
            round
          />
          <Beam
            from={[0.26, 0.76, 0.27]}
            to={[0.29, 1.16, 0.3]}
            r={0.009}
            color={p.slate}
          />
          <Cyl
            at={[0.29, 1.17, 0.3]}
            size={[0.015, 0.025, 0.015]}
            color={p.orange}
          />
        </Bake>
        {!small && (
          <Text
            position={[0, 0.46, 0.53]}
            font="/assets/plex-sans.woff"
            fontSize={0.075}
            color={p.chalk}
            anchorX="center"
          >
            M 07
          </Text>
        )}
      </group>
    </group>
  );
}

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { Bake, Beam, Box, Cyl, Planter, Rail } from "./kit";
import type { V3 } from "./kit";
import { palette as p, boards } from "./layout";
const slope = -Math.atan(3 / 22),
  rampLength = Math.hypot(22, 3);
export function Label({
  at,
  children,
  size = 0.35,
  color = p.slate,
  rotation = [0, 0, 0],
}: {
  at: V3;
  children: string;
  size?: number;
  color?: string;
  rotation?: V3;
}) {
  return (
    <Text
      position={at}
      rotation={rotation}
      font="/assets/plex-sans.woff"
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 /.'"
      fontSize={size}
      color={color}
      anchorX="center"
    >
      {children}
    </Text>
  );
}
export function Settlement() {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[38, 0.4, 34.5]} position={[0, -0.4, -5.5]} />
        <CuboidCollider args={[15, 1.5, 6]} position={[0, 1.5, 20]} />
        <CuboidCollider
          args={[3, 0.18, rampLength / 2 + 0.04]}
          position={[-5, 1.32, 3]}
          rotation={[slope, 0, 0]}
        />
        {/* Arrival perimeter, with a six-meter opening onto the ramp. */}
        <CuboidCollider args={[15, 0.6, 0.1]} position={[0, 3.6, 26]} />
        <CuboidCollider args={[0.1, 0.6, 6]} position={[-15, 3.6, 20]} />
        <CuboidCollider args={[0.1, 0.6, 3]} position={[15, 3.6, 17]} />
        <CuboidCollider args={[3.5, 0.6, 0.1]} position={[-11.5, 3.6, 14]} />
        <CuboidCollider args={[8.5, 0.6, 0.1]} position={[6.5, 3.6, 14]} />
        {/* Solid sides stop shortcuts off the raised terrace. */}
        <CuboidCollider
          args={[0.12, 0.65, rampLength / 2]}
          position={[-8, 2.1, 3]}
          rotation={[slope, 0, 0]}
        />
        <CuboidCollider
          args={[0.12, 0.65, rampLength / 2]}
          position={[-2, 2.1, 3]}
          rotation={[slope, 0, 0]}
        />
        {[
          [0, 0, 29, 38, 0.6, 0.1],
          [0, 0, -40, 38, 0.6, 0.1],
          [-38, 0, -5.5, 0.1, 0.6, 34.5],
          [38, 0, -5.5, 0.1, 0.6, 34.5],
        ].map(([x, y, z, w, h, d], i) => (
          <CuboidCollider key={i} args={[w, h, d]} position={[x, y + h, z]} />
        ))}
        {/* Major objects alone collide; no decorative foliage or glass colliders. */}
        <CuboidCollider args={[3.5, 0.8, 1.5]} position={[-7, 0.8, -14]} />
        <CuboidCollider args={[2.1, 0.65, 0.8]} position={[-17, 0.65, -16]} />
        {[-12, 2].map((x) => (
          <CuboidCollider
            key={x}
            args={[0.18, 3, 0.18]}
            position={[x, 3, -5]}
          />
        ))}
        <CuboidCollider args={[7.4, 0.22, 1.2]} position={[-5, 6, -5]} />
        {boards.map((board) => (
          <CuboidCollider
            key={board.id}
            args={[board.size[0] / 2 + 0.1, board.size[1] / 2, 0.18]}
            position={board.position}
          />
        ))}
        <CuboidCollider args={[2.1, 1.3, 0.6]} position={[10, 1.3, -12]} />
      </RigidBody>
      <Bake>
        <Box at={[0, -0.18, -5.5]} size={[76, 0.36, 69]} color="#b2bab1" />
        <Box at={[0, 1.43, 20]} size={[30, 3.06, 12]} color="#99a7a4" round />
        <Box at={[0, 2.97, 20]} size={[30, 0.12, 12]} color="#c4cbc3" />
        <Box
          at={[-5, 1.32, 3]}
          size={[6, 0.36, rampLength]}
          rotation={[slope, 0, 0]}
          color="#bec7bf"
        />
        <Box
          at={[-5, 1.55, 3]}
          size={[0.08, 0.02, rampLength - 0.3]}
          rotation={[slope, 0, 0]}
          color={p.chalk}
        />
        <Box
          at={[-5, -0.12, -16]}
          size={[32, 0.24, 16]}
          color="#c1c9c0"
          round
        />
        {/* Expansion joints, service channels and foot-worn edge strips. */}
        {[-12, -6, 0, 6, 12].map((x) => (
          <Box
            key={x}
            at={[x, 3.037, 20]}
            size={[0.025, 0.008, 11.8]}
            color="#a6b0a8"
          />
        ))}
        {[16, 22].map((z) => (
          <Box
            key={z}
            at={[0, 3.037, z]}
            size={[29.8, 0.008, 0.025]}
            color="#a6b0a8"
          />
        ))}
        {[-22, -18, -10].map((z) => (
          <Box
            key={z}
            at={[-5, 0.012, z]}
            size={[31.7, 0.01, 0.035]}
            color="#9baaa1"
          />
        ))}
        <Box at={[-19, 0.015, -13]} size={[0.35, 0.02, 21]} color={p.slate} />
        {Array.from({ length: 25 }, (_, i) => (
          <Box
            key={i}
            at={[-19, 0.03, -23 + i * 0.82]}
            size={[0.37, 0.03, 0.06]}
            color={p.metal}
          />
        ))}
        <Rail a={[-15, 3, 26]} b={[15, 3, 26]} />
        <Rail a={[-15, 3, 14]} b={[-15, 3, 26]} />
        <Rail a={[15, 3, 14]} b={[15, 3, 20]} />
        <Rail a={[-15, 3, 14]} b={[-8, 3, 14]} />
        <Rail a={[-2, 3, 14]} b={[15, 3, 14]} />
        <Rail a={[-8, 0, -8]} b={[-8, 3, 14]} />
        <Rail a={[-2, 0, -8]} b={[-2, 3, 14]} />
        <Rail a={[-38, 0, -40]} b={[38, 0, -40]} />
        <Rail a={[-38, 0, -40]} b={[-38, 0, 29]} />
        <Rail a={[38, 0, -40]} b={[38, 0, 29]} />
        <Planter at={[-11, 3, 14.8]} long={5} />
        <Planter at={[11.7, 3, 24.7]} long={5} />
        <Planter at={[-12, 3, 24.7]} long={3} />
        <Planter at={[8, 0, -24]} long={6} />
        <Planter at={[-18, 0, -24]} long={4} />
        {/* Raised overhead service bridge: 5.78 m clear at its center. */}
        {[-12, 2].map((x) => (
          <group key={x}>
            <Box at={[x, 3, -5]} size={[0.32, 6, 0.32]} color={p.slate} />
            <Box
              at={[x, 0.15, -5]}
              size={[0.65, 0.3, 0.65]}
              color={p.slate}
              round
            />
          </group>
        ))}
        <Box at={[-5, 6, -5]} size={[14.8, 0.44, 2.4]} color={p.slate} round />
        <Box at={[-5, 6.25, -5]} size={[14.6, 0.12, 2.1]} color={p.metal} />
        <Rail a={[-12, 6.3, -6]} b={[2, 6.3, -6]} />
        <Rail a={[-12, 6.3, -4]} b={[2, 6.3, -4]} />
        <Beam
          from={[-12, 5.7, -4]}
          to={[2, 5.7, -4]}
          r={0.1}
          color={p.orange}
        />
        <Box
          at={[-5, 5.4, -3.77]}
          size={[5.8, 0.75, 0.16]}
          color={p.chalk}
          round
        />
        {/* Exhibit canopy is high, partial and open to the dome. */}
        {[-19, 4].map((x) => (
          <group key={x}>
            <Box at={[x, 3.9, -23]} size={[0.19, 7.8, 0.19]} color={p.slate} />
            <Box at={[x, 7.8, -20]} size={[0.19, 0.2, 6]} color={p.slate} />
          </group>
        ))}
        <Box
          at={[-7.5, 7.9, -21.5]}
          size={[23.4, 0.25, 3.5]}
          color={p.metal}
          round
        />
        <Box
          at={[-7.5, 8.05, -21.5]}
          size={[23.3, 0.08, 3.3]}
          color={p.green}
        />
        <Beam
          from={[-19, 7.8, -18]}
          to={[4, 7.8, -18]}
          r={0.08}
          color={p.slate}
        />
        {/* Lived-in workbench: useful clutter, no fictional personal correspondence. */}
        <Box
          at={[-17, 1.15, -16]}
          size={[3.6, 0.15, 1.3]}
          color="#9b8e6c"
          round
        />
        {[-18.4, -15.6].map((x) => (
          <Box
            key={x}
            at={[x, 0.55, -16]}
            size={[0.13, 1.1, 1.1]}
            color={p.slate}
          />
        ))}
        <Box
          at={[-17.2, 1.29, -16]}
          size={[1, 0.12, 0.5]}
          color={p.slate}
          round
        />
        <Cyl
          at={[-18.1, 1.4, -16.2]}
          size={[0.13, 0.35, 0.13]}
          color={p.chalk}
        />
        <Cyl
          at={[-18.1, 1.58, -16.2]}
          size={[0.105, 0.01, 0.105]}
          color="#484a3c"
        />
        <Box at={[-17, 1.4, -16.06]} size={[0.06, 0.1, 0.4]} color={p.orange} />
        <Box at={[-16.7, 1.4, -16]} size={[0.06, 0.1, 0.35]} color={p.metal} />
        <Box
          at={[-16, 0.55, -14.5]}
          size={[0.75, 0.15, 0.75]}
          color={p.slate}
          round
        />
        <Box
          at={[-16, 1.05, -14.17]}
          size={[0.75, 1, 0.12]}
          color={p.metal}
          round
        />
        <Box
          at={[-16, 1.3, -14.05]}
          size={[0.85, 0.8, 0.12]}
          color="#6f8676"
          round
        />
        <Box
          at={[-16.43, 1.04, -14.05]}
          size={[0.25, 0.6, 0.18]}
          color="#6f8676"
          round
        />
        <Box
          at={[-18.6, 0.4, -11]}
          size={[1.3, 0.8, 0.7]}
          color={p.orange}
          round
        />
        {/* A quiet service cabinet and angled ventilation slats. */}
        <Box at={[10, 1.3, -12]} size={[4.2, 2.6, 1.2]} color={p.metal} round />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box
            key={i}
            at={[10, 1.2 + i * 0.17, -11.38]}
            size={[3.5, 0.055, 0.08]}
            color={p.slate}
          />
        ))}
        <Cyl at={[11, 2.8, -12]} size={[0.28, 0.45, 0.28]} />
      </Bake>
      <Label at={[-5, 5.4, -3.66]} size={0.35}>
        Systems / Projects
      </Label>
      <Label
        at={[-9.8, 3.045, 23.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={0.23}
      >
        Arrival terrace
      </Label>
    </>
  );
}

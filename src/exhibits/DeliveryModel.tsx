import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Box, Beam, Cyl, Bake } from "../world/kit";
import { Label } from "../world/Settlement";
import { Robot } from "../player/Robot";
import { palette as p } from "../world/layout";
export function DeliveryModel({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  const mover = useRef<Group>(null),
    time = useRef(0),
    travel = useRef(0),
    last = useRef<[number, number] | null>(null);
  useFrame((_, dt) => {
    if (!paused && !reduced) time.current += Math.min(dt, 0.05) * 0.35;
    const t = time.current,
      x = -7 + 2.6 * Math.cos(t),
      z = -14 + Math.sin(t) * 0.8;
    if (last.current)
      travel.current +=
        Math.hypot(x - last.current[0], z - last.current[1]) / 0.38;
    last.current = [x, z];
    if (mover.current) {
      mover.current.position.set(x, 1.065, z);
      mover.current.rotation.y = -Math.atan2(
        -2.6 * Math.sin(t),
        0.8 * Math.cos(t),
      );
    }
  });
  return (
    <>
      <Bake>
        <Box at={[-7, 0.85, -14]} size={[7, 0.25, 3]} color={p.slate} round />
        <Box at={[-7, 1, -14]} size={[6.8, 0.06, 2.8]} color="#aebeb3" round />
        <Box at={[-7, 1.035, -14]} size={[6.6, 0.015, 2.58]} color={p.chalk} />
        {[-10, -4].map((x) => (
          <group key={x}>
            <Box at={[x, 0.4, -14]} size={[0.18, 0.8, 2.6]} color={p.slate} />
            <Box
              at={[x, 0.08, -14]}
              size={[0.45, 0.15, 2.8]}
              color={p.slate}
              round
            />
            {[-15.15, -12.85].map((z) => (
              <Cyl
                key={z}
                at={[x, 0.18, z]}
                size={[0.055, 0.07, 0.055]}
                color={p.metal}
              />
            ))}
          </group>
        ))}
        <Beam
          from={[-10, 0.35, -14]}
          to={[-4, 0.35, -14]}
          r={0.065}
          color={p.orange}
        />
        <Box
          at={[-7, 0.65, -12.49]}
          size={[6.2, 0.08, 0.045]}
          color="#8d9e9c"
        />
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i * Math.PI * 2) / 48,
            b = ((i + 1) * Math.PI * 2) / 48;
          return (
            <group key={i}>
              <Beam
                from={[-7 + 2.6 * Math.cos(a), 1.052, -14 + 0.8 * Math.sin(a)]}
                to={[-7 + 2.6 * Math.cos(b), 1.052, -14 + 0.8 * Math.sin(b)]}
                r={0.035}
                color={p.slate}
              />
              {i % 3 === 0 && (
                <Cyl
                  at={[-7 + 2.6 * Math.cos(a), 1.09, -14 + 0.8 * Math.sin(a)]}
                  size={[0.018, 0.025, 0.018]}
                  color={p.orange}
                />
              )}
            </group>
          );
        })}
        {[-9.5, -7, -4.5].map((x, i) => (
          <group key={x}>
            <Box
              at={[x, 1.16, -15.15]}
              size={[0.8, 0.23, 0.4]}
              color={i === 1 ? p.blue : p.green}
              round
            />
            <Box
              at={[x, 1.46, -15.19]}
              size={[0.55, 0.38, 0.3]}
              color={p.metal}
              round
            />
            <Box
              at={[x, 1.47, -15.025]}
              size={[0.44, 0.18, 0.025]}
              color="#355a68"
            />
            <Box
              at={[x, 1.7, -15.19]}
              size={[0.64, 0.1, 0.36]}
              color={p.slate}
              round
            />
            <Box
              at={[x - 0.18, 1.4, -14.99]}
              size={[0.04, 0.06, 0.02]}
              color="#b6e4df"
            />
            <Cyl
              at={[x + 0.18, 1.77, -15.19]}
              size={[0.025, 0.07, 0.025]}
              color={p.orange}
            />
            <Box
              at={[x, 1.96, -15.08]}
              size={[1.15, 0.32, 0.07]}
              color={p.chalk}
              round
            />
            <Cyl
              at={[x, 1.76, -15.14]}
              size={[0.018, 0.24, 0.018]}
              color={p.slate}
            />
            <Beam
              from={[x, 1.055, -15]}
              to={[x, 1.055, -14.83]}
              r={0.02}
              color={p.orange}
            />
          </group>
        ))}
        {[-8.2, -6, -5.6].map((x, i) => (
          <group key={x}>
            <Box
              at={[x, 1.13, -14]}
              size={[0.38, 0.16, 0.4]}
              color={i % 2 ? p.metal : p.green}
              round
            />
            <Box
              at={[x, 1.23, -14]}
              size={[0.44, 0.06, 0.45]}
              color={p.slate}
            />
            <Box
              at={[x, 1.15, -13.79]}
              size={[0.2, 0.07, 0.015]}
              color="#355a68"
            />
          </group>
        ))}
        <Box
          at={[-7, 1.42, -12.51]}
          size={[4.8, 0.4, 0.12]}
          color={p.chalk}
          round
        />
        {[-10.27, -3.73].flatMap((x) =>
          [-15.28, -12.72].map((z) => (
            <Cyl
              key={`${x}${z}`}
              at={[x, 1.045, z]}
              size={[0.035, 0.025, 0.035]}
              color={p.slate}
            />
          )),
        )}
      </Bake>
      <group ref={mover}>
        <Robot small reduced={reduced} travel={travel} />
      </group>
      <Label at={[-7, 1.42, -12.44]} size={0.23}>
        Illustrative delivery flow
      </Label>
      <Label at={[-9.5, 1.96, -15.035]} size={0.15}>
        Partner
      </Label>
      <Label at={[-7, 1.96, -15.035]} size={0.15}>
        Platform
      </Label>
      <Label at={[-4.5, 1.96, -15.035]} size={0.15}>
        Status
      </Label>
    </>
  );
}

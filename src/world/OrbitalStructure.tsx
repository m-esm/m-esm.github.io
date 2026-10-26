import { Bake, Beam, Box, Cyl, mat } from "./kit";
import { palette as p } from "./layout";

// The habitat ends at a pressure flange. Everything beyond it is exposed hardware.
export function OrbitalStructure() {
  return (
    <>
      <mesh position={[0, -4.7, -2]} receiveShadow material={mat("#46565d")}>
        <cylinderGeometry args={[62, 59, 8, 96]} />
      </mesh>
      <mesh position={[0, -0.62, -2]} receiveShadow material={mat("#9ca9a5")}>
        <cylinderGeometry args={[61.9, 61.9, 0.18, 96]} />
      </mesh>
      {[-1, -7.9].map((y) => (
        <mesh
          key={y}
          position={[0, y, -2]}
          rotation={[Math.PI / 2, 0, 0]}
          material={mat("#a8b5b5")}
        >
          <torusGeometry args={[61.9, 0.3, 8, 128]} />
        </mesh>
      ))}
      <Bake>
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i * Math.PI) / 24;
          return (
            <group
              key={i}
              position={[Math.cos(a) * 61.7, -4.4, Math.sin(a) * 61.7 - 2]}
              rotation={[0, -a, 0]}
            >
              <Box size={[0.65, 6.5, 0.28]} color="#75878b" />
              <Box
                at={[0.12, 2.6, 0]}
                size={[0.85, 0.28, 0.9]}
                color={p.slate}
                round
              />
              <Box
                at={[0.25, -1.8, 0]}
                size={[0.18, 1.3, 0.9]}
                color={i % 6 === 0 ? p.orange : "#aeb8b1"}
              />
            </group>
          );
        })}
        {/* Paired articulated solar wings are raised just above the habitat horizon. */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <Beam
              from={[side * 49, -5, -36]}
              to={[side * 89, 5, -56]}
              r={0.2}
              color={p.slate}
            />
            <Beam
              from={[side * 49, -7, -36]}
              to={[side * 89, 3, -56]}
              r={0.2}
              color={p.slate}
            />
            {Array.from({ length: 8 }, (_, i) => {
              const x = side * (51 + i * 5),
                y = -4.5 + i * 1.25,
                z = -37 - i * 2.5;
              return (
                <group key={i}>
                  <Beam from={[x, y, z]} to={[x, y - 2, z]} r={0.11} />
                  <Beam
                    from={[x, y - 2, z]}
                    to={[x + side * 5, y + 1.25, z - 2.5]}
                    r={0.075}
                    color="#a1b1b4"
                  />
                </group>
              );
            })}
            <group
              position={[side * 85, 5.2, -57]}
              rotation={[0.25, side * -0.35, -side * 0.13]}
            >
              <Cyl size={[0.65, 3, 0.65]} color="#a1b1b4" />
              <Beam
                from={[0, 0, -23]}
                to={[0, 0, 23]}
                r={0.24}
                color={p.metal}
              />
              {[-1, 1].flatMap((bank) =>
                Array.from({ length: 6 }, (_, i) => (
                  <group
                    key={`${bank}-${i}`}
                    position={[bank * 6.8, 0, -19.5 + i * 7.8]}
                  >
                    <Box size={[12.4, 0.18, 7.25]} color="#85949c" />
                    <Box
                      at={[0, 0.12, 0]}
                      size={[12, 0.05, 6.85]}
                      color="#193b56"
                    />
                    {Array.from({ length: 8 }, (_, cell) => (
                      <Box
                        key={cell}
                        at={[-5.3 + cell * 1.5, 0.153, 0]}
                        size={[0.035, 0.015, 6.8]}
                        color="#64839a"
                      />
                    ))}
                    {[-2.2, 0, 2.2].map((z) => (
                      <Box
                        key={z}
                        at={[0, 0.155, z]}
                        size={[12, 0.012, 0.025]}
                        color="#64839a"
                      />
                    ))}
                    <Beam
                      from={[-6, -0.17, -3.4]}
                      to={[6, -0.17, 3.4]}
                      r={0.06}
                      color={p.slate}
                    />
                  </group>
                )),
              )}
            </group>
          </group>
        ))}
        {/* Thermal-control fins sit below the pressure deck, never in the garden. */}
        {[-1, 1].map((side) => (
          <group
            key={`radiator-${side}`}
            position={[side * 66, -4.7, 8]}
            rotation={[0, side * 0.22, side * 0.3]}
          >
            <Box size={[10, 0.3, 27]} color={p.slate} />
            {Array.from({ length: 12 }, (_, i) => (
              <group key={i} position={[0, 0.22, -12 + i * 2.15]}>
                <Box size={[9.5, 0.16, 1.93]} color="#b1bab5" />
                <Beam
                  from={[-4.5, 0.1, 0]}
                  to={[4.5, 0.1, 0]}
                  r={0.06}
                  color="#82928e"
                />
              </group>
            ))}
          </group>
        ))}
      </Bake>
    </>
  );
}

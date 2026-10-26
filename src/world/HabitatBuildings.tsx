import { Bake, Beam, Box, Cyl, Planter } from "./kit";
import { Label } from "./Settlement";
import { palette as p } from "./layout";

const modules = [
  { at: [-38, 1, -39], label: "Materials bay", accent: p.green },
  { at: [4, 3, -47], label: "Habitat services", accent: p.blue },
  { at: [38, 6, -38], label: "Life support", accent: p.green },
  { at: [-47, 4, -14], label: "Power systems", accent: p.orange },
] as const;

export function HabitatBuildings() {
  return (
    <>
      <Bake>
        {modules.map(({ at: [x, y, z], accent }, index) => (
          <group key={index} position={[x, y, z]}>
            <Box
              at={[0, -y / 2 - 0.15, 0]}
              size={[14.5, y + 0.7, 12]}
              color="#8e9e9b"
              round
            />
            <Box at={[0, 0.23, 0]} size={[14.8, 0.22, 12.3]} color="#b0bbb4" />
            {/* An inset wall layer reveals the load-bearing frame at each joint. */}
            <Box
              at={[0, 3.1, -2]}
              size={[10.84, 5.7, 5.72]}
              color={p.slate}
              round
            />
            {Array.from({ length: 8 }, (_, i) => (
              <group key={i} position={[-4.83 + i * 1.38, 3.1, -2]}>
                <Box
                  size={[1.34, 5.5, 5.92]}
                  color={index % 2 ? "#c2cbc7" : "#b5c1ba"}
                  round
                />
                <Box
                  at={[0, -1.25, 3.02]}
                  size={[1.24, 0.045, 0.03]}
                  color="#9caca5"
                />
                <Box
                  at={[0, 2.37, 3.02]}
                  size={[1.2, 0.28, 0.055]}
                  color={accent}
                />
              </group>
            ))}
            <Box
              at={[0, 6.04, -2]}
              size={[11.65, 0.3, 6.7]}
              color={p.slate}
              round
            />
            <Box at={[0, 6.23, -2]} size={[11.2, 0.12, 6.3]} color="#91a19b" />
            {[-1, 1].map((side) => (
              <group key={side}>
                <Box
                  at={[side * 5.46, 3.1, 1.13]}
                  size={[0.22, 5.7, 0.34]}
                  color="#788c89"
                  round
                />
                <Box
                  at={[side * 5.46, 0.58, 1.12]}
                  size={[0.52, 0.65, 0.64]}
                  color={p.slate}
                  round
                />
                <Box
                  at={[0, 6.37, -2 + side * 3.07]}
                  size={[11.4, 0.24, 0.13]}
                  color={p.metal}
                />
              </group>
            ))}
            {/* Deep window reveals, separate glazing, sills and mullions. */}
            {[-3.65, -0.7].map((windowX) => (
              <group key={windowX} position={[windowX, 3.45, 1.08]}>
                <Box size={[2.65, 2.38, 0.24]} color={p.slate} round />
                <Box
                  at={[0, 0, 0.132]}
                  size={[2.39, 2.11, 0.035]}
                  color="#355a68"
                />
                <Box
                  at={[0, 0.68, 0.158]}
                  size={[2.32, 0.16, 0.018]}
                  color="#7c999b"
                />
                <Box
                  at={[0, 0, 0.18]}
                  size={[0.06, 2.14, 0.08]}
                  color={p.metal}
                />
                <Box
                  at={[0, -0.48, 0.18]}
                  size={[2.4, 0.045, 0.08]}
                  color={p.metal}
                />
                <Box
                  at={[0, -1.25, 0.09]}
                  size={[2.86, 0.15, 0.64]}
                  color="#cbd2c9"
                  round
                />
                <Box
                  at={[0, 1.3, 0.13]}
                  size={[2.98, 0.13, 0.75]}
                  color={p.metal}
                  round
                />
              </group>
            ))}
            {/* Recessed pressure door: outer jamb, gasket, leaf, viewing slit and lever. */}
            <group position={[3.05, 2.35, 1.13]}>
              <Box size={[2.4, 4.15, 0.28]} color={p.slate} round />
              <Box
                at={[0, 0, 0.15]}
                size={[2.13, 3.92, 0.04]}
                color="#687b77"
                round
              />
              <Box
                at={[0, 0, 0.19]}
                size={[1.95, 3.76, 0.055]}
                color="#b0bdb4"
                round
              />
              <Box
                at={[0, 0.68, 0.23]}
                size={[1.1, 0.68, 0.065]}
                color={p.slate}
                round
              />
              <Box
                at={[0, 0.68, 0.27]}
                size={[0.96, 0.53, 0.035]}
                color="#355a68"
              />
              <Box
                at={[0.65, -0.2, 0.27]}
                size={[0.2, 0.65, 0.09]}
                color={p.slate}
                round
              />
              <Beam
                from={[0.49, -0.1, 0.36]}
                to={[0.76, -0.1, 0.36]}
                r={0.045}
                color={p.metal}
              />
              <Box
                at={[-0.64, -0.53, 0.24]}
                size={[0.3, 0.11, 0.025]}
                color={accent}
              />
              {[-1.25, 1.25].map((height) => (
                <Box
                  key={height}
                  at={[-0.95, height, 0.23]}
                  size={[0.16, 0.35, 0.15]}
                  color={p.metal}
                  round
                />
              ))}
              <Box
                at={[0, -2.03, 0.45]}
                size={[2.8, 0.12, 1.05]}
                color={p.slate}
                round
              />
            </group>
            <Box
              at={[2.7, 4.88, 1.3]}
              size={[3.6, 0.62, 0.16]}
              color={p.chalk}
              round
            />
            <Box
              at={[2.7, 5.27, 1.36]}
              size={[3.7, 0.09, 0.38]}
              color={p.slate}
            />
            {/* Roof ventilation has housings, rain caps, louvers and anchored pipes. */}
            <group position={[-2.5, 6.4, -2.5]}>
              <Box
                at={[0, 0.5, 0]}
                size={[2.7, 0.95, 2.1]}
                color={p.metal}
                round
              />
              <Box
                at={[0, 1.01, 0]}
                size={[2.88, 0.12, 2.28]}
                color={p.slate}
                round
              />
              {Array.from({ length: 7 }, (_, i) => (
                <Box
                  key={i}
                  at={[0, 0.2 + i * 0.09, 1.07]}
                  size={[2.35, 0.035, 0.08]}
                  color="#647975"
                />
              ))}
              <Beam
                from={[1.25, 0.3, 0]}
                to={[3.5, 0.3, 0]}
                r={0.14}
                color={accent}
              />
              <Cyl at={[3.5, 0.55, 0]} size={[0.3, 1.1, 0.3]} color={p.metal} />
              <Cyl
                at={[3.5, 1.13, 0]}
                size={[0.43, 0.12, 0.43]}
                color={p.slate}
              />
            </group>
            <Planter at={[-1.5, 0.38, 4.5]} long={7.5} />
            {[-5.1, 5.1].map((footX) => (
              <group key={footX}>
                <Beam
                  from={[footX, 0.7, 1.8]}
                  to={[footX, 5.8, 1.8]}
                  r={0.075}
                  color={accent}
                />
                {[1.2, 3.2, 5.2].map((height) => (
                  <Box
                    key={height}
                    at={[footX, height, 1.59]}
                    size={[0.31, 0.14, 0.5]}
                    color={p.slate}
                  />
                ))}
              </group>
            ))}
          </group>
        ))}
      </Bake>
      {modules.map(({ at: [x, y, z], label }) => (
        <Label key={label} at={[x + 2.7, y + 4.88, z + 1.395]} size={0.28}>
          {label}
        </Label>
      ))}
    </>
  );
}

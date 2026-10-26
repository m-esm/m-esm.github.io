import { Planet, Sky } from "./Atmosphere";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { HabitatBuildings } from "./HabitatBuildings";
import { HabitatTree } from "./Landscape";
import { BackSide, PMREMGenerator } from "three";
import { OrbitalStructure } from "./OrbitalStructure";
import { Beam, Box, Cyl, Orb, Planter, Bake } from "./kit";
import { palette as p } from "./layout";
// A locally baked neutral reflection field represents the sunlit habitat around metal.
// Direct lights still set the daylight direction; no remote HDRI is loaded.
function HabitatReflections() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const map = generator.fromScene(room, 0.02);
    const previous = scene.environment;
    const intensity = scene.environmentIntensity;
    scene.environment = map.texture;
    scene.environmentIntensity = 0.22;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = previous;
      scene.environmentIntensity = intensity;
      map.dispose();
    };
  }, [gl, scene]);
  return null;
}
export function Environment({
  low,
  reduced,
}: {
  low: boolean;
  reduced: boolean;
}) {
  return (
    <>
      <HabitatReflections />
      <Sky low={low} />
      <Planet reduced={reduced} />
      <OrbitalStructure />
      <hemisphereLight args={["#dcecf3", "#8e9680", 1.3]} />
      <directionalLight
        position={[-25, 55, 24]}
        intensity={2.65}
        color="#fff0d8"
        castShadow={!low}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={44}
        shadow-camera-bottom={-42}
        shadow-bias={-0.0005}
        shadow-normalBias={0.035}
        shadow-radius={3}
      />
      <directionalLight
        position={[35, 25, -45]}
        intensity={0.65}
        color="#b5d3e3"
      />
      <Bake castShadow={false}>
        {/* A sparse pressure dome: sweeping meridians and two latitude rings. */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI) / 8;
          return Array.from({ length: 32 }, (_, j) => {
            const a = (j * Math.PI) / 32,
              b = ((j + 1) * Math.PI) / 32;
            return (
              <Beam
                key={`${i}-${j}`}
                from={[
                  Math.cos(a) * 62 * Math.cos(angle),
                  Math.sin(a) * 48 - 1,
                  Math.cos(a) * 62 * Math.sin(angle) - 2,
                ]}
                to={[
                  Math.cos(b) * 62 * Math.cos(angle),
                  Math.sin(b) * 48 - 1,
                  Math.cos(b) * 62 * Math.sin(angle) - 2,
                ]}
                r={0.075}
                color="#91a3a5"
              />
            );
          });
        })}
        {[0.5, 0.96].map((angle) =>
          Array.from({ length: 64 }, (_, j) => {
            const a = (j * Math.PI) / 32,
              b = ((j + 1) * Math.PI) / 32,
              r = 62 * Math.cos(angle),
              y = 48 * Math.sin(angle) - 1;
            return (
              <Beam
                key={`${angle}-${j}`}
                from={[r * Math.cos(a), y, r * Math.sin(a) - 2]}
                to={[r * Math.cos(b), y, r * Math.sin(b) - 2]}
                r={0.055}
                color="#a6b9b7"
              />
            );
          }),
        )}
      </Bake>
      <HabitatBuildings />
      <Bake>
        {/* Communications mast anchored beyond the main terrace. */}
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <Beam
              key={`${x}${z}`}
              from={[14 + x * 0.95, 6, -48 + z * 0.95]}
              to={[14 + x * 0.95, 16, -48 + z * 0.95]}
              r={0.1}
              color={p.slate}
            />
          )),
        )}
        {Array.from({ length: 5 }, (_, i) => (
          <group key={`tower${i}`}>
            <Beam
              from={[13.05, 6 + i * 2, -47.05]}
              to={[14.95, 8 + i * 2, -47.05]}
              r={0.045}
              color="#8d9e9c"
            />
            <Beam
              from={[14.95, 6 + i * 2, -47.05]}
              to={[13.05, 8 + i * 2, -47.05]}
              r={0.045}
              color="#8d9e9c"
            />
            <Beam
              from={[14.95, 6 + i * 2, -48.95]}
              to={[14.95, 8 + i * 2, -47.05]}
              r={0.045}
              color="#8d9e9c"
            />
            <Box
              at={[14, 8 + i * 2, -48]}
              size={[2.1, 0.08, 2.1]}
              color={p.slate}
            />
          </group>
        ))}
        <Box at={[14, 16, -48]} size={[5, 0.65, 5]} color={p.metal} round />
        <Cyl at={[14, 20, -48]} size={[0.09, 6, 0.09]} />
        <Beam from={[11, 18, -48]} to={[17, 18, -48]} r={0.06} />
      </Bake>
      <HabitatTree />
      {/* A single restrained reflection makes the enclosure read as glass. */}
      {!low && (
        <mesh position={[0, -1, -2]} scale={[1, 48 / 62, 1]}>
          <sphereGeometry
            args={[61.8, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <shaderMaterial
            side={BackSide}
            transparent
            depthWrite={false}
            vertexShader={`varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`}
            fragmentShader={`varying vec3 n;varying vec3 v;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),4.);gl_FragColor=vec4(.65,.8,.82,.008+rim*.065);\n#include <colorspace_fragment>}`}
          />
        </mesh>
      )}
    </>
  );
}

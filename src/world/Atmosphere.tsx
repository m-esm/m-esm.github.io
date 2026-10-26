import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BackSide,
  CanvasTexture,
  Group,
  Mesh,
  SRGBColorSpace,
  Vector3,
} from "three";

function planetMaps() {
  const width = 1024,
    height = 512;
  const land = document.createElement("canvas"),
    clouds = document.createElement("canvas");
  land.width = clouds.width = width;
  land.height = clouds.height = height;
  const ctx = land.getContext("2d")!,
    cloudCtx = clouds.getContext("2d")!;
  const pixels = ctx.createImageData(width, height),
    cloudPixels = cloudCtx.createImageData(width, height);
  const hash = (x: number, y: number, z: number) => {
    const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const noise = (x: number, y: number, z: number) => {
    const ix = Math.floor(x),
      iy = Math.floor(y),
      iz = Math.floor(z);
    let fx = x - ix,
      fy = y - iy,
      fz = z - iz,
      n = 0;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    fz = fz * fz * (3 - 2 * fz);
    for (let a = 0; a < 2; a++)
      for (let b = 0; b < 2; b++)
        for (let c = 0; c < 2; c++)
          n +=
            hash(ix + a, iy + b, iz + c) *
            (a ? fx : 1 - fx) *
            (b ? fy : 1 - fy) *
            (c ? fz : 1 - fz);
    return n;
  };
  const fbm = (x: number, y: number, z: number) =>
    noise(x, y, z) * 0.57 +
    noise(x * 2.1, y * 2.1, z * 2.1) * 0.27 +
    noise(x * 4.3, y * 4.3, z * 4.3) * 0.11 +
    noise(x * 8.5, y * 8.5, z * 8.5) * 0.05;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const lat = (y / height) * Math.PI,
        lng = (x / width) * Math.PI * 2;
      const sx = Math.sin(lat) * Math.cos(lng),
        sy = Math.cos(lat),
        sz = Math.sin(lat) * Math.sin(lng);
      const warp = noise(sx * 2 + 9, sy * 2 + 3, sz * 2 + 7) - 0.5;
      const terrain = fbm(
        sx * 3.2 + 4 + warp * 0.8,
        sy * 3.2 + 9,
        sz * 3.2 + 2,
      );
      const detail = noise(sx * 24 + 3, sy * 24 + 8, sz * 24 + 9);
      let r = 19,
        g = 74,
        b = 110;
      if (terrain > 0.525) {
        const h = Math.min(1, (terrain - 0.525) * 6);
        r = 116 - h * 39 + detail * 12;
        g = 140 - h * 30 + detail * 14;
        b = 102 - h * 27 + detail * 9;
        if (terrain > 0.64) {
          const rock = Math.min(1, (terrain - 0.64) * 14);
          r = r * (1 - rock) + 175 * rock;
          g = g * (1 - rock) + 165 * rock;
          b = b * (1 - rock) + 137 * rock;
        }
      } else {
        const shelf = Math.pow(Math.max(0, 1 - (0.525 - terrain) * 30), 2);
        r += shelf * 23;
        g += shelf * 56;
        b += shelf * 39;
      }
      const ice = Math.min(1, Math.max(0, (Math.abs(sy) - 0.92) * 14));
      const k = (y * width + x) * 4;
      pixels.data[k] = r * (1 - ice) + 213 * ice;
      pixels.data[k + 1] = g * (1 - ice) + 228 * ice;
      pixels.data[k + 2] = b * (1 - ice) + 220 * ice;
      pixels.data[k + 3] = terrain > 0.525 ? 128 : 255; // Ocean mask for solar glint.
      // Latitude shear and domain warping form weather fronts instead of round spots.
      const shear = lng + Math.sin(sy * 9) * 0.28;
      const cx = Math.sin(lat) * Math.cos(shear),
        cz = Math.sin(lat) * Math.sin(shear);
      const curl = noise(cx * 5 + 31, sy * 7 + 9, cz * 5 + 7);
      const cloud = fbm(
        cx * 10 + curl * 2 + 17,
        sy * 17 + Math.sin(shear * 3) * 0.9 + 13,
        cz * 10 + curl * 2 + 5,
      );
      const wisp = noise(cx * 57 + 11, sy * 44 + 4, cz * 57 + 6);
      const front = Math.max(0, Math.min(1, (cloud - 0.49) * 8));
      const alpha = front * (0.45 + wisp * 0.5);
      cloudPixels.data[k] = 236;
      cloudPixels.data[k + 1] = 245;
      cloudPixels.data[k + 2] = 239;
      cloudPixels.data[k + 3] = alpha * 255;
    }
  ctx.putImageData(pixels, 0, 0);
  cloudCtx.putImageData(cloudPixels, 0, 0);
  const groundMap = new CanvasTexture(land),
    cloudMap = new CanvasTexture(clouds);
  groundMap.colorSpace = cloudMap.colorSpace = SRGBColorSpace;
  return { groundMap, cloudMap };
}
const planetVertex = `
  varying vec2 vUv;
  varying vec3 vNormalWorld;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const sunlight = new Vector3(-0.58, 0.68, 0.44).normalize();
export function Planet({ reduced }: { reduced: boolean }) {
  const maps = useMemo(planetMaps, []),
    cloud = useRef<Mesh>(null);
  const surface = useMemo(
    () => ({
      ground: { value: maps.groundMap },
      clouds: { value: maps.cloudMap },
      sunlight: { value: sunlight },
    }),
    [maps],
  );
  useEffect(
    () => () => {
      maps.groundMap.dispose();
      maps.cloudMap.dispose();
    },
    [maps],
  );
  useFrame((_, dt) => {
    if (cloud.current && !reduced)
      cloud.current.rotation.y += Math.min(dt, 0.05) * 0.0018;
  });
  return (
    <group position={[40, 44, -116]} rotation={[0.08, -0.7, 0.22]}>
      <mesh>
        <sphereGeometry args={[19.4, 80, 48]} />
        <shaderMaterial
          uniforms={surface}
          vertexShader={planetVertex}
          fragmentShader={`
            uniform sampler2D ground; uniform sampler2D clouds; uniform vec3 sunlight;
            varying vec2 vUv; varying vec3 vNormalWorld; varying vec3 vWorld;
            void main() {
              vec3 n = normalize(vNormalWorld), view = normalize(cameraPosition - vWorld);
              vec4 terrain = texture2D(ground, vUv);
              float solar = dot(n, sunlight);
              float day = smoothstep(-.08, .18, solar);
              float diffuse = max(0., solar);
              float cloudShadow = texture2D(clouds, vUv + vec2(.002,-.001)).a;
              vec3 color = terrain.rgb * (.018 + diffuse * 1.22) * (1. - cloudShadow * .17);
              float glint = pow(max(0., dot(n, normalize(view + sunlight))), 85.);
              color += vec3(1., .92, .78) * glint * smoothstep(.65,.95,terrain.a) * .26 * day;
              float rim = pow(1. - max(0., dot(n, view)), 3.);
              color += vec3(.025,.12,.24) * rim * day;
              gl_FragColor = vec4(color, 1.);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }`}
        />
      </mesh>
      <mesh ref={cloud}>
        <sphereGeometry args={[19.48, 80, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={surface}
          vertexShader={planetVertex}
          fragmentShader={`
            uniform sampler2D clouds; uniform vec3 sunlight;
            varying vec2 vUv; varying vec3 vNormalWorld; varying vec3 vWorld;
            void main() {
              float opacity = texture2D(clouds,vUv).a;
              float solar = max(0.,dot(normalize(vNormalWorld),sunlight));
              vec3 color = vec3(.91,.95,1.) * (.014 + solar * 1.5);
              gl_FragColor=vec4(color,opacity * .92);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }`}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[19.7, 80, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={surface}
          vertexShader={planetVertex}
          fragmentShader={`
            uniform vec3 sunlight;
            varying vec2 vUv; varying vec3 vNormalWorld; varying vec3 vWorld;
            void main() {
              vec3 n=normalize(vNormalWorld),v=normalize(cameraPosition-vWorld);
              float rim=pow(1.-max(0.,dot(n,v)),4.5);
              float day=smoothstep(-.18,.35,dot(n,sunlight));
              gl_FragColor=vec4(.18,.46,.85,rim*(.06+day*.55));
              #include <colorspace_fragment>
            }`}
        />
      </mesh>
    </group>
  );
}
// Camera-centred stars have no parallax, flicker or atmospheric extinction.
export function Sky({ low }: { low: boolean }) {
  const sky = useRef<Group>(null);
  const stars = useMemo(() => {
    let seed = 73619;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const count = low ? 1800 : 4200;
    const position = new Float32Array(count * 3);
    const color = new Float32Array(count * 3);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const y = random() * 2 - 1,
        a = random() * Math.PI * 2;
      const r = Math.sqrt(1 - y * y);
      position.set(
        [r * Math.cos(a) * 210, y * 210, r * Math.sin(a) * 210],
        i * 3,
      );
      const bright = Math.pow(random(), 5),
        warmth = random();
      const strength = 0.25 + bright * 0.75;
      color.set(
        [
          strength * (warmth > 0.8 ? 1 : 0.79),
          strength * 0.88,
          strength * (warmth > 0.8 ? 0.74 : 1),
        ],
        i * 3,
      );
      size[i] = 0.8 + bright * 2.3;
    }
    return { position, color, size, count };
  }, [low]);
  useFrame(({ camera }) => {
    if (sky.current) sky.current.position.copy(camera.position);
  });
  return (
    <group ref={sky}>
      <mesh renderOrder={-100}>
        <sphereGeometry args={[225, 32, 20]} />
        <shaderMaterial
          side={BackSide}
          depthWrite={false}
          toneMapped={false}
          vertexShader={`varying vec3 direction;void main(){direction=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
          fragmentShader={`varying vec3 direction;void main(){vec3 d=normalize(direction);float band=pow(max(0.,1.-abs(dot(d,normalize(vec3(.2,.85,.4))))),18.);vec3 col=vec3(.0012,.002,.004)+vec3(.0015,.0017,.0025)*band;gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>}`}
        />
      </mesh>
      <points renderOrder={-90} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stars.position, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[stars.color, 3]} />
          <bufferAttribute
            attach="attributes-starSize"
            args={[stars.size, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          vertexShader={`attribute float starSize;varying vec3 vColor;void main(){vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=starSize;}`}
          fragmentShader={`varying vec3 vColor;void main(){float r=length(gl_PointCoord-.5)*2.;float a=1.-smoothstep(.12,1.,r);if(a<.01)discard;gl_FragColor=vec4(vColor,a);\n#include <colorspace_fragment>}`}
          vertexColors
        />
      </points>
    </group>
  );
}

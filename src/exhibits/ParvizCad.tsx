import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  MathUtils,
  BufferGeometry,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { runtime } from "../app/runtime";
import { Label } from "../world/Settlement";
import { ParvizExhibit } from "./SignatureExhibits";

class AssetBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function Assembly({ reduced }: { reduced: boolean }) {
  const { scene } = useGLTF("/assets/projects/parviz-assembly.glb");
  const [exploded, setExploded] = useState(false);
  const amount = useRef(0);
  const assembly = useMemo(() => {
    const buckets = new Map<string, BufferGeometry[]>();
    scene.updateMatrixWorld(true);
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const name = o.name.toLowerCase();
      const part =
        /^(track_|drivewheels_|axle_hw_|track_keeper_|drive[2]?_)/.test(name)
          ? name.includes("_l")
            ? "left"
            : "right"
          : /^(head_|screen_|trim_rail|sd_plug|ear_mic|led_strip|antenna_|ant_|motor_ant|trim_hatch|camera_|cam_cover)/.test(
                name,
              )
            ? "head"
            : /^(pan_|neck_|trim_neck|worm_|tilt_|motor_tilt|motor_pan)/.test(
                  name,
                )
              ? "neck"
              : "body";
      const geometry = o.geometry.clone().applyMatrix4(o.matrixWorld);
      if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
      const group = buckets.get(part) ?? [];
      group.push(geometry);
      buckets.set(part, group);
    });
    const axis = new Group(),
      material = new MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.62,
        metalness: 0.12,
      });
    for (const [name, geometries] of buckets) {
      const geometry = mergeGeometries(geometries, false);
      geometries.forEach((g) => g.dispose());
      if (!geometry) continue;
      const mesh = new Mesh(geometry, material);
      mesh.name = name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      axis.add(mesh);
    }
    axis.rotation.x = -Math.PI / 2;
    axis.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(axis),
      size = bounds.getSize(new Vector3()),
      center = bounds.getCenter(new Vector3());
    const root = new Group();
    root.add(axis);
    root.scale.setScalar(2.2 / size.y);
    axis.position.set(-center.x, -bounds.min.y, -center.z);
    return { root, axis, material };
  }, [scene]);
  useEffect(
    () => () => {
      assembly.axis.children.forEach((o) => {
        if (o instanceof Mesh) o.geometry.dispose();
      });
      assembly.material.dispose();
    },
    [assembly],
  );
  useFrame((_, dt) => {
    amount.current = reduced
      ? Number(exploded)
      : MathUtils.damp(amount.current, Number(exploded), 7, Math.min(dt, 0.05));
    for (const part of assembly.axis.children) {
      part.position.set(
        part.name === "left"
          ? -55 * amount.current
          : part.name === "right"
            ? 55 * amount.current
            : 0,
        0,
        part.name === "head"
          ? 75 * amount.current
          : part.name === "neck"
            ? 30 * amount.current
            : 0,
      );
    }
  });
  return (
    <group position={[-32, 4.31, -13]}>
      <group
        rotation={[0, Math.PI + 0.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setExploded((v) => !v);
        }}
      >
        <primitive object={assembly.root} dispose={null} />
      </group>
      <Label at={[0, -0.06, 1.05]} size={0.15}>
        Parviz / Actual CAD assembly
      </Label>
      <Label at={[0, -0.28, 1.05]} size={0.12}>
        {exploded
          ? "Click to reassemble"
          : "Click for exploded view / Enlarged"}
      </Label>
    </group>
  );
}
const workshopPosition = new Vector3(-32, 3, -13);

/** Only fetch the locally hosted CAD when a visitor approaches its district. */
export function ParvizCad({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  const [near, setNear] = useState(false);
  useFrame(() => {
    if (!near && runtime.position.distanceTo(workshopPosition) < 24)
      setNear(true);
  });
  const fallback = <ParvizExhibit paused={paused} reduced={reduced} />;
  return near ? (
    <AssetBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Assembly reduced={reduced} />
      </Suspense>
    </AssetBoundary>
  ) : (
    fallback
  );
}

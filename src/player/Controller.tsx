import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
} from "@react-three/rapier";
import type { RapierRigidBody, RapierCollider } from "@react-three/rapier";
import { Group, MathUtils, Vector3 } from "three";
import { input } from "../app/state";
import { runtime } from "../app/runtime";
import { anchors, boards, vec, boardPosition } from "../world/layout";
import { boardDimensions } from "../signage/PhysicalBoard";
import { Robot } from "./Robot";
export function Controller({
  selected,
  portrait,
  reduced,
  onReady,
  onNear,
}: {
  selected: string | null;
  portrait: boolean;
  reduced: boolean;
  onReady: () => void;
  onNear: (id: string | null) => void;
}) {
  const { world, rapier } = useRapier();
  const { camera, gl } = useThree();
  const body = useRef<RapierRigidBody>(null),
    collider = useRef<RapierCollider>(null),
    visual = useRef<Group>(null),
    travel = useRef(0),
    speed = useRef({ x: 0, z: 0 }),
    seenTeleport = useRef(-1),
    recenter = useRef(0),
    ticks = useRef(0),
    substeps = useRef(0);
  const character = useRef<ReturnType<
    typeof world.createCharacterController
  > | null>(null);
  const sphere = useRef(new rapier.Ball(0.28));
  const target = useRef(new Vector3()),
    oldSelected = useRef<string | null>(null),
    inspectionFrom = useRef(new Vector3()),
    transition = useRef(0),
    look = useRef(new Vector3());
  useEffect(() => {
    const cc = world.createCharacterController(0.015);
    cc.setMaxSlopeClimbAngle(Math.PI / 9);
    cc.setMinSlopeSlideAngle(Math.PI / 6);
    cc.enableSnapToGround(0.35);
    cc.setApplyImpulsesToDynamicBodies(false);
    character.current = cc;
    return () => {
      world.removeCharacterController(cc);
    };
  }, [world]);
  useBeforePhysicsStep(() => {
    const b = body.current,
      c = collider.current,
      cc = character.current;
    if (!b || !c || !cc) return;
    if (seenTeleport.current !== runtime.teleport) {
      const a = vec(anchors[runtime.anchor]);
      b.setTranslation(a, true);
      b.setNextKinematicTranslation(a);
      runtime.position.copy(a);
      speed.current = { x: 0, z: 0 };
      seenTeleport.current = runtime.teleport;
      input.yaw = 0;
      input.pitch = 0;
    }
    if (++substeps.current > 5) {
      b.setNextKinematicTranslation(b.translation());
      return;
    }
    const dt = 1 / 60,
      intent = selected ? { x: 0, z: 0 } : input.intent(),
      moving = Math.hypot(intent.x, intent.z) > 0.01;
    const v = speed.current,
      change = (moving ? 7 : 10) * dt;
    const desired = new Vector3(intent.x * 3.2 - v.x, 0, intent.z * 3.2 - v.z);
    if (desired.length() > change) desired.setLength(change);
    v.x += desired.x;
    v.z += desired.z;
    cc.computeColliderMovement(c, { x: v.x * dt, y: -0.1, z: v.z * dt });
    const movement = cc.computedMovement(),
      pos = b.translation();
    const next = {
      x: pos.x + movement.x,
      y: pos.y + movement.y,
      z: pos.z + movement.z,
    };
    if (next.y < -0.9 || Math.abs(next.x) > 39 || next.z < -41 || next.z > 30) {
      input.clear();
      runtime.anchor = "arrival";
      runtime.teleport++;
      return;
    }
    b.setNextKinematicTranslation(next);
    runtime.position.set(next.x, next.y, next.z);
    travel.current += Math.hypot(movement.x, movement.z);
    if (Math.hypot(movement.x, movement.z) > 0.0005 && visual.current) {
      const heading = Math.atan2(-movement.x, -movement.z);
      visual.current.rotation.y +=
        (MathUtils.euclideanModulo(
          heading - visual.current.rotation.y + Math.PI,
          Math.PI * 2,
        ) -
          Math.PI) *
        0.16;
    }
    if (!runtime.ready && ++ticks.current > 3) {
      runtime.ready = true;
      onReady();
    }
  });
  useFrame((_, dt) => {
    substeps.current = 0;
    if (!body.current) return;
    runtime.frame++;
    if (runtime.benchmark && runtime.intervals.length < 10000)
      runtime.intervals.push(dt * 1000);
    const pos = body.current.translation();
    runtime.position.set(pos.x, pos.y, pos.z);
    if (recenter.current !== runtime.recenter) {
      input.yaw = 0;
      input.pitch = 0;
      recenter.current = runtime.recenter;
    }
    if (!selected) {
      if (input.keys.has("q")) input.yaw += dt * 1.2;
      if (input.keys.has("e")) input.yaw -= dt * 1.2;
      if (input.keys.has("pageup"))
        input.pitch = Math.min(0.65, input.pitch + dt * 0.6);
      if (input.keys.has("pagedown"))
        input.pitch = Math.max(-0.4, input.pitch - dt * 0.6);
    }
    if (selected) {
      const board = boards.find((b) => b.id === selected)!;
      const [w, h] = boardDimensions(board, portrait);
      target.current.copy(boardPosition(board, portrait));
      const fov =
        ((camera as import("three").PerspectiveCamera).fov * Math.PI) / 180;
      const aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
      const desiredWidth = Math.min(720, gl.domElement.clientWidth * 0.88);
      const distance = Math.max(
        w /
          (2 *
            Math.tan(fov / 2) *
            aspect *
            (desiredWidth / gl.domElement.clientWidth)),
        h / (2 * Math.tan(fov / 2) * 0.74),
      );
      const destination = target.current
        .clone()
        .add(new Vector3(0, 0, distance));
      if (oldSelected.current !== selected) {
        inspectionFrom.current.copy(camera.position);
        look.current.copy(target.current);
        transition.current = 0;
        oldSelected.current = selected;
      }
      transition.current = Math.min(1, transition.current + dt / 0.4);
      const t = reduced ? 1 : 1 - Math.pow(1 - transition.current, 3);
      runtime.readingBoard =
        reduced || transition.current >= 1 ? selected : null;
      camera.position.lerpVectors(inspectionFrom.current, destination, t);
      camera.lookAt(target.current);
      runtime.cameraObstructed = false;
    } else {
      runtime.readingBoard = null;
      oldSelected.current = null;
      const yaw = input.yaw,
        pitch = input.pitch;
      target.current.set(
        pos.x - Math.sin(yaw) * 2,
        pos.y + 2.3 + pitch * 4,
        pos.z - Math.cos(yaw) * 2,
      );
      const desired = new Vector3(
        pos.x + Math.sin(yaw) * (portrait ? 9 : 7.5),
        pos.y + 4.1 + pitch * 3,
        pos.z + Math.cos(yaw) * (portrait ? 9 : 7.5),
      );
      const direction = desired.clone().sub(target.current);
      const distance = direction.length();
      direction.normalize();
      const hit = world.castShape(
        target.current,
        { x: 0, y: 0, z: 0, w: 1 },
        direction,
        sphere.current,
        0,
        distance,
        true,
        undefined,
        undefined,
        collider.current!,
        body.current!,
      );
      runtime.cameraObstructed = !!hit;
      const safeDistance = hit
        ? Math.max(0.5, hit.time_of_impact - 0.15)
        : distance;
      runtime.cameraDistance = safeDistance;
      desired.copy(target.current).addScaledVector(direction, safeDistance);
      if (runtime.frame < 4 || reduced) camera.position.copy(desired);
      else
        camera.position.lerp(
          desired,
          hit && safeDistance < camera.position.distanceTo(target.current)
            ? 1
            : 1 - Math.exp(-dt * 10),
        );
      camera.lookAt(target.current);
    }
    runtime.cameraPosition.copy(camera.position);
    runtime.cameraOverlaps = !!world.intersectionWithShape(
      camera.position,
      { x: 0, y: 0, z: 0, w: 1 },
      sphere.current,
      undefined,
      undefined,
      collider.current!,
      body.current!,
    );
    // Eligible interaction: nearby, in front of physical board, clear line of sight.
    if (runtime.frame % 8 === 0) {
      let nearest: string | null = null,
        min = 4.2;
      for (const b of boards) {
        const delta = vec(b.position).sub(runtime.position);
        const dist = Math.hypot(delta.x, delta.z);
        if (
          dist < min &&
          runtime.position.z > b.position[2] + 0.4 &&
          (-delta.x * Math.sin(input.yaw) - delta.z * Math.cos(input.yaw)) /
            Math.max(0.01, dist) >
            0.1
        ) {
          const start = runtime.position.clone().add(new Vector3(0, 0.3, 0)),
            d = vec(b.position).sub(start);
          const hit = world.castRay(
            new rapier.Ray(start, d.clone().normalize()),
            Math.max(0, d.length() - 0.4),
            true,
            undefined,
            undefined,
            collider.current!,
            body.current!,
          );
          if (!hit) {
            min = dist;
            nearest = b.id;
          }
        }
      }
      if (nearest !== runtime.nearby) {
        runtime.nearby = nearest;
        onNear(nearest);
      }
    }
    if (runtime.frame % 60 === 0)
      runtime.metrics = {
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        textures: gl.info.memory.textures,
      };
  });
  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[2, 3.65, 22]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider ref={collider} args={[0.17, 0.43]} />
      <group ref={visual} position={[0, -0.6, 0]}>
        <Robot travel={travel} reduced={reduced} />
      </group>
    </RigidBody>
  );
}

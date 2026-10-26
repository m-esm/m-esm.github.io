import { physicalProjection } from "./projection";
import { Html, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { profile, exhibitForBoard, destinations } from "../content/portfolio";
import { runtime } from "../app/runtime";
import type { BoardPlacement } from "../world/layout";
import { boardPosition, boards } from "../world/layout";
import type { SectorId } from "../content/portfolio";
import { Bake, Box, Cyl } from "../world/kit";
import { palette as p } from "../world/layout";
export function boardDimensions(b: BoardPlacement, portrait: boolean) {
  return portrait ? ([3.3, 5.6] as const) : b.size;
}
export function BoardFrames({ portrait }: { portrait: boolean }) {
  return (
    <Bake key={String(portrait)}>
      {boards.map((board) => {
        const [width, height] = boardDimensions(board, portrait),
          pos = boardPosition(board, portrait);
        const sector = exhibitForBoard(board.id)?.sector;
        const ground = ["arrival", "directory"].includes(board.id)
          ? 3
          : sector === "agents"
            ? 6
            : sector === "systems"
              ? 0
              : 3;
        const bottom = ground - pos.y;
        const accent =
          sector === "agents"
            ? p.blue
            : sector === "career"
              ? p.green
              : p.orange;
        return (
          <group key={board.id} position={pos}>
            <Box
              at={[0, 0, -0.09]}
              size={[width + 0.23, height + 0.23, 0.25]}
              color={p.slate}
              round
            />
            <Box
              at={[0, 0, 0.035]}
              size={[width, height, 0.06]}
              color={p.chalk}
            />
            <Box
              at={[-width / 2 - 0.09, 0, 0.07]}
              size={[0.065, height - 0.12, 0.08]}
              color={accent}
              round
            />
            {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
              <group
                key={`inlay${i}`}
                position={[(x * width) / 5, -height / 2 + 0.55, 0.12]}
              >
                <Box
                  size={[0.44, 0.32, 0.012]}
                  color={i === 0 ? accent : "#a9b8ae"}
                  round
                />
                <Box
                  at={[0, 0.02, 0.01]}
                  size={[0.28, 0.1, 0.012]}
                  color={p.chalk}
                />
                {i < 3 && (
                  <Box
                    at={[width / 10, 0.015, 0]}
                    size={[width / 5 - 0.43, 0.018, 0.014]}
                    color="#8da297"
                  />
                )}
              </group>
            ))}
            <Box
              at={[0, height / 2 - 0.19, 0.075]}
              size={[width - 0.44, 0.018, 0.01]}
              color="#a9b8ae"
            />
            <Box
              at={[0, -height / 2 - 0.065, 0.04]}
              size={[width + 0.12, 0.08, 0.1]}
              color="#8d9e9c"
            />
            {[-1, 1].map((side) => (
              <group key={side}>
                <Box
                  at={[
                    side * (width / 2 + 0.07),
                    (bottom + height / 2) / 2,
                    -0.12,
                  ]}
                  size={[0.14, height / 2 - bottom + 0.1, 0.2]}
                  color={p.slate}
                  round
                />
                <Box
                  at={[side * (width / 2 - 0.2), bottom + 0.1, -0.08]}
                  size={[0.55, 0.19, 0.85]}
                  color={p.slate}
                  round
                />
                {[-0.2, 0.2].map((z) => (
                  <Cyl
                    key={z}
                    at={[side * (width / 2 - 0.2), bottom + 0.21, z - 0.08]}
                    size={[0.045, 0.04, 0.045]}
                    color="#8d9e9c"
                  />
                ))}
                {[-1, 1].map((vertical) => (
                  <Cyl
                    key={vertical}
                    at={[
                      side * (width / 2 + 0.045),
                      vertical * (height / 2 + 0.045),
                      0.075,
                    ]}
                    size={[0.027, 0.025, 0.027]}
                    rotation={[Math.PI / 2, 0, 0]}
                    color={p.metal}
                  />
                ))}
              </group>
            ))}
            <Box
              at={[width / 2 - 0.14, bottom + 0.32, -0.22]}
              size={[0.24, 0.45, 0.2]}
              color={accent}
              round
            />
          </group>
        );
      })}
    </Bake>
  );
}
export function PhysicalBoard({
  board,
  selected,
  portrait,
  onInspect,
  onLeave,
  onGo,
  paused,
  onPause,
}: {
  board: BoardPlacement;
  selected: string | null;
  portrait: boolean;
  onInspect: (id: string, replace?: boolean) => void;
  onLeave: () => void;
  onGo: (id: SectorId) => void;
  paused: boolean;
  onPause: () => void;
}) {
  const { camera, size } = useThree(),
    { world, rapier } = useRapier();
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true),
    heading = useRef<HTMLHeadingElement>(null),
    face = useRef<HTMLElement>(null),
    shortFace = useRef<Group>(null),
    wasReading = useRef(false);
  const [width, height] = boardDimensions(board, portrait);
  const pos = boardPosition(board, portrait);
  const active = selected === board.id;
  const exhibit = exhibitForBoard(board.id);
  const panels = exhibit?.panels ?? [];
  const item = panels.find((p) => p.id === board.id);
  const index = panels.findIndex((p) => p.id === board.id);
  useEffect(() => {
    if (active) {
      const task = setTimeout(
        () => heading.current?.focus({ preventScroll: true }),
        450,
      );
      return () => clearTimeout(task);
    }
  }, [active]);
  useFrame(() => {
    const aligned =
      active &&
      runtime.readingBoard === board.id &&
      Math.abs(camera.position.x - pos.x) < 0.04 &&
      Math.abs(camera.position.y - pos.y) < 0.04;
    if (shortFace.current)
      shortFace.current.visible =
        !aligned &&
        (!selected || active) &&
        camera.position.distanceTo(pos) < 48;
    if (face.current)
      face.current.style.visibility = aligned ? "visible" : "hidden";
    if (aligned && !wasReading.current)
      heading.current?.focus({ preventScroll: true });
    wasReading.current = aligned;
    if (face.current)
      face.current.style.transform = physicalProjection(
        camera,
        pos,
        width * 100,
        height * 100,
        size.width,
        size.height,
      );
    const delta = new Vector3().subVectors(pos, camera.position),
      distance = delta.length();
    let show = !selected || active;
    if (show && !active) {
      const ray = new rapier.Ray(camera.position, delta.clone().normalize());
      const hit = world.castRay(ray, Math.max(0.01, distance - 0.35), true);
      show =
        distance < 42 &&
        camera.position.z > pos.z + 0.15 &&
        (!hit || hit.timeOfImpact > distance - 0.4);
    }
    if (show !== visibleRef.current) {
      visibleRef.current = show;
      setVisible(show);
    }
  });
  return (
    <group position={pos}>
      <mesh
        position={[0, 0, 0.08]}
        onClick={(e) => {
          e.stopPropagation();
          onInspect(board.id);
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={shortFace}>
        <Text
          position={[-width / 2 + 0.25, height / 2 - 0.55, 0.12]}
          font="/assets/plex-sans.woff"
          fontSize={0.42}
          maxWidth={width - 0.5}
          anchorX="left"
          anchorY="top"
          color="#22383c"
        >
          {board.id === "arrival"
            ? profile.name
            : board.id === "directory"
              ? "Station directory"
              : item?.heading}
        </Text>
        <Text
          position={[-width / 2 + 0.25, height / 2 - 2, 0.12]}
          font="/assets/plex-sans.woff"
          fontSize={0.24}
          maxWidth={width - 0.5}
          anchorX="left"
          anchorY="top"
          color="#22383c"
        >
          {board.id === "arrival"
            ? "Software engineer / Helsinki\n\nInspect to read"
            : board.id === "directory"
              ? "Systems / Workshop / Agent lab / Garden\n\nInspect to choose a destination"
              : `${exhibit?.title}\n\n${item?.body.split(". ")[0] ?? ""}.`}
        </Text>
      </group>
      {visible && (
        <Html
          calculatePosition={() => [0, 0]}
          position={[0, 0, 0.082]}
          zIndexRange={[20, 1]}
          style={{ pointerEvents: "none", width: 0, height: 0 }}
        >
          <article
            ref={face}
            className={`physical-board ${portrait ? "portrait" : ""} ${active ? "active" : ""}`}
            style={{
              width: width * 100,
              height: height * 100,
              transformOrigin: "0 0",
              visibility: "hidden",
              pointerEvents: active ? "auto" : "none",
            }}
            aria-hidden={!active}
            inert={!active}
            data-board={board.id}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="board-rule">
              <span>
                {["arrival", "directory"].includes(board.id)
                  ? "Moshe's Lab"
                  : exhibit?.title}
              </span>
              <span>
                {index >= 0
                  ? `${index + 1} / ${panels.length}`
                  : "Orbital research station"}
              </span>
            </div>
            <h2 ref={heading} tabIndex={-1}>
              {board.id === "arrival"
                ? profile.name
                : board.id === "directory"
                  ? "Take a look around"
                  : item?.heading}
            </h2>
            {board.id === "arrival" ? (
              <>
                <p className="role">{profile.role}</p>
                <p>{profile.introduction}</p>
                <p className="board-note">
                  Drive with WASD / arrows. Drag to look.
                  <br />
                  Approach a sign, then inspect.
                </p>
                <div className="board-actions">
                  <button onClick={() => onInspect("directory", true)}>
                    Station directory
                  </button>
                  {profile.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </>
            ) : board.id === "directory" ? (
              <>
                <p>
                  An open engineering settlement. Follow the terraces or choose
                  a destination. Nothing to unlock.
                </p>
                <div className="directory-actions">
                  {destinations.map((d) => (
                    <button key={d.id} onClick={() => onGo(d.id)}>
                      Go to {d.label}
                    </button>
                  ))}
                </div>
                <p className="board-note">
                  The terraces form a connected loop. The courtyard ramp is a
                  shortcut to the garden.
                </p>
              </>
            ) : (
              <>
                <p>{item?.body}</p>
                {board.id === "context" && (
                  <p className="board-note">
                    Delivery-as-a-Service · Starship Technologies
                  </p>
                )}
                {(board.id === "tooling" || board.id === "contact") && (
                  <div className="board-actions">
                    {profile.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
                <div className="story-actions">
                  {item?.link && (
                    <a
                      className="board-source"
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.link.label}
                    </a>
                  )}
                  {index > 0 && (
                    <button
                      onClick={() => onInspect(panels[index - 1].id, true)}
                    >
                      Previous board
                    </button>
                  )}
                  {index < panels.length - 1 && (
                    <button
                      onClick={() => onInspect(panels[index + 1].id, true)}
                    >
                      Next board
                    </button>
                  )}
                </div>
                {index === 0 && exhibit?.caption && (
                  <p className="model-caption">{exhibit.caption}</p>
                )}
                {board.id === "tooling" && (
                  <button className="pause-model" onClick={onPause}>
                    {paused ? "Resume model" : "Pause model"}
                  </button>
                )}
              </>
            )}
          </article>
        </Html>
      )}
    </group>
  );
}

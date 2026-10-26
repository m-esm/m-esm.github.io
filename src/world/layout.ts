import { Vector3 } from "three";
import type { SectorId } from "../content/portfolio";
export const anchors = {
  arrival: [2, 3.65, 22],
  systems: [-5, 0.65, -10],
  workshop: [-28, 3.65, -17],
  agents: [31, 6.65, -29],
  career: [26.5, 3.65, 12],
} as const;
export interface BoardPlacement {
  id: string;
  position: [number, number, number];
  size: [number, number];
  portraitY?: number;
}
export const boards: BoardPlacement[] = [
  {
    id: "arrival",
    position: [5.8, 5.1, 15],
    size: [5.6, 4.2],
    portraitY: 6.15,
  },
  {
    id: "directory",
    position: [12.4, 5.4, 18],
    size: [4.8, 4.4],
    portraitY: 6.15,
  },
  { id: "context", position: [-13, 2.25, -21], size: [5.2, 4.7] },
  { id: "responsibility", position: [-6.8, 2.25, -21], size: [5.2, 4.7] },
  { id: "tooling", position: [-0.6, 2.25, -21], size: [5.2, 4.7] },
  { id: "mechanisms", position: [-31.2, 5.25, -24], size: [5.2, 4.7] },
  { id: "framework", position: [-25, 5.25, -24], size: [5.2, 4.7] },
  { id: "routing", position: [19, 8.25, -36], size: [5.2, 4.7] },
  { id: "branches", position: [25.2, 8.25, -36], size: [5.2, 4.7] },
  { id: "career-now", position: [31, 5.25, 4], size: [5.2, 4.7] },
  { id: "contact", position: [31, 5.25, 17], size: [5.2, 4.7] },
];
export function boardPosition(board: BoardPlacement, portrait: boolean) {
  const result = new Vector3(...board.position);
  if (portrait) result.y = board.portraitY ?? result.y + 1;
  return result;
}
export function nearestSector(position: {
  x: number;
  y: number;
  z: number;
}): SectorId {
  return (Object.keys(anchors) as SectorId[]).reduce(
    (best, id) =>
      vec(anchors[id]).distanceToSquared(
        vec([position.x, position.y, position.z]),
      ) <
      vec(anchors[best]).distanceToSquared(
        vec([position.x, position.y, position.z]),
      )
        ? id
        : best,
    "arrival",
  );
}
export const vec = (a: readonly number[]) => new Vector3(a[0], a[1], a[2]);
export const palette = {
  slate: "#394b56",
  metal: "#b9c3c5",
  chalk: "#e4e9e3",
  orange: "#c66b3c",
  green: "#617c57",
  blue: "#397ca5",
  floor: "#b1b9b2",
};

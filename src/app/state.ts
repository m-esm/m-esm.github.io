import {
  boardIds,
  destinations,
  exhibits,
  exhibitForBoard,
} from "../content/portfolio";
import type { SectorId } from "../content/portfolio";
export type Route =
  | { kind: "explore"; sector: SectorId; invalid?: boolean }
  | { kind: "inspect"; board: string }
  | { kind: "read" };
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").split("/");
  if (!path[0]) return { kind: "explore", sector: "arrival" };
  if (path[0] === "read") return { kind: "read" };
  const exhibit = exhibits.find((e) => e.id === path[1]);
  if (path[0] === "exhibit" && exhibit)
    return {
      kind: "inspect",
      board:
        exhibit.panels.find((p) => p.id === path[2])?.id ??
        exhibit.panels[0].id,
    };
  if (path[0] === "board" && boardIds.includes(path[1]))
    return { kind: "inspect", board: path[1] };
  if (
    path[0] === "sector" &&
    ["arrival", ...destinations.map((d) => d.id)].includes(path[1])
  )
    return { kind: "explore", sector: path[1] as SectorId };
  return { kind: "explore", sector: "arrival", invalid: true };
}
export function boardRoute(id: string) {
  return ["arrival", "directory"].includes(id)
    ? `#/board/${id}`
    : `#/exhibit/${exhibitForBoard(id)?.id}/${id}`;
}
export function movementIntent(x: number, z: number, yaw: number) {
  const length = Math.hypot(x, z);
  if (length > 1) {
    x /= length;
    z /= length;
  }
  return {
    x: x * Math.cos(yaw) + z * Math.sin(yaw),
    z: -x * Math.sin(yaw) + z * Math.cos(yaw),
  };
}
export class InputState {
  keys = new Set<string>();
  touch = { x: 0, z: 0 };
  yaw = 0;
  pitch = 0;
  clear() {
    this.keys.clear();
    this.touch = { x: 0, z: 0 };
  }
  intent() {
    return movementIntent(
      (this.keys.has("d") || this.keys.has("arrowright") ? 1 : 0) -
        (this.keys.has("a") || this.keys.has("arrowleft") ? 1 : 0) +
        this.touch.x,
      (this.keys.has("s") || this.keys.has("arrowdown") ? 1 : 0) -
        (this.keys.has("w") || this.keys.has("arrowup") ? 1 : 0) +
        this.touch.z,
      this.yaw,
    );
  }
}
export const input = new InputState();

import { Vector3 } from "three";
import type { SectorId } from "../content/portfolio";
export const runtime = {
  position: new Vector3(2, 3.65, 22),
  teleport: 0,
  anchor: "arrival" as SectorId,
  recenter: 0,
  nearby: null as string | null,
  ready: false,
  readingBoard: null as string | null,
  frame: 0,
  cameraDistance: 0,
  cameraObstructed: false,
  cameraPosition: new Vector3(),
  cameraOverlaps: false,
  metrics: { calls: 0, triangles: 0, textures: 0 },
  intervals: [] as number[],
  benchmark: false,
};

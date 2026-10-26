import { describe, it, expect } from "vitest";
import {
  movementIntent,
  InputState,
  parseRoute,
  boardRoute,
} from "../src/app/state";
import { validateContent, exhibits } from "../src/content/portfolio";
import { boards, anchors } from "../src/world/layout";
describe("navigation", () => {
  it("keeps panel IDs scoped to their exhibit and hydrates every destination", () => {
    expect(parseRoute("#/exhibit/delivery-systems/contact")).toEqual({
      kind: "inspect",
      board: "context",
    });
    for (const e of exhibits) {
      expect(parseRoute(`#/exhibit/${e.id}`)).toEqual({
        kind: "inspect",
        board: e.panels[0].id,
      });
      expect(parseRoute(`#/sector/${e.sector}`)).toEqual({
        kind: "explore",
        sector: e.sector,
      });
    }
  });

  it("hydrates known exhibits and rejects unknown destinations", () => {
    expect(parseRoute("#/exhibit/delivery-systems")).toEqual({
      kind: "inspect",
      board: "context",
    });
    expect(parseRoute("#/exhibit/delivery-systems/tooling")).toEqual({
      kind: "inspect",
      board: "tooling",
    });
    expect(parseRoute("#/sector/not-real")).toMatchObject({
      sector: "arrival",
      invalid: true,
    });
    expect(parseRoute("#/exhibit/private")).toMatchObject({ invalid: true });
  });
  it("round-trips every physical board and exposes reading mode", () => {
    for (const b of boards)
      expect(parseRoute(boardRoute(b.id))).toEqual({
        kind: "inspect",
        board: b.id,
      });
    expect(parseRoute("#/read/delivery-systems")).toEqual({ kind: "read" });
  });
});
describe("movement intent", () => {
  it("normalizes diagonals, including combined keyboard and touch", () => {
    expect(Math.hypot(...Object.values(movementIntent(1, 1, 0)))).toBeCloseTo(
      1,
    );
    expect(
      Math.hypot(...Object.values(movementIntent(2, -2, 1.9))),
    ).toBeCloseTo(1);
    expect(movementIntent(0.2, 0, 0).x).toBe(0.2);
  });
  it("rotates movement relative to the camera", () => {
    const v = movementIntent(0, -1, Math.PI / 2);
    expect(v.x).toBeCloseTo(-1);
    expect(v.z).toBeCloseTo(0);
  });
  it("clears held keyboard and touch state on interruption", () => {
    const state = new InputState();
    state.keys.add("w");
    state.touch.x = 0.7;
    state.clear();
    expect(state.intent()).toEqual({ x: 0, z: 0 });
  });
});
describe("public content and layout references", () => {
  it("has complete placements, evidence, and actual anchors", () => {
    expect(validateContent()).toBe(true);
    for (const p of exhibits.flatMap((e) => e.panels))
      expect(boards.some((b) => b.id === p.id)).toBe(true);
    for (const e of exhibits) expect(e.evidence.length).toBeGreaterThan(0);
    expect(anchors.systems[1]).toBeGreaterThan(0);
  });
});

describe("physical board projection", () => {
  it("matches the projected physical corners in portrait and off-axis views", () => {
    for (const [w, h] of [
      [390, 844],
      [1440, 900],
    ]) {
      const camera = new PerspectiveCamera(70, w / h, 0.1, 250);
      camera.position.set(4, 7, 12);
      camera.lookAt(-2, 3, -5);
      camera.updateMatrixWorld();
      const pos = new Vector3(-2, 3, -5),
        width = 520,
        height = 470;
      const css = physicalProjection(camera, pos, width, height, w, h);
      const matrix = new Matrix4().fromArray(
        css.slice(9, -1).split(",").map(Number),
      );
      for (const [x, y] of [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
      ]) {
        const actual = new Vector3(x, y, 0).applyMatrix4(matrix);
        const projected = new Vector3(
          pos.x + (x - width / 2) * 0.01,
          pos.y - (y - height / 2) * 0.01,
          pos.z + 0.082,
        ).project(camera);
        expect(actual.x).toBeCloseTo(((projected.x + 1) * w) / 2, 5);
        expect(actual.y).toBeCloseTo(((1 - projected.y) * h) / 2, 5);
      }
    }
  });
});
import { Matrix4, PerspectiveCamera, Vector3 } from "three";
import { physicalProjection } from "../src/signage/projection";

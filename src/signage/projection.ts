import { Matrix4, Vector3 } from "three";
import type { Camera } from "three";
// Project the physical face into one CSS matrix. Avoid nested CSS camera transforms:
// WebKit can cull that hierarchy while still reporting correct DOM bounds.
export function physicalProjection(
  camera: Camera,
  position: Vector3,
  width: number,
  height: number,
  screenWidth: number,
  screenHeight: number,
) {
  camera.updateMatrixWorld();
  const local = new Matrix4()
    .makeTranslation(position.x, position.y, position.z + 0.082)
    .multiply(new Matrix4().makeScale(0.01, -0.01, 1))
    .multiply(new Matrix4().makeTranslation(-width / 2, -height / 2, 0));
  const e = new Matrix4()
    .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    .multiply(local).elements;
  const denominator = e[15];
  if (Math.abs(denominator) < 0.001) return "scale(0)";
  const sx = screenWidth / 2,
    sy = screenHeight / 2;
  return `matrix3d(${[
    (sx * (e[0] + e[3])) / denominator,
    (sy * (e[3] - e[1])) / denominator,
    0,
    e[3] / denominator,
    (sx * (e[4] + e[7])) / denominator,
    (sy * (e[7] - e[5])) / denominator,
    0,
    e[7] / denominator,
    0,
    0,
    1,
    0,
    (sx * (e[12] + e[15])) / denominator,
    (sy * (e[15] - e[13])) / denominator,
    0,
    1,
  ].join(",")})`;
}

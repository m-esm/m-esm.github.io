import { chromium, webkit } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url).pathname;
const useWebKit = process.argv.includes("--webkit");
const browser = await (useWebKit ? webkit : chromium).launch(
  useWebKit
    ? {}
    : {
        channel: "chrome",
        headless: true,
        args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
      },
);
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:4173/?debug=1&measurement=1");
await page.waitForFunction(() => window.__station?.runtime.ready);
await page.waitForTimeout(1500);
const identity = await page.evaluate(() => {
  const canvas = document.querySelector("canvas"),
    gl = canvas.getContext("webgl2"),
    ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return {
    userAgent: navigator.userAgent,
    viewport: [innerWidth, innerHeight],
    dpr: devicePixelRatio,
    renderer: ext
      ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
      : "unavailable",
  };
});
await page.evaluate(() => {
  window.__station.runtime.intervals = [];
  window.__station.runtime.benchmark = true;
  window.__station.go("arrival");
});
const start = Date.now();
const route = [];
async function record(name) {
  route.push({
    name,
    ...(await page.evaluate(() => {
      const r = window.__station.runtime;
      return {
        position: r.position,
        cameraObstructed: r.cameraObstructed,
        cameraOverlaps: r.cameraOverlaps,
        cameraDistance: r.cameraDistance,
        metrics: r.metrics,
      };
    })),
  });
}
async function drive(key, ms) {
  await page.locator(".world-surface").focus();
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
  await page.waitForTimeout(350);
}
await drive("a", 2400);
await record("ramp entrance");
await drive("w", 9500);
await record("lower yard");
for (const id of ["context", "responsibility", "tooling"]) {
  await page.evaluate((id) => window.__station.inspect(id), id);
  await page.waitForTimeout(3500);
  await record(id);
  await page.keyboard.press("Escape");
}
await drive("s", 9500);
await record("arrival return");
await drive("q", 1600);
await page.waitForTimeout(1500);
await record("orbit");
await page.keyboard.press("r");
await page.evaluate(() => window.__station.go("systems"));
await drive("s", 1000);
await record("under bridge");
await page.waitForTimeout(Math.max(0, 61000 - (Date.now() - start)));
const frames = await page.evaluate(() => {
  const r = window.__station.runtime;
  r.benchmark = false;
  return r.intervals;
});
const sorted = [...frames].sort((a, b) => a - b);
const result = {
  date: new Date().toISOString(),
  build: "production preview, warm cache",
  identity,
  durationMs: Date.now() - start,
  frames: frames.length,
  meanMs: frames.reduce((a, b) => a + b, 0) / frames.length,
  p50Ms: sorted[Math.floor(sorted.length * 0.5)],
  p95Ms: sorted[Math.floor(sorted.length * 0.95)],
  p99Ms: sorted[Math.floor(sorted.length * 0.99)],
  maxMs: Math.max(...frames),
  route,
  errors,
};
await mkdir(root + "docs/validation", { recursive: true });
await writeFile(
  root + `docs/validation/benchmark-${useWebKit ? "webkit" : "chromium"}.json`,
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
await browser.close();

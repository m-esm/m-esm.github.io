import { webkit } from "playwright";
import { writeFile } from "node:fs/promises";
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const checks = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto("http://127.0.0.1:4173/?debug=1");
  await page.waitForFunction(() => window.__station?.runtime.ready);
  await page.screenshot({
    path: "docs/validation/expansion-webkit-arrival.png",
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const id of [
      "directory",
      "context",
      "mechanisms",
      "framework",
      "routing",
      "branches",
      "career-now",
      "contact",
    ]) {
      await page.evaluate((id) => window.__station.inspect(id), id);
      const board = page.locator(`[data-board="${id}"]`);
      await board.waitFor({ state: "visible" });
      const m = await board.evaluate((b) => ({
        id: b.dataset.board,
        width: innerWidth,
        font:
          (parseFloat(getComputedStyle(b.querySelector("p")).fontSize) *
            b.getBoundingClientRect().width) /
          b.offsetWidth,
        scroll: b.scrollHeight,
        client: b.clientHeight,
        x: b.getBoundingClientRect().x,
        right: b.getBoundingClientRect().right,
      }));
      checks.push(m);
      if (
        m.font < 18 ||
        m.scroll > m.client + 2 ||
        m.x < 8 ||
        m.right > width - 8
      )
        errors.push(`Board layout: ${id} at ${width}`);
      if (["routing", "contact"].includes(id))
        await page.screenshot({
          path: `docs/validation/expansion-webkit-${id}-${width}.png`,
        });
    }
  }
} catch (e) {
  errors.push(e.message);
} finally {
  await writeFile(
    "docs/validation/expansion-webkit-check.json",
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
  await browser.close();
  if (errors.length) process.exitCode = 1;
}

import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { exhibits } from "../../src/content/portfolio";

for (const width of [1440, 390]) {
  test(`expanded physical boards and directory fit at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto("/?debug=1#/board/directory");
    await page.waitForFunction(() => (window as any).__station?.runtime.ready);
    for (const id of [
      "directory",
      ...exhibits.slice(1).flatMap((e) => e.panels.map((p) => p.id)),
    ]) {
      await page.evaluate((id) => (window as any).__station.inspect(id), id);
      const board = page.locator(`[data-board="${id}"]`);
      await expect(board).toBeVisible();
      await expect
        .poll(() => board.evaluate((b) => b.scrollHeight <= b.clientHeight + 2))
        .toBe(true);
      const m = await board.evaluate((b) => {
        const r = b.getBoundingClientRect();
        return {
          font:
            (parseFloat(getComputedStyle(b.querySelector("p")!).fontSize) *
              r.width) /
            (b as HTMLElement).offsetWidth,
          x: r.x,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
        };
      });
      expect(m.font).toBeGreaterThanOrEqual(18);
      expect(m.x).toBeGreaterThan(8);
      expect(m.right).toBeLessThan(width - 8);
      expect(m.top).toBeGreaterThan(70);
      expect(m.bottom).toBeLessThan(width === 390 ? 770 : 820);
      expect(await page.locator(".physical-board:not([inert])").count()).toBe(
        1,
      );
    }
    await expect(
      page.getByRole("link", { name: "LinkedIn", exact: true }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/m-esm");
    await page.keyboard.press("Escape");
    await expect(page.locator(".world-surface")).toBeFocused();
  });
}

test("new exhibit deep links and history put the robot on the correct terrace", async ({
  page,
}) => {
  for (const e of exhibits.slice(1)) {
    await page.goto(`/?debug=1#/exhibit/${e.id}`);
    await page.waitForFunction(() => (window as any).__station?.runtime.ready);
    await expect(
      page.getByRole("heading", { name: e.panels[0].heading, exact: true }),
    ).toBeVisible();
    const y = await page.evaluate(
      () => (window as any).__station.runtime.position.y,
    );
    expect(y).toBeGreaterThan(e.sector === "agents" ? 6.4 : 3.4);
    await page.keyboard.press("Escape");
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: e.panels[0].heading, exact: true }),
    ).toBeVisible();
  }
});

async function driveTo(
  page: Page,
  key: string,
  axis: "x" | "z",
  value: number,
) {
  console.log(`Driving ${key} to ${axis}=${value}`);
  await page.locator(".world-surface").focus();
  const increasing = key === "d" || key === "s";
  await page.keyboard.down(key);
  try {
    await page.waitForFunction(
      ({ axis, value, increasing }) => {
        const n = (window as any).__station.runtime.position[axis];
        return increasing ? n > value : n < value;
      },
      { axis, value, increasing },
      { timeout: 45000 },
    );
  } finally {
    if (!page.isClosed()) await page.keyboard.up(key);
  }
  await page.waitForTimeout(400);
}

test("drive the connected loop over all four new ramps and return to arrival", async ({
  page,
}) => {
  test.setTimeout(360000);
  await page.goto("/?debug=1#/sector/systems");
  await page.waitForFunction(() => (window as any).__station?.runtime.ready);
  const checkpoints: {
    name: string;
    p: { x: number; y: number; z: number };
  }[] = [];
  const record = async (name: string, y: number) => {
    const p = await page.evaluate(
      () => (window as any).__station.runtime.position,
    );
    checkpoints.push({ name, p });
    expect(p.y).toBeCloseTo(y, 0.0);
  };
  await driveTo(page, "a", "x", -18);
  await driveTo(page, "s", "z", 18);
  await driveTo(page, "a", "x", -28);
  await driveTo(page, "w", "z", -17);
  await record("workshop", 3.61);
  await driveTo(page, "a", "x", -34.2);
  await driveTo(page, "w", "z", -34);
  await driveTo(page, "d", "x", 27);
  await record("agent terrace", 6.61);
  await driveTo(page, "s", "z", 12);
  await record("garden", 3.61);
  await driveTo(page, "s", "z", 22.5);
  await driveTo(page, "a", "x", 2);
  await record("arrival east connection", 3.61);
  // Courtyard shortcut: descend, turn on the ground, and climb back to garden.
  await page.evaluate(() => (window as any).__station.go("career"));
  await driveTo(page, "w", "z", 7);
  await driveTo(page, "a", "x", 0);
  await record("courtyard", 0.61);
  await driveTo(page, "d", "x", 26);
  await record("garden shortcut", 3.61);
  await test.info().attach("loop-checkpoints", {
    body: JSON.stringify(checkpoints, null, 2),
    contentType: "application/json",
  });
});

test("static reading includes all curated exhibits without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ["/reading.html", "/"]) {
    await page.goto(path);
    for (const e of exhibits)
      await expect(
        page.getByRole("heading", { name: e.title, exact: true }),
      ).toBeVisible();
    await expect(
      page.getByText("Staff Engineer at Songtradr", { exact: false }),
    ).toBeVisible();
  }
  await context.close();
});

test("garden transfer keeps the follow camera clear of the contact board", async ({
  page,
}) => {
  await page.goto("/?debug=1#/sector/career");
  await page.waitForFunction(() => (window as any).__station?.runtime.ready);
  await expect
    .poll(() =>
      page.evaluate(() => (window as any).__station.runtime.cameraDistance),
    )
    .toBeGreaterThan(8);
  expect(
    await page.evaluate(() => (window as any).__station.runtime.cameraOverlaps),
  ).toBe(false);
  expect(
    await page.evaluate(() => (window as any).__station.runtime.position.x),
  ).toBeCloseTo(26.5, 1);
});

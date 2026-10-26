import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
async function ready(page: Page, route = "") {
  await page.goto("/?debug=1" + route);
  await page.waitForFunction(() => (window as any).__station?.runtime.ready);
  await page.locator(".loading").waitFor({ state: "detached" });
}
async function drive(page: Page, key: string, ms: number) {
  await page.locator(".world-surface").focus();
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
  await page.waitForTimeout(250);
}
async function driveUntil(page: Page, key: string, condition: () => boolean) {
  await page.locator(".world-surface").focus();
  await page.keyboard.down(key);
  try {
    await page.waitForFunction(condition, undefined, { timeout: 40000 });
  } finally {
    await page.keyboard.up(key);
  }
  await page.waitForTimeout(350);
}
async function position(page: Page) {
  return page.evaluate(() => {
    const p = (window as any).__station.runtime.position;
    return { x: p.x, y: p.y, z: p.z };
  });
}
async function inspect(page: Page, id: string) {
  await page.evaluate((id) => (window as any).__station.inspect(id), id);
  await page.waitForTimeout(600);
}
for (const width of [1440, 390])
  test(`physical story and actual links fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await ready(page, "#/exhibit/delivery-systems");
    for (const id of ["context", "responsibility", "tooling"]) {
      if (id !== "context")
        await page
          .getByRole("button", { name: "Next board", exact: true })
          .click();
      const board = page.locator(`[data-board="${id}"]`);
      await expect(board).toHaveAttribute("aria-hidden", "false");
      await expect(board).toBeVisible();
      await page.waitForTimeout(500);
      const metrics = await board.evaluate((b) => {
        const p = b.querySelector("p")!,
          r = b.getBoundingClientRect();
        return {
          font:
            (parseFloat(getComputedStyle(p).fontSize) * r.width) /
            (b as HTMLElement).offsetWidth,
          scroll: b.scrollHeight,
          client: b.clientHeight,
          x: r.x,
          right: r.right,
          y: r.y,
          bottom: r.bottom,
        };
      });
      expect(metrics.font).toBeGreaterThanOrEqual(18);
      expect(metrics.scroll).toBeLessThanOrEqual(metrics.client + 2);
      expect(metrics.x).toBeGreaterThan(8);
      expect(metrics.right).toBeLessThan(width - 8);
      expect(metrics.y).toBeGreaterThan(70);
      expect(metrics.bottom).toBeLessThan(width === 390 ? 770 : 820);
    }
    await expect(
      page.getByRole("link", { name: "GitHub", exact: true }),
    ).toHaveAttribute("href", "https://github.com/m-esm");
    await page.keyboard.press("Escape");
    await expect(page.locator(".world-surface")).toBeFocused();
    const before = await position(page);
    await page.getByRole("button", { name: "Station controls" }).click();
    await page.getByRole("button", { name: "Inspect identity sign" }).click();
    await page.keyboard.press("Escape");
    const after = await position(page);
    expect(Math.abs(before.x - after.x)).toBeLessThan(0.1);
  });
test("keyboard drives down and back up the full ramp; rails block shortcuts", async ({
  page,
}) => {
  test.setTimeout(120000);
  await ready(page);
  await driveUntil(
    page,
    "a",
    () => (window as any).__station.runtime.position.x < -5,
  );
  const left = await position(page);
  expect(left.x).toBeLessThan(-4.5);
  await driveUntil(
    page,
    "w",
    () => (window as any).__station.runtime.position.z < -10,
  );
  const lower = await position(page);
  expect(lower.y).toBeLessThan(0.8);
  expect(lower.z).toBeLessThan(-8);
  await driveUntil(
    page,
    "s",
    () => (window as any).__station.runtime.position.z > 20,
  );
  const upper = await position(page);
  expect(upper.y).toBeGreaterThan(3.4);
  expect(upper.z).toBeGreaterThan(15);
  await page.evaluate(() => (window as any).__station.go("arrival"));
  await drive(page, "w", 4500);
  const rail = await position(page);
  expect(rail.z).toBeGreaterThan(14.4);
  expect(rail.y).toBeGreaterThan(3.4);
});
test("blur clears held movement; orbit persists and recenter is explicit", async ({
  page,
}) => {
  await ready(page);
  await page.keyboard.down("w");
  await page.waitForTimeout(400);
  await page.evaluate(() => dispatchEvent(new Event("blur")));
  await page.keyboard.up("w");
  await page.waitForTimeout(500);
  const a = await position(page);
  await page.waitForTimeout(500);
  const b = await position(page);
  expect(Math.abs(a.z - b.z)).toBeLessThan(0.04);
  await drive(page, "q", 500);
  const yaw = await page.evaluate(() => (window as any).__station.input.yaw);
  expect(yaw).toBeGreaterThan(0.3);
  await page.waitForTimeout(700);
  expect(
    await page.evaluate(() => (window as any).__station.input.yaw),
  ).toBeCloseTo(yaw);
  await page.keyboard.press("r");
  await expect
    .poll(() => page.evaluate(() => (window as any).__station.input.yaw))
    .toBe(0);
});
test("direct routes, Back/Forward, unknown IDs and distinct reading mode", async ({
  page,
}) => {
  await ready(page, "#/exhibit/delivery-systems");
  await expect(
    page.getByRole("heading", { name: "Connecting the last mile" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Connecting the last mile" }),
  ).toBeVisible();
  await page.goForward();
  await expect(page.locator(".inspection-utility")).toHaveCount(0);
  await ready(page, "#/exhibit/private");
  await expect(page.getByRole("status")).toContainText("isn’t available");
  await page.getByRole("link", { name: "Read portfolio", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Mohsen Esmaeili", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Delivery systems", exact: true }),
  ).toBeVisible();
});
test("touch joystick drives the ramp and releases cleanly", async ({
  browser,
}) => {
  test.setTimeout(100000);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await ready(page);
  // Pointer input is the same path used by a touch contact. Walk from arrival onto ramp.
  const stick = page.locator(".joystick"),
    b = (await stick.boundingBox())!;
  const cx = b.x + b.width / 2,
    cy = b.y + b.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - 38, cy);
  await page.waitForFunction(
    () => (window as any).__station.runtime.position.x < -5,
    undefined,
    { timeout: 40000 },
  );
  await page.mouse.up();
  await page.waitForTimeout(350);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx, cy - 38);
  await page.waitForFunction(
    () => (window as any).__station.runtime.position.z < -9,
    undefined,
    { timeout: 40000 },
  );
  await page.mouse.up();
  await page.waitForTimeout(400);
  const p = await position(page);
  expect(p.y).toBeLessThan(0.8);
  expect(p.z).toBeLessThan(-8);
  expect(
    await page.evaluate(() => (window as any).__station.input.touch),
  ).toEqual({ x: 0, z: 0 });
  await context.close();
});
test("reduced motion and context loss preserve usable content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.getByRole("button", { name: "Station controls" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Reduce motion" }),
  ).toBeChecked();
  await page.evaluate(() =>
    document
      .querySelector("canvas")!
      .dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
  );
  await expect(
    page.getByRole("heading", { name: "The reading view is ready." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Read portfolio", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Delivery systems" }),
  ).toBeVisible();
});
test("no WebGL, failed essential assets and no JavaScript have real fallback content", async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() => null) as any;
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "The reading view is ready." }),
  ).toBeVisible();
  await context.close();
  const failed = await browser.newPage();
  await failed.route("**/assets/World-*.js", (route) => route.abort());
  await failed.goto("/");
  await expect(
    failed.getByRole("heading", { name: "The reading view is ready." }),
  ).toBeVisible();
  await failed.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto("/");
  await expect(
    staticPage.getByRole("heading", { name: "Mohsen Esmaeili" }),
  ).toBeVisible();
  await staticPage.goto("/reading.html");
  await expect(
    staticPage.getByRole("heading", { name: "Delivery systems" }),
  ).toBeVisible();
  await expect(
    staticPage.getByRole("link", { name: "LinkedIn" }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/m-esm");
  await nojs.close();
});
test("production assets stay local and there are no unexpected console errors", async ({
  page,
}) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:4173/") &&
      !r.url().startsWith("blob:") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await ready(page);
  await inspect(page, "tooling");
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("physical sign face clicks inspect and world dragging stays available", async ({
  page,
}) => {
  await ready(page);
  const board = page.locator('[data-board="arrival"]');
  const bounds = (await board.boundingBox())!;
  await page.mouse.click(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(page.locator('[data-board="arrival"]')).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await expect(
    page.getByRole("heading", { name: "Mohsen Esmaeili" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.mouse.move(400, 680);
  await page.mouse.down();
  await page.mouse.move(480, 680, { steps: 8 });
  await page.mouse.up();
  expect(
    Math.abs(await page.evaluate(() => (window as any).__station.input.yaw)),
  ).toBeGreaterThan(0.2);
});

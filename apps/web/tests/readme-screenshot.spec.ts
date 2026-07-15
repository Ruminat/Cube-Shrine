import path from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Generates the hero screenshot embedded in the root README.
 *
 * The live algorithm gallery is rendered inside an inline mock macOS browser
 * window (traffic-light dots + a URL bar) so the README image reads as a real
 * product shot rather than a bare viewport grab. We force dark mode so the
 * colourful Canvas-2D cubes pop against the dark surface. Refresh it with:
 *
 *   npm run screenshot -w web
 *
 * NOTE: no `import.meta` here — Playwright's loader can reject it, so paths
 * are resolved from `process.cwd()` (the `apps/web` app directory).
 */

// A fixed, high-DPI viewport keeps the captured window a stable size across
// machines and gives a crisp 2x image. Dark colour scheme -> theme-init.js
// resolves the default `system` theme to dark. Wide enough that the card grid
// (`auto-fill, minmax(320px, 1fr)`) lays out four columns.
test.use({
  viewport: { width: 1840, height: 1060 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

const SITE_DOMAIN = "cs.shrek-labs.dev";

const FRAME_WIDTH = 1728;
const FRAME_HEIGHT = 672;

function framePage(appUrl: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { background: #000; }
      body {
        display: flex;
        justify-content: center;
        padding: 40px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .window {
        width: ${FRAME_WIDTH}px;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6);
        background: #0a0a0b;
      }
      .titlebar {
        display: flex;
        align-items: center;
        gap: 14px;
        height: 46px;
        padding: 0 16px;
        background: #1b1b1d;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .lights { display: flex; gap: 8px; }
      .lights span { width: 12px; height: 12px; border-radius: 50%; }
      .r { background: #ff5f57; }
      .y { background: #febc2e; }
      .g { background: #28c840; }
      .url {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        max-width: 440px;
        margin: 0 auto;
        height: 28px;
        border-radius: 8px;
        background: #2a2a2d;
        color: #d0d0d3;
        font-size: 13px;
      }
      .url svg { opacity: 0.7; }
      iframe {
        display: block;
        width: ${FRAME_WIDTH}px;
        height: ${FRAME_HEIGHT}px;
        border: 0;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="lights"><span class="r"></span><span class="y"></span><span class="g"></span></div>
        <div class="url">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          ${SITE_DOMAIN}
        </div>
      </div>
      <iframe src="${appUrl}" title="Cube Shrine algorithm gallery"></iframe>
    </div>
  </body>
</html>`;
}

test("generates the README hero screenshot", async ({ page, baseURL }) => {
  const appUrl = new URL("/", baseURL ?? "http://127.0.0.1:3111").toString();
  const outputPath = path.resolve(process.cwd(), "docs/screenshot.png");

  // The cube thumbnails mount only when their slot intersects the viewport
  // (`MiniCube deferUntilVisible`). Inside a headless iframe that observer is
  // unreliable, so we stub IntersectionObserver to report everything visible —
  // every cube renders. Applies to the app iframe too (init scripts run in all
  // frames), so it must be registered before the content is set.
  await page.addInitScript(() => {
    class AlwaysVisibleObserver {
      private readonly cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe(el: Element) {
        const rect = el.getBoundingClientRect();
        this.cb(
          [
            {
              isIntersecting: true,
              intersectionRatio: 1,
              target: el,
              boundingClientRect: rect,
              intersectionRect: rect,
              rootBounds: null,
              time: 0,
            } as IntersectionObserverEntry,
          ],
          this as unknown as IntersectionObserver,
        );
      }
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    window.IntersectionObserver = AlwaysVisibleObserver as unknown as typeof IntersectionObserver;
  });

  await page.setContent(framePage(appUrl));

  // Wait for the real app to render inside the iframe.
  const app = page.frameLocator("iframe");
  await expect(app.getByRole("heading", { name: "Master the CFOP Method" })).toBeVisible();

  // Hide the Next.js dev-tools indicator so the shot reads as production.
  const frameElement = await page.waitForSelector("iframe");
  const frame = await frameElement.contentFrame();
  await frame?.addStyleTag({
    content: "nextjs-portal, [data-nextjs-dev-tools-button] { display: none !important; }",
  });

  // Capture the top of the page (no scroll): hero, filters, and the first rows
  // of cube cards. Wait for the Canvas-2D cubes to mount and draw, then settle.
  await expect(app.locator("canvas").first()).toBeVisible();
  await page.waitForTimeout(1200);

  await page.locator(".window").screenshot({ path: outputPath });
});

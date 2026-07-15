import { defineConfig, devices } from "@playwright/test";

const PORT = 3111;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  reporter: "list",

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1360, height: 1000 },
      },
    },
  ],

  // Serve the static export instead of `next dev`: the framed iframe capture
  // needs the client bundle to hydrate (so the cube canvases mount), and the
  // dev server's HMR/cross-origin handshake fails inside the mock-window iframe.
  webServer: {
    command: `npm --prefix ../.. run build && python3 -m http.server ${PORT} --directory out`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env["CI"],
    timeout: 180_000,
  },
});

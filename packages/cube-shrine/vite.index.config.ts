import { defineConfig } from "vite";
import { libConfig } from "./vite.lib.shared";

export default defineConfig(
  libConfig("index", false, [
    "src/core/**/*.ts",
    "src/render/**/*.ts",
    "src/entry-core.ts",
    "src/entry-render.ts",
    "src/entry-index.ts"
  ])
);

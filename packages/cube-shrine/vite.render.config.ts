import { defineConfig } from "vite";
import { libConfig } from "./vite.lib.shared";

export default defineConfig(
  libConfig("render", false, [
    "src/core/**/*.ts",
    "src/render/**/*.ts",
    "src/entry-render.ts"
  ])
);

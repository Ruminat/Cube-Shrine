import { defineConfig } from "vite";
import { libConfig } from "./vite.lib.shared";

export default defineConfig(
  libConfig("core", true, ["src/core/**/*.ts", "src/entry-core.ts"])
);

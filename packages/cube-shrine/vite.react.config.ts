import { defineConfig } from "vite";
import { libConfig } from "./vite.lib.shared";

export default defineConfig(
  libConfig("react", false, [
    "src/react/**/*.ts",
    "src/react/**/*.tsx",
    "src/core/**/*.ts",
    "src/render/**/*.ts",
    "src/entry-react.ts"
  ])
);

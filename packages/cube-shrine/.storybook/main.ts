import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(dirname, "..");

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        // Longer subpaths first — otherwise `@shreklabs/cube-shrine` swallows `/react`.
        alias: [
          { find: "@shreklabs/cube-shrine/react", replacement: path.join(packageRoot, "src/entry-react.ts") },
          { find: "@shreklabs/cube-shrine/render", replacement: path.join(packageRoot, "src/entry-render.ts") },
          { find: "@shreklabs/cube-shrine/core", replacement: path.join(packageRoot, "src/entry-core.ts") },
          { find: "@shreklabs/cube-shrine", replacement: path.join(packageRoot, "src/entry-index.ts") }
        ]
      }
    })
};

export default config;

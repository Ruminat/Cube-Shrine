import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PluginOption, UserConfig } from "vite";
import dts from "vite-plugin-dts";

const root = path.dirname(fileURLToPath(import.meta.url));

export const externalReact = (id: string) =>
  id === "react" ||
  id === "react-dom" ||
  id === "react/jsx-runtime" ||
  id.startsWith("react/");

export function libConfig(
  name: "index" | "core" | "render" | "react",
  emptyOutDir: boolean,
  dtsInclude: string[]
): UserConfig {
  return {
    plugins: [
      dts({
        include: dtsInclude,
        exclude: ["**/*.test.ts"],
        entryRoot: "src",
        copyDtsFiles: true,
        compilerOptions: { noEmitOnError: true }
      }) as PluginOption
    ],
    build: {
      emptyOutDir,
      lib: {
        entry: path.resolve(root, `src/entry-${name}.ts`),
        formats: ["es"],
        fileName: () => `${name}.js`
      },
      rollupOptions: {
        external: externalReact,
        output: {
          inlineDynamicImports: true
        }
      }
    }
  };
}

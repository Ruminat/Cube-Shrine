import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const reactPkgs = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "react-dom/client",
  "react-dom/server"
];

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "storybook-static/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/react/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: reactPkgs.map((name) => ({
            name,
            message:
              "React may only be imported from packages/cube-shrine/src/react (Storybook and .storybook may import React)."
          })),
          patterns: [
            {
              group: ["react/*", "react-dom/*"],
              message:
                "React may only be imported from packages/cube-shrine/src/react (Storybook and .storybook may import React)."
            }
          ]
        }
      ]
    }
  }
);

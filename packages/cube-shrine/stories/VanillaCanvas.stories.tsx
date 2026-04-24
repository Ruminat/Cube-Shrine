import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef } from "react";
import {
  applyRotationStep,
  createSolvedCubies,
  parseNotation,
  type PaletteKey
} from "@shreklabs/cube-shrine/core";
import { CUBE_DETAIL_DPR_CAP, drawCube } from "@shreklabs/cube-shrine/render";

/** Fixed hex palette so this demo never calls `getPaletteFromCSS` (no React helpers). */
const STATIC_PALETTE: Record<PaletteKey, string> = {
  white: "#ffffff",
  yellow: "#fcd34d",
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6"
};

const meta = {
  title: "Cube/Vanilla canvas",
  parameters: {
    docs: {
      description: {
        component:
          "Mount a canvas with `document.createElement`, run `createSolvedCubies` → `parseNotation` → `applyRotationStep`, then `drawCube` from `@shreklabs/cube-shrine/render`. The only React here is Storybook’s wrapper component around `useEffect`."
      }
    }
  }
} satisfies Meta;

export default meta;

function VanillaCubeDemo({ notation }: { notation: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const size = 220;
    const canvas = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, CUBE_DETAIL_DPR_CAP);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    host.appendChild(canvas);

    const context = canvas.getContext("2d");
    if (!context) {
      host.removeChild(canvas);
      return;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cubies = createSolvedCubies();
    parseNotation(notation).forEach((step) => applyRotationStep(cubies, step));
    drawCube(context, cubies, size, STATIC_PALETTE, { compactFill: false });

    return () => {
      host.removeChild(canvas);
    };
  }, [notation]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 520 }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
        Uses only <code>@shreklabs/cube-shrine/core</code> and <code>@shreklabs/cube-shrine/render</code>. No{" "}
        <code>MiniCube</code>, <code>useCubeRenderer</code>, or <code>getPaletteFromCSS</code>.
      </p>
      <pre
        style={{
          margin: 0,
          padding: 12,
          borderRadius: 8,
          background: "#0f172a0d",
          fontSize: 13,
          overflow: "auto"
        }}
      >
        {notation}
      </pre>
      <div ref={hostRef} />
    </div>
  );
}

export const PlainCanvas: StoryObj = {
  name: "Plain canvas (no library React)",
  args: { notation: "R U R' U R U2 R'" },
  argTypes: {
    notation: { control: "text", name: "WCA notation" }
  },
  render: (args) => <VanillaCubeDemo notation={String(args.notation ?? "")} />
};

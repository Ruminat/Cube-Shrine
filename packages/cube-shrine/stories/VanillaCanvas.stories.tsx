import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Section, Text, TextField } from "@radix-ui/themes";
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
  title: "Examples/VanillaJS (no React)",
  parameters: {
    docs: {
      description: {
        component:
          "Mount a canvas with `document.createElement`, run `createSolvedCubies` → `parseNotation` → `applyRotationStep`, then `drawCube` from `@shreklabs/cube-shrine/render`. The only React here is Storybook’s wrapper component around `useEffect`. Use the **Controls** panel or the field below to edit notation."
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

  return <div ref={hostRef} />;
}

function VanillaStoryShell({ initialNotation }: { initialNotation: string }) {
  const [notation, setNotation] = useState(initialNotation);

  useEffect(() => {
    setNotation(initialNotation);
  }, [initialNotation]);

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: 560 }}>
      <Section size="1">
        <Heading size="4" mb="2">
          Plain canvas
        </Heading>
        <Text size="2" color="gray" mb="3">
          Uses only <code>@shreklabs/cube-shrine/core</code> and <code>@shreklabs/cube-shrine/render</code>. No{" "}
          <code>MiniCube</code>, <code>useCubeRenderer</code>, or <code>getPaletteFromCSS</code>.
        </Text>
        <Box mb="3">
          <Text as="label" size="2" weight="medium" htmlFor="vanilla-notation-field" mb="1" style={{ display: "block" }}>
            WCA notation
          </Text>
          <TextField.Root
            id="vanilla-notation-field"
            value={notation}
            onChange={(e) => setNotation(e.target.value)}
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
          />
        </Box>
        <VanillaCubeDemo key={notation} notation={notation} />
      </Section>
    </Flex>
  );
}

export const PlainCanvas: StoryObj<{ notation: string }> = {
  name: "Plain canvas (no library React)",
  args: { notation: "R U R' U R U2 R'" },
  argTypes: {
    notation: { control: "text", name: "WCA notation", description: "Synced when you load the story; edit in Controls or the field." }
  },
  render: (args) => <VanillaStoryShell initialNotation={String(args.notation ?? "")} />
};

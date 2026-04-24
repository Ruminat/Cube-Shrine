import type { Meta, StoryObj } from "@storybook/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { getCanonicalOllTopPatternFromNotation, parseReversedNotation } from "@shreklabs/cube-shrine/core";
import {
  CUBE_PREVIEW_DPR_CAP,
  drawOllTopPatternOnCanvas,
  getPaletteFromCSS
} from "@shreklabs/cube-shrine/render";
import { MiniCube } from "@shreklabs/cube-shrine/react";
import { AlgorithmStoryCard, IsoFlatToggle, type IsoFlatMode } from "./storybookUi";

const SAMPLE_OLL: { id: string; label: string; notation: string }[] = [
  { id: "sune", label: "Sune", notation: "R U R' U R U2 R'" },
  { id: "antisune", label: "Anti-Sune", notation: "R U2 R' U' R U' R'" },
  { id: "h", label: "OLL 21 (H)", notation: "F (R U R' U') (R U R' U') (R U R' U') F'" },
  { id: "pi", label: "OLL 22 (Pi)", notation: "R U2 (R2' U' R2 U') (R2' U2 R)" },
  { id: "headlights", label: "Headlights", notation: "F (R U R' U') R' F' R U R U' R'" }
];

const meta = {
  title: "The cube/OLL",
  parameters: {
    docs: {
      description: {
        component:
          "Compare the default isometric cube (same preparation as the site) with the canonical **top-flat** diagram used on OLL cards. Cases are shown in a grid like **Basic moves**."
      }
    }
  }
} satisfies Meta;

export default meta;

const FLAT_SIZE = 120;

function OllFlatCanvas({ notation }: { notation: string }) {
  const flatRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const canvas = flatRef.current;
    if (!canvas) return;
    const size = FLAT_SIZE;
    const dpr = Math.min(window.devicePixelRatio || 1, CUBE_PREVIEW_DPR_CAP);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pattern = getCanonicalOllTopPatternFromNotation(notation);
    drawOllTopPatternOnCanvas(ctx, size, pattern, getPaletteFromCSS());
  }, [notation]);

  return <canvas ref={flatRef} role="img" aria-label={`OLL flat: ${notation}`} />;
}

function OllCasePreview({ notation, label, mode }: { notation: string; label: string; mode: IsoFlatMode }) {
  const preparationRotations = parseReversedNotation(notation);
  const cubeSize = mode === "iso" ? 120 : 100;

  return (
    <AlgorithmStoryCard title={label} notation={notation}>
      {mode === "iso" ? (
        <MiniCube size={cubeSize} preparationRotations={preparationRotations} deferUntilVisible={false} />
      ) : (
        <OllFlatCanvas notation={notation} />
      )}
    </AlgorithmStoryCard>
  );
}

function OllCasesGrid() {
  const [mode, setMode] = useState<IsoFlatMode>("iso");

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: 1200 }}>
      <Box>
        <Heading size="5" mb="2">
          OLL views
        </Heading>
        <Text size="2" color="gray" mb="3">
          Isometric preparation uses the same reversed moves as the site. Switch to <strong>Top flat</strong> for the
          canonical U-face diagram.
        </Text>
        <IsoFlatToggle value={mode} onChange={setMode} />
      </Box>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16
        }}
      >
        {SAMPLE_OLL.map((sample) => (
          <OllCasePreview key={sample.id} notation={sample.notation} label={sample.label} mode={mode} />
        ))}
      </div>
    </Flex>
  );
}

export const IsoVersusTopFlat: StoryObj = {
  name: "OLL cases (grid)",
  render: () => <OllCasesGrid />
};

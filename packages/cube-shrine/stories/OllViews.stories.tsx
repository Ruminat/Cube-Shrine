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
import { storyOllCases } from "./siteAlgorithmCases";

const meta = {
  title: "The cube/OLL",
  parameters: {
    docs: {
      description: {
        component:
          "Compare the default isometric cube (same preparation as the site) with the canonical **top-flat** diagram used on OLL cards. Cases are **Cross** and **Dot** families from `apps/web/data/oll.algs.ts`."
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
    const { pattern } = getCanonicalOllTopPatternFromNotation(notation);
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
  const [mode, setMode] = useState<IsoFlatMode>("flat");

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: 1200 }}>
      <Box>
        <Heading size="5" mb="2">
          OLL views
        </Heading>
        <Text size="2" color="gray" mb="3">
          <strong>Top flat</strong> is the default U-face diagram (fixed world frame). Switch to <strong>Isometric</strong>{" "}
          for the same preparation (<code>parseReversedNotation</code> only — no whole-cube <code>y</code>).
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
        {storyOllCases.map((alg) => (
          <OllCasePreview key={alg.id} notation={alg.notation} label={alg.name} mode={mode} />
        ))}
      </div>
    </Flex>
  );
}

export const IsoVersusTopFlat: StoryObj = {
  name: "OLL cases (grid)",
  render: () => <OllCasesGrid />
};

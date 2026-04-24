import type { Meta, StoryObj } from "@storybook/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { getPllTopViewFromNotation, parseReversedNotation } from "@shreklabs/cube-shrine/core";
import {
  CUBE_PREVIEW_DPR_CAP,
  drawPllTopPatternOnCanvas,
  getPaletteFromCSS
} from "@shreklabs/cube-shrine/render";
import { MiniCube } from "@shreklabs/cube-shrine/react";
import { AlgorithmStoryCard, IsoFlatToggle, type IsoFlatMode } from "./storybookUi";
import { storyPllCases } from "./siteAlgorithmCases";

const meta = {
  title: "The cube/PLL",
  parameters: {
    docs: {
      description: {
        component:
          "Inverse notation plus the same whole-cube `y` quarter-turns as the top-flat canonical frame drive the isometric cube; **top-flat** uses `getPllTopViewFromNotation` with cubie-derived permutation arrows. Cases are **Ua, Ub, H, Ja, Jb, T** from `apps/web/data/pll.algs.ts`."
      }
    }
  }
} satisfies Meta;

export default meta;

const FLAT_SIZE = 120;

function PllFlatCanvas({ algorithmId, notation }: { algorithmId: string; notation: string }) {
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
    const model = getPllTopViewFromNotation(algorithmId, notation);
    drawPllTopPatternOnCanvas(ctx, size, model, getPaletteFromCSS());
  }, [algorithmId, notation]);

  return <canvas ref={flatRef} role="img" aria-label={`PLL flat: ${notation}`} />;
}

function PllCasePreview({
  algorithmId,
  notation,
  label,
  mode
}: {
  algorithmId: string;
  notation: string;
  label: string;
  mode: IsoFlatMode;
}) {
  const model = getPllTopViewFromNotation(algorithmId, notation);
  const yTail = Array.from({ length: model.pllCanonicalYQuarterTurns }, () => ({
    face: "y" as const,
    angle: 90 as const
  }));
  const preparationRotations = [...parseReversedNotation(notation), ...yTail];
  const cubeSize = mode === "iso" ? 120 : 100;

  return (
    <AlgorithmStoryCard title={label} notation={notation}>
      {mode === "iso" ? (
        <MiniCube size={cubeSize} preparationRotations={preparationRotations} deferUntilVisible={false} />
      ) : (
        <PllFlatCanvas algorithmId={algorithmId} notation={notation} />
      )}
    </AlgorithmStoryCard>
  );
}

function PllCasesGrid() {
  const [mode, setMode] = useState<IsoFlatMode>("flat");

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: 1200 }}>
      <Box>
        <Heading size="5" mb="2">
          PLL views
        </Heading>
        <Text size="2" color="gray" mb="3">
          <strong>Top flat</strong> shows the same diagram and arrows as the library default. Switch to{" "}
          <strong>Isometric</strong> for the same preparation as PLL cards on the site (reversed moves + canonical{" "}
          <code>y</code>).
        </Text>
        <IsoFlatToggle value={mode} onChange={setMode} />
      </Box>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {storyPllCases.map((alg) => (
          <PllCasePreview
            key={alg.id}
            algorithmId={alg.id}
            notation={alg.notation}
            label={alg.name}
            mode={mode}
          />
        ))}
      </div>
    </Flex>
  );
}

export const IsoVersusTopFlat: StoryObj = {
  name: "PLL cases (grid)",
  render: () => <PllCasesGrid />
};

import type { Meta, StoryObj } from "@storybook/react";
import { useLayoutEffect, useRef, useState } from "react";
import { getPllTopViewFromNotation, parseReversedNotation } from "@shreklabs/cube-shrine/core";
import {
  CUBE_PREVIEW_DPR_CAP,
  drawPllTopPatternOnCanvas,
  getPaletteFromCSS
} from "@shreklabs/cube-shrine/render";
import { MiniCube } from "@shreklabs/cube-shrine/react";

const SAMPLE_PLL: { id: string; label: string; notation: string }[] = [
  { id: "t", label: "T perm", notation: "R U R' U' R' F R2 U' R' U' R U R' F'" },
  { id: "jperm", label: "Ja perm", notation: "y' (L' U' L F) (L' U' L U) L F' L2' U L U" },
  { id: "h", label: "H perm", notation: "M2' U M2' U2 M2' U M2'" },
  { id: "ua", label: "Ua perm", notation: "R U' R U R U R U' R' U' R2" }
];

const meta = {
  title: "PLL / Views",
  parameters: {
    docs: {
      description: {
        component:
          "Same as the site: inverse notation drives the isometric cube; **top-flat** uses `getPllTopViewFromNotation` (diagram arrows omitted here)."
      }
    }
  }
} satisfies Meta;

export default meta;

function PllViewSwitcher() {
  const [caseId, setCaseId] = useState(SAMPLE_PLL[0].id);
  const [mode, setMode] = useState<"iso" | "flat">("iso");
  const sample = SAMPLE_PLL.find((c) => c.id === caseId) ?? SAMPLE_PLL[0];
  const preparationRotations = parseReversedNotation(sample.notation);
  const flatRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    if (mode !== "flat") return;
    const canvas = flatRef.current;
    if (!canvas) return;
    const size = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, CUBE_PREVIEW_DPR_CAP);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const model = getPllTopViewFromNotation(sample.id, sample.notation, {
      getArrows: () => []
    });
    drawPllTopPatternOnCanvas(ctx, size, model, getPaletteFromCSS());
  }, [mode, sample.id, sample.notation]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
        <span>PLL case</span>
        <select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          style={{ padding: 8, borderRadius: 6, maxWidth: 420 }}
        >
          {SAMPLE_PLL.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setMode("iso")}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: mode === "iso" ? "2px solid #3b82f6" : "1px solid #ccc",
            background: mode === "iso" ? "#eff6ff" : "#fff",
            cursor: "pointer"
          }}
        >
          Default (isometric)
        </button>
        <button
          type="button"
          onClick={() => setMode("flat")}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: mode === "flat" ? "2px solid #3b82f6" : "1px solid #ccc",
            background: mode === "flat" ? "#eff6ff" : "#fff",
            cursor: "pointer"
          }}
        >
          Top flat
        </button>
      </div>
      <div style={{ fontSize: 13, fontFamily: "ui-monospace, monospace", opacity: 0.85 }}>{sample.notation}</div>
      {mode === "iso" ? (
        <MiniCube size={220} preparationRotations={preparationRotations} deferUntilVisible={false} />
      ) : (
        <canvas ref={flatRef} role="img" aria-label={`PLL flat: ${sample.label}`} />
      )}
    </div>
  );
}

export const IsoVersusTopFlat: StoryObj = {
  name: "Isometric vs top-flat",
  render: () => <PllViewSwitcher />
};

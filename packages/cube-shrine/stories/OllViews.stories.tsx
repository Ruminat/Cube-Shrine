import type { Meta, StoryObj } from "@storybook/react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  getCanonicalOllTopPatternFromNotation,
  parseReversedNotation
} from "@shreklabs/cube-shrine/core";
import {
  CUBE_PREVIEW_DPR_CAP,
  drawOllTopPatternOnCanvas,
  getPaletteFromCSS
} from "@shreklabs/cube-shrine/render";
import { MiniCube } from "@shreklabs/cube-shrine/react";

const SAMPLE_OLL: { id: string; label: string; notation: string }[] = [
  { id: "sune", label: "Sune", notation: "R U R' U R U2 R'" },
  { id: "antisune", label: "Anti-Sune", notation: "R U2 R' U' R U' R'" },
  { id: "h", label: "OLL 21 (H)", notation: "F (R U R' U') (R U R' U') (R U R' U') F'" },
  { id: "pi", label: "OLL 22 (Pi)", notation: "R U2 (R2' U' R2 U') (R2' U2 R)" },
  { id: "headlights", label: "Headlights", notation: "F (R U R' U') R' F' R U R U' R'" }
];

const meta = {
  title: "OLL / Views",
  parameters: {
    docs: {
      description: {
        component:
          "Compare the default isometric cube (same preparation as the site) with the canonical **top-flat** diagram used on OLL cards."
      }
    }
  }
} satisfies Meta;

export default meta;

function OllViewSwitcher() {
  const [caseId, setCaseId] = useState(SAMPLE_OLL[0].id);
  const [mode, setMode] = useState<"iso" | "flat">("iso");
  const sample = SAMPLE_OLL.find((c) => c.id === caseId) ?? SAMPLE_OLL[0];
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
    const pattern = getCanonicalOllTopPatternFromNotation(sample.notation);
    drawOllTopPatternOnCanvas(ctx, size, pattern, getPaletteFromCSS());
  }, [mode, sample.notation]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
        <span>Oll case</span>
        <select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          style={{ padding: 8, borderRadius: 6, maxWidth: 360 }}
        >
          {SAMPLE_OLL.map((c) => (
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
        <canvas ref={flatRef} role="img" aria-label={`OLL flat: ${sample.label}`} />
      )}
    </div>
  );
}

export const IsoVersusTopFlat: StoryObj = {
  name: "Isometric vs top-flat",
  render: () => <OllViewSwitcher />
};

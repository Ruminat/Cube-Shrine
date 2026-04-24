import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import {
  invertNotationSequence,
  parseNotation,
  parseReversedNotation
} from "@shreklabs/cube-shrine/core";

const meta = {
  title: "Algorithms / Utilities",
  parameters: {
    docs: {
      description: {
        component: "Notation parsing, reversal, and reversed-step lists used by the site and tests."
      }
    }
  }
} satisfies Meta;

export default meta;

function formatStepsJson(label: string, value: unknown) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>{label}</h4>
      <pre
        style={{
          margin: 0,
          padding: 12,
          borderRadius: 8,
          background: "#0f172a0d",
          fontSize: 12,
          overflow: "auto",
          maxHeight: 220
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

function AlgorithmUtilsPanel() {
  const [input, setInput] = useState("R U R' U' (R' F R F')");

  const parsed = useMemo(() => parseNotation(input), [input]);
  const inverted = useMemo(() => invertNotationSequence(input), [input]);
  const reversedSteps = useMemo(() => parseReversedNotation(input), [input]);

  return (
    <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
        <span>Notation (spaces, parentheses allowed)</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            fontFamily: "ui-monospace, monospace",
            fontSize: 13
          }}
        />
      </label>
      {formatStepsJson("parseNotation(input) — forward steps", parsed)}
      {formatStepsJson("invertNotationSequence(input) — string that undoes the sequence", inverted)}
      {formatStepsJson("parseReversedNotation(input) — PLL-style reversed + inverted steps", reversedSteps)}
    </div>
  );
}

export const ParseInvertReverse: StoryObj = {
  name: "Parse · invert string · reversed steps",
  render: () => <AlgorithmUtilsPanel />
};

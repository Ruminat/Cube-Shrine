import type { Meta, StoryObj } from "@storybook/react";
import { parseNotation } from "@shreklabs/cube-shrine/core";
import { MiniCube } from "@shreklabs/cube-shrine/react";
import { allSingleMoveNotations } from "./move-notations";

const meta = {
  title: "Cube/Single moves",
  parameters: {
    docs: {
      description: {
        component:
          "One isometric preview per atomic move (`U`, `U'`, `U2`, …) for every face the model supports, including slices `M` `S`, wide `u`–`f`, and whole-cube `x` `y` `z`."
      }
    }
  }
} satisfies Meta;

export default meta;

function MoveGrid() {
  const moves = allSingleMoveNotations();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
        gap: 16,
        maxWidth: 1200
      }}
    >
      {moves.map((notation) => (
        <div key={notation} style={{ textAlign: "center" }}>
          <MiniCube size={88} preparationRotations={parseNotation(notation)} deferUntilVisible={false} />
          <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>
            {notation}
          </div>
        </div>
      ))}
    </div>
  );
}

export const EveryAtomicMove: StoryObj = {
  name: "Grid — every atomic move",
  render: () => <MoveGrid />
};

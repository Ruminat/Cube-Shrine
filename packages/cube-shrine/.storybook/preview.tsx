import type { Preview } from "@storybook/react";
import { CubePaletteProvider } from "@shreklabs/cube-shrine/react";
import "./preview.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <CubePaletteProvider>
        <div style={{ padding: 16 }}>
          <Story />
        </div>
      </CubePaletteProvider>
    )
  ],
  parameters: {
    layout: "fullscreen"
  }
};

export default preview;

import "@radix-ui/themes/styles.css";
import type { Preview } from "@storybook/react";
import { Theme } from "@radix-ui/themes";
import { CubePaletteProvider } from "@shreklabs/cube-shrine/react";
import "./preview.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <Theme accentColor="blue" grayColor="slate" panelBackground="solid" radius="medium">
        <CubePaletteProvider>
          <div style={{ padding: 16 }}>
            <Story />
          </div>
        </CubePaletteProvider>
      </Theme>
    )
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;

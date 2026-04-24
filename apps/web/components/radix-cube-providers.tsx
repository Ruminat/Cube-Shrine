"use client";

import { Theme as RadixTheme } from "@radix-ui/themes";
import { CubePaletteProvider } from "@shreklabs/cube-shrine/react";
import { useDocumentAppearance } from "@/lib/document-appearance";

export function RadixCubeProviders({ children }: { children: React.ReactNode }) {
  const appearance = useDocumentAppearance();

  return (
    <CubePaletteProvider>
      <RadixTheme
        suppressHydrationWarning
        appearance={appearance}
        accentColor="violet"
        grayColor="slate"
        radius="medium"
      >
        {children}
      </RadixTheme>
    </CubePaletteProvider>
  );
}

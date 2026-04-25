"use client";

import { useState } from "react";
import { Theme as RadixTheme } from "@radix-ui/themes";
import { CubePaletteProvider } from "@shreklabs/cube-shrine/react";
import { FullscreenPortalTargetContext } from "@/components/FullscreenPortal/fullscreen-portal-target-context";
import { useDocumentAppearance } from "@/lib/document-appearance";

export function RadixCubeProviders({ children }: { children: React.ReactNode }) {
  const appearance = useDocumentAppearance();
  const [fullscreenPortalTarget, setFullscreenPortalTarget] = useState<HTMLDivElement | null>(null);

  return (
    <CubePaletteProvider>
      <FullscreenPortalTargetContext.Provider value={fullscreenPortalTarget}>
        <RadixTheme
          suppressHydrationWarning
          appearance={appearance}
          accentColor="violet"
          grayColor="slate"
          radius="medium"
        >
          {children}
          {/*
            Fullscreen overlays must mount here (not on document.body) so they stay under
            `.radix-themes` and inherit Radix typography / theme tokens like the rest of the app.
          */}
          <div ref={setFullscreenPortalTarget} className="contents" />
        </RadixTheme>
      </FullscreenPortalTargetContext.Provider>
    </CubePaletteProvider>
  );
}

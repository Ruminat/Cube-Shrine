"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPaletteFromCSS } from "../render/paletteFromCss";

type CubePaletteContextValue = {
  paletteVersion: string;
};

const CubePaletteContext = createContext<CubePaletteContextValue | null>(null);

export function CubePaletteProvider({ children }: { children: React.ReactNode }) {
  const [paletteVersion, setPaletteVersion] = useState("");

  useEffect(() => {
    const update = () => setPaletteVersion(JSON.stringify(getPaletteFromCSS()));
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"]
    });

    return () => observer.disconnect();
  }, []);

  const value = useMemo(() => ({ paletteVersion }), [paletteVersion]);

  return <CubePaletteContext.Provider value={value}>{children}</CubePaletteContext.Provider>;
}

export function useCubePalette() {
  const context = useContext(CubePaletteContext);
  if (!context) {
    throw new Error("useCubePalette must be used within CubePaletteProvider");
  }
  return context;
}

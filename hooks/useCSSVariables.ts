"use client";

import { useEffect, useMemo, useState } from "react";
import type { CubeColors } from "@/types/cube";

const readColors = (): CubeColors => {
  const style = getComputedStyle(document.documentElement);
  return {
    white: style.getPropertyValue("--cube-color-white").trim(),
    yellow: style.getPropertyValue("--cube-color-yellow").trim(),
    red: style.getPropertyValue("--cube-color-red").trim(),
    orange: style.getPropertyValue("--cube-color-orange").trim(),
    green: style.getPropertyValue("--cube-color-green").trim(),
    blue: style.getPropertyValue("--cube-color-blue").trim()
  };
};

export const useCSSVariables = () => {
  const [colors, setColors] = useState<CubeColors | null>(null);

  useEffect(() => {
    const update = () => setColors(readColors());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"]
    });

    return () => observer.disconnect();
  }, []);

  const paletteVersion = useMemo(
    () => JSON.stringify(colors ?? {}),
    [colors]
  );

  return { colors, paletteVersion };
};

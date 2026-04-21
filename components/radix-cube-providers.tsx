"use client";

import { useEffect, useState } from "react";
import { Theme as RadixTheme } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import { CubePaletteProvider } from "@/components/Cube/CubePaletteContext";

export function RadixCubeProviders({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appearance: "light" | "dark" = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <CubePaletteProvider>
      <RadixTheme appearance={appearance} accentColor="violet" grayColor="slate" radius="medium">
        {children}
      </RadixTheme>
    </CubePaletteProvider>
  );
}

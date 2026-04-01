"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Theme } from "@radix-ui/themes";
import { CubePaletteProvider } from "@/components/Cube/CubePaletteContext";

type ThemeMode = "light" | "dark";

interface AppThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("cube-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cube-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme
    }),
    [theme, toggleTheme]
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      <Theme appearance={theme} accentColor="violet" grayColor="slate" radius="medium">
        <CubePaletteProvider>{children}</CubePaletteProvider>
      </Theme>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}

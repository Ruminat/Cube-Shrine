"use client";

import * as React from "react";

/** Keep in sync with `public/theme-init.js` (blocking `<script src>` in `app/layout.tsx` `<head>`). */
const DEFAULT_STORAGE_KEY = "theme";
const MEDIA = "(prefers-color-scheme: dark)";

export type ResolvedTheme = "light" | "dark";
export type ThemeSetting = ResolvedTheme | "system";

export type UseThemeProps = {
  theme?: ThemeSetting;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  resolvedTheme?: ResolvedTheme;
  forcedTheme?: ResolvedTheme;
  systemTheme?: ResolvedTheme;
  themes: string[];
};

const noopThemeContext: UseThemeProps = {
  setTheme: () => {},
  themes: [],
};

const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function readStoredTheme(storageKey: string, fallback: ThemeSetting): ThemeSetting {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === "light" || raw === "dark" || raw === "system") {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

function disableTransitionsBriefly(): () => void {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(style);
  return () => {
    window.getComputedStyle(document.body);
    window.setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}

function applyResolvedTheme(
  resolved: ResolvedTheme,
  options: { disableTransitionOnChange: boolean; enableColorScheme: boolean }
): void {
  const root = document.documentElement;
  const finishDisable = options.disableTransitionOnChange ? disableTransitionsBriefly() : () => {};
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  if (options.enableColorScheme) {
    root.style.colorScheme = resolved;
  }
  finishDisable();
}

function resolveTheme(theme: ThemeSetting, enableSystem: boolean): ResolvedTheme {
  if (theme === "system" && enableSystem) {
    return getSystemTheme();
  }
  if (theme === "system") {
    return "light";
  }
  return theme;
}

export type ThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: ThemeSetting;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  /** Kept for compatibility with previous `next-themes` call sites; this provider always uses `class` on `document.documentElement`. */
  attribute?: "class" | `data-${string}`;
  enableColorScheme?: boolean;
  storageKey?: string;
}>;

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = true,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeSetting>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light");
  const hasSyncedStorage = React.useRef(false);

  const apply = React.useCallback(
    (resolved: ResolvedTheme) => {
      setResolvedTheme(resolved);
      applyResolvedTheme(resolved, { disableTransitionOnChange, enableColorScheme });
    },
    [disableTransitionOnChange, enableColorScheme]
  );

  React.useLayoutEffect(() => {
    if (!hasSyncedStorage.current) {
      hasSyncedStorage.current = true;
      const stored = readStoredTheme(storageKey, defaultTheme);
      setThemeState(stored);
      apply(resolveTheme(stored, enableSystem));
      return;
    }
    apply(resolveTheme(theme, enableSystem));
  }, [apply, defaultTheme, enableSystem, storageKey, theme]);

  React.useEffect(() => {
    if (theme !== "system" || !enableSystem) {
      return;
    }
    const mq = window.matchMedia(MEDIA);
    const onChange = () => apply(getSystemTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply, enableSystem, theme]);

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || event.newValue == null) {
        return;
      }
      if (event.newValue === "light" || event.newValue === "dark" || event.newValue === "system") {
        setThemeState(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const setTheme = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setThemeState((prev) => {
        const next = typeof value === "function" ? (value as (p: ThemeSetting) => string)(prev) : value;
        if (next !== "light" && next !== "dark" && next !== "system") {
          return prev;
        }
        const typed = next as ThemeSetting;
        try {
          localStorage.setItem(storageKey, typed);
        } catch {
          /* ignore */
        }
        return typed;
      });
    },
    [storageKey]
  );

  const themes = React.useMemo(() => (enableSystem ? ["light", "dark", "system"] : ["light", "dark"]), [enableSystem]);

  const value = React.useMemo<UseThemeProps>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      themes,
    }),
    [resolvedTheme, setTheme, theme, themes]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): UseThemeProps {
  const ctx = React.useContext(ThemeContext);
  return ctx ?? noopThemeContext;
}

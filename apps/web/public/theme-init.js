/**
 * Runs synchronously from a blocking `<head>` script so the first paint matches stored theme.
 * Logic must match `components/theme-provider.tsx` (storage key + resolution).
 */
(function applyStoredThemeFromLocalStorage() {
  const storageKey = "theme";
  const root = document.documentElement;

  let stored;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    stored = null;
  }

  if (stored !== "light" && stored !== "dark" && stored !== "system") {
    stored = "system";
  }

  let resolved;
  if (stored === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    resolved = prefersDark ? "dark" : "light";
  } else {
    resolved = stored;
  }

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
})();

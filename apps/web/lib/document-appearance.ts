"use client";

import { useSyncExternalStore } from "react";

export function subscribeDocumentAppearance(callback: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(callback);
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function getDocumentAppearance(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Reads `light` / `dark` from `document.documentElement` (kept in sync by the head script + `ThemeProvider`). */
export function useDocumentAppearance(): "light" | "dark" {
  return useSyncExternalStore(subscribeDocumentAppearance, getDocumentAppearance, () => "light");
}

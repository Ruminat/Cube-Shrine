"use client";

import { createContext, useContext } from "react";

const FullscreenPortalTargetContext = createContext<HTMLElement | null>(null);

export function useFullscreenPortalTarget(): HTMLElement | null {
  return useContext(FullscreenPortalTargetContext);
}

export { FullscreenPortalTargetContext };

"use client";

import { createPortal } from "react-dom";
import { useFullscreenPortalTarget } from "@/components/FullscreenPortal/fullscreen-portal-target-context";
import { MARKETING_HERO_TITLE_CLASS } from "@/lib/marketing-hero-title-class";
import { cn } from "@/lib/utils";
import { formatSolveTime } from "@/components/TimerPage/utils";

export type TimerRunningOverlayProps = {
  elapsedMs: number;
};

export function TimerRunningOverlay({ elapsedMs }: TimerRunningOverlayProps) {
  const portalTarget = useFullscreenPortalTarget();
  if (!portalTarget) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[60000] flex items-center justify-center bg-background text-foreground",
        "pointer-events-auto cursor-default select-none touch-none"
      )}
      style={{ pointerEvents: "auto" }}
      role="presentation"
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div role="timer" aria-live="polite" className={cn("pointer-events-none", MARKETING_HERO_TITLE_CLASS)}>
        {formatSolveTime(elapsedMs)}
      </div>
    </div>,
    portalTarget
  );
}

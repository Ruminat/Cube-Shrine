"use client";

import { createPortal } from "react-dom";
import { useFullscreenPortalTarget } from "@/components/FullscreenPortal/fullscreen-portal-target-context";
import { cn } from "@/lib/utils";

export function TimerHoldOverlay() {
  const portalTarget = useFullscreenPortalTarget();
  if (!portalTarget) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[60000] flex flex-col items-center justify-center gap-4 bg-green-600 px-6 text-center text-white",
        "pointer-events-auto touch-none"
      )}
      style={{ pointerEvents: "auto" }}
      role="status"
      aria-live="polite"
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <p className="text-2xl font-semibold sm:text-3xl">Release space to start</p>
      <p className="max-w-md text-sm text-green-100">
        Let go of the Space key when you are ready. Press Escape to cancel.
      </p>
    </div>,
    portalTarget
  );
}

"use client";

import { MARKETING_HERO_TITLE_CLASS } from "@/lib/marketing-hero-title-class";
import { cn } from "@/lib/utils";

export type TimerLatestSolveBannerProps = {
  latestDisplay: string;
  latestIsPlusTwo: boolean;
  latestIsDnf: boolean;
};

export function TimerLatestSolveBanner({
  latestDisplay,
  latestIsPlusTwo,
  latestIsDnf,
}: TimerLatestSolveBannerProps) {
  return (
    <div className="mb-8 text-center">
      <p className={cn("mt-4", MARKETING_HERO_TITLE_CLASS)}>{latestDisplay}</p>
      {latestIsPlusTwo && !latestIsDnf ? (
        <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">(+2)</p>
      ) : null}
      <p className="mt-2 hidden text-sm text-muted-foreground md:block">Press space to start</p>
    </div>
  );
}

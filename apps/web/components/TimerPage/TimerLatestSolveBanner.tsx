"use client";

import { Clock } from "lucide-react";
import { PanelEyebrow } from "@/components/TimerPage/render";
import styles from "./TimerPage.module.scss";

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
    <div className="text-center">
      <PanelEyebrow icon={Clock} title="Timer" />

      <div className={styles.readout}>
        <p className={styles.readoutTime}>{latestDisplay}</p>
        {latestIsPlusTwo && !latestIsDnf ? (
          <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">(+2)</p>
        ) : null}
        <p className="mt-2 hidden text-sm text-muted-foreground md:block">Press space to start</p>
        <p className="mt-2 text-sm text-muted-foreground md:hidden">Tap start below</p>
      </div>

      <div className={`${styles.divider} mt-6`} />
    </div>
  );
}

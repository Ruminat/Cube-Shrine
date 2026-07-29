import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./TimerPage.module.scss";

/** Small presentational fragments for the timer page (keeps feature components lean). */

type IconComponent = ComponentType<{ className?: string }>;

/** Uppercase accent caption used as the heading of every timer panel. */
export function PanelEyebrow({
  icon: Icon,
  title,
  className,
}: {
  icon: IconComponent;
  title: string;
  className?: string;
}) {
  return (
    <p className={cn(styles.eyebrow, className)}>
      <Icon className={cn(styles.eyebrowIcon)} />
      {title}
    </p>
  );
}

export function StatGroup({
  icon,
  title,
  children,
}: {
  icon: IconComponent;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.statCard}>
      <PanelEyebrow icon={icon} title={title} />
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function StatReadoutRow({
  label,
  value,
  sigma,
  highlight,
}: {
  label: string;
  value: string;
  sigma?: string | null;
  /** Renders the value in the "best" accent colour (used for personal-best rows). */
  highlight?: boolean;
}) {
  return (
    <div className={styles.statRow}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(styles.statValue, highlight && styles.statValueGood)}>
        {value}
        {sigma != null && sigma !== "" ? (
          <span className={styles.statSigma}>&sigma; {sigma}</span>
        ) : null}
      </span>
    </div>
  );
}

export function StatExtremeHighlight({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "best" | "worst";
}) {
  return (
    <div className={styles.extremeTile}>
      <p className={styles.extremeLabel}>{label}</p>
      <p
        className={cn(
          styles.extremeValue,
          tone === "best" ? styles.extremeValueBest : styles.extremeValueWorst
        )}
      >
        {value}
      </p>
    </div>
  );
}

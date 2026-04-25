import type { ReactNode } from "react";

/** Small presentational fragments for the timer page (keeps feature components lean). */

export function StatGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/15 p-3">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export function StatReadoutRow({
  label,
  value,
  sigma,
}: {
  label: string;
  value: string;
  sigma?: string | null;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm leading-snug">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right tabular-nums text-base font-semibold tracking-tight text-foreground">
        {value}
        {sigma != null && sigma !== "" ? (
          <span className="ml-2 text-xs font-normal tabular-nums text-muted-foreground">&sigma; {sigma}</span>
        ) : null}
      </span>
    </div>
  );
}

export function StatExtremeHighlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-md border border-border/60 bg-background/90 px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate tabular-nums text-lg font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

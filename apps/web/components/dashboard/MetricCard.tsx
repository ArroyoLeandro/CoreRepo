import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, hint, icon: Icon }: Props) {
  return (
    <article className="border border-line bg-surface-elevated p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
        <span className="inline-flex size-7 items-center justify-center border border-line bg-surface text-accent">
          <Icon className="size-3.5" strokeWidth={1.75} />
        </span>
      </div>
      <p className="text-xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
    </article>
  );
}

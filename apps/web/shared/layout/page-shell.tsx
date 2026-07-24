import type { ReactNode } from "react";

type Props = {
  /** Small uppercase eyebrow above the title */
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  /** Optional class for the inner panel */
  innerClassName?: string;
  /** When false, inner panel has no default padding (default true) */
  padded?: boolean;
  titleTestId?: string;
};

/**
 * Full-bleed page frame: outer panel fills MainContent,
 * header strip + scrollable body with an inner content panel.
 * Keeps forms readable while using the available canvas.
 */
export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  innerClassName = "",
  padded = true,
  titleTestId,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col border border-line bg-surface">
      <header className="flex shrink-0 flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="text-xl font-semibold tracking-tight text-foreground"
            data-testid={titleTestId}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3 md:p-4">
        <div
          className={[
            "flex min-h-full flex-col border border-line bg-surface-elevated",
            padded ? "p-3 md:p-4" : "",
            innerClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

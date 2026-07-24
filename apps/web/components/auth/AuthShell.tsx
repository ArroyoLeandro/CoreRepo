import type { ReactNode } from "react";

type Step = {
  n: number;
  label: string;
  active?: boolean;
};

type Props = {
  brand: string;
  panelTitle: string;
  panelSubtitle: string;
  steps: Step[];
  formTitle: string;
  formSubtitle: string;
  theme?: "light" | "dark";
  children: ReactNode;
};

export function AuthShell({
  brand,
  panelTitle,
  panelSubtitle,
  steps,
  formTitle,
  formSubtitle,
  theme = "dark",
  children,
}: Props) {
  return (
    <div
      className="relative min-h-dvh bg-canvas text-foreground"
      data-theme={theme}
      data-testid="auth-shell"
    >
      <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 lg:grid-cols-2 lg:p-4">
        <section className="relative hidden overflow-hidden border border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(165deg, var(--palette-4) 0%, var(--palette-1) 52%, var(--palette-0) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "160px 160px",
            }}
          />

          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-2">
              <span
                className="inline-flex size-6 items-center justify-center border font-mono text-[10px]"
                style={{
                  color: "var(--palette-3)",
                  borderColor: "color-mix(in srgb, var(--palette-3) 40%, transparent)",
                }}
              >
                ●
              </span>
              <span
                className="text-sm font-semibold tracking-tight"
                style={{ color: "var(--palette-3)" }}
              >
                {brand}
              </span>
            </div>
            <h1
              className="max-w-sm text-3xl font-semibold tracking-tight"
              style={{ color: "var(--palette-3)" }}
            >
              {panelTitle}
            </h1>
            <p
              className="mt-3 max-w-sm text-sm"
              style={{
                color:
                  "color-mix(in srgb, var(--palette-3) 72%, transparent)",
              }}
            >
              {panelSubtitle}
            </p>
          </div>

          <ol className="relative z-10 mt-12 flex flex-col gap-2">
            {steps.map((step) => (
              <li
                key={step.n}
                className="flex items-center gap-3 border px-3 py-2.5 text-sm"
                style={
                  step.active
                    ? {
                        backgroundColor: "#fff",
                        color: "var(--palette-0)",
                        borderColor: "transparent",
                      }
                    : {
                        backgroundColor: "rgb(0 0 0 / 0.25)",
                        color:
                          "color-mix(in srgb, var(--palette-3) 75%, transparent)",
                        borderColor: "rgb(255 255 255 / 0.15)",
                      }
                }
              >
                <span className="font-mono text-xs tabular-nums">{step.n}</span>
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col justify-center border border-line border-t-0 bg-surface-elevated px-5 py-10 sm:px-10 lg:border-t lg:border-l-0">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {formTitle}
            </h2>
            <p className="mt-2 text-sm text-muted">{formSubtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

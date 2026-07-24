import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-foreground">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-10 w-full border border-line bg-surface px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-fg hover:opacity-90 disabled:opacity-50"
      : variant === "secondary"
        ? "border border-line bg-surface text-foreground hover:bg-canvas disabled:opacity-50"
        : "text-muted hover:text-foreground disabled:opacity-50";

  return (
    <button
      {...props}
      className={[
        "inline-flex h-10 items-center justify-center px-4 text-sm font-medium transition-opacity",
        styles,
        className,
      ].join(" ")}
    />
  );
}

"use client";

import { Bell, Menu, Search, UserRound } from "lucide-react";
import { useShell } from "./shell-context";

type Props = {
  breadcrumbs: string[];
  searchPlaceholder: string;
  userName: string;
};

export function Header({ breadcrumbs, searchPlaceholder, userName }: Props) {
  const { setMobileOpen } = useShell();

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface-elevated px-3 md:px-5"
      data-testid="admin-header"
    >
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center text-muted hover:bg-surface hover:text-foreground md:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" strokeWidth={1.75} />
      </button>

      <nav
        className="hidden min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:flex"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <span key={`${crumb}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span className="text-line">/</span> : null}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "text-foreground"
                  : undefined
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:max-w-xl md:flex-none md:justify-center">
        <label className="relative hidden w-full max-w-md md:block">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="h-9 w-full border border-line bg-header-search pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
          />
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center text-muted hover:bg-surface hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 border border-line bg-surface px-2 text-sm text-foreground hover:bg-canvas"
          aria-label="User menu"
        >
          <UserRound className="size-4 text-muted" strokeWidth={1.75} />
          <span className="hidden max-w-[120px] truncate sm:inline">
            {userName}
          </span>
        </button>
      </div>
    </header>
  );
}

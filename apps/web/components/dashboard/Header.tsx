"use client";

import { Bell, Menu, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { useShell } from "./shell-context";

type Props = {
  searchPlaceholder: string;
  userName: string;
  crumbLabels: Record<string, string>;
  notificationLabels: {
    title: string;
    empty: string;
    markAll: string;
  };
  notifications: Array<{ id: string; title: string; time: string; unread?: boolean }>;
};

export function Header({
  searchPlaceholder,
  userName,
  crumbLabels,
  notificationLabels,
  notifications,
}: Props) {
  const { setMobileOpen } = useShell();
  const [openNotifs, setOpenNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!notifRef.current?.contains(event.target as Node)) {
        setOpenNotifs(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header
      className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-surface-elevated px-3 md:px-4"
      data-testid="admin-header"
    >
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center text-muted hover:bg-surface hover:text-foreground md:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" strokeWidth={1.75} />
      </button>

      <AdminBreadcrumbs labels={crumbLabels} />

      <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:max-w-md md:flex-none">
        <label className="relative hidden w-full md:block">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="h-8 w-full border border-line bg-header-search pr-2 pl-8 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
          />
        </label>
      </div>

      <div className="relative flex items-center gap-1" ref={notifRef}>
        <button
          type="button"
          className="relative inline-flex size-8 items-center justify-center text-muted hover:bg-surface hover:text-foreground"
          aria-label="Notifications"
          aria-expanded={openNotifs}
          onClick={() => setOpenNotifs((v) => !v)}
        >
          <Bell className="size-4" strokeWidth={1.75} />
          {unread > 0 ? (
            <span className="absolute top-1 right-1 size-1.5 bg-accent" />
          ) : null}
        </button>

        {openNotifs ? (
          <div className="absolute top-full right-0 z-50 mt-1 w-80 border border-line bg-surface-elevated shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {notificationLabels.title}
              </p>
              <button
                type="button"
                className="text-xs text-accent hover:underline"
                onClick={() => setOpenNotifs(false)}
              >
                {notificationLabels.markAll}
              </button>
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  {notificationLabels.empty}
                </li>
              ) : (
                notifications.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-line px-3 py-2.5 last:border-b-0 hover:bg-surface"
                  >
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{item.time}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}

        <Link
          href="/admin/profile"
          className="inline-flex h-8 items-center gap-2 border border-line bg-surface px-2 text-sm text-foreground hover:bg-canvas"
          aria-label="Profile"
        >
          <UserRound className="size-4 text-muted" strokeWidth={1.75} />
          <span className="hidden max-w-[120px] truncate sm:inline">
            {userName}
          </span>
        </Link>
      </div>
    </header>
  );
}

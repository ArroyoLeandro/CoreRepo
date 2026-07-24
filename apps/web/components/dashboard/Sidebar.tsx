"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useShell } from "./shell-context";

export type SidebarUser = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  brand: string;
  user: SidebarUser;
  labels: {
    general: string;
    dashboard: string;
    users: string;
    usersList: string;
    usersCreate: string;
    settings: string;
    account: string;
    profile: string;
    logout: string;
  };
};

export function Sidebar({ brand, user, labels }: Props) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useShell();
  const usersOpenDefault =
    pathname.startsWith("/admin/users") || pathname === "/admin/users/new";
  const [usersOpen, setUsersOpen] = useState(usersOpenDefault);

  function closeMobile() {
    setMobileOpen(false);
  }

  function linkClass(active: boolean, nested = false) {
    return [
      "group relative flex w-full items-center gap-3 py-2 text-sm transition-colors",
      nested ? "px-3 pl-9" : "px-3",
      active
        ? "bg-accent/15 font-semibold text-foreground"
        : "text-muted hover:bg-surface-elevated hover:text-foreground",
      collapsed && !nested ? "justify-center px-2" : "",
    ].join(" ");
  }

  const panel = (
    <aside
      className={[
        "flex h-full flex-col border-r border-line bg-surface",
        collapsed ? "w-[64px]" : "w-[240px]",
      ].join(" ")}
      data-testid="admin-sidebar"
    >
      {/* Logged-in user first */}
      <div className="border-b border-line p-3">
        <div
          className={[
            "flex items-center gap-3",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <div className="flex size-9 shrink-0 items-center justify-center bg-accent font-mono text-xs font-semibold text-accent-fg">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={[
          "flex h-12 items-center border-b border-line px-3",
          collapsed ? "justify-center" : "justify-between gap-2",
        ].join(" ")}
      >
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              {brand}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Admin
            </p>
          </div>
        ) : (
          <span className="font-mono text-xs font-semibold text-accent">CR</span>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden size-8 items-center justify-center text-muted hover:bg-surface-elevated hover:text-foreground md:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="size-4" strokeWidth={1.75} />
          )}
        </button>
        <button
          type="button"
          onClick={closeMobile}
          className="inline-flex size-8 items-center justify-center text-muted hover:bg-surface-elevated md:hidden"
          aria-label="Close menu"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <p
          className={[
            "mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
            collapsed ? "text-center" : "px-3",
          ].join(" ")}
        >
          {collapsed ? "·" : labels.general}
        </p>
        <nav className="flex flex-col gap-0.5 px-0">
          <Link
            href="/admin"
            onClick={closeMobile}
            title={collapsed ? labels.dashboard : undefined}
            className={linkClass(pathname === "/admin")}
          >
            {pathname === "/admin" ? (
              <span className="absolute inset-y-1 left-0 w-0.5 bg-accent" />
            ) : null}
            <LayoutDashboard className="size-4 shrink-0" strokeWidth={1.75} />
            {!collapsed ? <span>{labels.dashboard}</span> : null}
          </Link>

          {/* Users group */}
          {collapsed ? (
            <Link
              href="/admin/users"
              onClick={closeMobile}
              title={labels.users}
              className={linkClass(pathname.startsWith("/admin/users"))}
            >
              <Users className="size-4 shrink-0" strokeWidth={1.75} />
            </Link>
          ) : (
            <div className="w-full">
              <button
                type="button"
                className={linkClass(pathname.startsWith("/admin/users"))}
                onClick={() => setUsersOpen((v) => !v)}
                aria-expanded={usersOpen}
              >
                {pathname.startsWith("/admin/users") ? (
                  <span className="absolute inset-y-1 left-0 w-0.5 bg-accent" />
                ) : null}
                <Users className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="flex-1 text-left">{labels.users}</span>
                <ChevronDown
                  className={[
                    "size-3.5 shrink-0 transition-transform",
                    usersOpen ? "rotate-180" : "",
                  ].join(" ")}
                  strokeWidth={1.75}
                />
              </button>
              {usersOpen ? (
                <div className="mt-0.5 flex w-full flex-col">
                  <Link
                    href="/admin/users"
                    onClick={closeMobile}
                    className={linkClass(
                      pathname === "/admin/users",
                      true,
                    )}
                  >
                    {labels.usersList}
                  </Link>
                  <Link
                    href="/admin/users/new"
                    onClick={closeMobile}
                    className={linkClass(
                      pathname === "/admin/users/new",
                      true,
                    )}
                  >
                    {labels.usersCreate}
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </nav>

        <p
          className={[
            "mb-1 mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
            collapsed ? "text-center" : "px-3",
          ].join(" ")}
        >
          {collapsed ? "·" : labels.account}
        </p>
        <nav className="flex flex-col gap-0.5 px-0">
          <Link
            href="/admin/profile"
            onClick={closeMobile}
            title={collapsed ? labels.profile : undefined}
            className={linkClass(pathname === "/admin/profile")}
          >
            <UserRound className="size-4 shrink-0" strokeWidth={1.75} />
            {!collapsed ? <span>{labels.profile}</span> : null}
          </Link>
          <Link
            href="/admin/settings"
            onClick={closeMobile}
            title={collapsed ? labels.settings : undefined}
            className={linkClass(pathname === "/admin/settings")}
          >
            <Settings className="size-4 shrink-0" strokeWidth={1.75} />
            {!collapsed ? <span>{labels.settings}</span> : null}
          </Link>
          <Link
            href="/admin/login"
            onClick={closeMobile}
            title={collapsed ? labels.logout : undefined}
            className={linkClass(false)}
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.75} />
            {!collapsed ? <span>{labels.logout}</span> : null}
          </Link>
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden h-dvh shrink-0 md:block">{panel}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--palette-0) 55%, transparent)",
            }}
            aria-label="Close overlay"
            onClick={closeMobile}
          />
          <div className="absolute inset-y-0 left-0 z-50">{panel}</div>
        </div>
      ) : null}
    </>
  );
}

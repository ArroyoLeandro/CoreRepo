"use client";

import {
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShell } from "./shell-context";

export type SidebarUser = {
  name: string;
  email: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

type Props = {
  brand: string;
  user: SidebarUser;
  labels: {
    general: string;
    dashboard: string;
    users: string;
    settings: string;
    account: string;
    logout: string;
  };
};

export function Sidebar({ brand, user, labels }: Props) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useShell();

  const general: NavItem[] = [
    { href: "/admin", label: labels.dashboard, icon: LayoutDashboard },
    { href: "/admin/users", label: labels.users, icon: Users },
  ];

  const tools: NavItem[] = [
    { href: "/admin/settings", label: labels.settings, icon: Settings },
  ];

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function NavLink({ item }: { item: NavItem }) {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? item.label : undefined}
        className={[
          "group relative flex items-center gap-3 px-3 py-2 text-sm transition-colors",
          active
            ? "bg-accent/10 font-semibold text-foreground"
            : "text-muted hover:bg-surface-elevated hover:text-foreground",
          collapsed ? "justify-center px-2" : "",
        ].join(" ")}
      >
        {active ? (
          <span className="absolute inset-y-1 left-0 w-0.5 bg-accent" />
        ) : null}
        <Icon className="size-4 shrink-0" strokeWidth={1.75} />
        {!collapsed ? <span className="truncate">{item.label}</span> : null}
      </Link>
    );
  }

  const panel = (
    <aside
      className={[
        "flex h-full flex-col border-r border-line bg-surface",
        collapsed ? "w-[64px]" : "w-[240px]",
      ].join(" ")}
      data-testid="admin-sidebar"
    >
      <div
        className={[
          "flex h-14 items-center border-b border-line px-3",
          collapsed ? "justify-center" : "justify-between gap-2",
        ].join(" ")}
      >
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-foreground">
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
          onClick={() => setMobileOpen(false)}
          className="inline-flex size-8 items-center justify-center text-muted hover:bg-surface-elevated md:hidden"
          aria-label="Close menu"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <p
          className={[
            "mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
            collapsed ? "px-0 text-center" : "px-3",
          ].join(" ")}
        >
          {collapsed ? "·" : labels.general}
        </p>
        <nav className="flex flex-col gap-0.5 px-1">
          {general.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <p
          className={[
            "mb-2 mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
            collapsed ? "px-0 text-center" : "px-3",
          ].join(" ")}
        >
          {collapsed ? "·" : labels.account}
        </p>
        <nav className="flex flex-col gap-0.5 px-1">
          {tools.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? labels.logout : undefined}
            className={[
              "flex items-center gap-3 px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground",
              collapsed ? "justify-center px-2" : "",
            ].join(" ")}
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.75} />
            {!collapsed ? <span>{labels.logout}</span> : null}
          </Link>
        </nav>
      </div>

      {!collapsed ? (
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center bg-accent font-mono text-xs font-semibold text-accent-fg">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-dvh shrink-0 md:block">{panel}</div>

      {/* Mobile drawer */}
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
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-50">{panel}</div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import type { ReactNode } from "react";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Sidebar, type SidebarUser } from "./Sidebar";
import { ShellProvider } from "./shell-context";

type Props = {
  brand: string;
  user: SidebarUser;
  theme: "light" | "dark";
  locale: string;
  breadcrumbs: string[];
  searchPlaceholder: string;
  sidebarLabels: {
    general: string;
    dashboard: string;
    users: string;
    settings: string;
    account: string;
    logout: string;
  };
  children: ReactNode;
};

export function DashboardLayout({
  brand,
  user,
  theme,
  locale,
  breadcrumbs,
  searchPlaceholder,
  sidebarLabels,
  children,
}: Props) {
  return (
    <ShellProvider>
      <div
        className="flex h-dvh overflow-hidden bg-canvas text-foreground"
        data-theme={theme}
        data-locale={locale}
        data-testid="admin-shell"
      >
        <Sidebar brand={brand} user={user} labels={sidebarLabels} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            breadcrumbs={breadcrumbs}
            searchPlaceholder={searchPlaceholder}
            userName={user.name}
          />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </ShellProvider>
  );
}

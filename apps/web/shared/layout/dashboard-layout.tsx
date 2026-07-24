"use client";

import type { ReactNode } from "react";
import { Header } from "./header";
import { MainContent } from "./main-content";
import { ShellProvider } from "./shell-context";
import { Sidebar, type SidebarUser } from "./sidebar";

type Props = {
  brand: string;
  user: SidebarUser;
  theme: "light" | "dark";
  locale: string;
  searchPlaceholder: string;
  sidebarLabels: {
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
  crumbLabels: Record<string, string>;
  notificationLabels: {
    title: string;
    empty: string;
    markAll: string;
  };
  notifications: Array<{
    id: string;
    title: string;
    time: string;
    unread?: boolean;
  }>;
  children: ReactNode;
};

export function DashboardLayout({
  brand,
  user,
  theme,
  locale,
  searchPlaceholder,
  sidebarLabels,
  crumbLabels,
  notificationLabels,
  notifications,
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
            searchPlaceholder={searchPlaceholder}
            userName={user.name}
            crumbLabels={crumbLabels}
            notificationLabels={notificationLabels}
            notifications={notifications}
          />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </ShellProvider>
  );
}

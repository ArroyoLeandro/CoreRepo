import { redirect } from "next/navigation";
import { DashboardLayout } from "@/shared/layout";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieHeader = await getRequestCookieHeader();

  if (!cookieHeader.includes("access_token=")) {
    redirect("/admin/login");
  }

  let locale = resolveLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE);
  let theme: "light" | "dark" = "light";
  let user = {
    id: "00000000-0000-0000-0000-000000000000",
    name: "Admin",
    email: "admin@example.com",
  };

  try {
    const api = createServerApi(cookieHeader);
    const me = await api.me();
    user = { id: me.id, name: me.name, email: me.email };
    const settings = await api.getSettings();
    locale = resolveLocale(settings.locale);
    theme = settings.theme;
  } catch {
    redirect("/admin/login");
  }

  const t = getMessages(locale);

  return (
    <DashboardLayout
      brand={t.brand}
      user={user}
      theme={theme}
      locale={locale}
      searchPlaceholder={t.header.search}
      sidebarLabels={{
        general: t.nav.general,
        dashboard: t.nav.dashboard,
        users: t.nav.users,
        usersList: t.nav.usersList,
        usersCreate: t.nav.usersCreate,
        settings: t.nav.settings,
        account: t.nav.account,
        profile: t.nav.profile,
        logout: t.nav.logout,
      }}
      crumbLabels={t.crumbs}
      notificationLabels={{
        title: t.header.notifications,
        empty: t.header.notificationsEmpty,
        markAll: t.header.markAllRead,
      }}
      notifications={[
        {
          id: "1",
          title: "Nuevo usuario registrado",
          time: "hace 12 min",
          unread: true,
        },
        {
          id: "2",
          title: "Backup nocturno completado",
          time: "hace 2 h",
          unread: true,
        },
        {
          id: "3",
          title: "Recordatorio: revisar settings de tema",
          time: "ayer",
        },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { createServerApi } from "../../../lib/api";
import { getMessages, resolveLocale } from "../../../lib/i18n";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  if (!cookieHeader.includes("access_token=")) {
    redirect("/admin/login");
  }

  let locale = resolveLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE);
  let theme: "light" | "dark" = "light";
  let user = { name: "Admin", email: "admin@example.com" };

  try {
    const api = createServerApi(cookieHeader);
    const me = await api.me();
    user = { name: me.name, email: me.email };
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
      breadcrumbs={[t.header.pages, t.nav.dashboard]}
      searchPlaceholder={t.header.search}
      sidebarLabels={{
        general: t.nav.general,
        dashboard: t.nav.dashboard,
        users: t.nav.users,
        settings: t.nav.settings,
        account: t.nav.account,
        logout: t.nav.logout,
      }}
    >
      {children}
    </DashboardLayout>
  );
}

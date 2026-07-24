import { DashboardHome } from "@/features/dashboard";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

export default async function AdminHomePage() {
  const cookieHeader = await getRequestCookieHeader();

  let locale = resolveLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE);
  let userCount = "—";

  try {
    const api = createServerApi(cookieHeader);
    const [settings, users] = await Promise.all([
      api.getSettings(),
      api.listUsers(),
    ]);
    locale = resolveLocale(settings.locale);
    userCount = String(users.users.length);
  } catch {
    /* layout gates auth */
  }

  const t = getMessages(locale);
  return <DashboardHome labels={t.dashboard} userCount={userCount} />;
}

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerApi } from "../../../lib/api";
import { getMessages, resolveLocale } from "../../../lib/i18n";
import styles from "../admin.module.css";

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

  try {
    const api = createServerApi(cookieHeader);
    await api.me();
    const settings = await api.getSettings();
    locale = resolveLocale(settings.locale);
    theme = settings.theme;
  } catch {
    redirect("/admin/login");
  }

  const t = getMessages(locale);

  return (
    <div className={styles.shell} data-theme={theme} data-locale={locale}>
      <nav className={styles.nav} data-testid="admin-nav">
        <span className={styles.brand}>{t.brand}</span>
        <Link href="/admin/users" data-testid="nav-users">
          {t.nav.users}
        </Link>
        <Link href="/admin/settings" data-testid="nav-settings">
          {t.nav.settings}
        </Link>
        <Link href="/admin/login" data-testid="nav-login">
          {t.nav.login}
        </Link>
      </nav>
      {children}
    </div>
  );
}

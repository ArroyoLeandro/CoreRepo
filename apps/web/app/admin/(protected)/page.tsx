import { Activity, Languages, Palette, Users } from "lucide-react";
import { cookies } from "next/headers";
import { DataTable } from "../../../components/dashboard/DataTable";
import { MetricCard } from "../../../components/dashboard/MetricCard";
import { createServerApi } from "../../../lib/api";
import { getMessages, resolveLocale } from "../../../lib/i18n";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  let locale = resolveLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE);
  let theme: "light" | "dark" = "light";
  let userCount = "—";

  try {
    const api = createServerApi(cookieHeader);
    const [settings, users] = await Promise.all([
      api.getSettings(),
      api.listUsers(),
    ]);
    locale = resolveLocale(settings.locale);
    theme = settings.theme;
    userCount = String(users.users.length);
  } catch {
    /* layout already gates auth */
  }

  const t = getMessages(locale);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Overview
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {t.dashboard.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{t.dashboard.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t.dashboard.metrics.users}
          value={userCount}
          hint="Active directory"
          icon={Users}
        />
        <MetricCard
          label={t.dashboard.metrics.sessions}
          value="—"
          hint="Template placeholder"
          icon={Activity}
        />
        <MetricCard
          label={t.dashboard.metrics.locale}
          value={locale.toUpperCase()}
          hint="From settings"
          icon={Languages}
        />
        <MetricCard
          label={t.dashboard.metrics.theme}
          value={theme}
          hint="From settings"
          icon={Palette}
        />
      </div>

      <DataTable
        title={t.dashboard.tableTitle}
        emptyLabel={t.dashboard.tableEmpty}
        columns={[
          { key: "name", label: "Name" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
          { key: "amount", label: "Amount" },
        ]}
      />
    </div>
  );
}

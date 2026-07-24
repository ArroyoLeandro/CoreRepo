"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageShell } from "../../../../components/dashboard/PageShell";
import { createBrowserApi } from "../../../../lib/api";
import type { Messages } from "../../../../lib/i18n";

type Settings = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["getSettings"]>
>;

type Props = {
  initialSettings: Settings;
  messages: Messages["settings"];
};

export function SettingsClient({ initialSettings, messages }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [workspaceName, setWorkspaceName] = useState("CoreRepo HQ");
  const [timezone, setTimezone] = useState("America/Argentina/Buenos_Aires");
  const [emailDigest, setEmailDigest] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function persist(next: Partial<Settings>) {
    setError(null);
    setStatus(null);
    setPending(true);
    try {
      const api = createBrowserApi();
      const saved = await api.updateSettings(next);
      setSettings(saved);
      setStatus(messages.saved);
      router.refresh();
    } catch {
      setError(messages.saveError);
    } finally {
      setPending(false);
    }
  }

  function toggleClass(active: boolean) {
    return [
      "inline-flex h-9 items-center justify-center px-3 text-sm font-medium disabled:opacity-50",
      active
        ? "bg-accent text-accent-fg"
        : "border border-line bg-surface text-foreground hover:bg-canvas",
    ].join(" ");
  }

  function CheckRow({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) {
    return (
      <label className="flex items-center justify-between gap-3 border border-line bg-surface px-3 py-2 text-sm">
        <span>{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 accent-[var(--accent)]"
        />
      </label>
    );
  }

  return (
    <PageShell
      eyebrow="Preferences"
      title={messages.title}
      titleTestId="settings-title"
      description={messages.description}
      innerClassName="flex flex-col gap-3"
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="border border-line bg-surface p-3">
          <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {messages.sectionAppearance}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted">{messages.locale}</span>
              <div
                className="flex gap-2"
                role="group"
                aria-label={messages.locale}
              >
                <button
                  type="button"
                  className={toggleClass(settings.locale === "es")}
                  disabled={pending || settings.locale === "es"}
                  data-testid="locale-es"
                  onClick={() => void persist({ locale: "es" })}
                >
                  {messages.localeEs}
                </button>
                <button
                  type="button"
                  className={toggleClass(settings.locale === "en")}
                  disabled={pending || settings.locale === "en"}
                  data-testid="locale-en"
                  onClick={() => void persist({ locale: "en" })}
                >
                  {messages.localeEn}
                </button>
              </div>
              <span data-testid="settings-locale" className="sr-only">
                {settings.locale}
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted">{messages.theme}</span>
              <div
                className="flex gap-2"
                role="group"
                aria-label={messages.theme}
              >
                <button
                  type="button"
                  className={toggleClass(settings.theme === "light")}
                  disabled={pending || settings.theme === "light"}
                  data-testid="theme-light"
                  onClick={() => void persist({ theme: "light" })}
                >
                  {messages.themeLight}
                </button>
                <button
                  type="button"
                  className={toggleClass(settings.theme === "dark")}
                  disabled={pending || settings.theme === "dark"}
                  data-testid="theme-dark"
                  onClick={() => void persist({ theme: "dark" })}
                >
                  {messages.themeDark}
                </button>
              </div>
              <span data-testid="settings-theme" className="sr-only">
                {settings.theme}
              </span>
            </div>
          </div>
        </section>

        <section className="border border-line bg-surface p-3">
          <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {messages.sectionWorkspace}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {messages.workspaceName}
              </span>
              <input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="h-9 border border-line bg-surface-elevated px-3 outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {messages.timezone}
              </span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-9 border border-line bg-surface-elevated px-3 outline-none focus:border-accent"
              >
                <option value="America/Argentina/Buenos_Aires">
                  America/Argentina/Buenos_Aires
                </option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/Madrid">Europe/Madrid</option>
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-muted">{messages.comingSoon}</p>
        </section>
      </div>

      <section className="border border-line bg-surface p-3">
        <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {messages.sectionNotifications}
        </h2>
        <div className="grid gap-2 md:grid-cols-3">
          <CheckRow
            label={messages.emailDigest}
            checked={emailDigest}
            onChange={setEmailDigest}
          />
          <CheckRow
            label={messages.productUpdates}
            checked={productUpdates}
            onChange={setProductUpdates}
          />
          <CheckRow
            label={messages.securityAlerts}
            checked={securityAlerts}
            onChange={setSecurityAlerts}
          />
        </div>
      </section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {status ? (
        <p className="text-sm text-muted" data-testid="settings-status">
          {status}
        </p>
      ) : null}
    </PageShell>
  );
}

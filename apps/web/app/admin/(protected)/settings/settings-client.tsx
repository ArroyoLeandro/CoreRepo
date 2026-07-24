"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
      "inline-flex h-10 items-center justify-center px-4 text-sm font-medium transition-opacity disabled:opacity-50",
      active
        ? "bg-accent text-accent-fg"
        : "border border-line bg-surface text-foreground hover:bg-canvas",
    ].join(" ");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Preferences
        </p>
        <h1
          className="mt-1 text-2xl font-semibold tracking-tight text-foreground"
          data-testid="settings-title"
        >
          {messages.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{messages.description}</p>
      </header>

      <section className="flex flex-col gap-4 border border-line bg-surface-elevated p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {messages.locale}
          </span>
          <div className="flex gap-2" role="group" aria-label={messages.locale}>
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

        <div className="h-px bg-line" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {messages.theme}
          </span>
          <div className="flex gap-2" role="group" aria-label={messages.theme}>
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
      </section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {status ? (
        <p className="text-sm text-muted" data-testid="settings-status">
          {status}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserApi } from "../../../../lib/api";
import type { Messages } from "../../../../lib/i18n";
import styles from "../../admin.module.css";

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

  return (
    <div className={styles.panelWide}>
      <h1 className={styles.title} data-testid="settings-title">
        {messages.title}
      </h1>
      <p className={styles.muted}>{messages.description}</p>

      <div className={styles.prefRow}>
        <span className={styles.prefLabel}>{messages.locale}</span>
        <div className={styles.actions} role="group" aria-label={messages.locale}>
          <button
            type="button"
            className={
              settings.locale === "es" ? styles.button : styles.buttonSecondary
            }
            disabled={pending || settings.locale === "es"}
            data-testid="locale-es"
            onClick={() => void persist({ locale: "es" })}
          >
            {messages.localeEs}
          </button>
          <button
            type="button"
            className={
              settings.locale === "en" ? styles.button : styles.buttonSecondary
            }
            disabled={pending || settings.locale === "en"}
            data-testid="locale-en"
            onClick={() => void persist({ locale: "en" })}
          >
            {messages.localeEn}
          </button>
        </div>
        <span data-testid="settings-locale" className={styles.srOnly}>
          {settings.locale}
        </span>
      </div>

      <div className={styles.prefRow}>
        <span className={styles.prefLabel}>{messages.theme}</span>
        <div className={styles.actions} role="group" aria-label={messages.theme}>
          <button
            type="button"
            className={
              settings.theme === "light" ? styles.button : styles.buttonSecondary
            }
            disabled={pending || settings.theme === "light"}
            data-testid="theme-light"
            onClick={() => void persist({ theme: "light" })}
          >
            {messages.themeLight}
          </button>
          <button
            type="button"
            className={
              settings.theme === "dark" ? styles.button : styles.buttonSecondary
            }
            disabled={pending || settings.theme === "dark"}
            data-testid="theme-dark"
            onClick={() => void persist({ theme: "dark" })}
          >
            {messages.themeDark}
          </button>
        </div>
        <span data-testid="settings-theme" className={styles.srOnly}>
          {settings.theme}
        </span>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {status ? (
        <p className={styles.muted} data-testid="settings-status">
          {status}
        </p>
      ) : null}
    </div>
  );
}

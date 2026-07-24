"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserApi } from "@/shared/lib/api";
import type { Messages } from "@/shared/lib/i18n";

export type Settings = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["getSettings"]>
>;

export function useSettings(
  initialSettings: Settings,
  messages: Messages["settings"],
) {
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

  return {
    settings,
    workspaceName,
    setWorkspaceName,
    timezone,
    setTimezone,
    emailDigest,
    setEmailDigest,
    productUpdates,
    setProductUpdates,
    securityAlerts,
    setSecurityAlerts,
    error,
    status,
    pending,
    persist,
  };
}

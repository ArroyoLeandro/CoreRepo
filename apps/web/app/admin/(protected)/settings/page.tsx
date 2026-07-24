import { cookies } from "next/headers";
import { createServerApi } from "../../../../lib/api";
import { getMessages, resolveLocale } from "../../../../lib/i18n";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const settings = await api.getSettings();
  const locale = resolveLocale(settings.locale);
  const messages = getMessages(locale);

  return (
    <SettingsClient initialSettings={settings} messages={messages.settings} />
  );
}

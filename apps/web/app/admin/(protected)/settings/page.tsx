import { SettingsPanel } from "@/features/settings";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

export default async function AdminSettingsPage() {
  const api = createServerApi(await getRequestCookieHeader());
  const settings = await api.getSettings();
  const messages = getMessages(resolveLocale(settings.locale));

  return (
    <SettingsPanel
      initialSettings={settings}
      messages={messages.settings}
    />
  );
}

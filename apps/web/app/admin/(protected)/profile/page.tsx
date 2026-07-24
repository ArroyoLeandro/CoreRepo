import { ProfileForm } from "@/features/profile";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

export default async function AdminProfilePage() {
  const api = createServerApi(await getRequestCookieHeader());
  const [me, settings] = await Promise.all([api.me(), api.getSettings()]);
  const t = getMessages(resolveLocale(settings.locale));

  return (
    <ProfileForm
      initialUser={me}
      labels={t.profile}
      fieldLabels={t.users}
    />
  );
}

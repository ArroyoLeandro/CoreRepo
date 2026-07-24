import { UserForm } from "@/features/users";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

export default async function AdminCreateUserPage() {
  const api = createServerApi(await getRequestCookieHeader());
  const settings = await api.getSettings();
  const t = getMessages(resolveLocale(settings.locale));

  return <UserForm mode="create" labels={t.users} />;
}

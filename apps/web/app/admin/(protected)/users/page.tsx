import { UsersList } from "@/features/users";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

export default async function AdminUsersPage() {
  const api = createServerApi(await getRequestCookieHeader());
  const [list, settings] = await Promise.all([
    api.listUsers(),
    api.getSettings(),
  ]);
  const t = getMessages(resolveLocale(settings.locale));

  return <UsersList initialUsers={list.users} labels={t.users} />;
}

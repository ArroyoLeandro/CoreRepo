import { cookies } from "next/headers";
import { createServerApi } from "../../../../lib/api";
import { getMessages, resolveLocale } from "../../../../lib/i18n";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const [list, settings] = await Promise.all([
    api.listUsers(),
    api.getSettings(),
  ]);
  const t = getMessages(resolveLocale(settings.locale));

  return <UsersClient initialUsers={list.users} labels={t.users} />;
}

import { cookies } from "next/headers";
import { createServerApi } from "../../../../../lib/api";
import { getMessages, resolveLocale } from "../../../../../lib/i18n";
import { UserFormClient } from "../user-form-client";

export default async function AdminCreateUserPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const settings = await api.getSettings();
  const t = getMessages(resolveLocale(settings.locale));

  return <UserFormClient mode="create" labels={t.users} />;
}

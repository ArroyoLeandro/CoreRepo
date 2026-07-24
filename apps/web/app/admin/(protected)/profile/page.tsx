import { cookies } from "next/headers";
import { createServerApi } from "../../../../lib/api";
import { getMessages, resolveLocale } from "../../../../lib/i18n";
import { ProfileClient } from "./profile-client";

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const [me, settings] = await Promise.all([api.me(), api.getSettings()]);
  const t = getMessages(resolveLocale(settings.locale));

  return (
    <ProfileClient
      initialUser={me}
      labels={t.profile}
      fieldLabels={t.users}
    />
  );
}

import { notFound } from "next/navigation";
import { UserForm } from "@/features/users";
import { createServerApi } from "@/shared/lib/api";
import { getMessages, resolveLocale } from "@/shared/lib/i18n";
import { getRequestCookieHeader } from "@/shared/lib/request-cookies";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditUserPage({ params }: Props) {
  const { id } = await params;
  const api = createServerApi(await getRequestCookieHeader());
  const settings = await api.getSettings();
  const t = getMessages(resolveLocale(settings.locale));

  try {
    const user = await api.getUser(id);
    return <UserForm mode="edit" initialUser={user} labels={t.users} />;
  } catch {
    notFound();
  }
}

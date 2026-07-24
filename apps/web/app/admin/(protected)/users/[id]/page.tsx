import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerApi } from "../../../../../lib/api";
import { getMessages, resolveLocale } from "../../../../../lib/i18n";
import { UserFormClient } from "../user-form-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditUserPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const settings = await api.getSettings();
  const t = getMessages(resolveLocale(settings.locale));

  try {
    const user = await api.getUser(id);
    return (
      <UserFormClient mode="edit" initialUser={user} labels={t.users} />
    );
  } catch {
    notFound();
  }
}

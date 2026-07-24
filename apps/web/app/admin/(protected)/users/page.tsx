import { cookies } from "next/headers";
import { createServerApi } from "../../../../lib/api";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const list = await api.listUsers();

  return <UsersClient initialUsers={list.users} />;
}

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerApi } from "../../../lib/api";
import styles from "../admin.module.css";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  if (!cookieHeader.includes("access_token=")) {
    redirect("/admin/login");
  }

  try {
    const api = createServerApi(cookieHeader);
    await api.me();
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <span className={styles.brand}>CoreRepo Admin</span>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/settings">Settings</Link>
        <Link href="/admin/login">Login</Link>
      </nav>
      {children}
    </div>
  );
}

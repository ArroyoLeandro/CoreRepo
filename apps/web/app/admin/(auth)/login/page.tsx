"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createBrowserApi } from "../../../../lib/api";
import styles from "../../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const api = createBrowserApi();
      await api.login({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      router.replace("/admin/users");
      router.refresh();
    } catch {
      setError("Login failed. Check email and password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.authCard}>
      <h1 className={styles.title}>Admin login</h1>
      <p className={styles.muted}>Sign in to manage users and settings.</p>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
      <div className={styles.links}>
        <Link href="/admin/register">Register</Link>
        <Link href="/admin/forgot">Forgot password</Link>
      </div>
    </div>
  );
}

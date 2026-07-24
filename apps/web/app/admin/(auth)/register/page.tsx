"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createBrowserApi } from "../../../../lib/api";
import styles from "../../admin.module.css";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");
    try {
      const api = createBrowserApi();
      await api.register({ email, password, name });
      await api.login({ email, password });
      router.replace("/admin/users");
      router.refresh();
    } catch {
      setError("Registration failed. Try another email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.authCard}>
      <h1 className={styles.title}>Admin register</h1>
      <p className={styles.muted}>Create an account, then enter the console.</p>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" type="text" required autoComplete="name" />
        </label>
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
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create account"}
          </button>
        </div>
      </form>
      <div className={styles.links}>
        <Link href="/admin/login">Back to login</Link>
      </div>
    </div>
  );
}

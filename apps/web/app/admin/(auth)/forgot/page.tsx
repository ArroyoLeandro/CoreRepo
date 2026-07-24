"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createBrowserApi } from "../../../../lib/api";
import styles from "../../admin.module.css";

export default function AdminForgotPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const api = createBrowserApi();
      await api.forgotPassword({
        email: String(form.get("email") ?? ""),
      });
      setMessage(
        "If that email exists, a reset message was issued (dev stub logs the token).",
      );
    } catch {
      setError("Request failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.authCard}>
      <h1 className={styles.title}>Forgot password</h1>
      <p className={styles.muted}>
        Request a reset token via the email stub (console in API).
      </p>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.muted}>{message}</p> : null}
        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send reset"}
          </button>
        </div>
      </form>
      <div className={styles.links}>
        <Link href="/admin/login">Back to login</Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "../../../../components/auth/AuthShell";
import { Button, Field, TextInput } from "../../../../components/ui/form-controls";
import { createBrowserApi } from "../../../../lib/api";

export default function AdminForgotPage() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const api = createBrowserApi();
      await api.forgotPassword({
        email: String(form.get("email") ?? ""),
      });
      setDone(true);
    } catch {
      setError("Request failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      brand="CoreRepo"
      panelTitle="Reset access"
      panelSubtitle="We’ll email a reset token (dev stub logs it to the console)."
      steps={[
        { n: 1, label: "Request reset email", active: true },
        { n: 2, label: "Open the token link" },
        { n: 3, label: "Choose a new password" },
      ]}
      formTitle="Forgot password"
      formSubtitle="Enter the email associated with your account."
      theme="dark"
    >
      {done ? (
        <p className="text-sm text-muted">
          If that email exists, a reset message was sent (check API logs in
          development).
        </p>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Field label="Email">
            <TextInput name="email" type="email" required autoComplete="email" />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Sending…" : "Send reset"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/admin/login" className="text-foreground">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

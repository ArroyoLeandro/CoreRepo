"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createBrowserApi } from "@/shared/lib/api";
import { Button, Field, TextInput } from "@/shared/ui/form-controls";

export function ForgotForm() {
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
    <>
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
    </>
  );
}

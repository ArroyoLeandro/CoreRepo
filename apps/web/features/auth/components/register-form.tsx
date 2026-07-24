"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createBrowserApi } from "@/shared/lib/api";
import { Button, Field, TextInput } from "@/shared/ui/form-controls";

export function RegisterForm() {
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
      const email = String(form.get("email") ?? "");
      const password = String(form.get("password") ?? "");
      await api.register({
        email,
        password,
        name: String(form.get("name") ?? ""),
      });
      await api.login({ email, password });
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Registration failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Field label="Name">
          <TextInput name="name" required placeholder="Ada Lovelace" />
        </Field>
        <Field label="Email">
          <TextInput
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ada@example.com"
          />
        </Field>
        <Field label="Password">
          <TextInput
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
          />
        </Field>
        <p className="text-xs text-muted">Must be at least 8 characters.</p>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating…" : "Sign up"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/admin/login" className="font-medium text-foreground">
          Log in
        </Link>
      </p>
    </>
  );
}

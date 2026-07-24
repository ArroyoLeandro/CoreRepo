"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "../../../../components/auth/AuthShell";
import { Button, Field, TextInput } from "../../../../components/ui/form-controls";
import { createBrowserApi } from "../../../../lib/api";

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
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Login failed. Check email and password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      brand="CoreRepo"
      panelTitle="Welcome back"
      panelSubtitle="Sign in to manage users, settings, and the admin workspace."
      steps={[
        { n: 1, label: "Sign in to your account", active: true },
        { n: 2, label: "Open the dashboard" },
        { n: 3, label: "Configure workspace prefs" },
      ]}
      formTitle="Sign in"
      formSubtitle="Enter your credentials to continue."
      theme="dark"
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Field label="Email">
          <TextInput
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
          />
        </Field>
        <Field label="Password">
          <TextInput
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <Link href="/admin/register" className="hover:text-foreground">
          Create account
        </Link>
        <Link href="/admin/forgot" className="hover:text-foreground">
          Forgot password
        </Link>
      </div>
    </AuthShell>
  );
}

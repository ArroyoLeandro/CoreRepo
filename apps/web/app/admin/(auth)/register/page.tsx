"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "../../../../components/auth/AuthShell";
import { Button, Field, TextInput } from "../../../../components/ui/form-controls";
import { createBrowserApi } from "../../../../lib/api";

export default function AdminRegisterPage() {
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
      await api.register({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        name: String(form.get("name") ?? ""),
      });
      await api.login({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Registration failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      brand="CoreRepo"
      panelTitle="Get started with us"
      panelSubtitle="Complete these easy steps to register your account."
      steps={[
        { n: 1, label: "Sign up your account", active: true },
        { n: 2, label: "Set up your workspace" },
        { n: 3, label: "Set up your profile" },
      ]}
      formTitle="Sign up account"
      formSubtitle="Enter your personal data to create your account."
      theme="dark"
    >
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
    </AuthShell>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Button, Field, TextInput } from "../../../../components/ui/form-controls";
import { createBrowserApi } from "../../../../lib/api";
import type { Messages } from "../../../../lib/i18n";

type User = Awaited<ReturnType<ReturnType<typeof createBrowserApi>["me"]>>;

type Props = {
  initialUser: User;
  labels: Messages["profile"];
  fieldLabels: Messages["users"];
};

export function ProfileClient({ initialUser, labels, fieldLabels }: Props) {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const api = createBrowserApi();
      const patch: { name?: string; email?: string; password?: string } = {
        name,
        email,
      };
      if (password.trim()) patch.password = password;
      const updated = await api.updateUser(user.id, patch);
      setUser(updated);
      setStatus(labels.saved);
    } catch {
      setError(labels.saveError);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Account
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {labels.title}
        </h1>
        <p className="text-sm text-muted">{labels.description}</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 border border-line bg-surface-elevated p-3"
      >
        <Field label={fieldLabels.name}>
          <TextInput name="name" required defaultValue={user.name} />
        </Field>
        <Field label={fieldLabels.email}>
          <TextInput
            name="email"
            type="email"
            required
            defaultValue={user.email}
          />
        </Field>
        <Field label={fieldLabels.password}>
          <TextInput name="password" type="password" minLength={8} />
        </Field>
        <p className="text-xs text-muted">{fieldLabels.passwordHint}</p>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {status ? <p className="text-sm text-muted">{status}</p> : null}

        <Button type="submit" disabled={pending} className="w-fit">
          {fieldLabels.save}
        </Button>
      </form>
    </div>
  );
}

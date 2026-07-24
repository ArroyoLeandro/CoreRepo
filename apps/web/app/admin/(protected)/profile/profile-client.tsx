"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "../../../../components/dashboard/PageShell";
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
    <PageShell
      eyebrow="Account"
      title={labels.title}
      description={labels.description}
      padded={false}
    >
      <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 border-b border-line p-4 lg:border-r lg:border-b-0"
        >
          <div className="grid gap-3 sm:grid-cols-2">
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
            <div className="sm:col-span-2">
              <Field label={fieldLabels.password}>
                <TextInput name="password" type="password" minLength={8} />
              </Field>
            </div>
          </div>
          <p className="text-xs text-muted">{fieldLabels.passwordHint}</p>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {status ? <p className="text-sm text-muted">{status}</p> : null}

          <div className="mt-auto border-t border-line pt-3">
            <Button type="submit" disabled={pending} className="w-fit">
              {fieldLabels.save}
            </Button>
          </div>
        </form>

        <aside className="flex flex-col gap-3 bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Sesión
          </p>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted">Rol</dt>
              <dd className="font-mono text-xs uppercase tracking-wide text-foreground">
                {user.role}
              </dd>
            </div>
            <div>
              <dt className="text-muted">ID</dt>
              <dd className="break-all font-mono text-xs text-foreground">
                {user.id}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </PageShell>
  );
}

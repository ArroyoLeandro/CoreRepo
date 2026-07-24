"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageShell } from "../../../../components/dashboard/PageShell";
import { Button, Field, TextInput } from "../../../../components/ui/form-controls";
import { createBrowserApi } from "../../../../lib/api";
import type { Messages } from "../../../../lib/i18n";

type UserRow = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["listUsers"]>
>["users"][number];

type Props = {
  mode: "create" | "edit";
  initialUser?: UserRow;
  labels: Messages["users"];
};

export function UserFormClient({ mode, initialUser, labels }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const role = (String(form.get("role") ?? "user") as "admin" | "user") || "user";

    try {
      const api = createBrowserApi();
      if (mode === "create") {
        await api.createUser({ name, email, password, role });
      } else if (initialUser) {
        const patch: {
          name?: string;
          email?: string;
          password?: string;
          role?: "admin" | "user";
        } = { name, email, role };
        if (password.trim().length > 0) {
          patch.password = password;
        }
        await api.updateUser(initialUser.id, patch);
      }
      router.replace("/admin/users");
      router.refresh();
    } catch {
      setError(mode === "create" ? "Could not create user." : "Could not update user.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell
      eyebrow={labels.list}
      title={mode === "create" ? labels.create : labels.edit}
      padded={false}
    >
      <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 border-b border-line p-4 lg:border-r lg:border-b-0"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={labels.name}>
              <TextInput
                name="name"
                required
                defaultValue={initialUser?.name ?? ""}
              />
            </Field>
            <Field label={labels.email}>
              <TextInput
                name="email"
                type="email"
                required
                defaultValue={initialUser?.email ?? ""}
              />
            </Field>
            <Field label={labels.password}>
              <TextInput
                name="password"
                type="password"
                required={mode === "create"}
                minLength={mode === "create" ? 8 : undefined}
                autoComplete="new-password"
              />
            </Field>
            <Field label={labels.role}>
              <select
                name="role"
                defaultValue={initialUser?.role ?? "user"}
                className="h-10 w-full border border-line bg-surface px-3 text-sm outline-none focus:border-accent"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </Field>
          </div>

          {mode === "edit" ? (
            <p className="text-xs text-muted">{labels.passwordHint}</p>
          ) : null}

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <div className="mt-auto flex gap-2 border-t border-line pt-3">
            <Button type="submit" disabled={pending}>
              {labels.save}
            </Button>
            <Link
              href="/admin/users"
              className="inline-flex h-10 items-center border border-line px-4 text-sm text-foreground hover:bg-canvas"
            >
              {labels.cancel}
            </Link>
          </div>
        </form>

        <aside className="flex flex-col gap-4 bg-surface p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Roles
            </p>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li>
                <span className="font-medium text-foreground">user</span> —
                acceso estándar al panel.
              </li>
              <li>
                <span className="font-medium text-foreground">admin</span> —
                gestión de usuarios y preferencias.
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Seguridad
            </p>
            <p className="mt-2 text-sm text-muted">
              Contraseña mínima de 8 caracteres. En edición, dejá el campo vacío
              para no cambiarla.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

"use client";

import Link from "next/link";
import type { Messages } from "@/shared/lib/i18n";
import { PageShell } from "@/shared/layout/page-shell";
import { Button, Field, TextInput } from "@/shared/ui/form-controls";
import { useUserForm } from "../hooks/use-user-form";
import type { UserRow } from "../types";

type Props = {
  mode: "create" | "edit";
  initialUser?: UserRow;
  labels: Messages["users"];
};

export function UserForm({ mode, initialUser, labels }: Props) {
  const { error, pending, submit } = useUserForm(mode, initialUser);

  return (
    <PageShell
      eyebrow={labels.list}
      title={mode === "create" ? labels.create : labels.edit}
      padded={false}
    >
      <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
        <form
          onSubmit={submit}
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

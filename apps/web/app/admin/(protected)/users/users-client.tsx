"use client";

import { FormEvent, useState } from "react";
import { Button, Field, TextInput } from "../../../../components/ui/form-controls";
import { createBrowserApi } from "../../../../lib/api";

type UserRow = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["listUsers"]>
>["users"][number];

type Props = {
  initialUsers: UserRow[];
  labels: {
    title: string;
    create: string;
    name: string;
    email: string;
    password: string;
    role: string;
    actions: string;
    deactivate: string;
    edit: string;
    save: string;
    cancel: string;
  };
};

export function UsersClient({ initialUsers, labels }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function refresh() {
    const api = createBrowserApi();
    const list = await api.listUsers();
    setUsers(list.users);
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const api = createBrowserApi();
      await api.createUser({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        name: String(form.get("name") ?? ""),
        role: (String(form.get("role") ?? "user") as "admin" | "user") || "user",
      });
      event.currentTarget.reset();
      await refresh();
    } catch {
      setError("Could not create user.");
    } finally {
      setPending(false);
    }
  }

  async function onUpdate(id: string) {
    setError(null);
    setPending(true);
    try {
      const api = createBrowserApi();
      await api.updateUser(id, { name: editName });
      setEditingId(null);
      await refresh();
    } catch {
      setError("Could not update user.");
    } finally {
      setPending(false);
    }
  }

  async function onDeactivate(id: string) {
    setError(null);
    setPending(true);
    try {
      const api = createBrowserApi();
      await api.deleteUser(id);
      await refresh();
    } catch {
      setError("Could not deactivate user.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Directory
        </p>
        <h1
          className="mt-1 text-2xl font-semibold tracking-tight text-foreground"
          data-testid="users-title"
        >
          {labels.title}
        </h1>
      </header>

      <form
        onSubmit={onCreate}
        className="grid grid-cols-1 gap-3 border border-line bg-surface-elevated p-4 md:grid-cols-2"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted md:col-span-2">
          {labels.create}
        </p>
        <Field label={labels.name}>
          <TextInput name="name" required />
        </Field>
        <Field label={labels.email}>
          <TextInput name="email" type="email" required />
        </Field>
        <Field label={labels.password}>
          <TextInput name="password" type="password" required minLength={8} />
        </Field>
        <Field label={labels.role}>
          <select
            name="role"
            defaultValue="user"
            className="h-10 w-full border border-line bg-surface px-3 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <Button type="submit" disabled={pending}>
            {labels.create}
          </Button>
        </div>
      </form>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <section className="border border-line bg-surface-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                {[labels.name, labels.email, labels.role, labels.actions].map(
                  (label) => (
                    <th
                      key={label}
                      className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 text-foreground">
                    {editingId === user.id ? (
                      <TextInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                    {user.role}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {editingId === user.id ? (
                        <>
                          <Button
                            type="button"
                            disabled={pending}
                            onClick={() => void onUpdate(user.id)}
                          >
                            {labels.save}
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setEditingId(null)}
                          >
                            {labels.cancel}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setEditingId(user.id);
                              setEditName(user.name);
                            }}
                          >
                            {labels.edit}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={pending}
                            onClick={() => void onDeactivate(user.id)}
                          >
                            {labels.deactivate}
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

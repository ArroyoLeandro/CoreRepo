"use client";

import { FormEvent, useState } from "react";
import { createBrowserApi } from "../../../../lib/api";
import styles from "../../admin.module.css";

type UserRow = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["listUsers"]>
>["users"][number];

type Props = {
  initialUsers: UserRow[];
};

export function UsersClient({ initialUsers }: Props) {
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
    <div className={styles.panelWide}>
      <h1 className={styles.title}>Users</h1>
      <p className={styles.muted}>
        Create, update, and soft-delete (deactivate) users.
      </p>

      <form className={styles.form} onSubmit={onCreate}>
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={8} />
        </label>
        <label>
          Role
          <select name="role" defaultValue="user">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={pending}>
            Create user
          </button>
        </div>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {editingId === user.id ? (
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className={styles.actions}>
                  {editingId === user.id ? (
                    <>
                      <button
                        type="button"
                        className={styles.button}
                        disabled={pending}
                        onClick={() => onUpdate(user.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={styles.buttonSecondary}
                      onClick={() => {
                        setEditingId(user.id);
                        setEditName(user.name);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.buttonDanger}
                    disabled={pending}
                    onClick={() => onDeactivate(user.id)}
                  >
                    Deactivate
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

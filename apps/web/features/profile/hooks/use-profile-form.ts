"use client";

import { FormEvent, useState } from "react";
import { createBrowserApi } from "@/shared/lib/api";
import type { Messages } from "@/shared/lib/i18n";

export type ProfileUser = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["me"]>
>;

export function useProfileForm(
  initialUser: ProfileUser,
  labels: Messages["profile"],
) {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
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

  return { user, error, status, pending, submit };
}

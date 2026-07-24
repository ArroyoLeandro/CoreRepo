"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createBrowserApi } from "@/shared/lib/api";
import type { UserRow } from "../types";

type Mode = "create" | "edit";

export function useUserForm(mode: Mode, initialUser?: UserRow) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const role =
      (String(form.get("role") ?? "user") as "admin" | "user") || "user";

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
      setError(
        mode === "create" ? "Could not create user." : "Could not update user.",
      );
    } finally {
      setPending(false);
    }
  }

  return { error, pending, submit };
}

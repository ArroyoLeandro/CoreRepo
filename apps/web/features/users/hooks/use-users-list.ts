"use client";

import { useMemo, useState } from "react";
import { createBrowserApi } from "@/shared/lib/api";
import type { UserRow } from "../types";

const PAGE_SIZE = 8;

export function useUsersList(initialUsers: UserRow[]) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q),
    );
  }, [users, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  async function refresh() {
    const api = createBrowserApi();
    const list = await api.listUsers();
    setUsers(list.users);
  }

  async function deactivate(id: string) {
    setError(null);
    setPending(true);
    setOpenMenuId(null);
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

  function setSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  return {
    error,
    pending,
    query,
    setSearch,
    filteredCount: filtered.length,
    totalCount: users.length,
    pageCount,
    safePage,
    pageRows,
    setPage,
    openMenuId,
    setOpenMenuId,
    deactivate,
  };
}

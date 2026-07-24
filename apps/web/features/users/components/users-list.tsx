"use client";

import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import type { Messages } from "@/shared/lib/i18n";
import { PageShell } from "@/shared/layout/page-shell";
import { useUsersList } from "../hooks/use-users-list";
import type { UserRow } from "../types";

type Props = {
  initialUsers: UserRow[];
  labels: Messages["users"];
};

export function UsersList({ initialUsers, labels }: Props) {
  const list = useUsersList(initialUsers);

  return (
    <PageShell
      eyebrow="Directory"
      title={labels.title}
      titleTestId="users-title"
      actions={
        <Link
          href="/admin/users/new"
          className="inline-flex h-9 items-center bg-accent px-3 text-sm font-medium text-accent-fg"
        >
          {labels.create}
        </Link>
      }
      innerClassName="flex flex-col gap-3"
      padded={false}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">{labels.search}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            value={list.query}
            onChange={(e) => list.setSearch(e.target.value)}
            placeholder={labels.search}
            className="h-9 w-full border border-line bg-canvas pr-2 pl-8 text-sm outline-none focus:border-accent"
          />
        </label>
        <p className="px-1 text-xs text-muted">
          {list.filteredCount} / {list.totalCount}
        </p>
      </div>

      {list.error ? (
        <p className="px-3 text-sm text-danger">{list.error}</p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {[labels.name, labels.email, labels.role, labels.actions].map(
                (label) => (
                  <th
                    key={label}
                    className="px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {list.pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-8 text-center text-sm text-muted"
                >
                  {labels.empty}
                </td>
              </tr>
            ) : (
              list.pageRows.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-3 py-2 font-medium text-foreground">
                    {user.name}
                  </td>
                  <td className="px-3 py-2 text-muted">{user.email}</td>
                  <td className="px-3 py-2 font-mono text-xs uppercase tracking-wide text-muted">
                    {user.role}
                  </td>
                  <td className="relative px-3 py-2">
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center border border-line text-muted hover:bg-surface hover:text-foreground"
                      aria-label={labels.actions}
                      disabled={list.pending}
                      onClick={() =>
                        list.setOpenMenuId((id) =>
                          id === user.id ? null : user.id,
                        )
                      }
                    >
                      <MoreHorizontal className="size-4" strokeWidth={1.75} />
                    </button>
                    {list.openMenuId === user.id ? (
                      <div className="absolute top-10 right-3 z-20 min-w-[140px] border border-line bg-surface-elevated shadow-sm">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="block px-3 py-2 text-sm hover:bg-surface"
                          onClick={() => list.setOpenMenuId(null)}
                        >
                          {labels.edit}
                        </Link>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-surface"
                          onClick={() => void list.deactivate(user.id)}
                        >
                          {labels.deactivate}
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line px-3 py-2">
        <p className="text-xs text-muted">
          {labels.page} {list.safePage} {labels.of} {list.pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="h-8 border border-line px-3 text-xs disabled:opacity-40"
            disabled={list.safePage <= 1}
            onClick={() => list.setPage((p) => Math.max(1, p - 1))}
          >
            {labels.prev}
          </button>
          <button
            type="button"
            className="h-8 border border-line px-3 text-xs disabled:opacity-40"
            disabled={list.safePage >= list.pageCount}
            onClick={() =>
              list.setPage((p) => Math.min(list.pageCount, p + 1))
            }
          >
            {labels.next}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

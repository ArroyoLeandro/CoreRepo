"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  labels: Record<string, string>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function AdminBreadcrumbs({ labels }: Props) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: Array<{ href: string; label: string }> = [];
  let href = "";
  for (const part of parts) {
    href += `/${part}`;
    let label = labels[href] ?? labels[part];
    if (!label && UUID_RE.test(part)) {
      label = labels.editUser ?? "Edit";
    }
    if (!label) {
      label = part.replace(/-/g, " ");
    }
    crumbs.push({ href, label });
  }

  return (
    <nav
      className="hidden min-w-0 items-center gap-1.5 overflow-hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:flex"
      aria-label="Breadcrumb"
      data-testid="admin-breadcrumbs"
    >
      {crumbs.map((crumb, index) => {
        const last = index === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex min-w-0 items-center gap-1.5">
            {index > 0 ? <span className="text-line">/</span> : null}
            {last ? (
              <span className="truncate text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href === "/admin" ? "/admin" : crumb.href}
                className="truncate hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

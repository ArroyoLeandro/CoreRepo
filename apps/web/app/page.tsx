import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        CoreRepo
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Fullstack template
      </h1>
      <p className="text-sm text-muted">
        Next.js + NestJS monorepo with shared Zod contracts.
      </p>
      <div className="flex gap-3 pt-2">
        <Link
          href="/admin/login"
          className="inline-flex h-10 items-center bg-accent px-4 text-sm font-medium text-accent-fg"
        >
          Open admin
        </Link>
        <Link
          href="/admin/register"
          className="inline-flex h-10 items-center border border-line bg-surface-elevated px-4 text-sm text-foreground"
        >
          Register
        </Link>
      </div>
    </main>
  );
}

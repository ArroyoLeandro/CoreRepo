import { createApiClient } from "@repo/api-client";
import styles from "./page.module.css";

export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const api = createApiClient({ baseUrl: apiUrl });

  let healthLabel = "API unavailable";
  try {
    const health = await api.health();
    healthLabel = `${health.status} · ${health.service}`;
  } catch {
    healthLabel = "API unavailable";
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>CoreRepo</h1>
        <p>Fullstack template: Next.js web + NestJS API.</p>
        <p data-testid="api-health">API health: {healthLabel}</p>
      </main>
    </div>
  );
}

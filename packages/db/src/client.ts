import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

export function createDb(connectionString: string): {
  db: Database;
  sql: ReturnType<typeof postgres>;
} {
  const sql = postgres(connectionString, { max: 10 });
  const db = drizzle(sql, { schema });
  return { db, sql };
}

export function createDbFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): {
  db: Database;
  sql: ReturnType<typeof postgres>;
} {
  const connectionString = env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to create a database client");
  }
  return createDb(connectionString);
}

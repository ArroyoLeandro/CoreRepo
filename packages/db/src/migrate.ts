import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { join } from "node:path";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to run migrations");
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  const migrationsFolder = join(__dirname, "..", "drizzle");
  await migrate(db, { migrationsFolder });
  await sql.end();

  console.log("Migrations applied successfully");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

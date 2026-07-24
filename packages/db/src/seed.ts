import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import { resolve } from "node:path";
import { appSettings, users } from "./schema";
import { createDb } from "./client";

loadEnv({ path: resolve(__dirname, "../../../.env") });

export type SeedConfig = {
  databaseUrl: string;
  email: string;
  name: string;
  password: string;
};

export type SeedResult = {
  admin: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
  };
  settings: {
    locale: "es" | "en";
    theme: "light" | "dark";
  };
};

const DEFAULT_SEED_SETTINGS = {
  locale: "es" as const,
  theme: "light" as const,
};

export function resolveSeedConfig(
  env: NodeJS.ProcessEnv = process.env,
): SeedConfig {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run seed");
  }

  const password = env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error("SEED_ADMIN_PASSWORD is required to run seed");
  }

  return {
    databaseUrl,
    email: (env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase(),
    name: env.SEED_ADMIN_NAME ?? "Admin",
    password,
  };
}

export async function runSeed(config: SeedConfig): Promise<SeedResult> {
  const { db, sql } = createDb(config.databaseUrl);

  try {
    const passwordHash = await argon2.hash(config.password, {
      type: argon2.argon2id,
    });

    const existing = await db.query.users.findFirst({
      where: eq(users.email, config.email),
    });

    let admin: SeedResult["admin"];

    if (existing) {
      const [updated] = await db
        .update(users)
        .set({
          passwordHash,
          name: config.name,
          role: "admin",
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
        });
      admin = updated;
    } else {
      const [created] = await db
        .insert(users)
        .values({
          email: config.email,
          passwordHash,
          name: config.name,
          role: "admin",
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
        });
      admin = created;
    }

    await db
      .insert(appSettings)
      .values({
        key: "app",
        value: DEFAULT_SEED_SETTINGS,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value: DEFAULT_SEED_SETTINGS,
          updatedAt: new Date(),
        },
      });

    return {
      admin,
      settings: DEFAULT_SEED_SETTINGS,
    };
  } finally {
    await sql.end();
  }
}

async function main() {
  const config = resolveSeedConfig();
  const result = await runSeed(config);
  console.log(
    `Seed complete: admin=${result.admin.email} role=${result.admin.role}`,
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

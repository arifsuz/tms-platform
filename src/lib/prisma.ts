import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma Client singleton.
 * Prevents multiple instances during Next.js hot-reload in development.
 * Uses Prisma 7 adapter-pg pattern.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize the Prisma PG adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fall back to a dummy URL when DATABASE_URL is unset (e.g. a preview deploy with
// no database yet) so client construction never throws at import time. Real
// queries still fail and are caught at the route level, surfacing preview mode.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL ?? "file:./dev.db" } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

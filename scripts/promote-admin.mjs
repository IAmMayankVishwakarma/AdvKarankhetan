import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const configuredEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
if (!configuredEmail) {
  throw new Error("Set ADMIN_BOOTSTRAP_EMAIL to the existing account email first.");
}

const requestedEmail = process.argv[2]?.trim().toLowerCase();
if (requestedEmail !== configuredEmail) {
  throw new Error("Pass the exact ADMIN_BOOTSTRAP_EMAIL as the command argument.");
}

if (!process.env.SUPABASE_DB_URL) {
  throw new Error("SUPABASE_DB_URL is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.SUPABASE_DB_URL }),
});

try {
  const user = await prisma.user.update({
    where: { email: configuredEmail },
    data: { role: "ADMIN" },
    select: { email: true, role: true },
  });
  console.log(`Promoted ${user.email} to ${user.role}.`);
} finally {
  await prisma.$disconnect();
}

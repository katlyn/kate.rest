import { PrismaClient } from "../prisma/generated/client.ts";

const prisma = new PrismaClient();
export default prisma;
export * from "../prisma/generated/client.ts";

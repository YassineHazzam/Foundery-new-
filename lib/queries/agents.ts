// lib/queries/agents.ts
import { prisma } from "@/lib/db";

export async function listAgents(city?: string) {
  return prisma.agent.findMany({
    where: {
      verificationStatus: "approved",
      ...(city && { agency: { city } }),
    },
    include: { user: true, agency: true, properties: { select: { id: true }, where: { status: "published" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function agentByUserId(userId: string) {
  return prisma.agent.findUnique({
    where: { userId },
    include: { user: true, agency: true },
  });
}

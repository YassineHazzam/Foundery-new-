"use server";

import { prisma } from "@/lib/db";
import { authOptions, toSessionUser } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { can } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function approveAgent(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  if (!user || !can(user, "agent:approve")) throw new Error("Non autorisé.");

  const agentId = String(formData.get("agentId"));
  await prisma.agent.update({ where: { id: agentId }, data: { verificationStatus: "approved" } });
  await prisma.auditLog.create({
    data: { actorUserId: user.id, action: "approve_agent", resourceType: "agent", resourceId: agentId },
  });
  revalidatePath("/agents");
}

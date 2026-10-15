"use server";

import { prisma } from "@/lib/db";
import { authOptions, toSessionUser } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { hasRole } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function assignAdminRole(formData: FormData) {
  const session = await getServerSession(authOptions);
  const actor = toSessionUser(session as any);
  if (!actor || !hasRole(actor, "super_admin")) throw new Error("Non autorisé.");

  const email = String(formData.get("email") || "");
  const city = String(formData.get("city") || "").trim();
  const target = await prisma.user.findUnique({ where: { email } });
  if (!target) throw new Error("Utilisateur introuvable.");

  await prisma.userRole.create({
    data: {
      userId: target.id,
      role: "admin",
      scopeType: city ? "city" : "platform",
      scopeId: city || null,
      status: "approved",
    },
  });
  await prisma.auditLog.create({
    data: { actorUserId: actor.id, action: "assign_admin", resourceType: "user", resourceId: target.id },
  });
  revalidatePath("/admins");
}

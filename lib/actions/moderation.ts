"use server";

import { prisma } from "@/lib/db";
import { authOptions, toSessionUser } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { can } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function publishProperty(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  const propertyId = String(formData.get("propertyId"));
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!user || !property || !can(user, "property:publish", { type: "property", city: property.city })) {
    throw new Error("Non autorisé.");
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: "published", publishedAt: new Date() },
  });
  await prisma.auditLog.create({
    data: { actorUserId: user.id, action: "publish", resourceType: "property", resourceId: propertyId },
  });
  revalidatePath("/moderation");
}

export async function rejectProperty(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  const propertyId = String(formData.get("propertyId"));
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!user || !property || !can(user, "property:publish", { type: "property", city: property.city })) {
    throw new Error("Non autorisé.");
  }

  await prisma.property.update({ where: { id: propertyId }, data: { status: "archived" } });
  await prisma.auditLog.create({
    data: { actorUserId: user.id, action: "reject", resourceType: "property", resourceId: propertyId },
  });
  revalidatePath("/moderation");
}

"use server";

import { prisma } from "@/lib/db";
import { authOptions, toSessionUser } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProperty(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  if (!user || !can(user, "property:create")) {
    throw new Error("Non autorisé.");
  }

  const agent = await prisma.agent.findUnique({ where: { userId: user.id } });
  if (!agent) throw new Error("Profil agent introuvable.");

  const title = String(formData.get("title") || "");
  const city = String(formData.get("city") || "");
  const price = Number(formData.get("price") || 0);
  const transactionType = String(formData.get("transactionType") || "sale");
  const propertyType = String(formData.get("propertyType") || "appartement");
  const surface = formData.get("surface") ? Number(formData.get("surface")) : null;
  const bedrooms = formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null;
  const description = String(formData.get("description") || "");

  if (!title || !city || !price) throw new Error("Titre, ville et prix sont requis.");

  const slugBase = slugify(`${title}-${city}`);
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const property = await prisma.property.create({
    data: {
      ownerType: "agent",
      agentId: agent.id,
      agencyId: agent.agencyId,
      city,
      price,
      transactionType,
      propertyType,
      surface,
      bedrooms,
      description,
      title,
      slug,
      status: "pending_review",
    },
  });

  redirect(`/dashboard/annonces/${property.id}`);
}

"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createLead(formData: FormData) {
  const propertyId = String(formData.get("propertyId"));
  const name = String(formData.get("name") || "");
  const phone = String(formData.get("phone") || "");
  const email = formData.get("email") ? String(formData.get("email")) : null;
  const message = formData.get("message") ? String(formData.get("message")) : null;

  if (!propertyId || !name || !phone) {
    throw new Error("Nom et téléphone sont requis.");
  }

  const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { slug: true } });
  if (!property) throw new Error("Bien introuvable.");

  await prisma.lead.create({
    data: { propertyId, name, phone, email, message, status: "new" },
  });

  redirect(`/bien/${property.slug}?contact=envoye`);
}

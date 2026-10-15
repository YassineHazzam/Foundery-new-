// lib/queries/projects.ts — new-build developer projects ("projets-neufs").
import { prisma } from "@/lib/db";

export async function listProjects(city?: string) {
  return prisma.project.findMany({
    where: { status: "active", ...(city && { city }) },
    include: { developer: true, units: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function projectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { developer: true, units: { orderBy: { label: "asc" } } },
  });
  if (project) {
    await prisma.project.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
  }
  return project;
}

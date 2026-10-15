// lib/queries/properties.ts
//
// Single search entry point for properties — mirrors the role the old
// store.js `searchProperties()` played, but as typed Prisma queries. Used
// by /acheter, /louer, the map endpoint, agent dashboard and admin, each
// passing a different filter set.

import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export interface PropertySearchParams {
  transactionType?: "sale" | "rent";
  status?: string;
  city?: string;
  district?: string;
  propertyType?: string;
  titleStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  bedrooms?: number;
  bathrooms?: number;
  keyword?: string;
  agentId?: string;
  sort?: "recent" | "price_asc" | "price_desc";
  page?: number;
  perPage?: number;
}

export async function searchProperties(params: PropertySearchParams) {
  const {
    transactionType,
    status = "published",
    city,
    district,
    propertyType,
    titleStatus,
    minPrice,
    maxPrice,
    minSurface,
    maxSurface,
    bedrooms,
    bathrooms,
    keyword,
    agentId,
    sort = "recent",
    page = 1,
    perPage = 12,
  } = params;

  const where: Prisma.PropertyWhereInput = {
    status,
    ...(transactionType && { transactionType }),
    ...(city && { city }),
    ...(district && { district }),
    ...(propertyType && { propertyType }),
    ...(titleStatus && { titleStatus }),
    ...(agentId && { agentId }),
    ...(bedrooms && { bedrooms: { gte: bedrooms } }),
    ...(bathrooms && { bathrooms: { gte: bathrooms } }),
    ...((minPrice || maxPrice) && {
      price: { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) },
    }),
    ...((minSurface || maxSurface) && {
      surface: { ...(minSurface && { gte: minSurface }), ...(maxSurface && { lte: maxSurface }) },
    }),
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { reference: { contains: keyword, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : { publishedAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { media: { orderBy: { position: "asc" }, take: 1 }, agent: { include: { user: true } } },
    }),
    prisma.property.count({ where }),
  ]);

  return { items, total, page, perPage, pageCount: Math.ceil(total / perPage) };
}

export async function propertyBySlug(slug: string) {
  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      media: { orderBy: { position: "asc" } },
      agent: { include: { user: true, agency: true } },
    },
  });
  if (property) {
    await prisma.property.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
  }
  return property;
}

export async function propertyByReference(reference: string) {
  return prisma.property.findUnique({ where: { reference } });
}

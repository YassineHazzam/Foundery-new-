// scripts/migrate-from-legacy.ts
//
// Reads the old single-row JSON blob (table: foundry_store, from the
// Express/EJS app) and writes it into the new normalized Prisma schema.
// Run with the OLD DATABASE_URL still reachable (same Postgres instance is
// fine — we just query a different table/client before switching the app
// over to Prisma's models).
//
// Usage: npx tsx scripts/migrate-from-legacy.ts

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const prisma = new PrismaClient();
const legacyPool = new Pool({
  connectionString: process.env.LEGACY_DATABASE_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

interface LegacyDb {
  users: any[];
  agencies: any[];
  agents: any[];
  properties: any[];
  leads: any[];
  savedSearches: any[];
  developers: any[];
  projects: any[];
}

async function loadLegacy(): Promise<LegacyDb> {
  const { rows } = await legacyPool.query(
    "SELECT data FROM foundry_store WHERE id = 1"
  );
  if (!rows.length) throw new Error("No legacy data found at foundry_store id=1");
  return rows[0].data as LegacyDb;
}

async function main() {
  const legacy = await loadLegacy();
  const userIdMap = new Map<string, string>(); // legacy id -> new id (same uuid, kept for clarity)

  console.log(`Migrating ${legacy.users?.length || 0} users...`);
  for (const u of legacy.users || []) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        fullName: u.name || u.email.split("@")[0],
        passwordHash: u.passwordHash || null,
        status: "active",
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
      },
    });
    userIdMap.set(u.id, created.id);

    // Legacy stored a single `role` string per user — map it into the new
    // role-join-table. Everyone gets platform scope unless we know better
    // (agencies/cities get backfilled below once agencies are migrated).
    if (u.role) {
      await prisma.userRole.create({
        data: {
          userId: created.id,
          role: mapLegacyRole(u.role),
          scopeType: "platform",
          isPublicProfile: u.role === "agent" || u.role === "developer",
          status: "approved",
        },
      });
    }
  }

  console.log(`Migrating ${legacy.agencies?.length || 0} agencies...`);
  const agencyIdMap = new Map<string, string>();
  for (const a of legacy.agencies || []) {
    const created = await prisma.agency.create({
      data: {
        id: a.id,
        name: a.name,
        city: a.city,
        address: a.address || null,
        phone: a.phone || null,
        email: a.email || null,
        logoUrl: a.logo || null,
        status: a.isActive === false ? "inactive" : "active",
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
      },
    });
    agencyIdMap.set(a.id, created.id);
  }

  console.log(`Migrating ${legacy.agents?.length || 0} agents...`);
  const agentIdMap = new Map<string, string>();
  for (const ag of legacy.agents || []) {
    const userId = userIdMap.get(ag.userId);
    if (!userId) continue;
    const created = await prisma.agent.create({
      data: {
        id: ag.id,
        userId,
        agencyId: ag.agencyId ? agencyIdMap.get(ag.agencyId) : null,
        commissionRate: ag.commissionRate ?? null,
        contractType: ag.contractType || null,
        verificationStatus: ag.verificationStatus || "approved",
        createdAt: ag.createdAt ? new Date(ag.createdAt) : new Date(),
      },
    });
    agentIdMap.set(ag.id, created.id);
  }

  console.log(`Migrating ${legacy.developers?.length || 0} developers...`);
  const developerIdMap = new Map<string, string>();
  for (const d of legacy.developers || []) {
    const userId = userIdMap.get(d.userId);
    if (!userId) continue;
    const created = await prisma.developer.create({
      data: {
        id: d.id,
        userId,
        companyName: d.companyName,
        slug: d.slug,
        legalInfo: d.legalInfo || null,
        phone: d.phone || null,
        description: d.description || null,
        logoUrl: d.logo || null,
        verificationStatus: d.isActive ? "approved" : "pending",
        createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
      },
    });
    developerIdMap.set(d.id, created.id);
  }

  console.log(`Migrating ${legacy.properties?.length || 0} properties...`);
  for (const p of legacy.properties || []) {
    const { photos, ...rest } = p;
    const created = await prisma.property.create({
      data: {
        id: p.id,
        ownerType: "agent",
        agentId: p.agentId ? agentIdMap.get(p.agentId) : null,
        agencyId: p.agencyId ? agencyIdMap.get(p.agencyId) : null,
        city: p.city,
        district: p.district || null,
        address: p.address || null,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
        price: p.price,
        currency: p.currency || "MAD",
        propertyType: p.propertyType,
        transactionType: p.transaction || p.transactionType,
        status: p.status || "draft",
        title: p.title,
        slug: p.slug,
        reference: p.reference || null,
        description: p.description || null,
        surface: p.surface ?? null,
        bedrooms: p.bedrooms ?? null,
        bathrooms: p.bathrooms ?? null,
        titleStatus: p.titleStatus || null,
        features: p.features || [],
        viewCount: p.viewCount || 0,
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      },
    });
    const media: string[] = p.photos || [];
    for (let i = 0; i < media.length; i++) {
      await prisma.propertyMedia.create({
        data: { propertyId: created.id, type: "image", url: media[i], position: i },
      });
    }
  }

  console.log(`Migrating ${legacy.projects?.length || 0} projects...`);
  for (const proj of legacy.projects || []) {
    const developerId = developerIdMap.get(proj.developerId);
    if (!developerId) continue;
    const created = await prisma.project.create({
      data: {
        id: proj.id,
        developerId,
        name: proj.name,
        slug: proj.slug,
        city: proj.city,
        district: proj.district || null,
        address: proj.address || null,
        description: proj.description || null,
        amenities: proj.amenities || [],
        totalUnits: proj.totalUnits ?? null,
        floors: proj.floors ?? null,
        landSurface: proj.landSurface ?? null,
        lat: proj.lat ?? null,
        lng: proj.lng ?? null,
        launchDate: proj.launchDate ? new Date(proj.launchDate) : null,
        handoverDate: proj.handoverDate ? new Date(proj.handoverDate) : null,
        paymentPlan: proj.paymentPlan || undefined,
        photos: proj.photos || [],
        status: proj.status || "active",
        viewCount: proj.viewCount || 0,
        createdAt: proj.createdAt ? new Date(proj.createdAt) : new Date(),
        publishedAt: proj.publishedAt ? new Date(proj.publishedAt) : null,
      },
    });
    for (const u of proj.units || []) {
      await prisma.projectUnit.create({
        data: {
          id: u.id,
          projectId: created.id,
          label: u.label,
          unitType: u.unitType,
          surface: u.surface ?? null,
          bedrooms: u.bedrooms ?? null,
          floor: u.floor || null,
          price: u.price,
          status: u.status || "available",
        },
      });
    }
  }

  console.log(`Migrating ${legacy.leads?.length || 0} leads...`);
  for (const l of legacy.leads || []) {
    await prisma.lead.create({
      data: {
        id: l.id,
        propertyId: l.propertyId,
        publicUserId: l.userId ? userIdMap.get(l.userId) || null : null,
        name: l.name || null,
        email: l.email || null,
        phone: l.phone || null,
        message: l.message || null,
        status: l.status || "new",
        createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
      },
    });
  }

  console.log("Migration complete.");
}

function mapLegacyRole(legacyRole: string): "super_admin" | "admin" | "agent" | "developer" | "notary" | "public_user" {
  const known = ["super_admin", "admin", "agent", "developer", "notary", "public_user"];
  return (known.includes(legacyRole) ? legacyRole : "public_user") as any;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await legacyPool.end();
  });

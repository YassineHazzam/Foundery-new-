import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, toSessionUser } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/layout/DashboardShell";

const nav = [{ href: "/dashboard", label: "Dossiers" }];

const stageBadge: Record<string, string> = {
  offer: "badge--warn",
  notary_review: "badge--title",
  closed: "badge--verified",
};

export default async function NotaryDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  if (!user || !hasRole(user, "notary")) redirect("/connexion");

  const cases = await prisma.transactionParticipant.findMany({
    where: { userId: user.id, roleInTx: "notary" },
    include: { transaction: { include: { property: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell sectionLabel="Espace notaire" nav={nav}>
      <div className="dash-head">
        <div>
          <h1>Mes dossiers</h1>
          <p>Transactions sur lesquelles vous êtes assigné(e).</p>
        </div>
      </div>
      {cases.length === 0 ? (
        <p style={{ color: "var(--ink-500)" }}>Aucun dossier assigné pour l&apos;instant.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cases.map((c) => (
            <div key={c.id} className="card" style={{ padding: 16 }}>
              <strong>{c.transaction.property.title}</strong>
              <p style={{ color: "var(--ink-500)", fontSize: ".88rem", margin: "4px 0 8px" }}>
                {c.transaction.property.city}
              </p>
              <span className={`badge ${stageBadge[c.transaction.stage] || "badge--neutral"}`}>
                {c.transaction.stage}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

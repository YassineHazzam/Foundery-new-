import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, toSessionUser } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/layout/DashboardShell";

const nav = [{ href: "/dashboard/projets", label: "Mes projets" }];

export default async function DeveloperProjectsPage() {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  if (!user || !hasRole(user, "developer")) redirect("/connexion");

  const developer = await prisma.developer.findUnique({ where: { userId: user.id } });
  if (!developer) redirect("/connexion");

  const projects = await prisma.project.findMany({
    where: { developerId: developer.id },
    orderBy: { createdAt: "desc" },
    include: { units: true },
  });

  return (
    <DashboardShell sectionLabel="Espace promoteur" nav={nav}>
      <div className="dash-head"><h1>Mes projets</h1></div>
      {projects.length === 0 ? (
        <p style={{ color: "var(--ink-500)" }}>Aucun projet publié pour l&apos;instant.</p>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ink-200)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px" }}>Projet</th>
                <th style={{ padding: "12px 16px" }}>Ville</th>
                <th style={{ padding: "12px 16px" }}>Lots</th>
                <th style={{ padding: "12px 16px" }}>Disponibles</th>
                <th style={{ padding: "12px 16px" }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--ink-100)" }}>
                  <td style={{ padding: "12px 16px" }}>{p.name}</td>
                  <td style={{ padding: "12px 16px" }}>{p.city}</td>
                  <td style={{ padding: "12px 16px" }}>{p.units.length}</td>
                  <td style={{ padding: "12px 16px" }}>{p.units.filter((u) => u.status === "available").length}</td>
                  <td style={{ padding: "12px 16px" }}><span className="badge badge--verified">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}

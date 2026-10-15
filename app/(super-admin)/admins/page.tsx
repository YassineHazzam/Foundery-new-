import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, toSessionUser } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { assignAdminRole } from "@/lib/actions/super-admin";

const nav = [{ href: "/admins", label: "Administrateurs" }];

export default async function AdminsPage() {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);
  if (!user || !hasRole(user, "super_admin")) redirect("/connexion");

  const admins = await prisma.userRole.findMany({
    where: { role: "admin" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell sectionLabel="Super admin" nav={nav}>
      <div className="dash-head"><h1>Administrateurs</h1></div>
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--ink-200)", textAlign: "left" }}>
              <th style={{ padding: "12px 16px" }}>Nom</th>
              <th style={{ padding: "12px 16px" }}>Ville (scope)</th>
              <th style={{ padding: "12px 16px" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid var(--ink-100)" }}>
                <td style={{ padding: "12px 16px" }}>{a.user.fullName}</td>
                <td style={{ padding: "12px 16px" }}>{a.scopeId || "Global"}</td>
                <td style={{ padding: "12px 16px" }}><span className="badge badge--verified">{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 24, maxWidth: 420 }}>
        <h3>Promouvoir un utilisateur en admin</h3>
        <form action={assignAdminRole}>
          <div className="field">
            <label htmlFor="email">Email de l&apos;utilisateur</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="city">Ville (laisser vide pour global)</label>
            <input id="city" name="city" />
          </div>
          <button type="submit" className="btn btn--primary">Assigner le rôle admin</button>
        </form>
      </div>
    </DashboardShell>
  );
}

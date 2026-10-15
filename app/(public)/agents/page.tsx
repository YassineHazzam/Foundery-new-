import Link from "next/link";
import { listAgents } from "@/lib/queries/agents";

export const metadata = {
  title: "Nos agents immobiliers",
  description: "Découvrez le réseau d'agents commerciaux Foundry à travers le Maroc.",
};

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function AgentsPage({ searchParams }: PageProps) {
  const { city } = await searchParams;
  const agents = await listAgents(city);

  return (
    <main id="main" className="wrap section">
      <div className="section-head">
        <div>
          <h1>Nos agents</h1>
          <p>{agents.length} agents actifs</p>
        </div>
      </div>
      <div className="grid grid--3">
        {agents.map((a) => (
          <Link key={a.id} href={`/agents/${a.id}`} className="agent-tile card" style={{ padding: 18 }}>
            <div className="agent-tile-head">
              <div>
                <h3>{a.user.fullName}</h3>
                <p style={{ color: "var(--ink-500)", fontSize: ".9rem" }}>{a.agency?.city || "—"}</p>
              </div>
            </div>
            <div className="agent-tile-stats">
              <div><strong>{a.properties.length}</strong>annonces actives</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

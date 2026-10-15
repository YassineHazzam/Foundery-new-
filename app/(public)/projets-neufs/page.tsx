import Link from "next/link";
import { listProjects } from "@/lib/queries/projects";

export const metadata = {
  title: "Projets immobiliers neufs au Maroc",
  description: "Découvrez les résidences neuves et programmes immobiliers en cours au Maroc.",
};

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function ProjetsNeufsPage({ searchParams }: PageProps) {
  const { city } = await searchParams;
  const projects = await listProjects(city);

  return (
    <main id="main" className="wrap section">
      <nav className="np-crumbs" aria-label="Fil d'Ariane"><a href="/">Accueil</a> › <span aria-current="page">Projets neufs</span></nav>
      <h1>Projets neufs</h1>
      <div className="grid grid--3" style={{ marginTop: 20 }}>
        {projects.map((p) => (
          <Link key={p.id} href={`/projets-neufs/${p.slug}`} className="card">
            {p.photos[0] && (
              <div className="card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photos[0]} alt={p.name} loading="lazy" />
              </div>
            )}
            <div className="card-body">
              <h3>{p.name}</h3>
              <p style={{ color: "var(--ink-500)", fontSize: ".9rem" }}>{p.developer.companyName} — {p.city}</p>
              <p style={{ color: "var(--ink-500)", fontSize: ".85rem" }}>{p.units.length} lots</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

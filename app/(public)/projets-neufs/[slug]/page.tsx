import { notFound } from "next/navigation";
import { projectBySlug } from "@/lib/queries/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await projectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.city}`,
    description: project.description?.slice(0, 160),
    openGraph: { images: project.photos.slice(0, 1) },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await projectBySlug(slug);
  if (!project) notFound();

  return (
    <main id="main" className="wrap section">
      <h1>{project.name}</h1>
      <p style={{ color: "var(--ink-500)" }}>
        {project.city}{project.district ? `, ${project.district}` : ""} — par {project.developer.companyName}
      </p>

      {project.photos.length > 0 && (
        <div className="grid grid--2" style={{ marginTop: 20 }}>
          {project.photos.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt={project.name} loading="lazy" style={{ borderRadius: "var(--r)", width: "100%" }} />
          ))}
        </div>
      )}

      <p style={{ marginTop: 24, maxWidth: "70ch" }}>{project.description}</p>

      <h2 style={{ marginTop: 32 }}>Lots disponibles</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--ink-200)", textAlign: "left" }}>
            <th style={{ padding: "8px 4px" }}>Lot</th>
            <th style={{ padding: "8px 4px" }}>Type</th>
            <th style={{ padding: "8px 4px" }}>Surface</th>
            <th style={{ padding: "8px 4px" }}>Étage</th>
            <th style={{ padding: "8px 4px" }}>Prix</th>
            <th style={{ padding: "8px 4px" }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {project.units.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid var(--ink-100)" }}>
              <td style={{ padding: "8px 4px" }}>{u.label}</td>
              <td style={{ padding: "8px 4px" }}>{u.unitType}</td>
              <td style={{ padding: "8px 4px" }}>{u.surface} m²</td>
              <td style={{ padding: "8px 4px" }}>{u.floor}</td>
              <td style={{ padding: "8px 4px" }}>{u.price.toString()} MAD</td>
              <td style={{ padding: "8px 4px" }}>
                <span className={`badge ${u.status === "available" ? "badge--verified" : u.status === "reserved" ? "badge--warn" : "badge--neutral"}`}>
                  {u.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

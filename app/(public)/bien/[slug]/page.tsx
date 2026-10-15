import { notFound } from "next/navigation";
import { propertyBySlug } from "@/lib/queries/properties";
import { LeadForm } from "@/components/property/LeadForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await propertyBySlug(slug);
  if (!property) return {};
  return {
    title: `${property.title} — ${property.city}`,
    description: property.description?.slice(0, 160),
    openGraph: { images: property.media[0]?.url ? [property.media[0].url] : [] },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await propertyBySlug(slug);
  if (!property) notFound();

  return (
    <main id="main" className="wrap section">
      <nav aria-label="Fil d'Ariane" style={{ fontSize: ".85rem", color: "var(--ink-500)", marginBottom: 14 }}>
        <a href="/">Accueil</a> › <a href={property.transactionType === "rent" ? "/louer" : "/acheter"}>
          {property.transactionType === "rent" ? "Louer" : "Acheter"}
        </a> › <span aria-current="page">{property.title}</span>
      </nav>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          {property.media.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {property.media.slice(0, 4).map((m, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.id}
                  src={m.url}
                  alt={property.title}
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    gridColumn: i === 0 ? "span 2" : undefined,
                    aspectRatio: i === 0 ? "16/9" : "1/1",
                    borderRadius: "var(--r)",
                  }}
                />
              ))}
            </div>
          )}

          <h1 style={{ marginTop: 28 }}>{property.title}</h1>
          <p style={{ color: "var(--ink-500)" }}>
            {property.district ? `${property.district}, ` : ""}
            {property.city}
          </p>
          <div className="card-price" style={{ fontSize: "1.6rem", marginTop: 8 }}>
            {Number(property.price).toLocaleString("fr-MA")} {property.currency}
            {property.transactionType === "rent" && <small> / mois</small>}
          </div>

          <dl style={{ display: "flex", gap: 24, borderTop: "1px solid var(--ink-200)", borderBottom: "1px solid var(--ink-200)", padding: "16px 0", margin: "24px 0" }}>
            {property.surface && (
              <div><dt style={{ color: "var(--ink-500)", fontSize: ".82rem" }}>Surface</dt><dd>{property.surface} m²</dd></div>
            )}
            {property.bedrooms != null && (
              <div><dt style={{ color: "var(--ink-500)", fontSize: ".82rem" }}>Chambres</dt><dd>{property.bedrooms}</dd></div>
            )}
            {property.bathrooms != null && (
              <div><dt style={{ color: "var(--ink-500)", fontSize: ".82rem" }}>Salles de bain</dt><dd>{property.bathrooms}</dd></div>
            )}
          </dl>

          <p style={{ whiteSpace: "pre-line", color: "var(--ink-700)" }}>{property.description}</p>
        </div>

        <aside className="card" style={{ padding: 20 }}>
          {property.agent && (
            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--ink-200)" }}>
              <h3>{property.agent.user.fullName}</h3>
              {property.agent.agency && <p style={{ color: "var(--ink-500)", fontSize: ".9rem" }}>{property.agent.agency.name}</p>}
            </div>
          )}
          <LeadForm propertyId={property.id} />
        </aside>
      </div>
    </main>
  );
}

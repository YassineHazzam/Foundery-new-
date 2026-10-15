import Link from "next/link";

interface PropertyCardProps {
  slug: string;
  title: string;
  price: string;
  currency: string;
  city: string;
  district?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
  imageUrl?: string | null;
  transactionType: string;
  propertyType?: string;
  isNew?: boolean;
}

// Mirrors views/partials/card.ejs exactly (.card / .card-media / .card-body / .card-specs).
export function PropertyCard({
  slug,
  title,
  price,
  currency,
  city,
  district,
  bedrooms,
  bathrooms,
  surface,
  imageUrl,
  transactionType,
  propertyType,
  isNew,
}: PropertyCardProps) {
  const formattedPrice = Number(price).toLocaleString("fr-MA");

  return (
    <article className="card">
      <div className="card-media">
        <Link href={`/bien/${slug}`} tabIndex={-1} aria-hidden="true">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" loading="lazy" width={560} height={385} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "var(--ink-100)" }} />
          )}
        </Link>
        {isNew && (
          <div className="card-tags">
            <span className="badge badge--new">Nouveau</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-price">
          {formattedPrice} {currency}
          {transactionType === "rent" && <small> / mois</small>}
        </div>
        <div className="card-specs">
          {bedrooms ? (<><span><b>{bedrooms}</b> ch.</span><span className="sep">·</span></>) : null}
          {bathrooms ? (<><span><b>{bathrooms}</b> sdb</span><span className="sep">·</span></>) : null}
          {surface ? <span><b>{surface}</b> m²</span> : null}
          {propertyType && <><span className="sep">·</span><span>{propertyType}</span></>}
        </div>
        <Link className="card-loc" href={`/bien/${slug}`} style={{ color: "var(--ink-500)" }}>
          {district ? `${district}, ` : ""}{city}
        </Link>
      </div>
    </article>
  );
}

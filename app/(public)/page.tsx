import Link from "next/link";
import { searchProperties } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/property/PropertyCard";

export default async function HomePage() {
  const recent = await searchProperties({ perPage: 8, sort: "recent" });

  return (
    <main id="main">
      <section className="hero">
        <div className="hero-inner">
          <div className="wrap">
            <h1>Trouvez un bien, pas une annonce de plus.</h1>
            <p className="hero-lede">
              Foundry réunit des agences locales et des biens vérifiés à travers le Maroc — à Agadir
              d&apos;abord, bientôt ailleurs.
            </p>
            <form className="hero-search" action="/acheter" method="get">
              <div className="search-box">
                <svg width={20} height={20} style={{ color: "var(--ink-400)", flex: "0 0 auto" }} aria-hidden="true"><use href="#i-search" /></svg>
                <input type="search" name="q" placeholder="Ville, quartier, référence..." aria-label="Rechercher un lieu" />
                <button className="btn btn--primary" type="submit">Rechercher</button>
              </div>
            </form>
            <div className="hero-stats">
              <div className="hero-stat"><strong>{recent.total}</strong><span>annonces en ligne</span></div>
              <div className="hero-stat"><strong>Agadir</strong><span>ville de lancement</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Biens récents</h2>
              <p>Les dernières annonces publiées par notre réseau d&apos;agents.</p>
            </div>
            <Link href="/acheter" className="btn btn--secondary">Voir tout</Link>
          </div>
          <div className="grid grid--3">
            {recent.items.map((p) => (
              <PropertyCard
                key={p.id}
                slug={p.slug}
                title={p.title}
                price={p.price.toString()}
                currency={p.currency}
                city={p.city}
                district={p.district}
                bedrooms={p.bedrooms}
                bathrooms={p.bathrooms}
                surface={p.surface}
                imageUrl={p.media[0]?.url}
                transactionType={p.transactionType}
                propertyType={p.propertyType}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

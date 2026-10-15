import { searchProperties } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SearchFilters } from "@/components/property/SearchFilters";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "Louer un bien immobilier au Maroc",
  description: "Parcourez les annonces de biens à louer au Maroc, vérifiées par le réseau d'agences Foundry.",
};

export default async function LouerPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const result = await searchProperties({
    transactionType: "rent",
    city: sp.city,
    propertyType: sp.type,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    bedrooms: sp.bedrooms ? Number(sp.bedrooms) : undefined,
    keyword: sp.q,
    page: sp.page ? Number(sp.page) : 1,
  });

  return (
    <main id="main">
      <SearchFilters basePath="/louer" current={sp} />
      <div className="wrap section">
        <div className="section-head">
          <div>
            <h1>Louer</h1>
            <p>{result.total} biens trouvés</p>
          </div>
        </div>
        {result.items.length === 0 ? (
          <p style={{ color: "var(--ink-500)" }}>
            Aucun bien ne correspond à ces critères pour l&apos;instant. Essayez d&apos;élargir votre recherche.
          </p>
        ) : (
          <div className="grid grid--3">
            {result.items.map((p) => (
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
        )}
      </div>
    </main>
  );
}

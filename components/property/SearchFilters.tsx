interface SearchFiltersProps {
  basePath: string;
  current: Record<string, string | undefined>;
}

const cities = ["Agadir", "Casablanca", "Rabat", "Marrakech", "Tanger"];
const types = ["appartement", "villa", "terrain", "local-commercial"];

// Mirrors the .filters bar + .field-row pattern used on /acheter, /louer.
export function SearchFilters({ basePath, current }: SearchFiltersProps) {
  return (
    <div className="filters">
      <div className="wrap">
        <form action={basePath} className="field-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", alignItems: "end" }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="q">Recherche</label>
            <input id="q" name="q" type="search" defaultValue={current.q} placeholder="Mot-clé, référence..." />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="city">Ville</label>
            <select id="city" name="city" defaultValue={current.city || ""}>
              <option value="">Toutes</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue={current.type || ""}>
              <option value="">Tous</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="minPrice">Prix min</label>
            <input id="minPrice" name="minPrice" type="number" defaultValue={current.minPrice} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="maxPrice">Prix max</label>
            <input id="maxPrice" name="maxPrice" type="number" defaultValue={current.maxPrice} />
          </div>
          <button type="submit" className="btn btn--primary">Filtrer</button>
        </form>
      </div>
    </div>
  );
}

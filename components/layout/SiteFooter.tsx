import Link from "next/link";

const cities = ["Agadir", "Casablanca", "Rabat", "Marrakech", "Tanger"];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <svg className="mark" aria-hidden="true"><use href="#i-mark" /></svg>
              <span>Foundry</span>
            </div>
            <p style={{ fontSize: ".88rem", maxWidth: "32ch", color: "var(--ink-500)" }}>
              Le réseau d&apos;agences et la plateforme immobilière du Maroc.
            </p>
          </div>
          <div>
            <h4>Chercher</h4>
            <ul>
              <li><Link href="/acheter">Biens à vendre</Link></li>
              <li><Link href="/louer">Biens à louer</Link></li>
              <li><Link href="/agents">Trouver un agent</Link></li>
              <li><Link href="/estimation">Estimer un bien</Link></li>
              <li><Link href="/vendre">Vendre</Link></li>
              <li><Link href="/pret-immobilier">Prêt immobilier</Link></li>
            </ul>
          </div>
          <div>
            <h4>Villes</h4>
            <ul>
              {cities.map((c) => (
                <li key={c}><Link href={`/acheter?city=${encodeURIComponent(c)}`}>{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Professionnels</h4>
            <ul>
              <li><Link href="/connexion">Espace agent</Link></li>
              <li><Link href="/connexion">Espace promoteur</Link></li>
              <li><Link href="/agents">Annuaire des agences</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Foundry — Agadir, Maroc</span>
          <span>Les estimations sont indicatives et ne constituent pas une expertise.</span>
        </div>
      </div>
    </footer>
  );
}

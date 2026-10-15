import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions, toSessionUser } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";

// Matches views/partials/head.ejs: left icon rail + top header with main
// nav and account nav.
export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const user = toSessionUser(session as any);

  return (
    <>
      <nav className="rail" aria-label="Navigation rapide">
        <Link className="rail-item" href="/acheter">
          <svg width={20} height={20}><use href="#i-search" /></svg><span>Rechercher</span>
        </Link>
        <Link className="rail-item" href="/acheter?fav=1">
          <svg width={20} height={20}><use href="#i-heart" /></svg><span>Favoris</span>
        </Link>
        <Link className="rail-item" href="/acheter?alerts=1">
          <svg width={20} height={20}><use href="#i-bell" /></svg><span>Alertes</span>
        </Link>
        <span className="rail-sep" aria-hidden="true"></span>
        <Link className="rail-item" href="/estimation">
          <svg width={20} height={20}><use href="#i-trend" /></svg><span>Estimer</span>
        </Link>
        <Link className="rail-item" href="/pret-immobilier">
          <svg width={20} height={20}><use href="#i-calc" /></svg><span>Prêt</span>
        </Link>
        <Link className="rail-item" href="/agents">
          <svg width={20} height={20}><use href="#i-users" /></svg><span>Agents</span>
        </Link>
      </nav>

      <header className="site-header">
        <div className="header-inner">
          <Link className="logo" href="/">
            <svg className="mark" aria-hidden="true"><use href="#i-mark" /></svg>
            <span className="logo-text">Foundry</span>
          </Link>

          <div className="nav-panel" id="nav-panel">
            <nav className="nav nav--main" aria-label="Navigation principale">
              <Link href="/acheter">Acheter</Link>
              <Link href="/louer">Louer</Link>
              <Link href="/vendre">Vendre</Link>
              <Link href="/projets-neufs">Projets neufs</Link>
              <Link href="/pret-immobilier">Prêt immobilier</Link>
            </nav>
            <nav className="nav nav--right" aria-label="Compte">
              {user && hasRole(user, "agent") && <Link href="/dashboard/annonces">Espace agent</Link>}
              {user && hasRole(user, "developer") && <Link href="/dashboard/projets">Espace promoteur</Link>}
              {user && hasRole(user, "admin") && <Link href="/moderation">Administration</Link>}
              {user && hasRole(user, "super_admin") && <Link href="/admins">Super admin</Link>}
              {user && hasRole(user, "notary") && <Link href="/dashboard">Espace notaire</Link>}
              <Link href="/agents">Agents</Link>
              {user ? (
                <form method="post" action="/api/auth/signout" style={{ margin: 0 }}>
                  <button className="btn btn--ghost btn--sm" type="submit">Déconnexion</button>
                </form>
              ) : (
                <Link href="/connexion" className="btn btn--secondary btn--sm">Connexion</Link>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

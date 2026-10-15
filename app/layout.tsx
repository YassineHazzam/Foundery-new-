import type { Metadata } from "next";
import "./foundry.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: { default: "Foundry — Immobilier au Maroc", template: "%s — Foundry" },
  description:
    "Foundry référence les biens à vendre et à louer au Maroc : statut foncier vérifié, agents notés, estimation transparente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <a className="skip-link" href="#main">Aller au contenu</a>
          <IconSprite />
          <SiteHeader />
          <div className="shell">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}

// The original app defines its icon set as inline <symbol> defs reused via
// <use href="#i-x"/>. Kept verbatim so every component below can reference
// the same icons the legacy EJS views used.
function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></symbol>
        <symbol id="i-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.2s-7.3-4.7-7.3-9.9A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 7.3 2.9c0 5.2-7.3 9.9-7.3 9.9Z" /></symbol>
        <symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z" /><path d="M10.3 19.5a2 2 0 0 0 3.4 0" /></symbol>
        <symbol id="i-calc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M9 7.5h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" /></symbol>
        <symbol id="i-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><circle cx="9.5" cy="8" r="3.4" /><path d="M3.5 20a6 6 0 0 1 12 0M17 11.5a3 3 0 0 0 0-6M18 20a5.5 5.5 0 0 0-2.2-4.4" /></symbol>
        <symbol id="i-trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M16 7h5v5" /></symbol>
        <symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></symbol>
        <symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3Z" /><path d="M9 12l2 2 4-4" /></symbol>
        <symbol id="i-mark" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="currentColor" /><path d="M9 23V9h13v3.6h-9v2.7h8v3.5h-8V23z" fill="#F04E23" /></symbol>
      </defs>
    </svg>
  );
}

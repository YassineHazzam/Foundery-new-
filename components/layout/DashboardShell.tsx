import Link from "next/link";

interface DashboardShellProps {
  sectionLabel: string;
  nav: { href: string; label: string; count?: number }[];
  children: React.ReactNode;
}

// Mirrors views/partials/dash-*.ejs: a .dash grid with a .dash-side nav
// and a .dash-main content area.
export function DashboardShell({ sectionLabel, nav, children }: DashboardShellProps) {
  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="dash-side-label">{sectionLabel}</div>
        <nav className="dash-nav">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              <span>{item.label}</span>
              {typeof item.count === "number" && item.count > 0 && (
                <span className="count">{item.count}</span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}

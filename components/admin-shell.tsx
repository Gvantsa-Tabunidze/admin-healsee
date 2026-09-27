"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useCatalog } from "../state context/catalog-context";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { products } = useCatalog();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const logOut = async () => {
    setProfileMenuOpen(false);
    await createSupabaseClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  };
  const links = [
    { label: "Dashboard", href: "/dashboard", icon: "⌂" },
    { label: "Products", href: "/products", icon: "▦" },
    { label: "Categories", href: "/categories", icon: "◫" },
  ];
  const activeLabel =
    links.find((link) => pathname.startsWith(link.href))?.label ?? "Admin";
  return (
    <div className="admin-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">h</span>
          <span>healsee</span>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              className={`nav-item ${pathname.startsWith(link.href) ? "nav-item-active" : ""}`}
              href={link.href}
              key={link.href}
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
              {link.label === "Products" && (
                <span className="nav-count">{products.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="avatar">GS</span>
          <div>
            <strong>Gvantsa</strong>
            <small>Administrator</small>
          </div>
          <div className="profile-menu-wrap">
            <button
              className="more"
              aria-label="Open account menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              ···
            </button>
            {profileMenuOpen && (
              <div className="profile-menu">
                <button type="button" onClick={logOut}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="breadcrumbs">
            Admin <span>/</span> <strong>{activeLabel}</strong>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              ♧<i />
            </button>
            <div className="top-avatar">GS</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

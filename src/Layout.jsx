// src/Layout.jsx
// Redesigned dark forest green sidebar layout.
// Uses useAuth() from AuthContext (no external imports that might be missing).
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, BookOpen, Trophy, User, Target,
  Sprout, Zap, LogOut, ChevronRight, Menu, X, TrendingUp,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  { name: "Dashboard",   icon: Home,        path: "Dashboard" },
  { name: "Learn",       icon: BookOpen,    path: "Learn" },
  { name: "Simulations", icon: Target,      path: "Simulations" },
  { name: "Challenges",  icon: Zap,         path: "Challenges" },
  { name: "Progress",    icon: TrendingUp,  path: "Progress" },
  { name: "Rankings",    icon: Trophy,      path: "Leaderboard" },
  { name: "Account",     icon: User,        path: "Account" },
];

// Pages that render full-screen with no sidebar
const NO_LAYOUT = new Set([
  "landing", "login", "signup", "forgotpassword",
  "schoolselection", "welcome", "home",
]);

const syne = { fontFamily: "'Syne', sans-serif" };

// Inline styles for the sidebar theme
const S = {
  sidebar: {
    width: 232,
    background: "#0f2d1a",
    borderRight: "1px solid rgba(20,83,45,0.5)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 30,
    overflowY: "auto",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "22px 18px",
    borderBottom: "1px solid rgba(20,83,45,0.5)",
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: "linear-gradient(135deg,#4ade80,#16a34a)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
  },
  userPill: {
    margin: "14px 12px 4px",
    padding: "10px 12px",
    background: "rgba(20,83,45,0.4)",
    border: "1px solid rgba(20,83,45,0.7)",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    background: "linear-gradient(135deg,#4ade80,#16a34a)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  navArea: { flex: 1, padding: "8px 10px" },
  navLink: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 12,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 2,
    transition: "all 0.15s",
    background:    active ? "rgba(74,222,128,0.1)"  : "transparent",
    color:         active ? "#86efac"                : "rgba(134,239,172,0.45)",
    border:        active ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
  }),
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "9px 12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(134,239,172,0.3)",
    transition: "all 0.15s",
  },
  mainBg: { background: "#071510", minHeight: "100vh", color: "white" },
  mobileHeader: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    height: 56,
    background: "rgba(15,45,26,0.97)",
    borderBottom: "1px solid rgba(20,83,45,0.5)",
    backdropFilter: "blur(16px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    zIndex: 40,
  },
  bottomNav: {
    position: "fixed",
    bottom: 0, left: 0, right: 0,
    background: "rgba(15,45,26,0.97)",
    borderTop: "1px solid rgba(20,83,45,0.5)",
    backdropFilter: "blur(16px)",
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0 10px",
    zIndex: 40,
  },
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageName = String(currentPageName || "").toLowerCase();

  const handleLogout = () => {
    if (typeof logout === "function") logout(false);
    navigate(createPageUrl("Login"));
  };

  // Full-screen pages — no sidebar
  if (NO_LAYOUT.has(pageName)) {
    return <>{children}</>;
  }

  const isActive = (key) => location.pathname === createPageUrl(key);

  const displayName = user?.full_name || user?.email || "Student";
  const initials = displayName[0]?.toUpperCase() ?? "S";
  const level = user?.level ?? 1;
  const xp    = (user?.xp_points ?? 0).toLocaleString();

  // ── Sidebar inner content (shared between desktop + mobile drawer) ──────────
  function SidebarContent() {
    return (
      <>
        {/* Logo */}
        <div style={S.logoArea}>
          <div style={S.logoIcon}><Sprout size={18} color="white" /></div>
          <div>
            <p style={{ ...syne, fontSize: 18, fontWeight: 900, color: "white", margin: 0, lineHeight: 1 }}>Sprout</p>
            <p style={{ fontSize: 11, color: "rgba(74,222,128,0.5)", margin: 0, marginTop: 2 }}>Grow Your Knowledge</p>
          </div>
        </div>

        {/* User pill */}
        <div style={S.userPill}>
          <div style={S.avatar}>{initials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </p>
            <p style={{ fontSize: 11, color: "rgba(74,222,128,0.5)", margin: 0, marginTop: 1 }}>
              Lv {level} · {xp} XP
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={S.navArea}>
          {NAV_ITEMS.map(({ name, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={createPageUrl(path)}
                onClick={() => setMobileOpen(false)}
                style={S.navLink(active)}
                onMouseOver={e => { if (!active) { e.currentTarget.style.background = "rgba(20,83,45,0.4)"; e.currentTarget.style.color = "rgba(187,247,208,0.8)"; } }}
                onMouseOut={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(134,239,172,0.45)"; } }}
              >
                <Icon size={17} />
                <span>{name}</span>
                {active && <ChevronRight size={13} style={{ marginLeft: "auto", color: "rgba(74,222,128,0.4)" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px 10px 16px", borderTop: "1px solid rgba(20,83,45,0.5)" }}>
          <button
            onClick={handleLogout}
            style={S.logoutBtn}
            onMouseOver={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseOut={e => { e.currentTarget.style.color = "rgba(134,239,172,0.3)"; e.currentTarget.style.background = "none"; }}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        @media (min-width: 1024px) {
          .sprout-mobile-header { display: none !important; }
          .sprout-bottom-nav { display: none !important; }
          .sprout-desktop-sidebar { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .sprout-desktop-sidebar { display: none !important; }
          .sprout-main-content { margin-left: 0 !important; padding-top: 56px !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="sprout-desktop-sidebar" style={{ ...S.sidebar, display: "none" /* overridden by CSS */ }}>
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="sprout-mobile-header" style={S.mobileHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ ...S.logoIcon, width: 28, height: 28 }}><Sprout size={14} color="white" /></div>
          <span style={{ ...syne, fontSize: 18, fontWeight: 900, color: "white" }}>Sprout</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#86efac", padding: 4 }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 35 }} />
          <aside style={{ ...S.sidebar, width: 260, zIndex: 45, display: "flex" }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div
        className="sprout-main-content"
        style={{ ...S.mainBg, marginLeft: 232, paddingBottom: 40 }}
      >
        <main style={{ padding: "28px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="sprout-bottom-nav" style={S.bottomNav}>
        {NAV_ITEMS.slice(0, 5).map(({ name, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={name}
              to={createPageUrl(path)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "#4ade80" : "rgba(20,83,45,0.9)", textDecoration: "none", padding: "4px 12px" }}
            >
              <Icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 600 }}>{name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
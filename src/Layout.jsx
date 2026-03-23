// src/Layout.jsx
// Authenticated top nav — white bar, pill buttons, grid-centered links.
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, BookOpen, Trophy, User, Target,
  Sprout, Zap, LogOut, TrendingUp, Menu, X, ChevronDown,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  { name: "Home",            icon: Home,       path: "Dashboard"  },
  { name: "Browse Courses",  icon: BookOpen,   path: "Learn"      },
  { name: "Simulations",     icon: Target,     path: "Simulations"},
  { name: "Challenges",      icon: Zap,        path: "Challenges" },
  { name: "Progress",        icon: TrendingUp, path: "Progress"   },
  { name: "Rankings",        icon: Trophy,     path: "Leaderboard"},
];

const NO_LAYOUT = new Set([
  "landing", "login", "signup", "forgotpassword", "resetpassword",
  "schoolselection", "welcome", "home",
]);

const NAV_H = 64;

export default function Layout({ children, currentPageName }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  const pageName = String(currentPageName || "").toLowerCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handle(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    if (typeof logout === "function") logout(false);
    navigate(createPageUrl("Login"));
  };

  if (NO_LAYOUT.has(pageName)) return <>{children}</>;

  const isActive = (key) => location.pathname === createPageUrl(key);
  const displayName = user?.full_name || user?.email || "Student";
  const initials    = (displayName[0] || "S").toUpperCase();
  const level       = user?.level ?? 1;
  const xp          = (user?.xp_points ?? 0).toLocaleString();

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        /* ─── Nav shell ─────────────────────────────────────── */
        .sn-nav {
          position: fixed; top: 0; left: 0; right: 0;
          height: ${NAV_H}px; z-index: 50;
          background: #ffffff;
          border-bottom: 1px solid #e8e3de;
          transition: box-shadow 0.25s;
        }
        .sn-nav.scrolled {
          box-shadow: 0 2px 16px rgba(28,47,60,0.08);
        }

        /* Grid: [logo] [───centered links───] [user] */
        .sn-inner-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          height: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          gap: 16px;
        }

        /* ─── Logo ──────────────────────────────────────────── */
        .sn-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0;
        }
        .sn-logo-text {
          font-size: 18px; font-weight: 800;
          color: #1c2f3c; letter-spacing: -0.4px; line-height: 1;
        }

        /* ─── Centered nav pills ────────────────────────────── */
        .sn-links {
          display: flex; align-items: center;
          justify-content: center; /* key: centers within 1fr column */
          gap: 6px;
          flex-wrap: nowrap;
        }
        .sn-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1.5px solid #e2ddd8;
          background: transparent;
          font-size: 13.5px; font-weight: 500;
          color: #4a5568;
          text-decoration: none; cursor: pointer;
          transition: color 0.18s, background 0.18s, border-color 0.18s, box-shadow 0.18s;
          white-space: nowrap; line-height: 1;
        }
        .sn-link:hover {
          color: #1c2f3c;
          border-color: #1c2f3c;
          background: #f5f3f0;
        }
        .sn-link.active {
          background: #2a7a4b;
          border-color: #2a7a4b;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(42,122,75,0.22);
        }

        /* ─── Right side: user pill ─────────────────────────── */
        .sn-right {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0; justify-content: flex-end;
        }
        .sn-user { position: relative; }
        .sn-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 999px;
          background: #f5f3f0;
          border: 1.5px solid #e2ddd8;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
        }
        .sn-user-btn:hover {
          border-color: #1c2f3c;
          background: #ede8e3;
        }
        .sn-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: #2a7a4b;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: white;
          flex-shrink: 0;
        }
        .sn-user-info { line-height: 1.25; }
        .sn-user-name { font-size: 13px; font-weight: 600; color: #1c2f3c; }
        .sn-user-sub  { font-size: 11px; color: #9ca3af; }

        /* ─── Dropdown ──────────────────────────────────────── */
        .sn-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: white; border: 1px solid #e8e3de;
          border-radius: 14px; padding: 6px;
          min-width: 176px;
          box-shadow: 0 8px 28px rgba(28,47,60,0.1);
          z-index: 60;
        }
        .sn-drop-item {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 13px; border-radius: 9px;
          font-size: 13px; font-weight: 500; color: #374151;
          cursor: pointer; transition: background 0.15s;
          text-decoration: none; border: none;
          background: transparent; width: 100%;
        }
        .sn-drop-item:hover { background: #f5f3f0; color: #1c2f3c; }
        .sn-drop-item.danger { color: #ef4444; }
        .sn-drop-item.danger:hover { background: #fff1f2; }
        .sn-drop-divider { height: 1px; background: #f3f0ec; margin: 5px 0; }

        /* ─── Hamburger (mobile) ────────────────────────────── */
        .sn-hamburger {
          display: none; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: #1c2f3c; padding: 4px; flex-shrink: 0;
        }

        /* ─── Mobile drawer ─────────────────────────────────── */
        .sn-mobile-drawer {
          position: fixed; top: ${NAV_H}px; left: 0; right: 0;
          background: white;
          border-bottom: 1px solid #e8e3de;
          box-shadow: 0 8px 24px rgba(28,47,60,0.1);
          padding: 12px 16px 20px;
          z-index: 56;
        }
        .sn-mobile-user {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px 14px; margin-bottom: 4px;
        }
        .sn-mobile-divider { height: 1px; background: #f0ece8; margin: 8px 0; }
        .sn-mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #4a5568;
          text-decoration: none; transition: all 0.15s; margin-bottom: 2px;
        }
        .sn-mobile-link:hover { background: #f5f3f0; color: #1c2f3c; }
        .sn-mobile-link.active { background: #2a7a4b; color: white; }
        .sn-mobile-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #ef4444;
          background: none; border: none; cursor: pointer;
          transition: background 0.15s; width: 100%;
        }
        .sn-mobile-logout:hover { background: #fff1f2; }

        /* ─── Page content ──────────────────────────────────── */
        .sn-page {
          padding-top: ${NAV_H}px;
          min-height: 100vh;
          background: #f8f9fa;
        }
        .sn-page-inner {
          padding: 28px 24px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ─── Responsive ────────────────────────────────────── */
        @media (max-width: 960px) {
          .sn-links      { display: none !important; }
          .sn-right      { display: none !important; }
          .sn-hamburger  { display: flex !important; }
        }
        @media (min-width: 961px) {
          .sn-hamburger      { display: none !important; }
          .sn-mobile-drawer  { display: none !important; }
        }
      `}</style>

      {/* ── Nav bar ── */}
      <header className={`sn-nav${scrolled ? " scrolled" : ""}`}>
        <div className="sn-inner-grid">

          {/* Logo — left */}
          <Link to={createPageUrl("Dashboard")} className="sn-logo">
            <span className="sn-logo-text">Sprout</span>
            <Sprout size={22} color="#1c2f3c" strokeWidth={2.2} />
          </Link>

          {/* Nav pills — centered */}
          <nav className="sn-links">
            {NAV_ITEMS.map(({ name, path }) => {
              const active = isActive(path);
              return (
                <button
                  key={name}
                  onClick={() => navigate(createPageUrl(path))}
                  className={`sn-link${active ? " active" : ""}`}
                >
                  {name}
                </button>
              );
            })}
          </nav>

          {/* User pill + dropdown — right */}
          <div className="sn-right">
            <div className="sn-user" ref={userMenuRef}>
              <button
                className="sn-user-btn"
                onClick={() => setUserMenuOpen(o => !o)}
                aria-label="User menu"
              >
                <div className="sn-avatar">{initials}</div>
                <div className="sn-user-info">
                  <div className="sn-user-name">{displayName.split(" ")[0]}</div>
                  <div className="sn-user-sub">Lv {level} · {xp} XP</div>
                </div>
                <ChevronDown size={13} color="#9ca3af" style={{ marginLeft: 2 }} />
              </button>

              {userMenuOpen && (
                <div className="sn-dropdown">
                  <Link
                    to={createPageUrl("Account")}
                    className="sn-drop-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={14} /> My Account
                  </Link>
                  <Link
                    to={createPageUrl("Progress")}
                    className="sn-drop-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <TrendingUp size={14} /> My Progress
                  </Link>
                  <div className="sn-drop-divider" />
                  <button className="sn-drop-item danger" onClick={handleLogout}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="sn-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sn-mobile-drawer">
          <div className="sn-mobile-user">
            <div className="sn-avatar">{initials}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2f3c" }}>{displayName}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Lv {level} · {xp} XP</div>
            </div>
          </div>
          <div className="sn-mobile-divider" />
          {NAV_ITEMS.map(({ name, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <button
                key={name}
                onClick={() => { setMobileOpen(false); navigate(createPageUrl(path)); }}
                className={`sn-mobile-link${active ? " active" : ""}`}
              >
                <Icon size={17} />
                {name}
              </button>
            );
          })}
          <div className="sn-mobile-divider" />
          <button className="sn-mobile-logout" onClick={handleLogout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      )}

      {/* Page content */}
      <div className="sn-page">
        <main className="sn-page-inner">
          {children}
        </main>
      </div>
    </>
  );
}

// src/Layout.jsx
// Redesigned with dark forest green + white theme
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, BookOpen, Trophy, User, Target, Sprout,
  Zap, LogOut, ChevronRight, Menu, X, TrendingUp,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/appClient";

// ─── Theme tokens ─────────────────────────────────────────────
// bg-[#0f2d1a]  = dark forest sidebar
// bg-[#0a1f10]  = slightly deeper main bg
// text-green-400 = accent

const NAV_ITEMS = [
  { name: "Dashboard", icon: Home,     path: "Dashboard" },
  { name: "Learn",     icon: BookOpen, path: "Learn" },
  { name: "Simulations", icon: Target, path: "Simulations" },
  { name: "Challenges", icon: Zap,     path: "Challenges" },
  { name: "Progress",  icon: TrendingUp, path: "Progress" },
  { name: "Rankings",  icon: Trophy,   path: "Leaderboard" },
  { name: "Account",   icon: User,     path: "Account" },
];

// Pages that render without the sidebar (full-screen layout)
const NO_LAYOUT_PAGES = new Set([
  "landing",
  "login",
  "signup",
  "forgotpassword",
  "schoolselection",
  "welcome",
  "home",
]);

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(createPageUrl("Login"));
  };

  const pageName = String(currentPageName || "").toLowerCase();

  // Full-screen pages (no sidebar)
  if (NO_LAYOUT_PAGES.has(pageName)) {
    return <>{children}</>;
  }

  const isActive = (pageKey) => location.pathname === createPageUrl(pageKey);

  return (
    <div className="min-h-screen bg-[#071510] flex">

      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-60 bg-[#0f2d1a] border-r border-green-900/40">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-green-900/40">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/50 flex-shrink-0">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
              Sprout
            </h1>
            <p className="text-xs text-green-500/70 mt-0.5">Grow Your Knowledge</p>
          </div>
        </div>

        {/* User pill */}
        {user && (
          <div className="mx-4 mt-4 px-3 py-3 bg-green-900/30 border border-green-800/40 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user.full_name || user.email || "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-none">
                {user.full_name || "Student"}
              </p>
              <p className="text-xs text-green-400/60 mt-0.5">
                Lv {user.level ?? 1} · {(user.xp_points ?? 0).toLocaleString()} XP
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ name, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={createPageUrl(path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  active
                    ? "bg-green-500/15 text-green-300 border border-green-500/20"
                    : "text-green-200/50 hover:text-green-200 hover:bg-green-900/30"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${active ? "text-green-400" : "text-current"}`} style={{ width: "18px", height: "18px" }} />
                <span className="text-sm font-medium">{name}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-green-500/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-green-900/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-green-200/40 hover:text-red-400 hover:bg-red-900/10 transition-all duration-150 text-sm font-medium"
          >
            <LogOut style={{ width: "18px", height: "18px" }} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile header ───────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f2d1a]/95 backdrop-blur-xl border-b border-green-900/40 h-14 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Sprout</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-green-300 hover:text-white p-1.5"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-[#0f2d1a] w-72 h-full border-r border-green-900/40 flex flex-col overflow-y-auto">
            {user && (
              <div className="mx-4 mt-4 mb-2 px-3 py-3 bg-green-900/30 border border-green-800/40 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(user.full_name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.full_name || "Student"}</p>
                  <p className="text-xs text-green-400/60">Lv {user.level ?? 1} · {(user.xp_points ?? 0).toLocaleString()} XP</p>
                </div>
              </div>
            )}
            <nav className="flex-1 px-3 py-2 space-y-0.5">
              {NAV_ITEMS.map(({ name, icon: Icon, path }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={name}
                    to={createPageUrl(path)}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-green-500/15 text-green-300 border border-green-500/20"
                        : "text-green-200/50 hover:text-green-200 hover:bg-green-900/30"
                    }`}
                  >
                    <Icon style={{ width: "18px", height: "18px" }} />
                    <span className="font-medium">{name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-green-900/40">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-green-200/40 hover:text-red-400 text-sm font-medium"
              >
                <LogOut style={{ width: "18px", height: "18px" }} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content area ───────────────────────────────── */}
      <div className="flex-1 lg:ml-60">
        {/* Mobile top spacing */}
        <div className="lg:hidden h-14" />

        <main className="min-h-screen pb-24 lg:pb-8 px-4 md:px-6 lg:px-8 py-6 lg:py-8 text-white">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f2d1a]/95 backdrop-blur-xl border-t border-green-900/40 z-40">
        <nav className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
          {NAV_ITEMS.slice(0, 5).map(({ name, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={createPageUrl(path)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-green-400" : "text-green-700"
                }`}
              >
                <Icon style={{ width: "20px", height: "20px" }} />
                <span className="text-[10px] font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Google Fonts for Syne */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');`}</style>
    </div>
  );
}
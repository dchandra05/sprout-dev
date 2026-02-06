// FILE: src/Layout.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Trophy, User, Target, Sprout, Zap } from "lucide-react";

import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // your AuthContext.logout signature appears to accept a boolean
    logout(false);
    navigate(createPageUrl("Login"));
  };

  // Pages that don't need the sidebar/bottom nav
  const noLayoutPages = new Set([
    "login",
    "signup",
    "forgotpassword",
    "schoolselection",
    "welcome",
  ]);

  if (noLayoutPages.has(String(currentPageName || "").toLowerCase())) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-50">
        {children}
      </div>
    );
  }

  const navItems = [
    { name: "Home", icon: Home, path: "Dashboard" },
    { name: "Learn", icon: BookOpen, path: "Learn" },
    { name: "Simulations", icon: Target, path: "Simulations" },
    { name: "Challenges", icon: Zap, path: "Challenges" },
    { name: "Leaderboard", icon: Trophy, path: "Leaderboard" },
    { name: "Account", icon: User, path: "Account" },
  ];

  const isActive = (pageKey) => location.pathname === createPageUrl(pageKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:border-gray-200 lg:bg-white/80 lg:backdrop-blur-xl">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-8 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sprout</h1>
              <p className="text-xs text-gray-500">Grow Your Knowledge</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-lime-400 to-green-500 text-white shadow-lg shadow-lime-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Level {user.level || 1}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-3 w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg z-50">
        <nav className="flex justify-around items-center px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                  active ? "text-lime-500" : "text-gray-500"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "scale-110" : ""}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// src/App.jsx
import "./App.css";
import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

import { queryClientInstance } from "@/lib/query-client";
import VisualEditAgent from "@/lib/VisualEditAgent";
import NavigationTracker from "@/lib/NavigationTracker";
import PageNotFound from "@/lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

import { pagesConfig } from "./pages.config";
import { createPageUrl } from "@/utils";

const { Pages, Layout, mainPage } = pagesConfig;
const firstPageKey = Object.keys(Pages || {})[0];
const mainPageKey = mainPage ?? firstPageKey ?? "Login";

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;

function AuthGate() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // ✅ Never navigate during render; do it in an effect
  useEffect(() => {
    if (authError?.type === "auth_required") {
      // avoid loops: if we're already on login, don't re-trigger
      const onLoginRoute = location.pathname === createPageUrl("Login");
      if (!onLoginRoute) navigateToLogin();
    }
  }, [authError?.type, navigateToLogin, location.pathname]);

  // Loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Handle authentication errors (render something, don't return null)
  if (authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  // If auth is required, show a lightweight redirect screen
  if (authError?.type === "auth_required") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Always send "/" to your main page route */}
      <Route path="/" element={<Navigate to={createPageUrl(mainPageKey)} replace />} />

      {/* Register every page using createPageUrl so routes match your links */}
      {Object.entries(Pages).map(([pageKey, Page]) => (
        <Route
          key={pageKey}
          path={createPageUrl(pageKey)}
          element={
            <LayoutWrapper currentPageName={pageKey}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthGate />
        </Router>

        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  );
}

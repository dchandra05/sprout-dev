// src/App.jsx
import "./App.css";
import React, { useEffect, useMemo } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
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

/**
 * PUBLIC ROUTE WHITELIST
 * Anything matching these paths should NOT force login.
 */
const isPublicPath = (pathname) => {
  // Make AI Literacy course + all days public
  return pathname === "/ai-literacy" || pathname.startsWith("/ai-literacy/");
};

/**
 * Route component that maps /ai-literacy/day/:dayNumber -> Pages.AIDay1 ... Pages.AIDay10
 */
function AIDayRoute() {
  const { dayNumber } = useParams();

  const n = Number(dayNumber);
  if (!Number.isFinite(n) || n < 1 || n > 10) {
    return <Navigate to="/ai-literacy" replace />;
  }

  const key = `AIDay${n}`;
  const DayComponent = Pages?.[key];

  if (!DayComponent) {
    // If the page isn't registered in pages.config, fall back gracefully
    return <Navigate to="/ai-literacy" replace />;
  }

  return (
    <LayoutWrapper currentPageName={key}>
      <DayComponent />
    </LayoutWrapper>
  );
}

function AuthGate() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  const publicRoute = useMemo(() => isPublicPath(location.pathname), [location.pathname]);

  // ✅ Only redirect to login if this is NOT a public route
  useEffect(() => {
    if (authError?.type === "auth_required" && !publicRoute) {
      const onLoginRoute = location.pathname === createPageUrl("Login");
      if (!onLoginRoute) navigateToLogin();
    }
  }, [authError?.type, navigateToLogin, location.pathname, publicRoute]);

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

  // ✅ If auth is required BUT this is a public route, do NOT block rendering
  if (authError?.type === "auth_required" && !publicRoute) {
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

      {/* ✅ PUBLIC AI LITERACY ROUTES (explicit) */}
      <Route
        path="/ai-literacy"
        element={
          Pages?.AILiteracy ? (
            <LayoutWrapper currentPageName="AILiteracy">
              <Pages.AILiteracy />
            </LayoutWrapper>
          ) : (
            <PageNotFound />
          )
        }
      />
      <Route path="/ai-literacy/day/:dayNumber" element={<AIDayRoute />} />

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

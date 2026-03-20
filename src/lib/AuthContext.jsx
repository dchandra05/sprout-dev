// src/lib/AuthContext.jsx
// Real Supabase auth provider — replaces the previous stub.
// Subscribes to onAuthStateChange, fetches the profile row, and syncs
// it to localStorage("sprout_user") so all existing pages continue to
// work without needing to be rewritten.

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

/**
 * Builds the merged user object that localStorage-based pages expect.
 * Combines Supabase auth user + profiles row.
 */
function buildUserObject(authUser, profile) {
  return {
    id:                     authUser.id,
    email:                  authUser.email,
    full_name:              profile?.full_name
                              ?? authUser.user_metadata?.full_name
                              ?? authUser.user_metadata?.name
                              ?? "",
    phone:                  profile?.phone                   ?? "",
    school_id:              profile?.school_id               ?? "",
    school_name:            profile?.school_name             ?? "",
    grade:                  profile?.grade                   ?? "",
    username:               profile?.username                ?? "",
    show_on_leaderboard:    profile?.show_on_leaderboard     ?? true,
    role:                   profile?.role                    ?? "user",
    level:                  profile?.level                   ?? 1,
    xp_points:              profile?.xp_points               ?? 0,
    total_lessons_completed: profile?.total_lessons_completed ?? 0,
    current_streak:         profile?.current_streak          ?? 0,
    longest_streak:         profile?.longest_streak          ?? 0,
    onboarding_completed:   profile?.onboarding_completed    ?? false,
  };
}

export function AuthProvider({ children }) {
  // `profile` is the merged auth + DB object every component needs.
  // `user` is the raw Supabase auth user, kept for consumers that need it.
  const [user,          setUser]          = useState(null);
  const [profile,       setProfile]       = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError,     setAuthError]     = useState(null);
  const [appPublicSettings] = useState({ id: "local", public_settings: {} });

  /**
   * Called every time the Supabase auth state changes (login, logout,
   * token refresh, page reload).  Always derives the localStorage user
   * from the live Supabase session — never from a hardcoded fallback.
   */
  async function syncFromAuthUser(authUser) {
    if (!authUser) {
      // Signed out — wipe every piece of per-user localStorage
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem("sprout_user");
      localStorage.removeItem("sprout_user_progress");
      localStorage.removeItem("sprout_user_badges");
      return;
    }

    setUser(authUser);
    setIsAuthenticated(true);

    try {
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error) {
        console.error("[AuthContext] profile fetch error:", error.message);
      }

      const merged = buildUserObject(authUser, prof ?? null);
      setProfile(merged);

      // Keep localStorage in sync so all pages that use getLocalUser()
      // always show the correct user — no stale data from a prior session.
      localStorage.setItem("sprout_user", JSON.stringify(merged));
    } catch (err) {
      console.error("[AuthContext] syncFromAuthUser unexpected error:", err);
    }
  }

  useEffect(() => {
    // 1. Check whether there is already an active session on mount.
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setAuthError(error.message);
      syncFromAuthUser(data?.session?.user ?? null).finally(() => {
        setIsLoadingAuth(false);
      });
    });

    // 2. Subscribe to all future auth events (SIGNED_IN, SIGNED_OUT,
    //    TOKEN_REFRESHED, USER_UPDATED, etc.).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        syncFromAuthUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Signs the user out of Supabase.  The onAuthStateChange listener will
   * fire a SIGNED_OUT event which calls syncFromAuthUser(null) and clears
   * localStorage automatically.
   */
  const logout = async (shouldRedirect = true) => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[AuthContext] signOut error:", err);
    }
    // Belt-and-suspenders: clear localStorage immediately in case the
    // onAuthStateChange callback hasn't fired before navigation.
    localStorage.removeItem("sprout_user");
    localStorage.removeItem("sprout_user_progress");
    localStorage.removeItem("sprout_user_badges");

    if (shouldRedirect) {
      window.location.assign("/#/Login");
    }
  };

  const navigateToLogin = () => {
    window.location.assign("/#/Login");
  };

  // No-op kept for API compatibility with callers that invoke checkAppState()
  const checkAppState = async () => {};

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      // Expose setters for any page that still manually updates auth state
      setUser,
      setIsAuthenticated,
      setAuthError,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profile, isAuthenticated, isLoadingAuth, authError, appPublicSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

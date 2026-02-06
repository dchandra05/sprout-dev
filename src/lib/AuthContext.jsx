import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

/**
 * DE-BASE44 STUB
 * This keeps the app running locally while we replace Base44 auth + settings.
 * Later we can swap the internals to Supabase/Firebase/your API without changing consumers.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // Simulate "initial boot"
    setAuthError(null);

    // Public settings: set to something minimal so UI can proceed
    setAppPublicSettings({ id: "local", public_settings: {} });
    setIsLoadingPublicSettings(false);

    // Auth: default to logged-out locally
    setUser(null);
    setIsAuthenticated(false);
    setIsLoadingAuth(false);
  }, []);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    if (shouldRedirect) {
      // Keep behavior similar, but we no longer have Base44 redirect helpers
      window.location.assign("/Login");
    }
  };

  const navigateToLogin = () => {
    window.location.assign("/Login");
  };

  const checkAppState = async () => {
    // For compatibility with existing code that calls this
    return;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      // helpers if you want them later:
      setUser,
      setIsAuthenticated,
      setAuthError,
    }),
    [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

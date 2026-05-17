import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, logout as apiLogout } from "../services/api";

const AuthContext = createContext(null);

function clearAuthStorage() {
  if (typeof window === "undefined") return;
  const keys = ["token", "access_token", "accessToken", "authToken", "jwt"];
  for (const k of keys) {
    try {
      window.localStorage?.removeItem(k);
    } catch {}
    try {
      window.sessionStorage?.removeItem(k);
    } catch {}
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
      return me;
    } catch (e) {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    })();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refreshUser,
      setUser,
      logout,
    }),
    [user, loading, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070d1a" }}>
      <div
        className="rounded-xl h-44 w-[420px] max-w-[90vw] animate-pulse"
        style={{ background: "#0d1225", border: "1px solid #1e2d4a" }}
      />
    </div>
  );
}

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle Loading State
  if (loading) return <FullPageSpinner />;

  // 2. Define Public Routes
  const isPublicRoute = ["/login", "/signup"].includes(location.pathname);

  // 3. Redirect Unauthenticated users if trying to access a private route
  if (!user && !isPublicRoute) {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // 4. Admin Check (Keep this if you still want to restrict admin-only pages)
  if (requireAdmin && user && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
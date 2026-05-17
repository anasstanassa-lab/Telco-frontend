// src/App.jsx
// Root component — owns global state, hooks, and renders the layout.

import React, { useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "./components/Toast";
import { useTargets } from "./hooks/useTargets";
import { useToasts } from "./hooks/useToasts";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";

function DashboardPage() {
  const [search, setSearch] = useState("");
  const [filterDown, setFilterDown] = useState(false);

  const { toasts, addToast, removeToast } = useToasts();

  // Fire toast when a target changes status
  const handleStatusChange = useCallback(
    (target) => {
      if (target.status === "DOWN") {
        addToast(`${target.url} is DOWN`, "error");
      } else {
        addToast(`${target.url} recovered — back UP`, "success");
      }
    },
    [addToast]
  );

  const { targets, loading, error, adding, countdown, refreshing, refresh, handleAdd, handleDelete } =
    useTargets({ onStatusChange: handleStatusChange });

  // Wrap add/delete to also show toasts
  const onAdd = useCallback(
    async (url) => {
      try {
        const t = await handleAdd(url);
        addToast(`Added ${url} — status: ${t.status}`, t.status === "UP" ? "success" : "error");
      } catch (err) {
        addToast(`Failed to add ${url}: ${err.message}`, "error");
      }
    },
    [handleAdd, addToast]
  );

  const onDelete = useCallback(
    async (id) => {
      const target = targets.find((t) => t.id === id);
      try {
        await handleDelete(id);
        if (target) addToast(`Removed ${target.url}`, "info");
      } catch (err) {
        addToast(`Failed to remove target: ${err.message}`, "error");
      }
    },
    [targets, handleDelete, addToast]
  );

  const upCount = targets.filter((t) => t.status === "UP").length;
  const downCount = targets.filter((t) => t.status === "DOWN").length;

  return (
    <div className="min-h-screen" style={{ background: "#070d1a" }}>
      <Navbar totalUp={upCount} totalDown={downCount} onSearch={setSearch} searchVal={search} />
      <Dashboard
        targets={targets}
        loading={loading}
        error={error}
        adding={adding}
        countdown={countdown}
        refreshing={refreshing}
        filterDown={filterDown}
        setFilterDown={setFilterDown}
        search={search}
        onAdd={onAdd}
        onDelete={onDelete}
        onRefresh={refresh}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>

          {/* Admin-only */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

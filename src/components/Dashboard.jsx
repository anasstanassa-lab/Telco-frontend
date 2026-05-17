// src/components/Dashboard.jsx
// Main content region — toolbar, stats, card grid, empty states.

import React from "react";
import TargetCard  from "./TargetCard";
import StatsBar    from "./StatsBar";
import AddTargetForm from "./AddTargetForm";

export default function Dashboard({
  targets,
  loading,
  error,
  adding,
  countdown,
  refreshing,
  filterDown,
  setFilterDown,
  search,
  onAdd,
  onDelete,
  onRefresh,
}) {
  // Client-side filtering (search + DOWN filter)
  const filtered = targets
    .filter((t) => !filterDown || t.status === "DOWN")
    .filter((t) => !search || t.url.toLowerCase().includes(search.toLowerCase()));

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="w-full max-w-[1600px] mx-auto px-8 md:px-16 py-8 text-[16px] min-h-[calc(100vh-80px)]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-64 animate-pulse"
              style={{ background: "#0d1225", border: "1px solid #1e2d4a" }}
            />
          ))}
        </div>
      </main>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="w-full max-w-[1600px] mx-auto px-8 md:px-16 py-8 text-[16px] min-h-[calc(100vh-80px)]">
        <div className="rounded-xl p-10 text-center" style={{ background: "#1c0a0a", border: "1px solid #3b1c1c" }}>
          <p className="text-red-400 font-sans text-base mb-3">Failed to load targets</p>
          <p className="text-slate-600 font-mono text-sm mb-6">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-red-900/40 hover:bg-red-900/70 border border-red-700 rounded-lg
              px-6 py-3 text-red-300 text-sm font-sans transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1600px] mx-auto px-8 md:px-16 py-8 text-[16px] min-h-[calc(100vh-80px)] flex flex-col">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-sans text-3xl font-bold text-slate-100 tracking-tight">
            Network Monitor
          </h1>
          <p className="text-sm font-mono mt-2" style={{ color: "#4b5563" }}>
            {refreshing ? (
              <span className="text-blue-400 animate-pulse">● Refreshing…</span>
            ) : (
              `Next refresh in ${countdown}s`
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Filter toggle */}
          <button
            onClick={() => setFilterDown((x) => !x)}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold font-sans border transition-all"
            style={{
              background: filterDown ? "rgba(239,68,68,0.12)" : "transparent",
              borderColor: filterDown ? "rgba(239,68,68,0.5)" : "#1e2d4a",
              color: filterDown ? "#ef4444" : "#64748b",
            }}
          >
            {filterDown ? "✕ Clear filter" : "⚠ Show DOWN only"}
          </button>

          {/* Manual refresh */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-lg px-4 py-2.5 text-sm font-sans border border-navy-500
              text-slate-500 hover:text-slate-300 disabled:opacity-40 transition-all"
          >
            ↻ Refresh now
          </button>

          {/* Add form */}
          <AddTargetForm onAdd={onAdd} loading={adding} />
        </div>
      </div>

      {/* Summary metrics */}
      <StatsBar targets={targets} />

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-700">
          <div className="text-center py-36">
            <div className="text-5xl mb-4 opacity-40">◎</div>
            <p className="font-sans text-base text-slate-600">No targets found</p>
            <p className="text-sm font-mono mt-2 text-slate-700">
              {filterDown
                ? "No services are currently DOWN"
                : "Add a target above to start monitoring"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6 flex-1">
          {filtered.map((t) => (
            <TargetCard key={t.id} target={t} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-navy-700 flex justify-between flex-wrap gap-3">
        <span className="text-xs text-slate-800 font-mono">
          TelcoPulse © 2025 · Monitoring {targets.length} endpoints
        </span>
        <span className="text-xs text-slate-800 font-mono">Polling interval: 60s</span>
      </div>
    </main>
  );
}

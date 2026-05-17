// src/components/StatsBar.jsx
// Summary row of metric cards shown above the target grid.

import React from "react";
import { latencyColor } from "../utils/helpers";

function MetricCard({ label, value, color }) {
  return (
    <div
      className="flex-1 min-w-[200px] rounded-xl p-6 border"
      style={{ background: "#0d1225", borderColor: "#1e2d4a" }}
    >
      <p className="text-xs text-slate-600 uppercase tracking-widest font-sans mb-2">{label}</p>
      <p className="text-4xl font-bold font-sans" style={{ color }}>{value}</p>
    </div>
  );
}

export default function StatsBar({ targets }) {
  const up   = targets.filter((t) => t.status === "UP").length;
  const down = targets.filter((t) => t.status === "DOWN").length;
  const withLatency = targets.filter((t) => t.latency);
  const avgLat = withLatency.length
    ? Math.round(withLatency.reduce((a, b) => a + b.latency, 0) / withLatency.length)
    : 0;
  const avgUp = targets.length
    ? (targets.reduce((a, b) => a + b.uptime, 0) / targets.length).toFixed(2)
    : "0.00";

  const metrics = [
    { label: "Total Targets", value: targets.length, color: "#3b82f6" },
    { label: "Services Up",   value: up,              color: "#10b981" },
    { label: "Services Down", value: down,            color: "#ef4444" },
    { label: "Avg Latency",   value: `${avgLat}ms`,  color: latencyColor(avgLat) },
    { label: "Avg Uptime",    value: `${avgUp}%`,    color: "#a78bfa" },
  ];

  return (
    <div className="flex gap-5 flex-wrap mb-8">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}

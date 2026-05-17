// src/components/TargetCard.jsx
// Individual monitoring card — displays status, latency, uptime, and trend chart.

import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { latencyColor, latencyLabel, fmtTime } from "../utils/helpers";

/** Mini sparkline chart for the latency history */
function LatencyChart({ history, color }) {
  const data = history.map((v, i) => ({
    t: `-${(history.length - 1 - i) * 5}m`,
    ms: v ?? 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={70}>
      <LineChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
        <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#4b5563" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#4b5563" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#0d1225", border: "1px solid #1e2d4a", borderRadius: 6, fontSize: 11, padding: "6px 10px" }}
          labelStyle={{ color: "#64748b" }}
          itemStyle={{ color }}
        />
        <Line type="monotone" dataKey="ms" stroke={color} strokeWidth={2} dot={false} animationDuration={400} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function TargetCard({ target, onDelete }) {
  const [showChart, setShowChart] = useState(false);

  const isUp   = target.status === "UP";
  const lColor = latencyColor(target.latency);
  const lLabel = latencyLabel(target.latency);

  return (
    <article
      className="animate-fade-up rounded-2xl p-6 relative overflow-hidden transition-all duration-300"
      style={{
        background: "#0d1225",
        border: `1px solid ${isUp ? "#1e3a2f" : "#3b1c1c"}`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: isUp
            ? "linear-gradient(90deg,#10b981,transparent)"
            : "linear-gradient(90deg,#ef4444,transparent)",
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Animated status dot */}
          <div className="relative w-3 h-3 flex-shrink-0">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: isUp ? "#10b981" : "#ef4444" }}
            />
            {isUp && (
              <div
                className="absolute inset-[-3px] rounded-full border border-emerald-400 animate-pulse-ring"
              />
            )}
          </div>
          <span className="font-mono text-base text-slate-300 truncate">{target.url}</span>
        </div>
        <button
          onClick={() => onDelete(target.id)}
          title="Remove target"
          className="text-slate-700 hover:text-red-400 transition-colors text-base ml-2 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Latency tile */}
        <div className="bg-[#070d1a] rounded-xl p-4">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-sans mb-2">Latency</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-sans" style={{ color: lColor }}>
              {target.latency ?? "—"}
            </span>
            {target.latency && <span className="text-sm text-slate-600">ms</span>}
          </div>
          <p className="text-xs font-bold tracking-widest mt-2" style={{ color: lLabel.color }}>
            {lLabel.text}
          </p>
        </div>

        {/* Uptime tile */}
        <div className="bg-[#070d1a] rounded-xl p-4">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-sans mb-2">Uptime</p>
          <span
            className="text-3xl font-bold font-sans"
            style={{
              color: target.uptime > 99 ? "#10b981" : target.uptime > 95 ? "#f59e0b" : "#ef4444",
            }}
          >
            {target.uptime}%
          </span>
          <p className="text-xs text-slate-600 mt-2">30d avg</p>
        </div>
      </div>

      {/* Trend chart toggle */}
      <button
        onClick={() => setShowChart((x) => !x)}
        className="w-full text-left mb-3"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-600 uppercase tracking-widest">Latency trend</span>
          <span className="text-xs text-slate-600">{showChart ? "▲" : "▼"}</span>
        </div>
        {showChart ? (
          <LatencyChart history={target.history} color={lColor} />
        ) : (
          /* Collapsed progress bar */
          <div className="h-0.5 bg-navy-600 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${Math.min(100, ((target.latency || 0) / 5))}%`,
                background: lColor,
              }}
            />
          </div>
        )}
      </button>

      {/* Timestamp */}
      <p className="text-xs text-slate-700 font-mono mt-2">
        Last check: {fmtTime(target.lastChecked)}
      </p>
    </article>
  );
}

// src/components/Navbar.jsx
// Top navigation bar — logo, live indicator, status counters, search input.

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function StatusPill({ count, type }) {
  const isUp = type === "up";
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold font-sans
      ${isUp
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${isUp ? "bg-emerald-400" : "bg-red-400"}`} />
      {count} {isUp ? "UP" : "DOWN"}
    </div>
  );
}

export default function Navbar({ totalUp, totalDown, onSearch, searchVal }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = !!user?.is_admin;
  const showSearchAndStatus =
    typeof onSearch === "function" &&
    typeof searchVal === "string" &&
    typeof totalUp === "number" &&
    typeof totalDown === "number";

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-navy-700 border-b border-navy-500 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="4" fill="#3b82f6" />
          <path d="M14 1 Q20 8 20 14 Q20 20 14 27 Q8 20 8 14 Q8 8 14 1Z"
            stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.5" />
          <line x1="1" y1="14" x2="27" y2="14" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        </svg>
        <span className="font-sans font-bold text-lg text-white tracking-tight">
          Telco<span className="text-blue-400">Pulse</span>
        </span>
        <span className="bg-navy-900 border border-navy-500 rounded px-2 py-0.5 text-[10px] text-slate-600 font-mono">
          v2.4.1
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {showSearchAndStatus ? (
          <>
            {/* Search */}
            <input
              value={searchVal}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search targets..."
              className="bg-navy-600 border border-navy-500 rounded-md px-3 py-1.5 text-xs text-slate-200
                placeholder-slate-600 font-mono w-48 outline-none focus:border-blue-500 transition-colors"
            />

            <StatusPill count={totalUp} type="up" />
            <StatusPill count={totalDown} type="down" />
          </>
        ) : null}

        {/* Live dot */}
        <div className="flex items-center gap-1.5">
          <div className="relative w-2 h-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-[-3px] rounded-full border border-emerald-400 animate-pulse-ring" />
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">LIVE</span>
        </div>

        {isAdmin ? (
          <button
            onClick={() => navigate("/admin")}
            className="rounded-md px-3 py-1.5 text-xs font-sans border border-navy-500
              text-slate-300 hover:text-white hover:border-blue-500/60 transition-all"
          >
            Admin Panel
          </button>
        ) : null}

        {user ? (
          <button
            onClick={onLogout}
            className="rounded-md px-3 py-1.5 text-xs font-sans border border-red-500/40
              bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/60 transition-all"
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}

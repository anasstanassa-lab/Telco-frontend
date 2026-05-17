import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added Link and useNavigate
import { signup } from "../services/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate(); // Initialize navigation

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSuccess(false);
    setSubmitting(true);
    try {
      await signup({ email: email.trim(), password });
      setSuccess(true);
      
      // Use navigate instead of window.location for a smoother transition
      setTimeout(() => {
        navigate("/login");
      }, 1500); 
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#070d1a" }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 border"
        style={{ background: "#0d1225", borderColor: "#1e2d4a" }}
      >
        {/* ... Logo Section ... */}
        <div className="flex items-center gap-3 mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
             <circle cx="14" cy="14" r="13" stroke="#3b82f6" strokeWidth="1.5" />
             <circle cx="14" cy="14" r="4" fill="#3b82f6" />
             <path d="M14 1 Q20 8 20 14 Q20 20 14 27 Q8 20 8 14 Q8 8 14 1Z" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.5" />
             <line x1="1" y1="14" x2="27" y2="14" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          </svg>
          <div>
            <div className="font-sans font-bold text-lg text-white tracking-tight">
              Telco<span className="text-blue-400">Pulse</span>
            </div>
            <div className="text-[11px] font-mono" style={{ color: "#4b5563" }}>
              Create your account
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg p-3 mb-4 text-xs font-sans border bg-red-500/10 text-red-300 border-red-500/30">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg p-3 mb-4 text-xs font-sans border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
            Account created. Redirecting to login…
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-sans text-slate-400 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              className="w-full bg-[#0d1225] border border-[#1e2d4a] rounded-md px-3 py-2 text-xs
                text-slate-200 placeholder-slate-600 font-mono outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans text-slate-400 mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full bg-[#0d1225] border border-[#1e2d4a] rounded-md px-3 py-2 text-xs
                text-slate-200 placeholder-slate-600 font-mono outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !email.trim() || !password}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
              rounded-md px-3.5 py-2 text-white text-xs font-semibold font-sans transition-all"
          >
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-[11px] font-mono text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
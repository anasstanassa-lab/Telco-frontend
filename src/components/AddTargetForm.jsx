// src/components/AddTargetForm.jsx
// Controlled form for adding a new URL/IP/hostname to monitor.

import React, { useState } from "react";

export default function AddTargetForm({ onAdd, loading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onAdd(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-xs">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm select-none">⊕</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add URL, IP or hostname..."
          className="w-full bg-navy-600 border border-navy-500 rounded-md pl-7 pr-3 py-2 text-xs
            text-slate-200 placeholder-slate-600 font-mono outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
          rounded-md px-3.5 py-2 text-white text-xs font-semibold font-sans transition-all whitespace-nowrap"
      >
        {loading ? "Adding…" : "+ Add Target"}
      </button>
    </form>
  );
}

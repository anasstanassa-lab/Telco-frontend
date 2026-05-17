// src/components/Toast.jsx
// Toast notification system — individual Toast + ToastContainer.

import React, { useState, useEffect } from "react";

const TYPE_CONFIG = {
  success: { bg: "#065f46", border: "#10b981", icon: "✓", textColor: "#6ee7b7" },
  error:   { bg: "#7f1d1d", border: "#ef4444", icon: "✕", textColor: "#fca5a5" },
  info:    { bg: "#1e3a5f", border: "#3b82f6", icon: "ℹ", textColor: "#93c5fd" },
};

/** Single toast — auto-exits after duration */
function Toast({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onRemove, 280);
    }, 3200);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={exiting ? "animate-slide-out" : "animate-slide-in"}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        minWidth: 260,
        maxWidth: 340,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <span style={{ fontSize: 14, color: config.textColor, flexShrink: 0 }}>{config.icon}</span>
      <span className="text-xs font-sans text-slate-200 leading-snug">{toast.message}</span>
    </div>
  );
}

/** Container fixed to top-right corner */
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

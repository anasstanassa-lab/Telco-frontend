// src/components/ConfirmModal.jsx
// Custom confirmation modal with dark theme, backdrop blur, and keyboard accessibility

import React, { useEffect, useRef } from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
}) {
  const confirmButtonRef = useRef(null);

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus confirm button on open
    confirmButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(7, 13, 26, 0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 border shadow-2xl"
        style={{
          background: "#0d1225",
          borderColor: isDestructive ? "rgba(239, 68, 68, 0.5)" : "#1e2d4a",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Destructive accent bar */}
        {isDestructive && (
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{
              background: "linear-gradient(90deg, #ef4444, transparent)",
            }}
          />
        )}

        {/* Icon */}
        <div className="mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: isDestructive ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.15)",
            }}
          >
            <span
              className="text-2xl"
              style={{ color: isDestructive ? "#ef4444" : "#3b82f6" }}
            >
              {isDestructive ? "⚠" : "ℹ"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2
          className="font-sans text-xl font-bold text-slate-100 tracking-tight mb-2"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-400 font-sans leading-relaxed mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold font-sans border transition-all"
            style={{
              background: "transparent",
              borderColor: "#1e2d4a",
              color: "#64748b",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(30, 45, 74, 0.5)";
              e.target.style.color = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#64748b";
            }}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold font-sans border transition-all"
            style={{
              background: isDestructive ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
              borderColor: isDestructive ? "#ef4444" : "#3b82f6",
              color: isDestructive ? "#fca5a5" : "#93c5fd",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDestructive ? "rgba(239, 68, 68, 0.35)" : "rgba(59, 130, 246, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDestructive ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)";
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// src/hooks/useToasts.js
// Minimal toast queue. Each toast auto-expires after `duration` ms.

import { useState, useCallback } from "react";

let toastId = 0;

export function useToasts(duration = 3500) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration + 300); // +300ms accounts for exit animation
  }, [duration]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

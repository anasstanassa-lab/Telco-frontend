// src/hooks/useTargets.js
// Custom hook that owns all target state, polling, and CRUD operations.
// Components just consume this hook — no API calls scattered around.

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchTargets, addTarget, deleteTarget } from "../services/api";
// ⬆ Swap to "../services/api" when connecting to a real backend

const POLL_INTERVAL = parseInt(import.meta.env.VITE_POLL_INTERVAL || "60000", 10);

export function useTargets({ onStatusChange }) {
  const [targets, setTargets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [adding, setAdding]       = useState(false);
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);
  const [refreshing, setRefreshing] = useState(false);

  // Track previous statuses to detect changes between polls
  const prevStatuses = useRef({});

  /** Load (or refresh) all targets from the API */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchTargets();
      setTargets(data);
      setError(null);

      // Detect status changes and fire callback
      data.forEach((t) => {
        const prev = prevStatuses.current[t.id];
        if (prev && prev !== t.status) {
          onStatusChange?.(t);
        }
        prevStatuses.current[t.id] = t.status;
      });
    } catch (err) {
      setError(err.message || "Failed to fetch targets");
    } finally {
      setRefreshing(false);
      setCountdown(POLL_INTERVAL / 1000);
    }
  }, [onStatusChange]);

  // Initial load
  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  // Countdown ticker + auto-refresh
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          refresh();
          return POLL_INTERVAL / 1000;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [refresh]);

  /** POST a new target URL */
  const handleAdd = useCallback(async (url) => {
    setAdding(true);
    try {
      const newTarget = await addTarget(url);
      setTargets((prev) => [newTarget, ...prev]);
      prevStatuses.current[newTarget.id] = newTarget.status;
      return newTarget;
    } catch (err) {
      throw err;
    } finally {
      setAdding(false);
    }
  }, []);

  /** DELETE a target by id */
  const handleDelete = useCallback(async (id) => {
    // Optimistic removal
    setTargets((prev) => prev.filter((t) => t.id !== id));
    delete prevStatuses.current[id];
    try {
      await deleteTarget(id);
    } catch (err) {
      // On failure, re-fetch to restore state
      refresh();
      throw err;
    }
  }, [refresh]);

  return {
    targets,
    loading,
    error,
    adding,
    countdown,
    refreshing,
    refresh,
    handleAdd,
    handleDelete,
  };
}

// src/utils/helpers.js

/** Returns Tailwind color class based on latency ms */
export function latencyColor(ms) {
  if (ms === null || ms === undefined) return "#ef4444"; // red — timeout
  if (ms < 50)  return "#10b981"; // green — fast
  if (ms < 150) return "#f59e0b"; // amber — normal
  return "#ef4444";               // red — slow
}

/** Returns label + color object for latency badge */
export function latencyLabel(ms) {
  if (ms === null) return { text: "TIMEOUT", color: "#ef4444" };
  if (ms < 50)    return { text: "FAST",    color: "#10b981" };
  if (ms < 150)   return { text: "NORMAL",  color: "#f59e0b" };
  return               { text: "SLOW",    color: "#ef4444" };
}

/** Format a Date to HH:MM:SS */
export function fmtTime(d) {
  try {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
  } catch {
    return "--:--:--";
  }
}

/** Inclusive random integer between min and max */
export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

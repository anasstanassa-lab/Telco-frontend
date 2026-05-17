# TelcoPulse — Network Monitoring Dashboard

A production-grade network monitoring dashboard built with React, Tailwind CSS, Axios, and Recharts.

---

## Folder Structure

```
telcopulse/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddTargetForm.jsx   # Controlled form to add new monitoring targets
│   │   ├── Dashboard.jsx       # Main content area — grid, toolbar, stats
│   │   ├── Navbar.jsx          # Top nav — logo, search, live status pills
│   │   ├── StatsBar.jsx        # Summary metric cards (total, up, down, latency, uptime)
│   │   ├── TargetCard.jsx      # Individual monitoring card with sparkline chart
│   │   └── Toast.jsx           # Toast notification system
│   ├── hooks/
│   │   ├── useTargets.js       # Custom hook: API calls, polling, state management
│   │   └── useToasts.js        # Custom hook: toast queue management
│   ├── services/
│   │   ├── api.js              # Real Axios API service (connect to your backend)
│   │   └── mockApi.js          # Drop-in mock for development without a backend
│   ├── utils/
│   │   └── helpers.js          # latencyColor, latencyLabel, fmtTime, randBetween
│   ├── App.jsx                 # Root component — wires hooks, state, layout
│   ├── index.js                # React entry point
│   └── index.css               # Tailwind directives + custom keyframes
├── .env.example                # Environment variable template
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Quick Start

### 1. Install dependencies

```bash
cd telcopulse
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env
# Edit .env and set REACT_APP_API_BASE_URL to your backend URL
```

### 3. Run in development (uses mock API by default)

```bash
npm start
# Opens http://localhost:3000
```

The app uses `src/services/mockApi.js` by default — no backend needed.

### 4. Connect to a real backend

1. Open `src/hooks/useTargets.js`
2. Change the import at the top from:
   ```js
   import { fetchTargets, addTarget, deleteTarget } from "../services/mockApi";
   ```
   to:
   ```js
   import { fetchTargets, addTarget, deleteTarget } from "../services/api";
   ```
3. Make sure your backend implements:
   - `GET  /api/targets`          → returns array of target objects
   - `POST /api/targets`          → body `{ url }`, returns new target
   - `DELETE /api/targets/:id`    → returns `{ success: true }`

---

## Expected Target Object Shape

```json
{
  "id": 1,
  "url": "api.stripe.com",
  "status": "UP",
  "latency": 42,
  "uptime": 99.98,
  "lastChecked": "2025-01-01T12:00:00.000Z",
  "history": [38, 41, 44, 42, 39, 43, 42]
}
```

---

## Features

- **Real-time status** — UP/DOWN with animated indicator dots
- **Color-coded latency** — green < 50ms, amber < 150ms, red >= 150ms  
- **Latency sparklines** — 7-point mini chart per target (click to expand)
- **Auto-polling** — refreshes every 60 seconds (configurable via `REACT_APP_POLL_INTERVAL`)
- **Toast notifications** — fires on status changes (UP → DOWN and recovery)
- **Search bar** — live filter by URL/hostname
- **DOWN filter** — toggle to show only degraded services
- **Add / Delete targets** — POST and DELETE with optimistic UI
- **Error handling** — error state with retry button, loading skeletons
- **Dark mode** — dark-first design

---

## Build for Production

```bash
npm run build
# Outputs to /build — serve with any static file server
```

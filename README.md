# Lynq — Asynchronous Link-in-Bio & Shortener Platform

Lynq is a modern, high-performance Link-in-Bio platform that integrates custom bio pages, link management, optional URL shortening, and high-performance, asynchronous analytics tracking.

Built as an **Nx Monorepo**, it combines a Next.js App Router frontend, a fast Go (Fiber v3) HTTP API, a Redis message queue, and a separate Go worker daemon for processing analytics.

---

## 🏗️ Architecture Overview

Lynq is designed to handle high-traffic click events without slowing down redirection responses for users. It uses an event-driven, producer-consumer model for analytics tracking:

```
                  ┌──────────────────────────────┐
                  │        Web Frontend          │
                  │   (Next.js App Router)       │
                  └──────────────┬───────────────┘
                                 │
                                 │ HTTP /api/v1
                                 ▼
                  ┌──────────────────────────────┐
                  │         Go API Server        │◄─── [Go Fiber v3]
                  │     (apps/api/cmd/server)    │
                  └──────────────┬───────────────┘
                                 │
                                 │ LPUSH (Asynchronous Queue Event)
                                 ▼
                  ┌──────────────────────────────┐
                  │         Redis Queue          │◄─── [Redis 7]
                  │     (analytics:events)       │
                  └──────────────┬───────────────┘
                                 │
                                 │ BRPOP (Blocking Consume)
                                 ▼
                  ┌──────────────────────────────┐
                  │       Go Background Worker   │◄─── [Go Worker Daemon]
                  │     (apps/api/cmd/worker)    │
                  └──────────────┬───────────────┘
                                 │
                                 │ Save & Update
                                 ▼
                  ┌──────────────────────────────┐
                  │         PostgreSQL           │◄─── [GORM / Database]
                  │          (lynq_db)           │
                  └──────────────────────────────┘
```

1. **Visitor Actions**: When a visitor views a public profile (`/api/v1/u/:username`) or clicks a link (`/l/:id` or `/s/:shortcode`), the **Go API Server** immediately records the request details, pushes them to Redis, and issues an instant HTTP redirect or JSON response.
2. **Asynchronous Processing**: The **Go Background Worker** pops events from Redis, parses the User-Agent (for browser, OS, device) and IP information, persists an `AnalyticsRecord` into PostgreSQL, and increments target click counts.
3. **Admin Dashboard**: Creators access the Next.js panel to customize layout themes, add/reorder links, toggle URL shortening, and query PostgreSQL for aggregated charts.

---

## 🛠️ Project Structure

This workspace is managed using [Nx](https://nx.dev) and contains the following projects:

```
├── apps
│   ├── api             # Go Backend (cmd/server, cmd/worker, internal packages)
│   └── web             # Next.js Frontend (App Router, Tailwind CSS)
├── packages
│   └── ui              # Shared Radix & Tailwind UI components library
├── pnpm-workspace.yaml # Monorepo workspaces definition
└── package.json        # Workspace dependencies & script managers
```

### Core Technologies
* **Frontend**: React 19, Next.js (App Router), Tailwind CSS.
* **Backend API & Worker**: Go 1.26, Fiber v3, GORM (Object Relational Mapping).
* **Database & Queue**: PostgreSQL 17, Redis 7 (via `docker-compose`).

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v20+ recommended) and `pnpm`
* [Go](https://go.dev/) (v1.26+ recommended)
* [Docker & Docker Compose](https://www.docker.com/)

### 2. Install Workspace Dependencies
From the root of the monorepo, run:
```bash
pnpm install
```

### 3. Spin up Database & Redis Services
Start the PostgreSQL and Redis containers using Docker Compose:
```bash
cd apps/api
docker compose up -d
```
This starts:
* **PostgreSQL** on port `5432` (database: `lynq_db`)
* **Redis** on port `6379`

### 4. Set up Environment Variables
Create an `.env` file in `apps/api`:
```ini
PORT=8000
DB_URL=postgres://postgres:postgres@localhost:5432/lynq_db?sslmode=disable
REDIS_URL=localhost:6379
JWT_SECRET=super-secret-token-key
```

---

## 💻 Running the Application

This workspace leverages Nx to manage and run project tasks.

### Run Development Servers
To run both the Frontend and Backend API in development mode concurrently, use:
```bash
pnpm nx run-many --targets=dev
```

Alternatively, you can start projects individually:

#### Start the Go API Server (with Hot Reloading)
Ensure you have `air` installed (`go install github.com/air-verse/air@latest`). Then run:
```bash
pnpm nx dev api
```
The server will start listening at `http://localhost:8000`.

#### Start the Go Background Analytics Worker
To compile and run the worker process that processes the Redis analytics queue:
```bash
cd apps/api
go run ./cmd/worker/main.go
```

#### Start the Next.js Frontend
To start the Next.js dev server:
```bash
pnpm nx dev web
```
The frontend will start at `http://localhost:3000`.

---

## 📦 Building for Production

To compile and bundle both the Next.js app and the Go API for production, run:
```bash
pnpm nx run-many --targets=build
```

---

## 🧪 Tasks & Utilities

* **Explore the Dependency Graph**: Visualize the relationships between projects in the workspace:
  ```bash
  pnpm nx graph
  ```
* **Lint Code**: Run ESLint across the codebase:
  ```bash
  pnpm nx run-many --targets=lint
  ```

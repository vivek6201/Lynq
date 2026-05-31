# Lynq — Asynchronous Link-in-Bio & Shortener Platform

Lynq is a modern, high-performance Link-in-Bio platform that integrates custom bio pages, link management, optional URL shortening, and high-performance asynchronous background processing for emails and analytics.

Built as an **Nx Monorepo**, it combines a Next.js App Router frontend, a fast Go (Fiber v3) HTTP API, a Redis message queue, and a separate Go worker daemon powered by `asynq`.

---

## 🏗️ Architecture Overview

Lynq is designed to handle high-traffic API requests without slowing down responses for users. It uses an event-driven, producer-consumer model for background tasks like sending emails and tracking analytics:

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
                                 │ Enqueue Task (Asynq)
                                 ▼
                  ┌──────────────────────────────┐
                  │         Redis Queue          │◄─── [Redis 7]
                  │          (default)           │
                  └──────────────┬───────────────┘
                                 │
                                 │ Poll (Blocking Consume)
                                 ▼
                  ┌──────────────────────────────┐
                  │       Go Background Worker   │◄─── [Go Asynq Worker Daemon]
                  │     (apps/api/cmd/worker)    │
                  └──────────────┬───────────────┘
                                 │
                                 │ Save & Notify
                                 ▼
          ┌──────────────────────┴──────────────────────┐
          │                                             │
┌─────────▼────────────┐                  ┌─────────────▼────────────────┐
│      PostgreSQL      │◄── [GORM]        │         Resend API           │◄── [Emails/OTPs]
│       (lynq_db)      │                  │  (task:send_email)           │
└──────────────────────┘                  └──────────────────────────────┘
```

1. **Fast Responses**: When a visitor requests an OTP (`/api/v1/auth/otp/send`), the **Go API Server** immediately records the payload, pushes it to Redis via `asynq`, and issues an instant HTTP response to the user.
2. **Asynchronous Processing**: The **Go Background Worker** pulls jobs from Redis. For example, it takes email payloads, maps them, and sends them via the Resend API securely in the background with automatic retries.
3. **Template Engine**: We use Go's built-in `//go:embed` to package HTML email templates securely inside the compiled binary.
4. **Creator Dashboard**: Creators access the Next.js panel to customize layout themes, add/reorder links, and view analytics.

---

## 🛠️ Project Structure

This workspace is managed using [Nx](https://nx.dev) and contains the following projects:

```text
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
* **Backend API & Worker**: Go 1.26, Fiber v3, GORM (Object Relational Mapping), Asynq (Background Jobs).
* **Database & Queue**: PostgreSQL 17, Redis 7 (via `docker-compose`).
* **Third Party Services**: Resend (Email Delivery), Google OAuth.

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v20+ recommended) and `pnpm`
* [Go](https://go.dev/) (v1.26+ recommended)
* [Docker & Docker Compose](https://www.docker.com/)
* [Air](https://github.com/air-verse/air) (`go install github.com/air-verse/air@latest`) for hot-reloading.

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
RESEND_KEY=re_your_resend_api_key_here
```

---

## 💻 Running the Application

This workspace leverages Nx to manage and run project tasks. Our custom configuration handles spinning up the API server and the background worker process **simultaneously**.

### Run Everything Concurrently
To run both the Next.js Frontend, the Go API Server, and the Go Worker Daemon in development mode (with hot-reloading), run:
```bash
pnpm nx run-many -t dev
```
- The API server will listen at `http://localhost:8000`.
- The Worker daemon will start polling Redis for background jobs.
- The Frontend will start at `http://localhost:3000`.

---

## 📦 Building for Production

To compile and bundle both the Next.js app and the Go binaries for production, run:
```bash
pnpm nx run-many -t build
```
Note: The Go `build` command will output the server binary to `apps/api/bin/api` and the worker binary to `apps/api/bin/worker` (if configured in your CI).

---

## 🧪 Tasks & Utilities

* **Explore the Dependency Graph**: Visualize the relationships between projects in the workspace:
  ```bash
  pnpm nx graph
  ```
* **Lint Code**: Run ESLint across the codebase:
  ```bash
  pnpm nx run-many -t lint
  ```

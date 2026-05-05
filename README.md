# Schomora

<div align="center">

![Schomora Banner](https://placehold.co/1200x300/6520BE/FFFFFF?text=Schomora+%E2%80%94+Adaptive+Learning+Platform&font=poppins)

**A fullstack LMS that adapts quiz difficulty in real-time based on student ability using Item Response Theory (IRT).**

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go&logoColor=white)](https://golang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=flat-square&logo=redis&logoColor=white)](https://upstash.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Live Demo](https://schomora.vercel.app) · [Report Bug](https://github.com/hasanwirayuda/schomora/issues)

</div>

---

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- A [Supabase](https://supabase.com) project (PostgreSQL)
- An [Upstash](https://upstash.com) Redis database

### 1. Clone the repository

```bash
git clone https://github.com/hasanwirayuda/schomora.git
cd schomora
```

### 2. Backend setup

```bash
cd apps/api

# Copy and fill in environment variables
cp .env.example .env
```

Edit `.env`:

```env
PORT=8080
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET=your-secret-key-here
REDIS_URL=rediss://default:[PASSWORD]@[HOST]:6379
```

```bash
# Install dependencies and run
go mod tidy
go run cmd/server/main.go
```

The API will be available at `http://localhost:8080`. Database tables are created automatically via GORM AutoMigrate on first run.

### 3. Frontend setup

```bash
cd apps/web

# Copy and fill in environment variables
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Tech Stack

### Backend

| Category       | Technology            |
| :------------- | :-------------------- |
| Language       | Go 1.21+              |
| HTTP Framework | Gin                   |
| ORM            | GORM                  |
| Database       | PostgreSQL (Supabase) |
| Cache          | Redis (Upstash)       |
| Auth           | JWT + bcrypt          |
| PDF            | gofpdf                |

### Frontend

| Category     | Technology              |
| :----------- | :---------------------- |
| Framework    | Next.js 14 (App Router) |
| Styling      | Tailwind CSS            |
| Server State | TanStack React Query    |
| Client State | Zustand                 |
| HTTP Client  | Axios                   |
| Forms        | React Hook Form + Zod   |
| Icons        | Lucide React            |

### Infrastructure

| Service  | Provider              |
| :------- | :-------------------- |
| Database | Supabase (PostgreSQL) |
| Cache    | Upstash (Redis)       |
| Frontend | Vercel                |
| Backend  | Railway               |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

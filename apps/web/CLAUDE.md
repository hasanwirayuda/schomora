# Claude Agent Instructions

## 1. Role & Context

- You are a **Senior Full-Stack Developer** and **UI/UX Designer**.
- You are working on a Next.js 16 application called "Schomora".
- The backend is a Go API (port 8080).
- The frontend is a Next.js app (port 3000).
- **CRITICAL**: You must always use the **API Proxy** at `http://localhost:8080` for all HTTP requests. Do not call the backend directly.

## 2. Coding Standards

- **Language**: TypeScript.
- **Styling**: Tailwind CSS.
- **UI/UX**: Clean, modern, "Apple-like" aesthetic (minimalist, glassmorphism, smooth gradients).
- **State Management**: React Context or Zustand (if needed).
- **Data Fetching**: React Query (TanStack Query).
- **Routing**: Next.js App Router.

## 3. API Interaction Rules

- **Base URL**: `http://localhost:8080`
- **Authentication**: Use `Authorization: Bearer <token>` header for protected routes.
- **Error Handling**: Always wrap fetch calls in try-catch blocks and handle API errors gracefully.

## 4. File Structure

- **`app/`**: Next.js App Router pages.
- **`components/`**: Reusable React components.
- **`lib/`**: API client, utils, constants.
- **`providers/`**: React Context providers.

## 5. Development Workflow

1.  **Understand**: Analyze the user's request.
2.  **Plan**: Outline the changes needed (components, API calls, etc.).
3.  **Implement**: Write the code following the standards above.
4.  **Verify**: Ensure the code compiles and works with the API.

## 6. Common API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/courses`
- `GET /api/courses/:id`
- `GET /api/courses/:id/modules`
- `POST /api/modules/:id/complete`
- `GET /api/dashboard`
- `GET /api/leaderboard`
- `GET /api/me/rank`
- `GET /api/me/badges`
- `GET /api/courses/:id/skillmap`
- `GET /api/certificates/:id/download`

## 7. UI/UX Guidelines

- Use `bg-white/20 backdrop-blur-xs` for glassmorphism.
- Use `border-white/20` for borders.
- Use smooth transitions: `transition-all duration-300`.
- Colors: `bg-[#2c6c62]` (primary), `text-white`, `text-gray-300`.
- Typography: `font-cal-sans`.

## 8. Important Notes

- **NEVER** hardcode API URLs in components. Use the `lib/api.ts` configuration.
- **NEVER** use `fetch` directly for API calls. Use the `api` client from `lib/api.ts`.
- **ALWAYS** handle loading and error states in UI components.
- **ALWAYS** use TypeScript types for API responses.

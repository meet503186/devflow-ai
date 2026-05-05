# Code Standards

## General

- Keep modules small, focused, and single-purpose
- Fix root causes instead of layering workarounds
- Do not mix unrelated concerns in one component, hook, or route
- Prefer clarity over cleverness — code should be easy to read and reason about
- Co-locate related logic when it improves maintainability

---

## TypeScript

- Strict mode is required across the project
- Avoid `any` — use explicit types, interfaces, or generics
- Validate all unknown external input at system boundaries
- Prefer type inference where safe, but be explicit for API contracts
- Use shared types for API request/response to ensure consistency

---

## Next.js

- Default to **Server Components**
- Add `"use client"` only when browser interactivity is required
- Keep API routes focused on a single responsibility
- Avoid heavy logic inside components — move to `lib/` when needed
- Use server-side code for secure operations (e.g., API keys, prompt construction)

---

## Styling

- Use CSS custom property tokens — no hardcoded hex values
- Follow the design system defined in `ui-context.md`
- Use Tailwind utility classes for layout and spacing
- Avoid inline styles unless absolutely necessary
- Maintain consistent spacing, typography, and radius scale

---

## API Routes

- Validate and sanitize request input before any processing
- Never trust client input — enforce structure and limits
- Keep API responses consistent (structured JSON format)
- Handle errors gracefully with clear messages
- Do not expose sensitive data (e.g., API keys) in responses

---

## Data and Storage

- Session-level data (history, UI state) should remain client-side (LocalStorage/Zustand)
- Do not persist large generated content unnecessarily
- Avoid introducing a database until persistence is required
- Keep data structures minimal and purpose-driven

---

## File Organization

- `app/` — Routes, pages, layouts, and API endpoints
- `components/` — Reusable UI and feature components
- `components/ui/` — Base UI primitives (from shadcn/ui)
- `lib/` — Shared logic (prompt templates, parsing, utilities)
- `store/` — Client-side state management (Zustand stores)
- `types/` — Shared TypeScript types and interfaces
- `hooks/` — Custom React hooks for reusable logic

# Architecture Context

## Stack

| Layer     | Technology                        | Role                                                               |
| --------- | --------------------------------- | ------------------------------------------------------------------ |
| Framework | Next.js (App Router) + TypeScript | Full-stack framework for UI, routing, and API layer                |
| UI        | Tailwind CSS                      | Styling and layout system for building responsive UI               |
| State     | Zustand                           | Client-side state management for UI and workflow state             |
| API Layer | Next.js API Routes                | Handles prompt construction, validation, and AI interaction        |
| AI Model  | Gemini API                        | Generates structured Jira ticket output from prompts               |
| Storage   | Browser (LocalStorage)            | Stores temporary history and session data (no persistence for now) |

---

## System Boundaries

- `app/` — Owns UI routes, pages, and layout (input, output, debug panel)
- `components/` — Reusable UI components (editor, output panel, sidebar, controls)
- `lib/` — Shared logic (prompt templates, parsing, utilities)
- `app/api/` — Backend API routes (AI calls, validation, response formatting)
- `store/` — Client-side state (current ticket, history, UI state)

---

## Storage Model

- **Client Storage (LocalStorage)**: Stores recent ticket generations, history, and temporary session data
- **In-Memory State (Zustand)**: Holds active UI state such as current input, output, and regeneration cycle

---

## Auth and Access Model

- No authentication in v1 (open access system)
- All users share the same public interface without identity
- Rate limiting and input validation act as basic protection mechanisms
- No ownership or access control required (single-user session-based usage)

---

## Invariants

1. All AI interactions must go through backend API routes (no direct client-side API calls)
2. Output must always be structured (title, description, acceptance criteria) regardless of input
3. System prompt remains controlled; user can only influence behavior via additional instructions
4. Regeneration must preserve previous output in history before replacing it
5. API keys must never be exposed to the client

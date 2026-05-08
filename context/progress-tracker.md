# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- None — all planned features complete through 09

## Completed

- **01-design-system**: Installed and configured shadcn/ui (Tailwind v4), added Button, Card, Input, Textarea, Tabs, ScrollArea, Dialog components, installed lucide-react, created lib/utils.ts with cn() helper, configured CSS variables for light/dark themes aligned to project palette from ui-context.md.
- **02-app-shell**: Created `components/layout/navbar.tsx` (fixed top, app name + theme toggle), `components/layout/sidebar.tsx` (fixed left 260px, History + Templates placeholders, scrollable), `components/layout/theme-toggle.tsx` (client component toggling `.dark` class), updated `app/page.tsx` with full workspace layout (sidebar + split input/output panels).
- **03-input-panel**: Created `components/editor/input-panel.tsx` — numbered step badge, subtitle, description textarea with char count (n/2000), Task Type select with emoji icons, Additional Instructions textarea with optional label + help icon, full-width Generate Ticket button disabled when description is empty. Added shadcn Select component.
- **04-output-panel**: Created `components/editor/output-panel.tsx` — mock data for title, description, and acceptance criteria; editable title (Input) and description (Textarea); per-section copy buttons with check/copy icon feedback; "Copy All as Markdown" button in header; acceptance criteria rendered as a numbered list. Wired into `app/page.tsx` replacing the placeholder.
- **05-generate-api**: Created `app/api/generate/route.ts` (POST) — validates and sanitizes request, constructs system + user prompt via `lib/prompts.ts`, calls Gemini 2.0 Flash via `@google/generative-ai`, parses and validates JSON response, returns `{ title, description, acceptanceCriteria }`. Added `types/generate.ts` for shared request/response types. API key read from `GEMINI_API_KEY` env var (never exposed to client). Added `.env.example`. Build passes cleanly.
- **06-connect-generation**: Installed zustand. Created `store/generate.ts` (Zustand store) with `status`, `output`, `error`, and `generate()` action that POSTs to `/api/generate`. Updated `InputPanel` to call `generate()` on button click with loading state (spinner + disabled). Rewrote `OutputPanel` to consume the store — shows idle/loading/error/success states; success renders real API output with editable fields and copy buttons. Build passes cleanly.
- **07-regenerate**: Added `regenerate()` action to Zustand store — saves current output to `history: GenerateResponse[]` before replacing, re-sends the same `lastInput` with `previousOutput` (human-readable formatted string) to `/api/generate`. Store also tracks `lastInput` on every `generate()` call. Strengthened regeneration prompt in `lib/prompts.ts` to explicitly ask for improved title specificity, description clarity, and sharper acceptance criteria. Added "Regenerate" button to `OutputPanel` header (enabled only on success, alongside "Copy All as Markdown"). Build passes cleanly.
- **08-templates**: Created `lib/templates.ts` with three templates (Bug Report 🐛, Feature Request ✨, API Endpoint 🔌) — each carries a `systemPromptAddition` that appends template-specific structure requirements to the system prompt. Added `templateId` to `GenerateRequest` type. Updated `buildSystemPrompt(templateId?)` in `lib/prompts.ts` to inject the template's addition when provided. API route (`app/api/generate/route.ts`) accepts and validates `templateId`, passes it to `buildSystemPrompt`. Zustand store tracks `activeTemplateId` with `setTemplate()` action; both `generate()` and `regenerate()` forward the active template to the API. Sidebar (`components/layout/sidebar.tsx`) upgraded to a client component — renders clickable template cards with active/inactive highlight; clicking a second time on the active template deselects it. Build passes cleanly.
- **09-debug-panel**: Added `DebugInfo` type to `types/generate.ts` (`systemPrompt`, `userPrompt`, `rawResponse`, `latencyMs`, `promptTokens`, `responseTokens`). Updated `GenerateResponse` to include optional `debugInfo`. API route now captures system/user prompt strings, times the Gemini call, reads `usageMetadata` from the response, and returns `debugInfo` alongside the ticket fields. Created `components/editor/debug-panel.tsx` — collapsible bottom panel (hidden until first generation), header shows latency + total tokens inline, expands to shadcn Tabs with "Prompt Used" (system + user prompt), "Raw Response", and "Parsed JSON" tabs each in a 192px ScrollArea, plus a stats footer showing per-category token counts. Updated `app/page.tsx` to flex-col layout with `DebugPanel` below the input/output row. Build passes cleanly.
- **10-history**: Added `HistoryEntry` type to `types/generate.ts` (id, output without debugInfo, input snapshot, timestamp). Updated Zustand store — `history` changed from `GenerateResponse[]` to `HistoryEntry[]`; both `generate()` (when replacing existing output) and `regenerate()` prepend a `HistoryEntry` to the list; added `restore(entry)` action that sets `output`, `lastInput`, and `status: "success"`. Updated `components/layout/sidebar.tsx` — History section renders clickable `HistoryItem` cards showing truncated title and relative timestamp ("just now", "X min ago", "X hr ago"); clicking calls `restore()`. Build passes cleanly.

## In Progress

- None.

## Next Up

- None.

## Open Questions

- None currently.

## Architecture Decisions

- shadcn/ui initialized with Tailwind v4 support (`shadcn@latest` CLI, `components.json` with `tailwind.version: "4"`)
- CSS design tokens: project-specific variables (`--bg-base`, `--bg-surface`, `--accent-primary`, etc.) are the source of truth; shadcn tokens (`--background`, `--primary`, etc.) are wired to them via `var()` references so both conventions work seamlessly

## Session Notes

- Build passes cleanly after 01-design-system implementation
- All 7 shadcn components in `components/ui/`, `lib/utils.ts` with `cn()` in place
- Light/dark theme via `.dark` class (no hardcoded colors anywhere)

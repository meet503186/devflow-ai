# AI Workflow Rules

## Approach

Build this project incrementally using a **spec-driven workflow**. Context files (`project-overview.md`, `architecture.md`, `ui-context.md`, etc.) define what to build, how to build it, and the current system constraints.

All implementation must strictly follow these specs.
Do not invent behavior, UI patterns, or system logic outside of what is defined.
Treat context files as the **single source of truth**.

---

## Scoping Rules

- Work on one feature unit at a time (e.g., ticket generation, debug panel, templates)
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- Each change should be testable end-to-end within minutes

---

## When to Split Work

Split an implementation step if it combines:

- UI changes and backend/API logic changes in one step
- Multiple unrelated API routes or endpoints
- State management + UI + API logic without clear boundaries
- Behavior not clearly defined in the context files

If a change cannot be verified quickly and independently, the scope is too broad — split it.

---

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, document it as an open question in `progress-tracker.md`
- Prefer clarification over assumption

---

## Protected Files

Do not modify the following unless explicitly instructed:

- `components/ui/*` — Generated UI components (shadcn/ui)
- Third-party libraries and dependencies
- Auto-generated configuration files

---

## Keeping Docs in Sync

Update the relevant context files whenever implementation introduces changes to:

- System architecture or boundaries
- API structure or contracts
- Storage model decisions
- Code conventions or patterns
- Feature scope or behavior

Documentation must always reflect the current system state.

---

## Before Moving to the Next Unit

1. The current unit works end-to-end within its defined scope
2. No invariant defined in `architecture.md` is violated
3. `progress-tracker.md` reflects completed work and next steps
4. Build passes successfully (`pnpm run build`)
5. No critical console errors or runtime issues remain

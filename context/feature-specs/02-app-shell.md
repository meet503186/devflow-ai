# 02-app-shell.md

Read `AGENTS.md` before starting.

We are building the core layout structure of the application.

## Implementation

### Navbar

Create `components/layout/navbar.tsx`

- fixed top navbar
- left: app name (DevFlow AI)
- right:
  - theme toggle
  - placeholder for future controls

- subtle border bottom

---

### Sidebar

Create `components/layout/sidebar.tsx`

- fixed left sidebar (~260px)
- sections:
  - History (placeholder)
  - Templates (placeholder)

- scrollable content
- border separator

---

### Workspace Layout

Create layout in `app/page.tsx`

- left sidebar
- center workspace split:
  - left: input panel (placeholder)
  - right: output panel (placeholder)

---

## Scope Limits

- No business logic
- No API calls
- No real data

---

## Check When Done

- Layout renders correctly
- Sidebar + navbar visible
- Responsive behavior works
- No TypeScript errors

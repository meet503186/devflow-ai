# UI Context

## Theme

The application supports both **light and dark themes** with a consistent design language across both modes. The UI follows a **developer-focused workspace aesthetic** — clean layouts, clear hierarchy, and minimal visual noise.

- **Light Theme**: Soft neutral backgrounds, high readability, subtle borders
- **Dark Theme**: Deep layered surfaces, low-glare contrast, vibrant accents for interaction

Theme switching should feel seamless, with all components adapting via design tokens (no hardcoded colors).

---

## Colors

All colors must be defined using CSS variables. Components should only consume these tokens.

### Light Theme

| Role            | CSS Variable       | Value     |
| --------------- | ------------------ | --------- |
| Page background | `--bg-base`        | `#F8FAFC` |
| Surface         | `--bg-surface`     | `#FFFFFF` |
| Primary text    | `--text-primary`   | `#0F172A` |
| Muted text      | `--text-muted`     | `#64748B` |
| Primary accent  | `--accent-primary` | `#6366F1` |
| Border          | `--border-default` | `#E2E8F0` |
| Error           | `--state-error`    | `#EF4444` |
| Success         | `--state-success`  | `#22C55E` |

---

### Dark Theme

| Role            | CSS Variable       | Value     |
| --------------- | ------------------ | --------- |
| Page background | `--bg-base`        | `#020617` |
| Surface         | `--bg-surface`     | `#0F172A` |
| Primary text    | `--text-primary`   | `#E2E8F0` |
| Muted text      | `--text-muted`     | `#94A3B8` |
| Primary accent  | `--accent-primary` | `#8B5CF6` |
| Border          | `--border-default` | `#1E293B` |
| Error           | `--state-error`    | `#F87171` |
| Success         | `--state-success`  | `#4ADE80` |

---

## Typography

| Role      | Font                        | Variable      |
| --------- | --------------------------- | ------------- |
| UI text   | Inter / Geist Sans          | `--font-sans` |
| Code/mono | JetBrains Mono / Geist Mono | `--font-mono` |

---

## Border Radius

| Context           | Class         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-md`  |
| Cards / panels    | `rounded-xl`  |
| Modals / overlays | `rounded-2xl` |

---

## Component Library

Using **shadcn/ui** on top of Tailwind CSS.

- Components live in `components/ui/`
- Use CLI (`npx shadcn-ui add`) to generate components
- Extend existing components instead of building from scratch
- Maintain consistency with design tokens and spacing system

---

## Layout Patterns

- **Workspace Layout**: Full-viewport split with left sidebar (history/templates), center input panel, and right output panel
- **Sidebars**: Fixed width (~260px) with subtle border separator
- **Main Panels**: Card-based surfaces with padding and elevation (via border + background contrast)
- **Debug Panel**: Collapsible bottom panel with tabbed content (prompt, raw response, JSON)
- **Navbar**: Sticky top bar with bottom border and minimal controls (theme toggle, profile, templates)

---

## Icons

Using **Lucide React**.

- Style: Stroke-based icons only
- Sizes:
  - Inline: `h-4 w-4`
  - Buttons: `h-5 w-5`

- Use consistent spacing between icon and text (`gap-2`)
- Avoid mixing icon styles (no filled icons)

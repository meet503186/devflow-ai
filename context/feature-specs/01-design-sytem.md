# 01-design-system.md

Read `AGENTS.md` before starting.

We are setting up the base design system and UI primitives.

## Implementation

1. Install and configure `shadcn/ui`

2. Add the following components:
   - Button
   - Card
   - Input
   - Textarea
   - Tabs
   - ScrollArea
   - Dialog

3. Install `lucide-react` for icons

4. Create `lib/utils.ts`:
   - Add `cn()` helper for merging Tailwind classes

5. Configure global styles:
   - Add CSS variables from `ui-context.md`
   - Support both light and dark themes

6. Ensure:
   - No hardcoded colors
   - All components use CSS variables

---

## Scope Limits

- Do not modify generated `components/ui/*`
- Do not build custom components yet
- Do not add business logic

---

## Check When Done

- All components import without errors
- `cn()` works correctly
- Light + dark theme toggles correctly
- No default Tailwind light styles leak

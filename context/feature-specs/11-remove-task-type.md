# 11-remove-task-type.md

Read `AGENTS.md` before starting.

Remove `taskType` from the entire codebase. Template selection via `activeTemplateId` replaces it — templates are now selected directly in the sidebar instead of choosing a task type first.

## Implementation

- Remove `taskType` from `types/generate.ts` (`GenerateRequest`, `HistoryEntry.input`)
- Remove `taskType` state, `setTaskType` action, and all references from `store/generate.ts`
- Remove `taskType` validation and destructuring from `app/api/generate/route.ts`
- Remove `Task Type: ${req.taskType}` line from `lib/prompts.ts` `buildUserPrompt`
- Rename "Task Type" label to "Template" in `components/editor/input-panel.tsx`

---

## Scope Limits

- No changes to template data or prompt logic beyond removing the `taskType` line
- `templateId` / `activeTemplateId` remain unchanged

---

## Check When Done

- No `taskType` references remain anywhere in the codebase
- Generation and regeneration work without `taskType`
- Input panel label reads "Template"

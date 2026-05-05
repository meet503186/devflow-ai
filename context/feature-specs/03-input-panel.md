# 03-input-panel.md

Read `AGENTS.md` before starting.

We are building the input panel where users describe tasks.

## Implementation

Create `components/editor/input-panel.tsx`

### Fields

- Textarea:
  - placeholder: "Describe the issue or task..."
  - character count

- Task Type dropdown:
  - Bug
  - Feature
  - Task

- Additional Instructions textarea:
  - optional

- Generate button

---

### Behavior

- Controlled inputs (React state)
- Disable button if input is empty

---

## Scope Limits

- No API calls yet
- No generation logic
- No validation beyond basic checks

---

## Check When Done

- Inputs update state correctly
- Button enabled/disabled correctly
- UI matches design

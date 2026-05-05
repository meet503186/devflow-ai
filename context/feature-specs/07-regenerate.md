# 07-regenerate.md

Read `AGENTS.md` before starting.

Add regeneration capability.

## Implementation

- Add "Regenerate" button

### Behavior

- Send previous output to API
- Modify prompt:
  - improve clarity
  - refine output

---

### State

- Maintain history (in memory)
- Save previous output before replacing

---

## Scope Limits

- No variations UI
- No advanced controls

---

## Check When Done

- Regenerate produces improved output
- History is preserved

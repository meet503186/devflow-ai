# 05-generate-api.md

Read `AGENTS.md` before starting.

We are implementing the backend AI generation endpoint.

## Implementation

Create `app/api/generate/route.ts`

### Request

```json
{
  "input": "",
  "taskType": "",
  "instructions": "",
  "previousOutput": ""
}
```

---

### Behavior

- Construct prompt:
  - system prompt (fixed)
  - user input
  - optional previous output
  - optional instructions

- Call Gemini API

- Parse response into structured JSON

---

### Response

```json
{
  "title": "",
  "description": "",
  "acceptanceCriteria": []
}
```

---

## Scope Limits

- No auth
- No persistence
- No rate limiting (yet)

---

## Check When Done

- API returns structured response
- Handles errors safely
- No API key leakage

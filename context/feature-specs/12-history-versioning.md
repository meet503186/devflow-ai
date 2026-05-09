# 12-history-versioning.md

Read `AGENTS.md` before starting.

We are implementing session-based history with versioned regenerations.

## Goal

History should represent meaningful AI generation sessions, while regenerations should create refinements (versions) within the same session.

The system must avoid:

- duplicate history entries
- noisy sidebar history
- loss of previous outputs during regeneration

---

## History Model

A history item represents a single generation session.

Each session contains:

- original input
- generation type
- additional instructions
- multiple generated versions

---

### Session Shape

```ts id="0"
type TicketSession = {
  id: string;
  createdAt: string;

  generationType: string;

  input: string;
  instructions?: string;

  activeVersionId: string;

  versions: TicketVersion[];
};
```

---

### Version Shape

```ts id="z5j0od"
type TicketVersion = {
  id: string;

  createdAt: string;

  output: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
  };

  metadata?: {
    latency?: number;
    tokens?: number;
  };
};
```

---

## Generate Flow

When the user clicks `Generate Ticket`:

### If no active session exists

- create new session
- create first version (`v1`)
- save to history

### If input changed meaningfully

- create NEW session
- create first version

### If input did not change

- treat action as regenerate
- append new version to existing session

---

## Regenerate Flow

When user clicks `Regenerate`:

- send:

  - original input
  - current output
  - generation type
  - additional instructions

- API returns improved/refined output

---

### Regenerate Behavior

- create new version
- append to current session
- set latest version as active
- preserve previous versions

Do NOT:

- overwrite previous version
- create new top-level history item

---

## Sidebar Behavior

Sidebar displays:

- sessions only
- not individual versions

Example:

```txt id="f34ny7"
History

• Login issue
• Payment API
• Dashboard feature
```

---

### Sidebar Item Click

Restores:

- input
- generation type
- instructions
- latest active version

---

## Version Navigation

Inside output panel:

```txt id="0"
Version 2 of 4

[ Previous ] [ Next ]
```

---

### Behavior

- switching versions updates output panel
- switching versions does NOT mutate history
- active version persists in session state

---

## State Management

Use Zustand for:

- active session
- active version
- history state

Persist history to:

- LocalStorage

---

## Scope Limits

- No backend persistence
- No authentication
- No version diffing
- No collaborative editing
- No branching/version trees

---

## Check When Done

- Generate creates new session correctly
- Regenerate appends versions correctly
- Sidebar remains clean (sessions only)
- Previous versions remain accessible
- History restores workspace state correctly
- LocalStorage persistence works

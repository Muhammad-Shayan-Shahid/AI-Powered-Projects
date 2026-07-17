---
name: claude-md-sync
description: Use at the end of building a feature or phase, to check whether any new decisions made during this session should be permanently recorded in this project's CLAUDE.md file. Triggers on requests like "update claude.md", "what should we add to claude.md", "sync the project memory", or automatically after completing a feature/phase, even if not explicitly asked.
---

# CLAUDE.md Sync

After finishing a feature or phase of work, review what was just built and decide what belongs in `CLAUDE.md` — the project's permanent, always-loaded rules file.

## What counts as worth adding

Add it if it's something a FUTURE session or FUTURE feature needs to stay consistent with:
- New schema field names, types, or enum values on any model
- New naming conventions introduced (event names, API response shapes, route naming)
- Design tokens (colors, fonts, spacing) if this session involved implementing a new visual design system
- Any architecture decision that would be wrong to redo differently later (auth strategy, storage choice, folder structure changes)

## What does NOT need to be added

- Routine implementation details that don't affect future work (e.g. internal variable names, minor helper functions)
- Anything already covered by an existing rule in CLAUDE.md
- Temporary/test-only data or setup

## How to add it

1. Open the existing `CLAUDE.md` and find the `## Locked-in implementation decisions` section (or equivalent — do not create a duplicate section with a different name).
2. Append a new clearly-titled subsection for what was just decided, in the same style as existing entries (short heading, then bullet points — see existing entries for exact tone/format).
3. Do NOT rewrite, restructure, reorder, or delete any existing content in CLAUDE.md. Only append.
4. Show the proposed addition and ask for confirmation before actually editing the file — this file is a standing set of rules, not a scratch pad, so changes should be deliberate, not automatic.

## Output

After confirmation, make the edit and briefly summarize what was added, in plain language, so it's easy to spot in a diff/commit later.

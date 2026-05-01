# TOOLBOX.md — Non-Claude AI tools

**Purpose:** Workspace-level catalog of non-Claude AI tools you use (or evaluate) for capabilities outside Claude's strength. Loaded on demand by Claude sessions when triggered (see `BOOTSTRAP.md` "On-demand reads"). Not loaded at session start.

---

## How to use this file

When a trigger fires (image/video/voice gen requests, real-time data, or any capability Claude says it can't serve), read this file. Surface the relevant tool for the request, help craft the input prompt, note handoff considerations.

## Format per tool

```
### [Tool name]
- **Provider / access:** [vendor, plan tier if relevant]
- **Strength:** [what this tool is best at]
- **Use when:** [trigger conditions specific to this tool]
- **Handoff to user:** [what they do — paste prompt, upload file, etc.]
- **Output format:** [what comes back, how to integrate]
- **Cost / latency:** [if known]
- **Notes:** [pitfalls, version notes, non-obvious things]
```

## Capability categories

(Sections populate as you adopt tools. Empty categories signal "not yet decided," which is meaningful — not "not needed.")

### Image generation
*(empty — populate when adopted)*

### Video generation
*(empty — populate when adopted)*

### Voice / music generation
*(empty — populate when adopted)*

### Real-time / web-current data
*(empty — populate when adopted)*

### Other / specialty
*(empty — populate when adopted)*

## How this file gets updated

Append-only-ish: when a tool is adopted, add an entry under the right category. When a tool is dropped, mark superseded with date — don't delete. Same rule-revisability discipline as `PATTERNS.md` and `PERSONALITY.md`.

## Version history

- **[YYYY-MM-DD]** — initial fill from coFounder template.

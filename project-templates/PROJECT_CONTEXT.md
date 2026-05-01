# PROJECT_CONTEXT.md — [PROJECT NAME]

**Layer 2 of the coFounder six-layer architecture.** Per-project, lives at the project root. Authoritative source for what this project is, what's built, what's decided, what's in scope, and the build stack.

---

## Project overview

[1–3 sentences describing what this project is. What does it do? Who is it for? Why does it exist?]

**Tech stack:** [languages, frameworks, runtimes — e.g., "Node.js + Express + SQLite + vanilla JS frontend"]

**Business context:** [if relevant, link to or summarize key business rules, terminology, or constraints. Or: "N/A — internal tool / personal project."]

## Audience and roles

[If your project has a permission model or different user types, document them here. Otherwise: "Single user / no role distinctions."]

## Architecture

[Describe the high-level architecture. Sub-sections as needed:]

### Data layer
[Describe persistence: database, schema, migrations.]

### App surface
[Pages, endpoints, CLI commands — what the project exposes.]

### Auth
[If relevant: how sessions/users/permissions work.]

### Key data flows
[The important request-response cycles or data pipelines.]

### Frontend conventions
[If applicable: CSS conventions, JS patterns, framework specifics.]

## Commands

[Common commands for development, testing, building, deploying.]

```bash
# Dev server
npm run dev

# Tests
npm test

# Build for production
npm run build
```

## Git & files

- [What's gitignored that matters? e.g., `.env`, `database.db`, `node_modules/`]
- [Any special directory conventions? e.g., `archived/` is read-only reference]

## Current state

[Brief snapshot of where the project is *right now*. What's working, what's in-progress, what's blocked. Update this when state changes meaningfully.]

## How this file gets updated

Updated when project state changes meaningfully — major decisions, phase transitions, scope changes, architecture shifts. Routine progress goes to `SESSION_NOTES.md`, not here. Decisions go to `DECISIONS.md`, not here.

## Version history

- **[YYYY-MM-DD]** — initial fill from coFounder template.

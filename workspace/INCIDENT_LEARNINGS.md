# INCIDENT_LEARNINGS — workflow precautions

**Purpose:** Workspace-level append-only record of incidents that exposed gaps in the layered-context system, plus the durable rules added in response. Not project-scoped — lessons apply across every project under your workspace.

**Loading:** Session-start. Surfaced by the SessionStart hook directive at position 6, between `OPERATIONS.md` and the project's `PROJECT_CONTEXT.md`. The "Active rules" section at the bottom is the cumulative discipline list — future Claude sessions can grep that section for the current rules without reading every per-incident narrative.

**Note on architecture:** `INCIDENT_LEARNINGS.md` is a workspace-level **reference** (sibling to `PATTERNS.md`, `TOOLBOX.md`, `OPERATIONS.md`), session-start hooked. **Not a layer.** See `BOOTSTRAP.md` "Workspace-level files: layer vs reference" for the placement rule: a file is a layer if it occupies one of the six conceptual roles; a file is a reference if it catalogs information the layers draw on.

**This file is incident-driven and append-only** — same shape as `DECISIONS.md`. Don't preemptively outline categories. Don't pre-populate rules. Each rule should be earned by an actual incident that exposed a real gap.

---

## How this file gets updated

Append a new section at the bottom for each incident worth preserving. Structure: **incident → what happened → what failed → what worked → durable rules added → lower-priority improvements not yet active**. Don't edit prior entries except to update Status if a rule is later relaxed or superseded; the historical context matters even if the rule changes.

The "Active rules" section at the bottom is the cumulative index — regenerated as new incidents add or modify rules. Each rule there should be self-contained — applying it correctly should NOT require reading the per-incident detail above. Per-incident detail explains *why*; the "Active rules" section explains *what to do*.

---

## Active rules (cumulative across all incidents)

*(empty — populate as incidents accrue. Each rule should be: a clear directive, the precipitating incident date for context, and self-contained enough to apply without reading the full incident narrative.)*

---

*This file lives at workspace level. It applies to every project's session via the layered-context discipline; it does not get duplicated into project directories.*

*Pre-populated rules from the source coFounder workspace are intentionally NOT included here — the architectural shape ships, the rules don't. If you want to start with proven rules rather than waiting for your own incidents, browse the source repo's `INCIDENT_LEARNINGS.md` history for examples worth porting.*

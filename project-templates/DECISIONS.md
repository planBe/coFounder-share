# DECISIONS.md — [PROJECT NAME]

**Layer 4 of the coFounder five-layer architecture.** Append-only log of meaningful decisions with reasoning. Loaded by Claude sessions on session start (per `BOOTSTRAP.md`).

**Format per entry:**
- **Date** — when the decision was made (absolute, ISO format)
- **Category** — Architecture / Process / Business / Infrastructure
- **Status** — Active / Superseded / Reversed / In progress / Falsified
- **Decision** — what was decided
- **Reasoning** — why; the part that matters when revisiting
- **Revisit if** — what conditions warrant revisiting

---

## [Decision title]

- **Date:** YYYY-MM-DD
- **Category:** [Architecture / Process / etc.]
- **Status:** Active
- **Decision:** [What was decided]
- **Reasoning:** [Why — the part that matters when revisiting]
- **Revisit if:** [Conditions]

## How this file gets updated

Append-only. New decisions get appended below; never edit prior entries except to update Status (Superseded / Reversed / Falsified) — and even then, do not delete or rewrite the original. When a decision is superseded, add a "Status note" line at the bottom of its entry pointing at the superseding decision.

If a decision is falsified, update Status to "Falsified" with the date and a pointer to where the falsification is documented. The falsification IS a decision worth preserving.

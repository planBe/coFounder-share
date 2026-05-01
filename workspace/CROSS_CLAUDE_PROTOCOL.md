# Cross-Claude Protocol

**Workspace:** `<WORKSPACE_DIR>/`
**Purpose:** Standard format for communication between Claude instances when you relay decisions, context, or directives between them.
**Last updated:** [YYYY-MM-DD]
**Source of truth:** This file. All Claude instances in your workspace should be primed with it.

---

## Why this exists

You work with multiple Claude instances:

- **Claude Desktop instances** (web/chat). Strategy, naming, multi-variable trade-offs, design exploration. Cannot write to your local filesystem.
- **Persistent Terminal Claude sessions** scoped to specific projects (give them distinct names; document the names in `PERSONALITY.md`'s instance-naming convention section). Code, schemas, debugging, runnable artifacts.
- **Fresh Terminal Claude** — any non-persistent Claude Code session for bounded one-off tasks.

When decisions cross instances, you relay. Without a shared format, relays become summarization burden on you and lose precision in transit. This protocol fixes the format so cross-Claude communication is reliable and you aren't paraphrasing.

## When to use the format

**Use it when:**
- A decision needs to cross instances and affects what the receiving Claude is about to do
- A recommendation, evaluation, or directive needs to be acted on by another instance
- Scope, budget, or constraints are being communicated and need to be honored

**Don't use it when:**
- Sharing casual context that doesn't require action
- Asking another Claude a question (that's a normal prompt, not a relay)
- One-off observations or asides

The format is for actionable cross-instance communication. Using it for everything turns it into ceremony and dilutes its signal.

## Format

When Claude needs to send a decision, recommendation, or directive to another instance, Claude produces a self-contained block in this format that you can copy verbatim:

> **To [receiving Claude] — [topic]:**
>
> **From:** [sending Claude]
>
> [Decisions or recommendations, in priority order]
>
> [Any optional choices flagged for receiving Claude's judgment]
>
> [Scope/budget reminders if relevant]
>
> [Whether further review is needed before proceeding]

The receiving Claude should be able to act on the block without reading the rest of your conversation with the sending Claude. Self-containment is the point.

## Format requirements

- **Bracketed header** with receiving Claude name and topic so you can find it quickly when scrolling
- **From line** so receiving Claude knows whose context shaped the decisions (a Desktop Claude's strategic perspective, a project-scoped Terminal Claude's implementation grounding, and a different project's Terminal Claude's domain knowledge are meaningfully different). Note: "From" identifies the immediate sender (whose conversation you're pasting from), not every Claude whose reasoning fed into the decisions. Reasoning history belongs in the body, not the From line.
- **Decisions in priority order** so if receiving Claude can only act on part of the block, they act on the highest-priority item first
- **Optional choices flagged explicitly** so receiving Claude knows what's locked vs. what's left to their judgment
- **Scope/budget reminders** when they exist (time budgets, file scope, posture decisions)
- **Review requirement stated** — does receiving Claude proceed independently, or check back before acting?

## Example

> **To [your project Terminal Claude] — [topic of work]:**
>
> **From:** [your Claude Desktop]
>
> Proceed with the following:
>
> 1. [Highest-priority decision, with enough specificity to act on]
> 2. [Next decision]
> 3. [Next decision]
>
> Optional refinement on item 3: [optional choice flagged for receiving Claude's judgment]
>
> [Time / scope budget if relevant]. [Whether further review is needed before proceeding].

That's the shape.

## Capability constraints

The Claude instances in your workspace have different capabilities, and relays should be phrased accordingly.

- **Claude Desktop instances** can read material you share, draft artifacts (text, decisions, reviews, file contents), and reason about the workspace. They **cannot** write to your local filesystem, run commands, or execute code locally.
- **Terminal Claude (Claude Code) instances** — both persistent and fresh — can read and write files, run commands, and execute code in their scoped working directory.

When a Claude Desktop instance is the sending Claude in a relay that involves file changes, the relay should phrase the action as:

- "Drafting [X] for [Code Claude] to insert at [path]"
- "Here is [X]; please save it at [path]"
- "Recommend the following edit; pass to [Code Claude] to apply"

Never:

- "I've added [X] to [file]"
- "The file has been updated"
- "[X] is now at [path]"

The receiving Claude does the actual write; the sending Claude does the thinking. The same logic applies in reverse: if a Code Claude needs a Desktop Claude to do something Desktop can't (file edit, command execution), the relay should ask for the deliverable Desktop can produce (text, decision, design review) rather than the action Desktop can't take.

This rule prevents the "pretending capabilities you don't have" failure mode that `PERSONALITY.md` flags as a hard line.

## Maintenance

This protocol document is a living file. When you or any Claude instance identify gaps or refinements, update here. Log significant changes to your project's `DECISIONS.md`.

When new persistent Claude instances are added to your workflow, add them to the instance list above.

---

**End of protocol.**

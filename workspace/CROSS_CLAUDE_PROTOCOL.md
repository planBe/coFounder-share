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

**Reciprocal discipline.** If a future relay uses enacting language about the filesystem from an instance that can't act on it ("I've placed," "I've added," "I've committed," "the file is now at X"), treat it as a phrasing error rather than a claim of fact. Flag the misphrasing in the response and treat the actual action as not-yet-done. Tightens the same Capability constraints rule above — prevents half-committed work where the sending Claude thinks something landed but it's still a draft for you to place.

## Inbox routing — paste required only across surfaces

If you adopt the inbox filesystem convention for cross-instance relays (documented in `BOOTSTRAP.md` as a workspace-level `<inbox-dir>/`), recipient discovery is automatic for Code-Claude-to-Code-Claude exchanges; paste is only required when the surface changes:

- **Code Claude → Code Claude**: **no paste needed.** All Code Claudes share the same filesystem; the session-start protocol checks the inbox after the layer reads and discovers pending relays automatically. The sending Claude drafts + saves to inbox; the recipient picks it up on their next session-start (or by you prompting an active session to "check inbox"). No paste-routing required.
- **Anything → Claude Desktop instance**: **paste required.** Desktop runs on the chat surface and cannot read your local filesystem. You must copy relay content and paste into the Desktop conversation.
- **Desktop → anywhere**: **paste required in reverse.** Desktop cannot write to your filesystem. You copy the Desktop-drafted relay and save it as a file (typically to the inbox so Code Claudes consume via session-start or active inbox-check).

**Don't ask the user to paste a Code-Claude-to-Code-Claude relay** — that creates manual work the protocol's filesystem mechanism already eliminates. Drafting + saving to inbox is sufficient delivery for Code-to-Code; paste only when crossing the chat/code surface boundary.

## Working division of labor

The Claude instances in your workspace divide labor along the capability axis named in Capability constraints. This division is the operational expression of the orthogonal cross-instance layer — personas compose within-instance; the instance split composes cross-instance.

- **Claude Desktop instances (chat surface)** — thinking and planning. Strategy, synthesis, drafting, adversarial review, surfacing gaps, multi-variable trade-offs. Produce paste-ready artifacts. Do not execute on the filesystem.
- **Persistent Terminal Claude sessions + Fresh Terminal Claude (Claude Code surfaces)** — execution. Disk writes, command runs, commits, builds, archive operations, anything that touches state.
- **One designated reviewer instance (optional)** — if your setup has multiple persistent Code Claude sessions, designate one as the cross-instance reviewer/checker for canonical work from other instances before it settles as final. The reviewer is typically the first persistent Code Claude (the one with widest cross-project view).
- **You (the user)** — router between instances. Paste relays to and from the inbox; adjudicate conflicts; ratify canonical commits.

The default flow is the **think→hand-off pattern**: a Claude Desktop instance produces a paste-ready artifact → you route via inbox to a Code Claude → Code Claude executes → optional sanity-check by the designated reviewer → settled. Reverse direction (a Code Claude needs strategic synthesis): the Code Claude drafts a relay asking for the deliverable Desktop can produce → you route → Desktop drafts → returns via inbox.

This is not a hard rule that forbids exceptions. A Code Claude can produce strategic thinking when the work calls for it; a Desktop instance can sanity-check execution-side drafts when the strategic surface is the right one. The default routing is above; when a task arrives at the wrong instance for its character, the right move is usually a hand-off relay rather than a one-instance heroic.

## Maintenance

This protocol document is a living file. When you or any Claude instance identify gaps or refinements, update here. Log significant changes to your project's `DECISIONS.md`.

When new persistent Claude instances are added to your workflow, add them to the instance list above.

---

**End of protocol.**

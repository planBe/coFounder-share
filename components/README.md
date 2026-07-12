# How coFounder drives Claude Code without scraping

These are the actual production components — not samples — from [coFounder](https://kulafounders.com/claude-code), the Mac app that wraps *your own* Claude Code in a native cockpit. Published so a skeptical developer can read exactly the code that touches their CLI and their permission gate, instead of taking a landing page's word for it.

MIT, like the rest of this repo.

## The architecture in five sentences

1. **Every chat turn is your own logged-in CLI, headless:** `claude -p --resume <uuid> --output-format stream-json --include-partial-messages`, prompt over stdin, one crash-isolated process per turn. Your login, your plan — no proxy, no relay, no per-token markup, no API key demanded.
2. **Nothing is scraped.** The app renders the CLI's *structured events* (see `chat-classify/`), never regexes over a terminal screen. When Anthropic's event schema shifts, a fixture test goes red instead of a pane silently blanking.
3. **Session state comes from hooks, not guesswork.** A tiny stdlib-Python hook (`cofounder-state-hook.py`) receives Claude Code's lifecycle events and distills them to a per-session state file — `busy`, `awaiting-approval`, `idle`, `ended` — that the app reads.
4. **Ask-before-acting is fail-closed.** An optional PreToolUse gate (`cofounder-approval-gate.py`) files an approval request for every mutating tool call and blocks until the founder clicks Allow/Deny in the conversation. Its internal deadline is *shorter* than its hook timeout, so silence resolves to an explicit deny — a timeout can never fall through to "allowed."
5. **The serving model is read from `message.model`** on each assistant message — the only ground-truth field (init events go stale, and models are unreliable narrators about themselves).

## What's in here

| File | What it is |
|---|---|
| `cofounder-state-hook.py` | The lifecycle hook. Registered via `--settings` at launch; writes `~/.cofounder/session-state/<uuid>.json`. Note the deliberate bias: unknown notification wording defaults to **blocked** — a wrong hold is loud, a wrong send is silent data loss. |
| `cofounder-approval-gate.py` | The PreToolUse approval gate. Armed per-turn by env vars; unarmed turns pass straight through, so it costs nothing when off. Read the deadline math — fail-closed is a two-line invariant. |
| `chat-classify/chat-classify.js` | The pure event classifier, extracted verbatim from the app. stream-json line in → render op (or null) out. No DOM, no state. |
| `chat-classify/fixtures/*.jsonl` | Real captured `claude -p` streams (a scratch-dir spike; paths redacted). This is what the protocol actually looks like on the wire, including the hook noise a renderer must ignore. |
| `chat-classify/test.cjs` | `node test.cjs` — the schema tripwire. Counts what must render against the captured reality. |

## Why per-turn processes (the design bet)

A resident interactive session would mean screen-scraping a TUI or driving a PTY — the fragile pattern every wrapper eventually regrets. Per-turn headless processes trade a little session-startup latency for: crash isolation (a dead turn can't take the conversation with it), zero parsing of human-oriented output, honest resumability (`--resume` against the same transcript any terminal can open), and a clean seam for per-turn `--model`/`--effort` overrides. The transcripts stay in `~/.claude/projects/` — quit the app and `claude --resume` them from any terminal. No lock-in is a checkable claim, not a slogan.

## Provenance

Extracted from coFounder's production source 2026-07-12 (app version 0.6.18). The generated hook scripts are re-written by the app on every launch (self-healing, version-stamped) — these copies are that generator's output, verbatim.

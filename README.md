# coFounder — sanitized share

This is **coFounder**, a layered-context filesystem architecture I built for my own work with Claude Code. I'm sharing a sanitized version because you might find it useful.

## What it is

A set of markdown files at your workspace root and inside each project directory. A `SessionStart` hook in `~/.claude/settings.json` surfaces a directive at every session start that lists the layer files in read order; Claude reads each via the Read tool before substantive work. The result: every Claude Code session you launch in a project under your coFounder workspace starts with full context (your working style, the project's current state, recent work, decisions, where you left off) without you having to manually re-prime.

## What you get

- A **workspace template** (`workspace/`) with five workspace-level files: `PERSONALITY.md`, `BOOTSTRAP.md`, `PATTERNS.md`, `TOOLBOX.md`, `CLAUDE.md`.
- **Project-level templates** (`project-templates/`) for the per-project layer files: `PROJECT_CONTEXT.md`, `SESSION_NOTES.md`, `DECISIONS.md`, `RESUMING.md`, `CLAUDE.md`.
- A **home stub template** (`home-stub-CLAUDE.md`) to drop at `~/CLAUDE.md` if you want a wrong-place-to-launch guardrail.
- The **`SessionStart` hook script** (`cofounder-session-start.sh`) that surfaces the bootstrap directive at session start.
- `SETUP.md` walking you through manual installation.

## One thing it does

This system asks Claude to verify its own work — describe how it would check the output before doing it, and review afterward. You can disable that if you want (edit `PERSONALITY.md` and remove the "Verification discipline" section), but I find it makes Claude noticeably more reliable.

## What it's not

- **Not a product.** I'm not maintaining it, supporting it, taking feature requests, or shipping updates.
- **Not an onboarding for Claude Code itself.** This share is for someone (you) who already uses Claude Code.
- **Not customized for you.** Templates have placeholders. Fill in your bio, working style, project list, conventions — make it yours.

## Make it yours

If you want something different from what's here — different file structure, different read order, different conventions — **fork it**. Don't ask me to change the repo. Forking is the right path; I want you to make it your own, not get stuck waiting on me. If you have a way to generically improve it for everyone, please share your ideas with me Michael@planBeCreative.com

## Context for Claude Code users

This relies on Claude Code's `SessionStart` hook + `additionalContext` mechanism. The hook surfaces a small directive (~1.3KB); it does **not** auto-load the layer files inline because Claude Code has a ~10K-character offload threshold I hit while building it. The pattern that works is "directive + Read tool calls" — Claude reads each file at session start instead of getting them inline. If you're new to Claude Code hooks, `SETUP.md` walks through the install.

## License

MIT. See `LICENSE`. Use it however you want.

---

*Built by Michael Wild · planBe Creative · 2026. Friend-to-friend share, not a product yet, but if it works, that is the plan.*

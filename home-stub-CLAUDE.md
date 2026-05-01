# CLAUDE.md — home directory (wrong place to launch Claude)

If you're seeing this, Claude Code was launched from `~/` — your home directory. This is too broad a scope. A session here has read access to your entire user account.

## Sensitive paths — off-limits by default

[List paths in your home directory that should never be touched without explicit narrow instruction. Examples to consider:
- `~/Pictures/Photos Library.photoslibrary/` — Apple Photos library; macOS package; touching internals can corrupt
- `~/Library/Keychains/` — sensitive credentials
- `~/Library/Mobile Documents/` — iCloud-synced data
- Any encrypted vaults or password-store directories
- Backup directories]

These can also be enforced via `permissions.deny` rules in `~/.claude/settings.json`. Document here so any session reading the cascade sees them up front.

If a task seems to require touching any of these, stop and confirm first. Cost of confirmation is trivial; cost of unwanted change is potentially permanent.

## What to do

1. Ask the user which project they want to work on. Known projects:
   - **[Project 1]** at `<WORKSPACE_DIR>/<project1>/`
   - **[Project 2]** at `<WORKSPACE_DIR>/<project2>/`
   - [Add more as relevant]
2. Recommend they exit this session and relaunch from inside that project, e.g.:
   ```
   cd <WORKSPACE_DIR>/<project> && claude
   ```
3. Until they do, work conservatively — don't make non-trivial changes.
   - Auto-memory writes from this home-scoped session land at `~/.claude/projects/-Users-<username>/memory/` rather than the project's memory directory.
   - The `SessionStart` hook in `~/.claude/settings.json` only fires its layered-context bootstrap directive for sessions launched **inside** the workspace. From home, the hook falls back to `RESUMING.md`-only behavior — and there's no `RESUMING.md` at home. So this session has minimal auto-loaded context; the working-style fallback below is what's available.

## Working style (fallback — read PERSONALITY.md directly for full)

The workspace umbrella `<WORKSPACE_DIR>/CLAUDE.md` is a thin forwarder; substantive working-style content lives in `<WORKSPACE_DIR>/PERSONALITY.md`. **Read it directly via the Read tool** for the full working-style profile.

If you can't or don't read `PERSONALITY.md`, here's a generic condensed fallback the user can edit:

- Direct over hedged. Short answers like "C" / "make it so" / "1 and 2" should be treated as complete.
- Options + recommendation, not decisions delivered.
- Confirm before destructive ops.
- "FYI" prefix means *don't implement*; absorb as background context.
- No filler / no AI cheerfulness; speak like a peer.

[Edit the bullets above to match your own working-style preferences once you've filled in `PERSONALITY.md`.]

## Why this stub exists

Auto-memory is per-cwd-keyed and CLAUDE.md cascades up the directory tree. Sessions launched from home scope away from project-specific memories. This stub is a guardrail to catch the mistake earlier.

# SETUP.md — Installing coFounder for yourself

Manual installation. ~30 minutes assuming you're already a Claude Code user.

## Prerequisites

- macOS or Linux (commands assume macOS; should work on Linux with minor path adjustments).
- Claude Code installed and working (`claude` runs in the terminal).
- `jq` installed (`brew install jq` on macOS) — used by the SessionStart hook to format JSON.
- A workspace directory you'll use for coFounder-managed projects (e.g., `~/Documents/coFounder-workspace/`). Only projects inside this dir get the layered bootstrap; everything else is unaffected.

## Step 1: Pick your workspace path

Decide where your coFounder-managed projects will live. Examples:
- `~/Documents/<your-name>/`
- `~/Documents/coFounder-workspace/`
- `~/projects/`

Whatever you pick, this is your **workspace dir**. Throughout this guide we'll call it `WORKSPACE_DIR`.

```bash
WORKSPACE_DIR="$HOME/Documents/coFounder-workspace"  # adjust to your preference
mkdir -p "$WORKSPACE_DIR"
```

## Step 2: Copy workspace-level files

```bash
cp workspace/* "$WORKSPACE_DIR/"
```

Then edit each file to replace placeholders:

- **`PERSONALITY.md`** — fill in your bio, working style, instance-naming convention, projects you're carrying. This is YOUR file; make it yours. Look for `[YOUR ...]` placeholders.
- **`BOOTSTRAP.md`** — replace `<WORKSPACE_DIR>` with your actual path (use `sed -i '' "s|<WORKSPACE_DIR>|$WORKSPACE_DIR|g" "$WORKSPACE_DIR/BOOTSTRAP.md"` if you want to scriptify).
- **`CLAUDE.md`** (the workspace umbrella) — same `<WORKSPACE_DIR>` find-and-replace.
- **`PATTERNS.md`** — start mostly empty; fill in cross-project patterns as you discover them. The "Process discipline that always transfers" and "Recurring mistakes to watch for" sections are pre-populated with patterns that are universally useful — keep, edit, or remove as fits your style.
- **`TOOLBOX.md`** — start empty; fill in non-Claude AI tools as you adopt them.

## Step 3: Install the SessionStart hook

The hook script (`cofounder-session-start.sh`) needs to live somewhere stable. Recommended: `~/.claude/`.

```bash
mkdir -p ~/.claude
cp cofounder-session-start.sh ~/.claude/
chmod +x ~/.claude/cofounder-session-start.sh
```

Edit `~/.claude/cofounder-session-start.sh` and change the `WS="..."` line at the top to your actual workspace dir.

Then register the hook in `~/.claude/settings.json`. **If the file doesn't exist:**

```bash
cat > ~/.claude/settings.json <<'EOF'
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/cofounder-session-start.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
EOF
```

**If the file already exists** with other content (other hooks, permissions, etc.), back it up first and merge by hand:

```bash
cp ~/.claude/settings.json ~/.claude/settings.json.bak.pre-cofounder
# Then edit settings.json by hand, adding the SessionStart hook entry above
# inside the existing "hooks" object. Verify with: jq empty ~/.claude/settings.json
```

## Step 4: Create your first project

```bash
mkdir -p "$WORKSPACE_DIR/my-first-project"
cp project-templates/* "$WORKSPACE_DIR/my-first-project/"
```

Edit each project-level file:
- **`PROJECT_CONTEXT.md`** — describe the project (what it is, build stack, current state).
- **`SESSION_NOTES.md`** — your rolling work log; append entries with absolute dates.
- **`DECISIONS.md`** — accumulate meaningful decisions with reasoning.
- **`RESUMING.md`** — your "letter to next Claude session" about where work left off.
- **`CLAUDE.md`** — thin forwarder pointing at the layer files. No edits needed unless you want to.

## Step 5: (Recommended) Install the home stub

This installs a wrong-place-to-launch guardrail (a `CLAUDE.md` at `~/` that warns when Claude Code is launched from your home directory). Catches the most common launch mistake. Skip only if you have other Claude Code workflows where a `~/CLAUDE.md` would conflict.

```bash
cp home-stub-CLAUDE.md ~/CLAUDE.md
# Edit the placeholders for sensitive paths and known projects
```

## Step 6: Test

```bash
cd "$WORKSPACE_DIR/my-first-project" && claude
```

Then in the launched Claude Code session, paste:

> What auto-loaded at startup? List the read directives you see and confirm you've read each layer file.

**Pass:** Claude lists the six layer files (RESUMING, BOOTSTRAP, PERSONALITY, PROJECT_CONTEXT, SESSION_NOTES, DECISIONS) and reports reading them via the Read tool. Working-style register matches what you put in `PERSONALITY.md`.

**Fail diagnostics:**
- Hook isn't firing: `jq empty ~/.claude/settings.json` to check JSON validity. Run the hook manually: `CLAUDE_PROJECT_DIR="$WORKSPACE_DIR/my-first-project" bash ~/.claude/cofounder-session-start.sh` — should output JSON with the bootstrap directive.
- Hook fires but Claude ignores it: directives in `additionalContext` are advisory, not enforced. If this becomes a real problem you can add system-prompt-level enforcement via project-level `CLAUDE.md` files (the cascade auto-loads those).
- `additionalContext` got offloaded: Claude Code has a ~10K-char threshold above which payloads get persisted to a file rather than inlined. The hook in this share stays well under that (~1.3KB). If you extend the hook to inline more content, you may hit this — see Anthropic's GitHub issue #13650 for context.

## What's not in this share

- **No SessionEnd hook.** Michael's setup has one that prints a continuity reminder; you can add similar by hand if you want.
- **No setup script** — you just did the install manually because that's the right scope for a single-friend share.
- **No auto-memory integration.** Claude Code's auto-memory directories (`~/.claude/projects/<sanitized-cwd>/memory/`) work as usual; coFounder is filesystem-based at the project level, separate from auto-memory.

---

*That's it. If something doesn't work and you're stuck, fork the repo and figure it out — the architecture is small enough that you can read all the files in 20 minutes.*

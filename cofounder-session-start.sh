#!/bin/bash
# coFounder SessionStart hook
# Surfaces a layered-context bootstrap directive for Claude Code sessions
# launched inside your coFounder workspace.
#
# Setup: edit the WS line below to point at your workspace dir, then register
# this script in ~/.claude/settings.json per SETUP.md.

# === EDIT THIS LINE ===
WS="$HOME/Documents/coFounder-workspace"
# ======================

PD="$CLAUDE_PROJECT_DIR"

case "$PD" in
  "$WS"/*)
    cat <<EOF | jq -Rs '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":.}}'
# coFounder bootstrap (auto-loaded by SessionStart hook)

You're a Claude Code session in a coFounder workspace project. Per the workspace's BOOTSTRAP.md, this workspace uses a five-layer file architecture for persistent context. Read these layer files via the Read tool before substantive work. If a file doesn't exist, flag the absence — don't skip silently.

1. \`$PD/RESUMING.md\` — Layer 5 (most-current state; read first)
2. \`$WS/BOOTSTRAP.md\` — read protocol, five-layer architecture
3. \`$WS/PERSONALITY.md\` — working-style
4. \`$PD/PROJECT_CONTEXT.md\` — Layer 2 (project state)
5. \`$PD/SESSION_NOTES.md\` — Layer 3 (rolling log; use Read with offset for last 2-3 entries if file is long)
6. \`$PD/DECISIONS.md\` — Layer 4 (decision history)

Then proceed with substantive work.
EOF
    ;;
  *)
    [ -f "$PD/RESUMING.md" ] && jq -Rs '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":.}}' < "$PD/RESUMING.md"
    ;;
esac

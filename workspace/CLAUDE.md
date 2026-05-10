# CLAUDE.md — workspace umbrella (thin forwarder)

Auto-loaded via Claude Code's CLAUDE.md cascade for any session whose cwd is inside this workspace. Substantive content lives in the named-layer files. Read these next:

- `<WORKSPACE_DIR>/BOOTSTRAP.md` — read protocol, six-layer architecture, full enumeration of workspace layers + references, on-demand read triggers, SessionStart hook documentation
- `<WORKSPACE_DIR>/PERSONALITY.md` — Layer 1, working-style + instance-naming convention

The `SessionStart` hook in `~/.claude/settings.json` surfaces a directive listing the full read order including the current project's layer files. Follow it. (PATTERNS, TOOLBOX, CROSS_CLAUDE_PROTOCOL, OPERATIONS, INCIDENT_LEARNINGS — and the inbox-relay convention if you adopt it — are enumerated in BOOTSTRAP.md to keep this forwarder truly thin.)

## Launch from inside a project, not from this directory

This workspace is a parent of all projects, not a project itself. Always launch Claude Code from inside a specific project (e.g. `cd <WORKSPACE_DIR>/my-project && claude`). Auto-memory is keyed to launch cwd; starting from this parent scopes you away from project memories. If a session has started here, ask the user which project they intend and have them relaunch from there before substantive work.

## Why this file is thin

Substantive working-style and project-architecture content lives in the named-layer files (one home per rule). This file exists only as the cascade-load entry point.

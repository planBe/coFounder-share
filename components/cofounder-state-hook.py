#!/usr/bin/env python3
# cofounder-state-hook v2 (+approval gate) — written by coFounder; safe to delete (regenerated on launch).
# Claude Code invokes this on lifecycle events (hooks in ~/.cofounder/claude-hooks.json,
# passed via --settings at launch). Distills the event into a per-session state file the
# dashboard reads instead of scraping the terminal. stdlib-only; must stay FAST.
import json, os, sys, time, tempfile
try:
    ev = json.load(sys.stdin)
except Exception:
    sys.exit(0)
sid = ev.get("session_id") or ""
if not sid:
    sys.exit(0)
name = ev.get("hook_event_name") or ""
msg = (ev.get("message") or "")[:200]
state = None
if name in ("UserPromptSubmit", "PreToolUse", "PostToolUse", "SubagentStop"):
    state = "busy"
elif name == "Notification":
    low = msg.lower()
    # "waiting for your input" = the idle nudge -> safe to send. Anything else
    # (permission / trust / unknown wording) -> a menu is up: composer text would
    # be swallowed as menu input. Default UNKNOWN to blocked — with the frontend's
    # return-to-composer backstop, a wrong hold is loud; a wrong send is silent loss.
    state = "idle" if "waiting for your input" in low else "awaiting-approval"
elif name == "Stop":
    state = "idle"
elif name == "SessionEnd":
    state = "ended"
if state is None:
    sys.exit(0)
d = os.path.expanduser("~/.cofounder/session-state")
os.makedirs(d, exist_ok=True)
fd, tmp = tempfile.mkstemp(dir=d)
with os.fdopen(fd, "w") as f:
    json.dump({"state": state, "event": name, "message": msg,
               "cwd": ev.get("cwd") or "", "ts": time.time()}, f)
os.replace(tmp, os.path.join(d, sid + ".json"))

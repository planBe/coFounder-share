#!/usr/bin/env python3
# cofounder-state-hook v2 (+approval gate) — approval gate written by coFounder; safe to delete (regenerated on launch).
import json, os, sys, time, uuid
adir = os.environ.get("COFOUNDER_APPROVAL_DIR") or ""
sid = os.environ.get("COFOUNDER_SID") or ""
if not adir or not sid:
    sys.exit(0)  # not an approvals-armed chat turn -> allow-through
try:
    ev = json.load(sys.stdin)
except Exception:
    sys.exit(0)
tool = ev.get("tool_name") or ""
ti = ev.get("tool_input") or {}
gist = ""
for k in ("description", "command", "file_path", "pattern", "url", "prompt"):
    v = ti.get(k)
    if v:
        gist = str(v)[:220]
        break
rid = uuid.uuid4().hex[:12]
os.makedirs(adir, exist_ok=True)
req = {"id": rid, "sid": sid, "tool": tool, "gist": gist,
       "input": json.dumps(ti)[:2000], "ts": time.time()}
tmp = os.path.join(adir, rid + ".tmp")
with open(tmp, "w") as f:
    json.dump(req, f)
os.replace(tmp, os.path.join(adir, rid + ".request.json"))
resp_path = os.path.join(adir, rid + ".response.json")
deadline = time.time() + 110
decision = None
while time.time() < deadline:
    if os.path.exists(resp_path):
        try:
            with open(resp_path) as f:
                decision = json.load(f)
        except Exception:
            decision = None
        break
    time.sleep(0.25)
for p in (os.path.join(adir, rid + ".request.json"), resp_path):
    try:
        os.remove(p)
    except Exception:
        pass
allow = bool(decision and decision.get("allow"))
if allow:
    reason = "founder approved in coFounder"
elif decision is not None:
    reason = "founder declined this action in coFounder"
else:
    reason = "approval timed out - no founder response; treat as declined"
print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
      "permissionDecision": "allow" if allow else "deny",
      "permissionDecisionReason": reason}}))
sys.exit(0)

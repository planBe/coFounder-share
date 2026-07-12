// Run: node test.cjs — validates chatClassify against REAL captured claude stream-json fixtures
// (a scratch-dir spike session; paths redacted). The day the CLI's event schema shifts, this goes
// red instead of a chat pane silently blanking. That's the whole testing philosophy: fixtures from
// reality, assertions on what the UI must render.
const fs = require("fs"), path = require("path"), assert = require("assert");
const { chatClassify } = require("./chat-classify.js");
const stats = { delta: 0, assistant: 0, tooluse: 0, toolresult: 0, done: 0, init: 0, usertext: 0, ignored: 0 };
for (const f of ["turn1.jsonl", "turn2.jsonl"]) {
  for (const line of fs.readFileSync(path.join(__dirname, "fixtures", f), "utf8").split("\n")) {
    if (!line.trim()) continue;
    const op = chatClassify(JSON.parse(line));
    if (!op) { stats.ignored++; continue; }
    for (const o of (op.op === "multi" ? op.ops : [op])) {
      stats[o.op] = (stats[o.op] || 0) + 1;
      if (o.op === "assistant") stats.tooluse += o.blocks.filter(b => b.type === "tool_use").length;
    }
  }
}
assert.strictEqual(stats.delta, 2); assert.strictEqual(stats.assistant, 3);
assert.strictEqual(stats.tooluse, 1); assert.strictEqual(stats.toolresult, 1);
assert.strictEqual(stats.done, 2); assert.strictEqual(stats.init, 2);
assert.ok(stats.ignored >= 30, "hook/bookkeeping noise ignored");
console.log("OK —", JSON.stringify(stats));

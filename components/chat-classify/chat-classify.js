// chatClassify — coFounder's pure stream-json event classifier (extracted verbatim from the app).
// Input: one parsed line of `claude -p --output-format stream-json --include-partial-messages` output.
// Output: a render op ({op:"delta"|"thinkdelta"|"assistant"|"usertext"|"toolresult"|"done"|"exit"|"init"|"multi",...})
// or null for hook noise / stream bookkeeping. Pure function: no DOM, no state — which is why it's testable
// against captured real streams (see fixtures/ + test.cjs). MIT, from github.com/planBe/coFounder-share.

function chatClassify(e){
    try{
      if(e.type==="stream_event"){
        const ev=e.event||{};
        if(ev.type==="content_block_delta"&&ev.delta&&ev.delta.type==="text_delta") return {op:"delta",text:ev.delta.text||""};
        if(ev.type==="content_block_delta"&&ev.delta&&ev.delta.type==="thinking_delta") return {op:"thinkdelta",text:ev.delta.thinking||""};   // expandable reasoning (parity e)
        return null;
      }
      if(e.type==="assistant"&&e.message) return {op:"assistant",model:e.message.model||"",blocks:(e.message.content||[]).filter(b=>b&&(b.type==="text"||b.type==="tool_use"||(b.type==="thinking"&&b.thinking)))};   // message.model = the SERVING model, the only ground truth (init lies by staleness — relay Finding #4)
      if(e.type==="user"&&e.message){
        const out=[];
        const c=e.message.content;
        if(Array.isArray(c)) c.forEach(b=>{ if(b&&b.type==="tool_result") out.push({op:"toolresult",id:b.tool_use_id,content:typeof b.content==="string"?b.content:JSON.stringify(b.content),isError:!!b.is_error});
                                            else if(b&&b.type==="text"&&b.text) out.push({op:"usertext",text:b.text}); });
        else if(typeof c==="string"&&c) out.push({op:"usertext",text:c});
        return out.length?{op:"multi",ops:out}:null;
      }
      if(e.type==="result") return {op:"done",ms:e.duration_ms||0,isError:!!e.is_error,cost:e.total_cost_usd};
      if(e.type==="proc_exit") return {op:"exit",code:e.code,err:e.stderr_tail||""};
      if(e.type==="system"&&e.subtype==="init") return {op:"init",model:e.model||""};
      return null;
    }catch(_){ return null; }
  }

if (typeof module !== 'undefined') module.exports = { chatClassify };

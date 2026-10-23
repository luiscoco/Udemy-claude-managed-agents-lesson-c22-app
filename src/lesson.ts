import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 22,
  title: "Tool Catalogs and Bounded Discovery",
  description: "An application can accumulate dozens or hundreds of capabilities across billing, shipping, and other domains. Showing every full definition at once adds context and makes overlapping tools harder to choose.",
  concepts: ["Bounded tool discovery", "Discovery does not register tools", "Dispatch exact names and schemas"],
  scope: "Searches and dispatches a local two-entry tool catalog. It does not connect to a native MCP server. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Discover invoice lookup", "input": {"query": "billing invoice", "selectedTool": "billing_lookup_invoice", "invoiceId": "INV-1001"}, "expected": "passed", "checks": {"matches": 1}}, {"id": "1", "label": "Discovery cannot enable deletion", "input": {"query": "billing", "selectedTool": "delete_invoice", "invoiceId": "INV-1001"}, "expected": "rejected", "checks": {}}],
  async run(input) {

const catalog=[{name:"billing_lookup_invoice",hint:"billing invoice lookup"},{name:"shipping_track_order",hint:"shipping order delivery"}];
const terms=unique(text(input,"query").toLowerCase().split(/\s+/).filter(Boolean));
const matches=catalog.map(c=>({...c,score:terms.filter(t=>(c.name+" "+c.hint).includes(t)).length})).filter(c=>c.score>0).sort((a,b)=>b.score-a.score).slice(0,5);
if(text(input,"selectedTool")!=="billing_lookup_invoice"||text(input,"invoiceId")!=="INV-1001")return report("rejected","The requested capability or owned invoice is not enabled",{catalogMatches:matches},["Return bounded reference matches","Require exact host dispatcher authorization"]);
return report("passed","Discovered a tool and dispatched an authorized read-only lookup",{matches:matches.length,catalogMatches:matches,invoice:{id:"INV-1001",owner:"demo-user",totalCents:4200}},["Rank catalog terms","Cap results at five","Validate the selected tool and arguments","Apply ownership at lookup"]);

  }
};

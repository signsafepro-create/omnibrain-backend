import React, { useState } from "react";
import { Code, Key, Terminal, Copy, Check, X, Shield, Webhook } from "lucide-react";

interface ApiDocsModalProps {
  onClose: () => void;
}

export default function ApiDocsModal({ onClose }: ApiDocsModalProps) {
  const [activeLang, setActiveLang] = useState<"curl" | "js" | "python">("curl");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/query",
      desc: "Consult the OMNIBRAIN Cognitive Engine with prompts or candidate search.",
      request: `{ "message": "Analyze Anthropic S-1 IPO probability and executive hiring." }`,
      response: `{ "text": "### OMNIBRAIN Telemetry Report: Anthropic (ANTH)...", "timestamp": "2026-07-21T09:41:00Z" }`
    },
    {
      method: "GET",
      path: "/api/v1/candidates",
      desc: "Fetch real-time candidate scores, valuation ranges, and signal convergence events.",
      response: `[ { "id": "anthropic", "name": "Anthropic", "ipoProbability": 0.92, "score": 82.4, "valuationHigh": 965 } ]`
    },
    {
      method: "POST",
      path: "/api/v1/generate-image",
      desc: "Synthesize photorealistic 8K FLUX AI financial infographics and telemetry visuals.",
      request: `{ "prompt": "Anthropic S-1 IPO timeline graphic chart", "size": "1K" }`,
      response: `{ "imageUrl": "https://image.pollinations.ai/prompt/...", "size": "1K" }`
    }
  ];

  const getCodeSnippet = (endpoint: typeof endpoints[0]) => {
    if (activeLang === "curl") {
      return `curl -X ${endpoint.method} "https://ipo-brain.vercel.app${endpoint.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" ${endpoint.request ? `\\\n  -d '${endpoint.request}'` : ""}`;
    }
    if (activeLang === "js") {
      return `const res = await fetch("https://ipo-brain.vercel.app${endpoint.path}", {
  method: "${endpoint.method}",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }${endpoint.request ? `,\n  body: JSON.stringify(${endpoint.request})` : ""}
});
const data = await res.json();
console.log(data);`;
    }
    return `import requests

url = "https://ipo-brain.vercel.app${endpoint.path}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
${endpoint.request ? `payload = ${endpoint.request}\nresponse = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)` : `response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`}
print(response.json())`;
  };

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#06b6d4]" />
            <h3 className="text-lg font-bold font-serif italic text-white">API & Quant Developer Documentation</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Auth Instructions */}
          <div className="p-5 bg-[#0f172a] border border-[#06b6d4]/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#06b6d4] uppercase">
              <Key className="w-4 h-4" />
              <span>Authentication Standard</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              All REST API requests require an HTTP Bearer header containing your active API key (available on your User Account Dashboard for Predictor, Trader, and Institution tiers).
            </p>
            <div className="p-2.5 bg-[#020617] rounded-lg font-mono text-[11px] text-slate-300">
              Authorization: Bearer ipobrain_live_key_9948271
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono uppercase font-bold text-[#64748b]">Executable Request Snippets</span>
            <div className="flex bg-[#0f172a] p-1 rounded-lg border border-white/10 gap-1 text-[10px] font-mono font-bold uppercase">
              {(["curl", "js", "python"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeLang === lang ? "bg-[#06b6d4] text-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang === "js" ? "JavaScript" : lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-6">
            {endpoints.map((ep, idx) => {
              const code = getCodeSnippet(ep);
              return (
                <div key={idx} className="p-6 bg-[#0f172a]/60 border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] font-mono text-xs font-bold rounded">
                        {ep.method}
                      </span>
                      <span className="font-mono text-sm text-white font-bold">{ep.path}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#94a3b8] font-light">{ep.desc}</p>

                  {/* Code Snippet */}
                  <div className="relative p-4 bg-[#020617] rounded-xl border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto">
                    <button
                      onClick={() => copyCode(code, `code-${idx}`)}
                      className="absolute top-3 right-3 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      {copiedCode === `code-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCode === `code-${idx}` ? "Copied" : "Copy"}
                    </button>
                    <pre className="whitespace-pre">{code}</pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

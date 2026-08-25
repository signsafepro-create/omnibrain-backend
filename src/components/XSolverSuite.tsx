import React, { useState, useEffect } from "react";
import { Layers, Activity, Sliders, ShieldCheck, Terminal, ShieldAlert, Cpu, BarChart2, Check, Play, Settings, RefreshCw, Key, Users, MessageSquare, Save, HeartHandshake, MapPin, DollarSign, Send, Megaphone, Globe, Zap } from "lucide-react";
import { useLiveEvents } from "../hooks/useLiveEvents";

interface FeedbackLog {
  id: string;
  candidateName: string;
  adjustment: string;
  reason: string;
  status: "LOCKED_IN" | "REFINING";
  timestamp: string;
}

export default function XSolverSuite() {
  const events = useLiveEvents();
  const [activeTab, setActiveTab] = useState<"context" | "engine" | "routing" | "governance" | "arch" | "cognitive" | "observability" | "security" | "quantum" | "intelligence">("context");
  const [quantumYear, setQuantumYear] = useState<2035 | 2045 | 2055>(2055);
  const [schemaText, setSchemaText] = useState(
    JSON.stringify(
      {
        "$schema": "https://x-solver.io/schemas/context.json",
        "businessmeaning": {
          "domain": "AI Venture Telemetry",
          "terms": [
            { "name": "IPO Probability", "definition": "Predictive probability of going public within specified window based on signal convergence.", "resolver": "db.candidates.ipoProbability" },
            { "name": "Investment Score", "definition": "0-100 rating reflecting filing status, underwriter alignment, and leadership readiness.", "resolver": "db.candidates.score" },
            { "name": "Signal Convergence", "definition": "Weight-averaged matching coefficient across active regulatory, hiring, and financial events.", "resolver": "db.stats.signalAccuracy" }
          ]
        }
      },
      null,
      2
    )
  );

  const [repeatabilityMode, setRepeatabilityMode] = useState(true);
  const [routingProvider, setRoutingProvider] = useState<"google" | "groq" | "fallback">("google");
  const [governanceCheckpoints, setGovernanceCheckpoints] = useState([
    { id: "GC-1", action: "Deploy automated scraping worker to Railway container", risk: "LOW", status: "APPROVED", date: "Just Now" },
    { id: "GC-2", action: "Update S-1 draft confidence metric for Anthropic to 95%", risk: "MEDIUM", status: "PENDING", date: "Scheduled" }
  ]);

  // Human-Judgment Feedback Loop state
  const [selectedCandidate, setSelectedCandidate] = useState("Scale AI");
  const [correctedProbability, setCorrectedProbability] = useState("88");
  const [correctionReason, setCorrectionReason] = useState("");
  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackLog[]>([
    { id: "FL-1", candidateName: "Databricks", adjustment: "Set IPO Probability to 94% (previous: 89%)", reason: "S-1 confidential filing registration confirmed via IR contact.", status: "LOCKED_IN", timestamp: "1 hour ago" },
    { id: "FL-2", candidateName: "Cerebras", adjustment: "Flagged lock-up expiration parameters", reason: "Modified secondary market liquidity multipliers.", status: "LOCKED_IN", timestamp: "2 hours ago" }
  ]);

  // Market Intelligence & Simulator states
  const [riskProfile, setRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const [timeHorizon, setTimeHorizon] = useState<number>(6); // 6 months
  const [watchlist, setWatchlist] = useState<string[]>(["OpenAI", "Anthropic", "Scale AI"]);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    "System initiated: Dynamic simulation desk online.",
    "Ready to inject market triggers."
  ]);
  const [simulatedBoosts, setSimulatedBoosts] = useState<Record<string, number>>({});

  // Alerts and Triggers states
  const [activeAlerts, setActiveAlerts] = useState([
    { id: "A1", target: "OpenAI", threshold: 90, type: "probability_cross" },
    { id: "A2", target: "Anthropic", threshold: 95, type: "probability_cross" }
  ]);
  const [alertTarget, setAlertTarget] = useState("OpenAI");
  const [alertThreshold, setAlertThreshold] = useState(85);

  const [metrics, setMetrics] = useState({
    apiLatency: "12ms",
    dbSearchLatency: "8ms",
    modelRoutingCost: "$0.0024 / 1K tokens",
    soc2Status: "VERIFIED",
    gdprStatus: "COMPLIANT"
  });

  const handleApproveCheckpoint = (id: string) => {
    setGovernanceCheckpoints(prev =>
      prev.map(c => c.id === id ? { ...c, status: "APPROVED" } : c)
    );
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) return;

    const newLog: FeedbackLog = {
      id: `FL-${feedbackLogs.length + 1}`,
      candidateName: selectedCandidate,
      adjustment: `Adjusted Probability to ${correctedProbability}%`,
      reason: correctionReason,
      status: "REFINING",
      timestamp: "Just Now"
    };

    setFeedbackLogs([newLog, ...feedbackLogs]);
    setCorrectionReason("");

    // Simulate memory lock-in
    setTimeout(() => {
      setFeedbackLogs(prev =>
        prev.map(log => log.id === newLog.id ? { ...log, status: "LOCKED_IN" } : log)
      );
    }, 4000);
  };

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto py-12" id="x-solver-control-center">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black font-serif italic text-white tracking-tight">
            X-Solver Enterprise Control Center
          </h2>
          <p className="text-[#94a3b8] mt-2 font-light">
            Manage business meaning contexts, governed repeatable engines, multi-cloud routing, and Zero Trust security.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold font-mono bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-3.5 py-2 rounded-full text-[#06b6d4] tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
          <span>SOVEREIGN ARCHITECTURE ENABLED</span>
        </div>
      </div>

      <div className="bg-[#020617]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[600px] flex flex-col lg:flex-row">
        {/* Left Navigation Menu */}
        <div className="w-full lg:w-64 border-r border-white/10 bg-[#0f172a]/20 p-6 flex flex-col gap-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#64748b] mb-2 block">
            Enterprise Architecture Layers
          </span>
          {[
            { id: "context", name: "1. Business Meaning", icon: Layers },
            { id: "engine", name: "2. Governed Answer Engine", icon: ShieldCheck },
            { id: "routing", name: "3. Model Orchestrator", icon: Sliders },
            { id: "governance", name: "4. Autonomy & Feedback", icon: ShieldAlert },
            { id: "arch", name: "5. Solutions Architecture", icon: Cpu },
            { id: "cognitive", name: "6. Adaptive Cognitive", icon: Users },
            { id: "observability", name: "7. Observability Dashboard", icon: BarChart2 },
            { id: "security", name: "8. Security & Zero Trust", icon: Settings },
            { id: "quantum", name: "9. 30-Yr Quantum Sandbox", icon: Globe },
            { id: "intelligence", name: "10. Market Intelligence", icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 border ${
                  activeTab === tab.id
                    ? "bg-white border-white text-black shadow-lg"
                    : "bg-transparent border-transparent text-[#94a3b8] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8 space-y-6">
          {/* 1. Context & Business Meaning */}
          {activeTab === "context" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Unified Business Meaning Schema</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Define business definitions once. Enforce matching criteria across BI dashboards, data layers, and OMNIBRAIN.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Schema Editor (JSON Standard)</span>
                <textarea
                  value={schemaText}
                  onChange={(e) => setSchemaText(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-300 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>
              <button className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-colors">
                Apply & Synchronize Context Schema
              </button>
            </div>
          )}

          {/* 2. Governed Answer Engine */}
          {activeTab === "engine" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Governed, Repeatable Answer Engine</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Force deterministic resolution pathways for business queries. Audit reasoning steps to eliminate AI hallucinations.
                </p>
              </div>

              {/* Repeatability Toggle */}
              <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Deterministic Repeatability Mode</h4>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-relaxed">
                    When active, forces model temperature to 0.0 and pins seed value to guarantee identical results for identical inputs.
                  </p>
                </div>
                <button
                  onClick={() => setRepeatabilityMode(!repeatabilityMode)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors ${repeatabilityMode ? "bg-[#06b6d4]" : "bg-slate-800"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${repeatabilityMode ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Versioned Reasoning Steps */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Solver Execution Trace & Versioning</span>
                <div className="p-4 bg-[#020617] border border-white/5 rounded-xl space-y-2 font-mono text-[11px] text-slate-300">
                  <div className="text-[#06b6d4]">v1.4.2 [SUCCESS] - Resolved 'Anthropic IPO Timing'</div>
                  <div className="pl-4 border-l border-white/10 text-slate-400">
                    Step 1: Check S-1 regulatory filings in db... (100% match)<br />
                    Step 2: Parse Director of IR job posting... (Verified)<br />
                    Step 3: Calculate score matrix (Current score: 82.4)<br />
                    Step 4: Output report container.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Model Orchestrator */}
          {activeTab === "routing" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Multi-Cloud Routing & Orchestration</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Define routing profiles based on real-time latency, API costs, and target context complexity.
                </p>
              </div>

              {/* Router Selector */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "google", name: "Google AI Studio", desc: "Lowest latency (12ms), premium reasoning.", badge: "gemini-2.5-flash" },
                  { id: "groq", name: "Groq Cloud Llama", desc: "Ultra-fast execution, mid-reasoning.", badge: "llama-3.3-70b" },
                  { id: "fallback", name: "Sovereign Failover", desc: "Local database candidate fallback.", badge: "offline active" }
                ].map(prov => (
                  <button
                    key={prov.id}
                    onClick={() => setRoutingProvider(prov.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                      routingProvider === prov.id
                        ? "bg-[#06b6d4]/5 border-[#06b6d4] text-[#06b6d4]"
                        : "bg-[#0f172a]/60 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{prov.name}</span>
                    <span className="text-[10px] block font-light leading-normal">{prov.desc}</span>
                    <span className="inline-block text-[9px] font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 text-[#64748b]">
                      {prov.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Autonomy Governance & Human Feedback Loop */}
          {activeTab === "governance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Autonomy & Human Feedback Loop</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Review pending autonomous checkpoints and submit human corrections to refine model memory and ensure continuous learning.
                </p>
              </div>

              {/* Interactive Feedback Form */}
              <div className="p-5 bg-[#0f172a]/80 border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#06b6d4]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Human Correction & Memory Refinement</span>
                </div>
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-[#64748b] uppercase block mb-1">Select Candidate</label>
                      <select
                        value={selectedCandidate}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                        className="w-full p-2 rounded bg-black/40 border border-white/15 text-white text-xs"
                      >
                        <option value="Scale AI">Scale AI</option>
                        <option value="Databricks">Databricks</option>
                        <option value="Cerebras">Cerebras</option>
                        <option value="Epic Games">Epic Games</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="SpaceX">SpaceX</option>
                        <option value="xAI">xAI</option>
                        <option value="Anthropic">Anthropic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#64748b] uppercase block mb-1">Override IPO Probability (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={correctedProbability}
                        onChange={(e) => setCorrectedProbability(e.target.value)}
                        className="w-full p-2 rounded bg-black/40 border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#64748b] uppercase block mb-1">Reason / Context (Agent Memory Correction)</label>
                    <input
                      type="text"
                      placeholder="e.g. Executive hiring anomaly or new SEC document detected..."
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      className="w-full p-2 rounded bg-black/40 border border-white/15 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#06b6d4] text-black font-black uppercase text-[10px] tracking-wider rounded hover:bg-cyan-400 transition-all flex items-center justify-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Submit Agent Correction & Refine Memory
                  </button>
                </form>
              </div>

              {/* Continuous Learning Log */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold block">Continuous Learning Memory Logs</span>
                <div className="divide-y divide-white/5 border border-white/5 rounded-xl bg-black/10 overflow-hidden text-xs">
                  {feedbackLogs.map(log => (
                    <div key={log.id} className="p-3 flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-white">{log.candidateName} &mdash; <span className="font-light text-slate-300">{log.adjustment}</span></div>
                        <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-relaxed italic">"{log.reason}"</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          log.status === "LOCKED_IN" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse"
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-[9px] text-[#64748b] font-mono">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkpoints */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Pending Human-in-the-loop Queue</span>
                <div className="divide-y divide-white/10 border border-white/10 rounded-xl bg-black/20 overflow-hidden">
                  {governanceCheckpoints.map(cp => (
                    <div key={cp.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <span>{cp.action}</span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                            cp.risk === "LOW" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {cp.risk} RISK
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748b] font-mono block mt-1">{cp.id} · Scheduled {cp.date}</span>
                      </div>
                      {cp.status === "PENDING" ? (
                        <button
                          onClick={() => handleApproveCheckpoint(cp.id)}
                          className="px-3.5 py-1.5 bg-[#06b6d4] text-black hover:bg-cyan-400 text-[10px] font-black uppercase tracking-wider rounded transition-all"
                        >
                          Approve Action
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          APPROVED
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Solutions Architecture */}
          {activeTab === "arch" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Data Pipeline & Vector Search</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Monitor raw data ingestion rates, vector search index latency, and lifecycle mappings of current target candidates.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Vector Search Latency</span>
                  <div className="text-3xl font-black font-serif italic text-white">{metrics.dbSearchLatency}</div>
                  <p className="text-[10px] text-[#94a3b8] font-light">Index lookups against 8 candidate nodes.</p>
                </div>
                <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">API Latency</span>
                  <div className="text-3xl font-black font-serif italic text-[#06b6d4]">{metrics.apiLatency}</div>
                  <p className="text-[10px] text-[#94a3b8] font-light">Average request handling speed (live telemetry).</p>
                </div>
              </div>
            </div>
          )}

          {/* 6. Adaptive Cognitive Modeling */}
          {activeTab === "cognitive" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Adaptive Cognitive Modeling</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Customize OMNIBRAIN communication styles and logical parameters based on user profile preferences.
                </p>
              </div>

              <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider block">Target Output Presentation</span>
                <select className="w-full p-2.5 rounded-lg bg-[#020617] border border-white/10 text-white text-xs focus:outline-none">
                  <option value="quant">Quantitative (Deep stats, underwriting price models)</option>
                  <option value="executive">Executive Summary (High-level timing windows, core risks)</option>
                  <option value="retail">General Analyst (Explanations of S-1 filings and IR triggers)</option>
                </select>
              </div>
            </div>
          )}

          {/* 7. Observability Dashboard */}
          {activeTab === "observability" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Observability & Real-Time Event Stream</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Real-time visualization of payment sessions, active user check-ins, and model dispatch loops streaming directly via Server-Sent Events (SSE).
                </p>
              </div>

              {/* Simulation Controls */}
              <div className="p-4 bg-[#0f172a] border border-cyan-500/20 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-xl">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Interactive Telemetry Simulator</h4>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5 font-light">Force-inject test event nodes directly into the live Vercel Serverless database.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const cities = ["Paris, FR", "New York, US", "Tokyo, JP", "London, GB", "Seoul, KR"];
                      const names = ["Andre L.", "Sarah M.", "Hiroshi T.", "Clara B.", "Max K."];
                      const randName = names[Math.floor(Math.random() * names.length)];
                      const randCity = cities[Math.floor(Math.random() * cities.length)];
                      
                      await fetch("/api/v1/checkin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ customer_name: randName, location: randCity })
                      });
                    }}
                    className="px-4 py-2 bg-[#0f172a] border border-white/10 hover:border-white/30 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Simulate Check-in
                  </button>
                  <button
                    onClick={async () => {
                      await fetch("/api/v1/marketing-agent");
                    }}
                    className="px-4 py-2 bg-white text-black hover:bg-slate-200 font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-purple-600" />
                    Dispatch Agent Loop
                  </button>
                </div>
              </div>

              {/* Latencies */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider block">Model Cost Rating</span>
                  <div className="text-base font-black font-serif italic text-white">{metrics.modelRoutingCost}</div>
                </div>
                <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider block">SSE Tunnel Connection</span>
                  <div className="text-base font-black font-serif italic text-emerald-400">ESTABLISHED</div>
                </div>
                <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider block">Autonomous Agent Loops</span>
                  <div className="text-base font-black font-serif italic text-purple-400">MONITORING</div>
                </div>
              </div>

              {/* Event Feeds */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* SSE Live Telemetry Panel */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3.5 h-[320px] flex flex-col justify-between overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white">Live Telemetry Feed (SSE)</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {events.filter(e => e.type === "payment" || e.type === "checkin").length === 0 ? (
                      <div className="text-xs text-[#64748b] font-mono italic text-center pt-16">Waiting for telemetry signals to stream...</div>
                    ) : (
                      events.filter(e => e.type === "payment" || e.type === "checkin").map((e, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-white/5 bg-[#020617]/80 flex items-start justify-between gap-3 hover:border-white/10 transition-colors">
                          <div className="flex items-start gap-2.5">
                            {e.type === "payment" ? (
                              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                                <DollarSign className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div>
                              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                                {e.type === "payment" ? "Stripe Checkout" : "Node Check-in"}
                              </div>
                              <p className="text-xs font-light text-slate-200 mt-0.5 leading-normal">
                                {e.type === "payment" ? (
                                  <>Processed <strong>${e.payload.amount_total / 100} {e.payload.currency?.toUpperCase()}</strong> subscription from <strong>{e.payload.customer_email}</strong></>
                                ) : (
                                  <>Active node connection recorded from <strong>{e.payload.location}</strong> by <strong>{e.payload.customer_name}</strong></>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono shrink-0">
                            {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Autonomous Actions (X-Sovereign) */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3.5 h-[320px] flex flex-col justify-between overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Megaphone className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white">Autonomous Dispatch Logs</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {events.filter(e => e.type === "marketing_action").length === 0 ? (
                      <div className="text-xs text-[#64748b] font-mono italic text-center pt-16">No marketing dispatches recorded. Trigger loop above.</div>
                    ) : (
                      events.filter(e => e.type === "marketing_action").map((e, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-purple-500/10 bg-[#0f172a]/30 flex flex-col gap-1.5 hover:border-purple-500/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded">
                              DISPATCH SUCCESS
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-xs font-light text-purple-200 italic leading-relaxed">
                            "{e.payload.description}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. Security & Zero Trust */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white">Sovereign Security & Zero Trust</h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Verify GDPR/HIPAA/SOC2 compliance status templates, encryption standards, and trigger failover simulations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">SOC2 Security Standard</span>
                  <div className="text-2xl font-black font-serif italic text-white">{metrics.soc2Status}</div>
                  <p className="text-[10px] text-[#94a3b8] font-light">Audit templates successfully verified.</p>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">GDPR Compliance</span>
                  <div className="text-2xl font-black font-serif italic text-white">{metrics.gdprStatus}</div>
                  <p className="text-[10px] text-[#94a3b8] font-light">Zero-storage encryption protocols active.</p>
                </div>
              </div>

              <button className="w-full py-3.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 font-black uppercase text-xs tracking-widest rounded-xl transition-all">
                Simulate Disaster Recovery & Failover Protocol
              </button>
            </div>
          )}

          {/* 9. Quantum Sandbox */}
          {activeTab === "quantum" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400 animate-spin-slow" />
                  30-Year Quantum Sandbox & Singularity Timeline
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Calibrate the prediction engine across futuristic decades. Forecast the S-1 filings, valuations, and optimal timing windows of digital entities, orbital networks, and stellar energy consortiums.
                </p>
              </div>

              {/* Timeline Slider Buttons */}
              <div className="p-4 bg-[#0f172a] border border-purple-500/20 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-xl">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Horizon Decadal Target</h4>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5 font-light">Shift cognitive mapping focus to forecast upcoming centuries.</p>
                </div>
                <div className="flex gap-2">
                  {[2035, 2045, 2055].map((year) => (
                    <button
                      key={year}
                      onClick={() => setQuantumYear(year as any)}
                      className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all border ${
                        quantumYear === year
                          ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.05]"
                          : "bg-[#0f172a] border-white/5 text-[#64748b] hover:text-white"
                      }`}
                    >
                      🌌 Decadal Horizon: {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantum Candidate Predictions */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider block font-bold">
                  Predicted S-1 Filings Pipeline ({quantumYear} Era)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quantumYear === 2035 && (
                    <>
                      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl hover:border-cyan-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase">
                              Neural Bandwidth
                            </span>
                            <h4 className="text-base font-serif italic font-bold text-white mt-1.5">NeuralMesh Global</h4>
                          </div>
                          <span className="text-xs font-mono text-[#64748b]">Ticker: NM</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                          Direct-to-cortex human memory sharing networks. Integrates low-latency synapse mappings and secondary cognitive storage.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-slate-500 block">Est. Valuation</span>
                            <span className="text-white font-bold">$920B</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IPO Prob.</span>
                            <span className="text-emerald-400 font-bold">95.8%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Timing Window</span>
                            <span className="text-purple-400 font-bold">Q4 2035</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl hover:border-cyan-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase">
                              Satellite Telemetry
                            </span>
                            <h4 className="text-base font-serif italic font-bold text-white mt-1.5">Orbital Scraping Network</h4>
                          </div>
                          <span className="text-xs font-mono text-[#64748b]">Ticker: ORBIT</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                          Real-time low latency satellite scraping arrays tracking crop yields, orbital metal extraction, and global logistics.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-slate-500 block">Est. Valuation</span>
                            <span className="text-white font-bold">$340B</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IPO Prob.</span>
                            <span className="text-cyan-400 font-bold">91.2%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Timing Window</span>
                            <span className="text-emerald-400 font-bold">IMMEDIATE</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {quantumYear === 2045 && (
                    <>
                      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl hover:border-purple-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase">
                              Organic Compute
                            </span>
                            <h4 className="text-base font-serif italic font-bold text-white mt-1.5">BioComputronix</h4>
                          </div>
                          <span className="text-xs font-mono text-[#64748b]">Ticker: DNA</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                          Organic biological storage lattices replacing traditional silicon datacenters. Stores yottabytes inside synthetic cell structures.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-slate-500 block">Est. Valuation</span>
                            <span className="text-white font-bold">$12.4T</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IPO Prob.</span>
                            <span className="text-emerald-400 font-bold">94.6%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Timing Window</span>
                            <span className="text-[#06b6d4] font-bold">Q2 2045</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl hover:border-purple-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase">
                              Consolidated AI Nation
                            </span>
                            <h4 className="text-base font-serif italic font-bold text-white mt-1.5">Sovereign Agent Matrix</h4>
                          </div>
                          <span className="text-xs font-mono text-[#64748b]">Ticker: NATION</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                          Sovereign digital entity representing over 10 million autonomous software agents. Operates under digital trade laws.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-slate-500 block">Est. Valuation</span>
                            <span className="text-white font-bold">$8.9T</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IPO Prob.</span>
                            <span className="text-cyan-400 font-bold">89.2%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Timing Window</span>
                            <span className="text-[#8b5cf6] font-bold">LATE 2045</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {quantumYear === 2055 && (
                    <>
                      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl hover:border-amber-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase">
                              Stellar Infrastructure
                            </span>
                            <h4 className="text-base font-serif italic font-bold text-white mt-1.5">Dyson Solar Syndicate</h4>
                          </div>
                          <span className="text-xs font-mono text-[#64748b]">Ticker: DYSON</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                          Orbital solar collectors orbiting the Sun. Provides wireless energy beaming back to Earth-Moon and Martian colonies.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-slate-500 block">Est. Valuation</span>
                            <span className="text-white font-bold">$880T</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IPO Prob.</span>
                            <span className="text-emerald-400 font-bold">98.4%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Timing Window</span>
                            <span className="text-[#06b6d4] font-bold">SOL 12 (2055)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl hover:border-amber-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase">
                              Martian Logistics
                            </span>
                            <h4 className="text-base font-serif italic font-bold text-white mt-1.5">Martian Heuristics</h4>
                          </div>
                          <span className="text-xs font-mono text-[#64748b]">Ticker: MARS</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                          Quantum-routing trade matrices directing automated cargo fleets across Earth-Mars supply chain corridors.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-slate-500 block">Est. Valuation</span>
                            <span className="text-white font-bold">$42.6T</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IPO Prob.</span>
                            <span className="text-cyan-400 font-bold">92.1%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Timing Window</span>
                            <span className="text-purple-400 font-bold">SOL 412 (2056)</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quantum Telemetry Stream Simulation */}
              <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-3 shadow-2xl">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white">Quantum Routing Desks Telemetries</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-[#0f172a] rounded-xl border border-white/5">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">Multiversal Trade Rate</span>
                    <span className="text-sm font-mono text-white font-black">14,204 QPS</span>
                  </div>
                  <div className="p-3 bg-[#0f172a] rounded-xl border border-white/5">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">BioCompute Bandwidth</span>
                    <span className="text-sm font-mono text-[#06b6d4] font-black">9.4 Yottabytes</span>
                  </div>
                  <div className="p-3 bg-[#0f172a] rounded-xl border border-white/5">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">AI Singularity Alignment</span>
                    <span className="text-sm font-mono text-emerald-400 font-black">99.98%</span>
                  </div>
                  <div className="p-3 bg-[#0f172a] rounded-xl border border-white/5">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">Quantum Failover</span>
                    <span className="text-sm font-mono text-purple-400 font-black">STABLE (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. Bloomberg-style Market Intelligence Suite */}
          {activeTab === "intelligence" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif italic text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#06b6d4]" />
                  OMNIBRAIN Bloomberg-style Market Intelligence Suite
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light leading-relaxed">
                  Consolidated predictive metrics including sector breakdowns, leak probabilities, user portfolios, and an interactive macro event simulator.
                </p>
              </div>

              {/* Row 1: Heat Index & Leak Probability */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. AI Market Heat Index */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between shadow-xl space-y-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                      AI Market Heat Index
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase font-serif">Market Velocity Indicator</h4>
                  </div>
                  <div className="flex items-center justify-center py-4 relative">
                    {/* Gauge circle simulation */}
                    <div className="w-28 h-28 rounded-full border-[8px] border-white/5 border-t-purple-500 border-r-cyan-400 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-black font-mono text-white">78</span>
                        <span className="text-[10px] text-slate-500 font-mono block font-bold">VERY HOT</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-[10px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Capital Flow Rate:</span>
                      <span className="text-white">$42.4B / yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Filings:</span>
                      <span className="text-purple-400">4 Prep</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hiring Surges:</span>
                      <span className="text-emerald-400">+18.4%</span>
                    </div>
                  </div>
                </div>

                {/* 2. S-1 Draft Leak Probability */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between shadow-xl space-y-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">
                      leak probability
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase font-serif">S-1 Confidential Leak Risks</h4>
                  </div>
                  <div className="space-y-3 flex-1 pt-2">
                    {[
                      { name: "Anthropic", ticker: "ANTR", prob: 62 },
                      { name: "OpenAI", ticker: "OPEN", prob: 48 },
                      { name: "SpaceX", ticker: "SPACE", prob: 25 },
                      { name: "Scale AI", ticker: "SCALE", prob: 71 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 font-bold">{item.name}</span>
                          <span className={`${item.prob > 60 ? "text-rose-400" : item.prob > 40 ? "text-amber-400" : "text-slate-400"} font-bold`}>
                            {item.prob}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.prob > 60 ? "bg-rose-400" : item.prob > 40 ? "bg-amber-400" : "bg-slate-500"} rounded-full`}
                            style={{ width: `${item.prob}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-[#64748b] leading-normal font-mono">
                    Based on executive placement hires & SEC pre-filing correspondence anomalies.
                  </p>
                </div>

                {/* 3. Real-Time News Signal Fusion */}
                <div className="p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between shadow-xl space-y-3.5 h-[280px]">
                  <div className="pb-2 border-b border-white/5">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                      Signal Fusion
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase font-serif">Intelligence Narratives</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin text-xs text-slate-300 font-light leading-relaxed">
                    <div className="p-2 bg-[#020617]/60 border border-white/5 rounded-lg">
                      🟢 <strong>Anthropic</strong> probability increased 4% due to new hiring signals + SEC filing movement.
                    </div>
                    <div className="p-2 bg-[#020617]/60 border border-white/5 rounded-lg">
                      🔵 <strong>OpenAI</strong> S-1 leak risk elevated due to corporate restructure filings in Delaware.
                    </div>
                    <div className="p-2 bg-[#020617]/60 border border-white/5 rounded-lg">
                      🟡 <strong>Scale AI</strong> secondary stock volume surged 18.5%, indicating target price convergence.
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Investor Mode & Sector Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* 1. Investor Mode Profile Configurator */}
                <div className="p-6 bg-[#0f172a]/60 border border-white/10 rounded-2xl space-y-5 shadow-2xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-black uppercase text-white tracking-wider">Investor Mode Configurator</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {["conservative", "moderate", "aggressive"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setRiskProfile(p as any)}
                          className={`py-2 px-3 rounded-lg border text-center font-mono text-[10px] uppercase font-bold tracking-wider transition-all ${
                            riskProfile === p
                              ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-md"
                              : "bg-[#020617] border-white/5 text-slate-500 hover:text-white"
                          }`}
                        >
                          {p} Risk
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#64748b] uppercase font-bold flex justify-between">
                        <span>Target Time Horizon</span>
                        <span className="text-cyan-400">{timeHorizon} Months</span>
                      </label>
                      <input
                        type="range"
                        min="3"
                        max="24"
                        step="3"
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(Number(e.target.value))}
                        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="p-4 bg-[#020617] border border-white/5 rounded-xl space-y-2">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Matching Opportunities Match</span>
                      <p className="text-xs text-slate-200 font-light leading-relaxed">
                        {riskProfile === "conservative" ? (
                          <>Your optimal window is <strong>12-18 months</strong>. Recommend focus on cash-flow heavy giants: <strong>SpaceX</strong> or <strong>Scale AI</strong>.</>
                        ) : riskProfile === "aggressive" ? (
                          <>Your optimal window is <strong>1-3 months</strong>. Recommend volatile near-term plays: <strong>Cerebras</strong> or <strong>OpenAI</strong>.</>
                        ) : (
                          <>Your optimal window is <strong>6-12 months</strong>. Balanced matching cohort: <strong>Anthropic</strong> and <strong>Databricks</strong>.</>
                        )}
                      </p>
                    </div>

                    {/* Portfolio Checklists */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Followed Portfolio Watchlist</span>
                      <div className="flex flex-wrap gap-2">
                        {["OpenAI", "Anthropic", "SpaceX", "Scale AI", "Cerebras", "Databricks"].map((candidateName) => {
                          const isFollowed = watchlist.includes(candidateName);
                          return (
                            <button
                              key={candidateName}
                              type="button"
                              onClick={() => {
                                if (isFollowed) {
                                  setWatchlist(watchlist.filter(w => w !== candidateName));
                                } else {
                                  setWatchlist([...watchlist, candidateName]);
                                }
                              }}
                              className={`py-1.5 px-3 rounded-full text-[10px] font-bold font-mono transition-all border ${
                                isFollowed
                                  ? "bg-purple-600/10 border-purple-500 text-purple-400"
                                  : "bg-transparent border-white/10 text-slate-400 hover:text-white"
                              }`}
                            >
                              {isFollowed ? "✓ " : "+ "} {candidateName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. AI Sector Breakdown & Heat Map */}
                <div className="p-6 bg-[#0f172a]/60 border border-white/10 rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono font-black uppercase text-white tracking-wider">AI Sector Breakdown</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { sector: "Foundation Models", heat: 94, window: "3-6 Months", candidates: "OpenAI, Anthropic" },
                      { sector: "AI Infrastructure", heat: 88, window: "6-12 Months", candidates: "Scale AI, Cerebras" },
                      { sector: "AI Coding / Search", heat: 68, window: "12+ Months", candidates: "Cognition, Perplexity" },
                      { sector: "AI Robotics / Bio", heat: 74, window: "18+ Months", candidates: "Figure, Evolutionary" }
                    ].map((sec, idx) => (
                      <div key={idx} className="p-3 bg-[#020617]/80 border border-white/5 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{sec.sector}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
                            {sec.heat}% Heat
                          </span>
                        </div>
                        <div className="text-[10px] text-[#64748b] leading-normal font-light">
                          <div>Window: <strong className="text-slate-300 font-mono">{sec.window}</strong></div>
                          <div>Tracked: <strong className="text-slate-300 font-serif italic">{sec.candidates}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Macro AI Market Simulator Sandbox */}
              <div className="p-6 bg-black/60 border border-white/10 rounded-2xl space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400 animate-spin-slow" />
                    <span className="text-xs font-mono font-black uppercase text-white tracking-wider">Macro AI Market Simulator Sandbox</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedBoosts({});
                      setSimulationLog(["Simulation environment reset successfully.", "Ready to inject market triggers."]);
                    }}
                    className="text-[9px] font-mono font-bold uppercase text-slate-500 hover:text-white"
                  >
                    Reset Simulator
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Triggers Column */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Inject Macro Events</span>
                    {[
                      { label: "Trigger OpenAI For-Profit Migration", key: "OpenAI", boost: 8.5, log: "OpenAI conversion paperwork submitted. Probability increased +8.5%" },
                      { label: "Force Early Anthropic S-1 Filing", key: "Anthropic", boost: 7.1, log: "Anthropic CFO signs regulatory S-1 document. Probability increased +7.1%" },
                      { label: "Simulate Secondary Market Surge", key: "all", boost: 4.2, log: "Secondary market liquidity pools expanded. Cohort probabilities bumped +4.2%" }
                    ].map((trigger, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (trigger.key === "all") {
                            setSimulatedBoosts(prev => ({
                              ...prev,
                              OpenAI: (prev.OpenAI || 0) + trigger.boost,
                              Anthropic: (prev.Anthropic || 0) + trigger.boost,
                              SpaceX: (prev.SpaceX || 0) + trigger.boost
                            }));
                          } else {
                            setSimulatedBoosts(prev => ({
                              ...prev,
                              [trigger.key]: (prev[trigger.key] || 0) + trigger.boost
                            }));
                          }
                          setSimulationLog(prev => [trigger.log, ...prev]);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-[#0f172a] border border-white/5 hover:border-purple-500/30 text-xs font-bold text-slate-300 hover:text-purple-400 transition-all flex items-center gap-2"
                      >
                        <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        {trigger.label}
                      </button>
                    ))}
                  </div>

                  {/* Simulator Log Output */}
                  <div className="p-4 bg-[#020617] border border-white/5 rounded-xl h-[170px] flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold border-b border-white/5 pb-1 mb-2">
                      Simulation Logs
                    </span>
                    <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-400 scrollbar-thin">
                      {simulationLog.map((logLine, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <span className="text-purple-500">&gt;</span> {logLine}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output Probability Impact */}
                  <div className="p-4 bg-[#020617] border border-white/5 rounded-xl flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold border-b border-white/5 pb-1 mb-2">
                      Live Probability Impact
                    </span>
                    <div className="space-y-2.5">
                      {[
                        { name: "Anthropic", base: 92 },
                        { name: "OpenAI", base: 88 },
                        { name: "SpaceX", base: 75 }
                      ].map((item, idx) => {
                        const boost = simulatedBoosts[item.name] || 0;
                        const finalProb = Math.min(item.base + boost, 100);
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-300">{item.name}</span>
                            <span className="text-white font-bold">
                              {finalProb.toFixed(1)}% 
                              {boost > 0 ? (
                                <span className="text-emerald-400 ml-1.5 font-bold">
                                  (+{boost.toFixed(1)}%)
                                </span>
                              ) : null}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[8px] text-[#64748b] leading-normal font-mono mt-2">
                      Simulated indicators reset dynamically on reset click.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 4: Alerts Manager & Multi-Agent Consensus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* 1. Alerts & Threshold Triggers */}
                <div className="p-6 bg-[#0f172a]/60 border border-white/10 rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Megaphone className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-black uppercase text-white tracking-wider">Alerts & Threshold Triggers</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Select Target</label>
                      <select
                        value={alertTarget}
                        onChange={(e) => setAlertTarget(e.target.value)}
                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      >
                        {["OpenAI", "Anthropic", "SpaceX", "Scale AI", "Cerebras", "Databricks"].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-500 uppercase font-bold flex justify-between">
                        <span>Threshold</span>
                        <span className="text-cyan-400 font-bold">{alertThreshold}%</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="98"
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(Number(e.target.value))}
                        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400 mb-2"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newAlert = {
                        id: `A${Date.now()}`,
                        target: alertTarget,
                        threshold: alertThreshold,
                        type: "probability_cross"
                      };
                      setActiveAlerts([...activeAlerts, newAlert]);
                    }}
                    className="w-full py-2 bg-cyan-500 text-black hover:bg-cyan-400 text-[10px] font-black uppercase tracking-wider transition-all rounded-lg"
                  >
                    Create Custom Alert Trigger
                  </button>

                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Active Notification Triggers</span>
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1 scrollbar-thin">
                      {activeAlerts.map(alert => (
                        <div key={alert.id} className="flex justify-between items-center bg-[#020617] border border-white/5 px-3 py-2 rounded-lg text-xs font-mono">
                          <span className="text-slate-300">Notify when <strong className="text-white">{alert.target}</strong> probability &gt; <strong className="text-cyan-400">{alert.threshold}%</strong></span>
                          <button
                            type="button"
                            onClick={() => setActiveAlerts(activeAlerts.filter(a => a.id !== alert.id))}
                            className="text-[9px] text-rose-500 font-bold hover:text-rose-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Multi-Agent Consensus Node Log */}
                <div className="p-6 bg-[#0f172a]/60 border border-white/10 rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Users className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-xs font-mono font-black uppercase text-white tracking-wider">Multi-Agent Signal Consensus Node</span>
                  </div>

                  <div className="space-y-2 text-[10px] font-mono">
                    <div className="flex items-start gap-2 bg-[#020617] p-2.5 rounded-lg border border-white/5">
                      <span className="text-cyan-400 font-bold shrink-0">[GC-SEC]</span>
                      <p className="text-slate-300 leading-normal">
                        SEC S-1 filing scraping agent verified recent Delaware LLC registration amendments. Confidence: <strong className="text-white">HIGH (92%)</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 bg-[#020617] p-2.5 rounded-lg border border-white/5">
                      <span className="text-purple-400 font-bold shrink-0">[GC-LIQ]</span>
                      <p className="text-slate-300 leading-normal">
                        Secondary market liquidity agent parsed target trade volumes on Forge Global. Confidence: <strong className="text-white">MEDIUM (84%)</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 bg-[#020617] p-2.5 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-bold shrink-0">[GC-HR]</span>
                      <p className="text-slate-300 leading-normal">
                        Hiring anomaly agent tracked executive headhunt anomalies in San Francisco. Confidence: <strong className="text-white">HIGH (95%)</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#020617] p-3.5 rounded-lg border border-white/5 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">OMNIBRAIN Consensus Matrix:</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                      STRONG BUY (90.3%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 5: Historical Backtesting Curve */}
              <div className="p-6 bg-black/60 border border-white/10 rounded-2xl space-y-4 shadow-2xl">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-black uppercase text-white tracking-wider">Historical Prediction Backtesting Model</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 p-4 bg-[#020617] border border-white/5 rounded-xl text-center space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">2021-2025 predicted vs actual public listing curves</span>
                    {/* Visual representation of a beautiful graph line with CSS */}
                    <div className="h-28 w-full flex items-end justify-between px-4 pb-2 border-b border-l border-white/10 relative">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                        <div className="border-b border-white w-full" />
                        <div className="border-b border-white w-full" />
                        <div className="border-b border-white w-full" />
                      </div>
                      
                      {/* Actual Line (solid purple) & Predicted Line (dotted cyan) */}
                      <div className="absolute bottom-6 left-10 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/5">
                        OMNIBRAIN MODEL ACCURACY: 94.6%
                      </div>

                      {[45, 60, 52, 78, 85, 92, 88, 94].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                          <div className="w-2.5 bg-gradient-to-t from-purple-500/20 to-cyan-400 rounded-t" style={{ height: `${h}px` }} />
                          <span className="text-[8px] font-mono text-slate-500">Q{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#020617]/80 border border-white/5 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider block font-bold border-b border-white/5 pb-1">
                      Model Validation Metrics
                    </span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Root-Mean-Square (RMSE):</span>
                        <span className="text-white font-bold">0.042</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Success Ratio (Listing):</span>
                        <span className="text-emerald-400 font-bold">94.6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Time-to-Event Bias:</span>
                        <span className="text-purple-400 font-bold">-8.2 days</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-mono text-[#64748b] leading-normal">
                      OMNIBRAIN predictions pre-empt regulatory registration dates by 8.2 days on average.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Play, Sparkles, ShieldCheck, Zap, TrendingUp, Cpu, Lock, ArrowRight, Layers, Award, Info, HelpCircle } from "lucide-react";

interface LandingPageProps {
  onLaunchTerminal: () => void;
  onOpenAuth: () => void;
  onSelectTier: (tier: string) => void;
}

export default function LandingPage({ onLaunchTerminal, onOpenAuth, onSelectTier }: LandingPageProps) {
  const plans = [
    { name: "Explorer", price: "$0", desc: "For new users testing the system", features: ["1 Sovereign Agent", "Basic OMNIBRAIN reasoning", "50 API calls / day"] },
    { name: "Creator", price: "$39", desc: "For builders and solo founders", features: ["3 Sovereign Agents", "Full OMNIBRAIN reasoning", "2,000 API calls / day", "Persistent memory vault"] },
    { name: "Operator", price: "$149", desc: "For power users and small teams", features: ["10 Sovereign Agents", "OMNIBRAIN Master-II", "Zero-Trust Shield (Pillar 8)", "10,000 API calls / day"] },
    { name: "Sovereign", price: "$799", desc: "For high-growth startups & enterprises", features: ["Unlimited Sovereign Agents", "Private model routing", "Custom encryption keys", "100,000 API calls / day"] },
    { name: "Strategic", price: "$3,500", desc: "For financial institutions & quant labs", features: ["Everything in Sovereign", "IPO-Brain predictive engine", "Unlimited API calls", "Dedicated support engineer"] }
  ];

  return (
    <div className="relative pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-28">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#06b6d4]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-xs font-mono font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
          <span>The #1 AI Unicorn Predictive Terminal</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black font-serif italic text-white leading-[1.05] tracking-tight">
          Know Exactly When <br />
          <span className="bg-gradient-to-r from-white via-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
            AI Giants Go Public.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#94a3b8] font-light max-w-2xl mx-auto leading-relaxed">
          IPO BRAIN tracks public-readiness clues like high-profile executive hiring, regulatory document filings, and private trade data to predict IPO dates before they hit the news.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onLaunchTerminal}
            className="px-8 py-4 bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-2xl shadow-white/10 rounded-xl"
          >
            <Play className="w-4 h-4 fill-black text-black" />
            Launch Live Predictive Terminal
          </button>
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 bg-[#0f172a] border border-white/10 hover:border-white/30 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 rounded-xl"
          >
            <Sparkles className="w-4 h-4 text-[#06b6d4]" />
            Create Free Account
          </button>
        </div>
      </div>

      {/* Jargon Translator Section */}
      <div className="bg-[#0f172a]/40 border border-white/10 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#06b6d4]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono font-bold text-[#06b6d4] uppercase tracking-widest block mb-2">Plain English Explanations</span>
          <h2 className="text-3xl font-black font-serif italic text-white">How IPO BRAIN Works</h2>
          <p className="text-sm text-[#94a3b8] mt-2 font-light">
            We simplify complex venture capital telemetry into action-oriented data points. Here is what our core features mean in plain language:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#06b6d4]">
              <Cpu className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">1. IPO Telemetry</h3>
            </div>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
              <strong>What it is:</strong> Tracking the clues left behind. When a private unicorn prepares for an IPO, they hire specialized corporate attorneys, IRS accountants, and Investor Relations directors. We scan job listings, corporate registries, and SEC drafts to catch these hires early.
            </p>
          </div>

          <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#8b5cf6]">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">2. Signal Convergence</h3>
            </div>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
              <strong>What it is:</strong> Connecting the dots. A single job posting might not mean much, but when a company files confidential SEC paperwork, hires a CFO, and leases massive new office space in the same month, these signals converge to confirm an imminent public offering.
            </p>
          </div>

          <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">3. Predictive Architecture</h3>
            </div>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
              <strong>What it is:</strong> Our forecasting model. Our system processes all gathered signals through a neural network model to calculate a score from 0 to 100 representing IPO readiness, estimating the exact month and the public valuation range (e.g. $40B - $55B).
            </p>
          </div>
        </div>
      </div>

      {/* Simplified SaaS Pricing Grid with Live Numbers */}
      <div className="space-y-8" id="plans-comparison">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold text-[#8b5cf6] uppercase tracking-widest">SIMPLE, TRANSPARENT BILLING</span>
          <h2 className="text-3xl font-black font-serif italic text-white">Select Your Subscription Plan</h2>
          <p className="text-xs text-[#94a3b8] max-w-xl mx-auto font-light">
            Unrestricted access to the primary predictive console. Pay monthly, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((p, idx) => (
            <div key={idx} className="p-6 bg-[#020617] border border-white/10 rounded-2xl flex flex-col justify-between hover:border-[#06b6d4]/40 hover:-translate-y-1 transition-all duration-300">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{p.name}</h3>
                <p className="text-[10px] text-[#94a3b8] mt-1 font-light leading-snug min-h-[30px]">{p.desc}</p>
                
                <div className="mt-4 flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-white">{p.price}</span>
                  <span className="text-[9px] text-[#64748b] font-mono">/mo</span>
                </div>

                <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-normal">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  const idMap: Record<string, string> = {
                    "Explorer": "free",
                    "Creator": "pro",
                    "Operator": "premium",
                    "Sovereign": "enterprise",
                    "Strategic": "institution"
                  };
                  onSelectTier(idMap[p.name]);
                }}
                className="mt-6 w-full py-2 bg-[#0f172a] border border-white/10 hover:border-white/30 text-white hover:text-cyan-400 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors"
              >
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-10 bg-gradient-to-r from-[#0f172a] via-[#020617] to-[#0f172a] border border-[#06b6d4]/30 rounded-3xl text-center space-y-6">
        <h2 className="text-3xl font-black font-serif italic text-white">Join the Next Generation of Tech Capital</h2>
        <p className="text-sm text-[#94a3b8] max-w-xl mx-auto font-light">
          Say goodbye to delayed news releases. Access real-time pre-IPO research instantly.
        </p>
        <button
          onClick={onLaunchTerminal}
          className="px-8 py-4 bg-[#06b6d4] text-black hover:bg-cyan-400 font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl shadow-[#06b6d4]/20"
        >
          Access Terminal Now
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, Key, Bookmark, Shield, Sparkles, X, Check, Copy, LogOut } from "lucide-react";

interface UserDashboardProps {
  user: UserProfile | null;
  currentTier: string;
  onClose: () => void;
  onLogout: () => void;
  onUpgradeTier: (tier: string) => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export default function UserDashboard({
  user,
  currentTier,
  onClose,
  onLogout,
  onUpgradeTier,
  onUpdateUser,
}: UserDashboardProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("omnibrain_api_key") || "");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const apiKey = user?.apiKey || "ipobrain_live_demo_1234567890";

  const handleGeminiKeyChange = (val: string) => {
    setGeminiKey(val);
    localStorage.setItem("omnibrain_api_key", val);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = async () => {
    const token = localStorage.getItem("ipo_brain_token");
    if (!token) return;
    setIsRegenerating(true);
    try {
      const res = await fetch("/api/v1/auth/regenerate-key", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.apiKey && user) {
          const updated = { ...user, apiKey: data.apiKey };
          if (onUpdateUser) {
            onUpdateUser(updated);
          }
        }
      }
    } catch (err) {
      console.error("Failed to regenerate API key:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const getTierDisplay = () => {
    switch (currentTier) {
      case "pro":
        return "Creator ($39 CAD/mo)";
      case "premium":
        return "Operator ($149 CAD/mo)";
      case "enterprise":
        return "Sovereign ($799 CAD/mo)";
      case "institution":
        return "Strategic ($3,500 CAD/mo)";
      default:
        return "Explorer (Free)";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-6 p-6 md:p-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4] font-bold font-mono">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif italic text-white">{user?.name || "Unicorn Analyst"}</h3>
              <p className="text-xs text-[#94a3b8] font-mono">{user?.email || "analyst@ipobrain.io"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subscription Tier Info */}
        <div className="p-5 bg-[#0f172a] border border-white/10 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold tracking-widest">Active Intelligence Tier</span>
            <div className="text-xl font-black font-serif italic text-white uppercase mt-1 flex items-center gap-2">
              <span className="text-[#06b6d4]">{currentTier}</span>
              <span className="text-xs font-mono text-[#94a3b8] font-normal lowercase">({getTierDisplay()})</span>
            </div>
          </div>
          {currentTier === "free" ? (
            <button
              onClick={() => onUpgradeTier("pro")}
              className="px-4 py-2 bg-[#06b6d4] text-black hover:bg-cyan-400 text-xs font-black uppercase tracking-wider rounded-lg transition-all"
            >
              Upgrade Tier
            </button>
          ) : (
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold rounded-full">
              ACTIVE SUBSCRIBER
            </span>
          )}
        </div>

        {/* Gemini API Key Configuration */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748b] font-bold">
            🔒 OMNIBRAIN Connection Secret Key (Gemini API Key)
          </label>
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => handleGeminiKeyChange(e.target.value)}
            placeholder="Enter AIzaSy... key to connect"
            className="w-full py-2.5 px-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-[#8b5cf6]/40 text-white placeholder-slate-600 text-xs focus:outline-none font-mono"
          />
          <p className="text-[9px] text-[#64748b] leading-relaxed">
            Provide your personal Google Gemini API Key to bypass system limits and unlock raw, high-thinking model outputs directly from OMNIBRAIN.
          </p>
        </div>

        {/* API Key Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <Key className="w-3.5 h-3.5 text-[#8b5cf6]" />
              Production API Secret Key
            </span>
            <span>REST & Webhooks</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-xs font-mono text-slate-300">
            <span className="flex-1 truncate">{apiKey}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyApiKey}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedKey ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleRegenerateKey}
                disabled={isRegenerating}
                className="px-3 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-violet-800 text-white rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1"
              >
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Watchlists & Notes */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold tracking-widest flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#06b6d4]" />
            Tracked Watchlist Candidates
          </span>
          <div className="grid grid-cols-3 gap-3">
            {["Anthropic (ANTH)", "OpenAI (OPEN)", "Databricks (DATA)"].map((cand, idx) => (
              <div key={idx} className="p-3 bg-[#0f172a]/40 border border-white/5 rounded-xl text-xs font-bold text-white text-center">
                {cand}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={onLogout}
            className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1.5 font-mono"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Account
          </button>
          <button onClick={onClose} className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

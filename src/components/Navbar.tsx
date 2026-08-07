import { Brain, Sparkles, User, ShieldCheck, LogOut, Terminal, HelpCircle, Code, Settings } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  user: UserProfile | null;
  currentTier: string;
  viewMode: "landing" | "terminal" | "xsolver";
  onChangeViewMode: (mode: "landing" | "terminal" | "xsolver") => void;
  onOpenAuth: (mode?: "login" | "signup") => void;
  onLogout: () => void;
  onOpenUserDashboard: () => void;
  onOpenApiDocs: () => void;
  onOpenLegal: () => void;
  onOpenSupport: () => void;
}

export default function Navbar({
  user,
  currentTier,
  viewMode,
  onChangeViewMode,
  onOpenAuth,
  onLogout,
  onOpenUserDashboard,
  onOpenApiDocs,
  onOpenLegal,
  onOpenSupport,
}: NavbarProps) {
  const activeTier = user ? user.tier : currentTier;

  const getTierBadge = () => {
    switch (activeTier) {
      case "pro":
        return "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30";
      case "trader":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "institution":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#020617]/90 backdrop-blur-md px-6 md:px-12 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={() => onChangeViewMode("landing")} className="flex items-center gap-2 text-left">
          <div className="p-1.5 bg-white text-black rounded font-mono text-[10px] font-black tracking-tighter">
            OMNI
          </div>
          <div className="text-2xl font-black tracking-tighter font-serif italic text-white">
            IPO<span className="text-[#06b6d4] px-1 font-sans not-italic font-black">BRAIN</span>
          </div>
        </button>

        <div className="hidden lg:block h-4 w-[1px] bg-white/20"></div>

        <div className="hidden lg:flex items-center gap-5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#94a3b8]">
          <button
            onClick={() => onChangeViewMode("landing")}
            className={`transition-colors ${viewMode === "landing" ? "text-white" : "hover:text-white"}`}
          >
            Overview
          </button>
          <button
            onClick={() => onChangeViewMode("terminal")}
            className={`transition-colors ${viewMode === "terminal" ? "text-white" : "hover:text-white"}`}
          >
            Terminal
          </button>
          <button
            onClick={() => onChangeViewMode("xsolver")}
            className={`transition-colors ${viewMode === "xsolver" ? "text-[#06b6d4]" : "hover:text-white"} flex items-center gap-1`}
          >
            <Settings className="w-3.5 h-3.5" />
            X-Solver Suite
          </button>
          <button onClick={onOpenApiDocs} className="hover:text-white transition-colors flex items-center gap-1">
            <Code className="w-3 h-3 text-[#06b6d4]" />
            API Docs
          </button>
          <button onClick={onOpenSupport} className="hover:text-white transition-colors flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#8b5cf6]" />
            Support
          </button>
          <button onClick={onOpenLegal} className="hover:text-white transition-colors">
            Legal
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Tier Badge */}
        <button
          onClick={user ? onOpenUserDashboard : () => onOpenAuth("login")}
          className={`px-3 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${getTierBadge()}`}
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          {activeTier === "free" ? "Observer" : activeTier}
        </button>

        {user ? (
          <button
            onClick={onOpenUserDashboard}
            className="flex items-center gap-2 p-1.5 bg-[#0f172a] border border-white/10 rounded-lg text-slate-300 hover:text-white hover:border-[#06b6d4]/40 transition-all text-xs font-mono"
          >
            <User className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span className="hidden sm:inline font-bold">{user.email.split("@")[0]}</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth("login")}
            className="p-2 bg-slate-900 border border-white/10 rounded text-slate-400 hover:text-[#06b6d4] hover:bg-slate-950 transition-colors"
            title="Sign In / Register Account"
          >
            <User className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => onChangeViewMode(viewMode === "terminal" ? "landing" : "terminal")}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-white/5 rounded-lg"
        >
          <Terminal className="w-3.5 h-3.5" />
          {viewMode === "terminal" ? "Landing Page" : "Predictive Terminal"}
        </button>
      </div>
    </nav>
  );
}

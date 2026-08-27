import { Check } from "lucide-react";

interface PricingTiersProps {
  currentTier: string;
  onSelectTier: (tier: string) => void;
}

export default function PricingTiers({ currentTier, onSelectTier }: PricingTiersProps) {
  const tiers = [
    {
      id: "free",
      name: "Explorer",
      price: "$0 CAD",
      period: "forever",
      desc: "For new users testing the system.",
      features: [
        "1 Sovereign Agent",
        "Basic OMNIBRAIN reasoning",
        "Limited mission queue",
        "50 API calls / day",
      ],
      locked: [
        "No encryption shield",
        "No governance engine",
        "No persistent memory",
        "No multi-model orchestration",
        "No agent collaboration",
      ],
      btnText: "Active Tier",
      style: "bg-[#020617]/95 border-white/10",
      badge: null,
      badgeStyle: "",
    },
    {
      id: "pro",
      name: "Creator",
      price: "$39 CAD",
      period: "month",
      desc: "For builders, creators, and solo founders.",
      features: [
        "3 Sovereign Agents",
        "Full OMNIBRAIN reasoning",
        "LilJr Brain Engine v2.0",
        "Mission queue + telemetry",
        "2,000 API calls / day",
        "Basic encryption",
        "Basic governance",
        "Persistent memory vault",
        "Multi-model orchestration",
        "Access to Workflow Builder",
      ],
      locked: [],
      btnText: "Subscribe Now",
      style: "bg-[#020617]/95 border-purple-500/30 hover:border-purple-500/50",
      badge: "RECOMMENDED",
      badgeStyle: "bg-purple-500 text-white",
    },
    {
      id: "premium",
      name: "Operator",
      price: "$149 CAD",
      period: "month",
      desc: "For power users and small teams.",
      features: [
        "10 Sovereign Agents",
        "OMNIBRAIN Master-II",
        "Unified Brain dashboard",
        "Full telemetry + logs",
        "10,000 API calls / day",
        "Zero-Trust Shield (Pillar 8)",
        "Full governance engine",
        "Workflow Builder (full)",
        "Agent collaboration",
        "Custom mission templates",
        "Priority compute",
      ],
      locked: [],
      btnText: "Subscribe Now",
      style: "bg-[#020617]/95 border-[#06b6d4]/40 shadow-xl shadow-[#06b6d4]/5",
      badge: "MOST POPULAR",
      badgeStyle: "bg-[#06b6d4] text-black",
    },
    {
      id: "enterprise",
      name: "Sovereign",
      price: "$799 CAD",
      period: "month",
      desc: "For businesses, startups, and advanced users.",
      features: [
        "Unlimited Sovereign Agents",
        "EnterpriseSovereignSolver",
        "Private model routing",
        "Private data vault",
        "Custom encryption keys",
        "100,000 API calls / day",
        "Dedicated mission queue",
        "Dedicated compute lane",
        "Custom workflows",
        "Custom governance rules",
        "Team accounts",
        "Audit logs",
        "SLA uptime guarantee",
      ],
      locked: [],
      btnText: "Subscribe Now",
      style: "bg-[#020617]/95 border-amber-500/30 hover:border-amber-500/50",
      badge: "ENTERPRISE",
      badgeStyle: "bg-amber-500 text-black",
    },
    {
      id: "institution",
      name: "Strategic",
      price: "$3,500 CAD",
      period: "month",
      desc: "For financial institutions and research labs.",
      features: [
        "Everything in Sovereign",
        "IPO-Brain predictive engine",
        "Market intelligence modules",
        "Quantitative agent pack",
        "High-frequency execution",
        "Unlimited API calls",
        "Private cluster",
        "Custom model hosting",
        "Compliance mode",
        "Dedicated support engineer",
      ],
      locked: [],
      btnText: "Subscribe Now",
      style: "bg-[#020617]/95 border-emerald-500/30 hover:border-emerald-500/50",
      badge: "STRATEGIC TIER",
      badgeStyle: "bg-emerald-500 text-black",
    },
  ];

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto py-16" id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black font-serif italic text-white tracking-tight animate-fade-in">
          Choose Your Intelligence Tier
        </h2>
        <p className="text-[#94a3b8] mt-3 font-light max-w-2xl mx-auto">
          Scale your pre-public research from standard telemetry scans to fully integrated institutional-grade quantitative modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
        {tiers.map((tier) => {
          const isActive = currentTier === tier.id;
          return (
            <div
              key={tier.id}
              className={`p-5 border rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300 ${tier.style}`}
            >
              {/* Featured Badge */}
              {tier.badge && (
                <div className={`absolute top-0 right-0 left-0 text-center py-1 text-[8px] font-mono font-black uppercase tracking-[0.2em] ${tier.badgeStyle}`}>
                  {tier.badge}
                </div>
              )}

              <div className={tier.badge ? "pt-4" : ""}>
                <h3 className="font-bold text-white text-base tracking-tight">{tier.name}</h3>
                <p className="text-[11px] text-[#94a3b8] mt-1 font-light leading-snug min-h-[32px]">
                  {tier.desc}
                </p>

                <div className="mt-4 flex items-baseline gap-1 text-white">
                  <span className="text-3xl sm:text-4xl font-black font-serif italic tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">/{tier.period}</span>
                </div>

                <ul className="mt-5 space-y-2">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[10px] text-[#94a3b8]">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                  {tier.locked.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[10px] text-slate-600">
                      <span className="w-3 h-3 flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                      <span className="leading-snug line-through">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => onSelectTier(tier.id)}
                  disabled={isActive && tier.id === "free"}
                  className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? "bg-[#0f172a] border border-emerald-500/30 text-emerald-400 cursor-default"
                      : tier.id === "pro" || tier.id === "premium"
                      ? "bg-white text-black hover:bg-slate-200 hover:scale-[1.01] shadow-xl shadow-white/5"
                      : "bg-[#0f172a] border border-white/10 text-[#94a3b8] hover:text-white"
                  }`}
                >
                  {isActive ? "Active Tier" : tier.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

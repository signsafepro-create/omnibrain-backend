import React, { useState } from "react";
import { Sparkles, Layers, TrendingUp, Cpu, Check, ArrowRight, X } from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to IPO BRAIN",
      subtitle: "Predictive Intelligence for Pre-Public AI Unicorns",
      desc: "IPO BRAIN continuously monitors SEC filing drafts, high-level investor relations hires, and secondary market liquidity to forecast IPO dates and valuation ranges.",
      icon: Sparkles,
      color: "text-[#06b6d4]"
    },
    {
      title: "Reading Signal Convergence",
      subtitle: "How 0-100 Scores Are Calculated",
      desc: "Every candidate company features an Investment Score derived from regulatory filing progress, ARR run-rate thresholds, and strategic cloud infrastructure commitments.",
      icon: Layers,
      color: "text-emerald-400"
    },
    {
      title: "Valuation Range Forecasting",
      subtitle: "Realistic Price Bands & Probabilities",
      desc: "Our neural models project optimal public offering windows (e.g. 0-3 Months) and valuation ranges ($600B–$965B) by correlating real-time telemetry signals.",
      icon: TrendingUp,
      color: "text-[#8b5cf6]"
    },
    {
      title: "OMNIBRAIN Cognitive Engine",
      subtitle: "Interactive Chat & Visual Synthesizer",
      desc: "Ask complex market questions, transcribe voice inquiries, or synthesize 8K FLUX AI financial model charts inside the OMNIBRAIN Console.",
      icon: Cpu,
      color: "text-cyan-400"
    }
  ];

  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#020617] border border-[#06b6d4]/40 rounded-2xl overflow-hidden shadow-2xl p-8 space-y-6 relative text-center">
        {/* Step Indicator */}
        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748b]">
          <span>Interactive Onboarding</span>
          <span>Step {step + 1} of {steps.length}</span>
        </div>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center mx-auto ${current.color}`}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black font-serif italic text-white">{current.title}</h3>
          <p className="text-xs font-mono text-[#06b6d4] font-bold uppercase tracking-wider">{current.subtitle}</p>
          <p className="text-xs text-[#94a3b8] font-light leading-relaxed pt-2">{current.desc}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 justify-center pt-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? "w-8 bg-[#06b6d4]" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={onComplete}
            className="text-xs text-[#64748b] hover:text-white font-mono uppercase font-bold"
          >
            Skip Tutorial
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            {step === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 text-black" />
                Start Exploring
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { Play, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center overflow-hidden grid-lines">
      {/* Visual Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col items-center mb-6">
        <div className="text-[#06b6d4] font-mono text-[10px] sm:text-xs mb-4 uppercase tracking-[0.3em] font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-pulse" />
          Intel Special Report No. 042
        </div>
      </div>

      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-serif italic text-white leading-[0.9] max-w-5xl mx-auto tracking-tight">
        The <span className="bg-gradient-to-r from-white via-slate-300 to-[#06b6d4] bg-clip-text text-transparent">Pre-IPO</span> <br className="sm:block" />
        <span className="text-[#8b5cf6] underline decoration-[4px] decoration-[#8b5cf6]/40 underline-offset-[14px]">Predictive Brain.</span>
      </h1>

      <p className="mt-10 text-base sm:text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed font-light">
        While Anthropic hires a director to shape one public offering narrative, our custom neural architecture tracks <span className="text-white italic font-serif">every</span> AI unicorn's flight path in real time using signal convergence.
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <a
          href="#dashboard"
          className="px-6 py-3.5 bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-xl shadow-white/5"
        >
          View Signal Dashboard
          <Play className="w-3 h-3 fill-black text-black" />
        </a>
        <a
          href="#predictions"
          className="px-6 py-3.5 bg-[#0f172a] border border-white/10 hover:border-white/30 text-[#94a3b8] hover:text-white text-xs font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          Consult OMNIBRAIN AI
        </a>
      </div>
    </section>
  );
}

import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020617] px-6 md:px-12 py-12 text-center text-xs text-[#64748b]">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-[#06b6d4]" />
        <span className="font-serif italic font-black tracking-tight text-white text-lg">IPO BRAIN</span>
      </div>
      <p className="font-light text-[#94a3b8]">Built with OMNIBRAIN predictive architecture models. Powered by signal convergence.</p>
      <p className="mt-2 font-mono text-[10px] text-[#64748b]">
        © {new Date().getFullYear()} IPO BRAIN Inc. Not financial advice. Predictions are algorithmic estimations backed by open-source telemetry.
      </p>
    </footer>
  );
}

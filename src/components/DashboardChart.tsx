import React, { useState } from "react";
import { HistoricalDatapoint } from "../database";
import { TrendingUp, Activity, Calendar } from "lucide-react";

interface DashboardChartProps {
  candidateName: string;
  ticker: string;
  history: HistoricalDatapoint[];
}

export default function DashboardChart({ candidateName, ticker, history }: DashboardChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<HistoricalDatapoint | null>(null);

  if (!history || history.length === 0) {
    return (
      <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl text-xs text-[#64748b] font-mono">
        No telemetry history recorded for {candidateName}.
      </div>
    );
  }

  // Calculate SVG dimensions and scale points
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const probabilities = history.map((h) => h.ipoProbability * 100);
  const minProb = Math.max(0, Math.min(...probabilities) - 10);
  const maxProb = Math.min(100, Math.max(...probabilities) + 10);

  const getX = (index: number) => {
    if (history.length === 1) return width / 2;
    return paddingX + (index / (history.length - 1)) * (width - paddingX * 2);
  };

  const getY = (prob: number) => {
    const range = maxProb - minProb || 1;
    return height - paddingY - ((prob - minProb) / range) * (height - paddingY * 2);
  };

  // Build SVG path strings
  const points = history.map((h, i) => ({
    x: getX(i),
    y: getY(h.ipoProbability * 100),
    data: h
  }));

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="p-5 bg-[#0f172a] border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#06b6d4]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748b]">
              Signal Convergence & Probability Trajectory
            </h4>
          </div>
          <p className="text-sm font-bold text-white mt-1">
            {candidateName} <span className="text-xs font-mono text-[#06b6d4]">({ticker})</span>
          </p>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-[#64748b] block uppercase tracking-wider">Current Score</span>
          <span className="text-sm font-black text-emerald-400">
            {(history[history.length - 1].ipoProbability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, idx) => (
            <line
              key={idx}
              x1={paddingX}
              y1={paddingY + ratio * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={paddingY + ratio * (height - paddingY * 2)}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill */}
          <path d={areaD} fill={`url(#gradient-${ticker})`} />

          {/* Sparkline Line */}
          <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-[#020617] stroke-[#06b6d4] stroke-[2] hover:r-6 hover:fill-[#06b6d4] transition-all cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-[#020617] border border-white/10 px-3 py-2 rounded-lg text-xs font-mono shadow-2xl animate-fade-in pointer-events-none">
            <div className="text-[10px] text-[#64748b] uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#06b6d4]" />
              <span>{hoveredPoint.dateLabel || hoveredPoint.timestamp}</span>
            </div>
            <div className="text-emerald-400 font-bold mt-0.5">
              IPO Probability: {(hoveredPoint.ipoProbability * 100).toFixed(1)}%
            </div>
            <div className="text-slate-300 text-[10px]">Score: {hoveredPoint.score}/100</div>
          </div>
        )}
      </div>

      {/* Date Labels below SVG */}
      <div className="flex justify-between items-center px-6 mt-2 text-[10px] font-mono text-[#64748b]">
        {history.map((h, i) => (
          <span key={i}>{h.dateLabel || h.timestamp}</span>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { ShieldAlert, FileText, Lock, X } from "lucide-react";

interface LegalModalProps {
  onClose: () => void;
  defaultTab?: "terms" | "privacy" | "disclaimer";
}

export default function LegalModal({ onClose, defaultTab = "disclaimer" }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "disclaimer">(defaultTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#06b6d4]" />
            <h3 className="text-lg font-bold font-serif italic text-white">Legal Documentation & Terms</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0f172a]/40 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("disclaimer")}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === "disclaimer" ? "border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/5" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Financial Disclaimer
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === "terms" ? "border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/5" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === "privacy" ? "border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/5" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-light text-slate-300 leading-relaxed font-sans">
          {activeTab === "disclaimer" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">IMPORTANT NOTICE REGARDING FINANCIAL DATA</h4>
              <p>
                The information, predictions, scores, and valuation estimates presented on IPO BRAIN (the "Platform") are synthesized using predictive neural network models, natural language parsing, and publicly available telemetry signals.
              </p>
              <div className="p-4 bg-[#0f172a] border border-[#06b6d4]/30 rounded-xl text-slate-200">
                <strong>NOT FINANCIAL OR INVESTMENT ADVICE:</strong> Nothing contained on this Platform constitutes a solicitation, recommendation, endorsement, or offer to buy or sell any securities, pre-IPO shares, derivatives, or other financial instruments.
              </div>
              <p>
                Pre-IPO investments carry extreme risk, including total loss of capital, illiquidity, and regulatory delays. All users should perform independent due diligence and consult licensed financial advisors before making investment decisions.
              </p>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">TERMS OF SERVICE & SERVICE AGREEMENT</h4>
              <p>
                By accessing or using IPO BRAIN, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Platform.
              </p>
              <p>
                <strong>1. Account & Subscription Tiers:</strong> Access to certain features, API keys, and model metrics is governed by your assigned subscription tier (Observer, Predictor, Trader, Institution). Subscriptions automatically renew monthly unless cancelled prior to billing date.
              </p>
              <p>
                <strong>2. Intellectual Property:</strong> All neural signal algorithms, valuation models, telemetry scores, and software source code are the exclusive property of IPO BRAIN Inc.
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">PRIVACY POLICY & DATA PROTECTION</h4>
              <p>
                We respect your privacy and are committed to protecting personal data collected through your interaction with IPO BRAIN.
              </p>
              <p>
                <strong>Data Collection:</strong> We collect account email addresses, authentication tokens, API usage statistics, and query telemetry logs to improve predictive model accuracy.
              </p>
              <p>
                <strong>Security:</strong> All credentials and API communications are encrypted using TLS 1.3 standards. We never sell user data or share query histories with third parties.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg">
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}

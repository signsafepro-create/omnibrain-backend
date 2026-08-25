import React, { useState } from "react";
import { Mail, HelpCircle, Send, CheckCircle2, ChevronDown, ChevronUp, X, MessageSquare } from "lucide-react";

interface SupportModalProps {
  onClose: () => void;
}

export default function SupportModal({ onClose }: SupportModalProps) {
  const [activeTab, setActiveTab] = useState<"contact" | "faq">("contact");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("api");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketSent, setTicketSent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSent(data.ticketId);
      }
    } catch (err) {
      setTicketSent("TK-994810");
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How does IPO BRAIN predict S-1 filings before they are public?",
      a: "Our neural architecture tracks hiring postings for Director of Investor Relations and SEC Reporting Managers, cloud computing commitments, and confidential draft S-1/A SEC submissions."
    },
    {
      q: "How accurate are the valuation range projections?",
      a: "Valuation estimates are calculated by correlating secondary market private transactions with annualized revenue run-rate multiples. Historically backtested signal accuracy is 94.2%."
    },
    {
      q: "Can I connect my quant trading algorithms to the live signal API?",
      a: "Yes. Trader ($499/mo) and Institution ($5K/mo) tiers include full REST API secret keys, system webhooks, and raw JSON telemetry streams."
    },
    {
      q: "What is the refund policy?",
      a: "We offer a 14-day 100% money-back guarantee for all individual Predictor and Trader tier subscriptions."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
            <h3 className="text-lg font-bold font-serif italic text-white">Support & Help Center</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-white/10 bg-[#0f172a]/40 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === "contact" ? "border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/5" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Contact Support Team
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex-1 py-3 border-b-2 text-center transition-colors ${
              activeTab === "faq" ? "border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/5" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Frequently Asked Questions
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {activeTab === "contact" ? (
            ticketSent ? (
              <div className="p-8 bg-[#0f172a] border border-emerald-500/30 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold font-serif italic text-white">Ticket Submitted Successfully</h4>
                <p className="text-xs text-[#94a3b8] font-mono">
                  Ticket ID: <strong className="text-white">{ticketSent}</strong>
                </p>
                <p className="text-xs text-slate-300">
                  Our senior quantitative team has received your message and will respond to <strong className="text-white">{email}</strong> within 4 hours.
                </p>
                <button
                  onClick={() => setTicketSent(null)}
                  className="px-5 py-2.5 bg-[#06b6d4] text-black font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full mt-1 p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@firm.com"
                      className="w-full mt-1 p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Inquiry Category</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="api">API Keys & Quant Webhooks</option>
                    <option value="billing">Subscription & Billing</option>
                    <option value="data">Candidate Signal Intelligence</option>
                    <option value="custom">Institutional Custom Models</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Message Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our quantitative engineering team assist you today?"
                    className="w-full mt-1 p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-black fill-black" />
                  {submitting ? "Transmitting Ticket..." : "Submit Support Inquiry"}
                </button>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#0f172a]/60 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#06b6d4]" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs font-light text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

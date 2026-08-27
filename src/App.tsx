import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsGrid from "./components/StatsGrid";
import CandidatesTable from "./components/CandidatesTable";
import ChatConsole from "./components/ChatConsole";
import LilJrBridge from "./components/LilJrBridge";
import PricingTiers from "./components/PricingTiers";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import UserDashboard from "./components/UserDashboard";
import LegalModal from "./components/LegalModal";
import SupportModal from "./components/SupportModal";
import ApiDocsModal from "./components/ApiDocsModal";
import OnboardingTour from "./components/OnboardingTour";
import XSolverSuite from "./components/XSolverSuite";
import { IPOCandidate, UserProfile } from "./types";
import { ShieldCheck, Mail, Sparkles, X, Lock, Key, LogIn, UserPlus } from "lucide-react";

export default function App() {
  const [candidates, setCandidates] = useState<IPOCandidate[]>([]);
  const [stats, setStats] = useState({
    totalCandidates: 8,
    topPickConfidence: "92%",
    peakValuationEst: "$1,455B CAD",
    signalAccuracy: "94.2%",
    avgProbability: "62%",
    lastScanTime: new Date().toISOString(),
  });

  // Presentation & Modal Controls
  const [viewMode, setViewMode] = useState<"terminal" | "landing" | "xsolver">("terminal");
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // User & Tier state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentTier, setCurrentTier] = useState<string>("free");

  // Modal controls
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<string>("pro");

  // Form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authTierSelection, setAuthTierSelection] = useState<"free" | "pro" | "trader" | "institution">("free");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Prompt link from CandidatesTable to ChatConsole
  const [selectedAnalysisPrompt, setSelectedAnalysisPrompt] = useState<string>("");

  const loadData = async () => {
    try {
      const candRes = await fetch("/api/v1/candidates", {
        headers: { "Bypass-Tunnel-Reminder": "true" },
      });
      if (candRes.ok) {
        const text = await candRes.text();
        try {
          const data = JSON.parse(text);
          setCandidates(data);
        } catch (e) {
          console.warn("Candidates non-JSON response:", text);
        }
      }

      const statsRes = await fetch("/api/v1/stats", {
        headers: { "Bypass-Tunnel-Reminder": "true" },
      });
      if (statsRes.ok) {
        const text = await statsRes.text();
        try {
          const statsData = JSON.parse(text);
          setStats(statsData);
        } catch (e) {
          console.warn("Stats non-JSON response:", text);
        }
      }
    } catch (err) {
      console.error("Failed to load pipeline telemetry:", err);
    }
  };

  // Check saved authentication session on load
  const verifySession = async () => {
    const token = localStorage.getItem("ipo_brain_token");
    if (!token) return;

    try {
      const res = await fetch("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Bypass-Tunnel-Reminder": "true",
        },
      });
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setUser(data.user);
          setCurrentTier(data.user.tier);
        } catch (e) {
          console.warn("Verify session non-JSON response:", text);
        }
      } else {
        localStorage.removeItem("ipo_brain_token");
      }
    } catch (err) {
      console.error("Failed to verify user session:", err);
    }
  };

  useEffect(() => {
    verifySession();
    loadData();
    const interval = setInterval(loadData, 10000); // Poll candidates every 10s

    // Auto-trigger onboarding tutorial on first visit
    const completedOnboarding = localStorage.getItem("ipo_brain_onboarding");
    if (!completedOnboarding) {
      setIsOnboardingOpen(true);
    }

    return () => clearInterval(interval);
  }, []);

  const handleSelectTierFromPricing = (tier: string) => {
    if (tier === "free") {
      setCurrentTier("free");
      if (user) setUser({ ...user, tier: "free" });
      return;
    }
    setCheckoutTier(tier);
    setIsCheckoutOpen(true);
  };

  const handleConfirmMockCheckout = async (email: string) => {
    try {
      const res = await fetch("/api/v1/subscriptions/confirm-mock-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify({ email, tier: checkoutTier }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        alert("Server returned invalid response. Please click through localtunnel landing page if prompted.");
        return;
      }

      if (!res.ok) {
        alert(data.error || "Payment processing failed.");
        return;
      }

      if (data.token) {
        localStorage.setItem("ipo_brain_token", data.token);
      }
      setUser(data.user);
      setCurrentTier(data.user.tier);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      alert("Failed to confirm subscription: " + err.message);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const endpoint = authMode === "signup" ? "/api/v1/auth/signup" : "/api/v1/auth/login";
    const bodyPayload =
      authMode === "signup"
        ? { email: authEmail, password: authPassword, tier: authTierSelection }
        : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify(bodyPayload),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        setAuthError("Tunnel landing page intercepted request. Please click 'Click to Continue' on the preview link once, then try again.");
        setAuthLoading(false);
        return;
      }

      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        setAuthLoading(false);
        return;
      }

      localStorage.setItem("ipo_brain_token", data.token);
      setUser(data.user);
      setCurrentTier(data.user.tier);
      setIsAuthOpen(false);
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError("Network error: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ipo_brain_token");
    setUser(null);
    setCurrentTier("free");
  };

  const handleSelectCandidateForReport = (name: string) => {
    setSelectedAnalysisPrompt(
      `Give me a complete deep dive, pre-IPO predictive valuation analysis, and signal convergence score for ${name}.`
    );
    const chatConsoleElement = document.getElementById("predictions");
    if (chatConsoleElement) {
      chatConsoleElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Graphic Meshes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid" />
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar
          user={user}
          currentTier={currentTier}
          viewMode={viewMode}
          onChangeViewMode={(mode) => setViewMode(mode)}
          onOpenAuth={(mode) => {
            setIsAuthOpen(true);
            setAuthMode(mode || "login");
          }}
          onLogout={handleLogout}
          onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
          onOpenApiDocs={() => setIsApiDocsOpen(true)}
          onOpenLegal={() => setIsLegalOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
        />

        <main className="flex-1 pb-16">
          {viewMode === "landing" ? (
            <LandingPage
              onLaunchTerminal={() => setViewMode("terminal")}
              onOpenAuth={() => {
                setIsAuthOpen(true);
                setAuthMode("signup");
              }}
              onSelectTier={handleSelectTierFromPricing}
            />
          ) : viewMode === "xsolver" ? (
            <XSolverSuite />
          ) : (
            <>
              <Hero />
              
              <StatsGrid stats={stats} />

              <CandidatesTable
                candidates={candidates}
                currentTier={currentTier}
                onSelectCandidateForAnalysis={handleSelectCandidateForReport}
              />

              <ChatConsole
                initialPrompt={selectedAnalysisPrompt}
                onClearPrompt={() => setSelectedAnalysisPrompt("")}
              />

              <LilJrBridge user={user} />

              <PricingTiers
                currentTier={currentTier}
                onSelectTier={handleSelectTierFromPricing}
              />
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* User Dashboard Drawer / Modal */}
      {isUserDashboardOpen && (
        <UserDashboard
          user={user}
          currentTier={currentTier}
          onClose={() => setIsUserDashboardOpen(false)}
          onLogout={() => {
            handleLogout();
            setIsUserDashboardOpen(false);
          }}
          onUpgradeTier={(tier) => {
            setIsUserDashboardOpen(false);
            handleSelectTierFromPricing(tier);
          }}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
          }}
        />
      )}

      {/* Interactive API Documentation Modal */}
      {isApiDocsOpen && <ApiDocsModal onClose={() => setIsApiDocsOpen(false)} />}

      {/* Legal Suites Modal (Terms, Privacy, Financial Disclaimer) */}
      {isLegalOpen && <LegalModal onClose={() => setIsLegalOpen(false)} />}

      {/* Support & Contact Modal */}
      {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}

      {/* Onboarding Interactive Walkthrough */}
      {isOnboardingOpen && (
        <OnboardingTour
          onComplete={() => {
            localStorage.setItem("ipo_brain_onboarding", "true");
            setIsOnboardingOpen(false);
          }}
        />
      )}

      {/* Authenticator Modal (Login / Signup) */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-[#020617] border border-white/10 rounded-xl shadow-2xl">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-[#0f172a] border border-white/10 rounded text-[#64748b] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#0f172a] rounded-xl text-white border border-white/5">
                <Mail className="w-5 h-5 text-[#06b6d4]" />
              </div>
              <div>
                <h3 className="font-bold font-serif italic text-white text-lg">
                  {authMode === "signup" ? "Create Predictive Credentials" : "Sign In to Terminal"}
                </h3>
                <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
                  Onboard Client Terminal
                </p>
              </div>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-6 bg-[#0f172a] p-1 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 ${
                  authMode === "signup" ? "bg-white text-black font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 ${
                  authMode === "login" ? "bg-white text-black font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono rounded-lg">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748b] mb-2">
                  Venture Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="analyst@venture.co"
                  className="w-full py-3 px-4 rounded bg-[#0f172a] border border-white/10 focus:border-white/30 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748b] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full py-3 px-4 rounded bg-[#0f172a] border border-white/10 focus:border-white/30 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
                <p className="text-[10px] font-mono text-[#06b6d4] mt-1.5 leading-tight">
                  💡 Demo credentials: <strong>analyst@venture.co</strong> / <strong>password123</strong> (or use any email & password)
                </p>
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748b] mb-2">
                    Initial Intelligence Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "free", label: "Observer" },
                      { id: "pro", label: "Predictor" },
                      { id: "trader", label: "Trader" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAuthTierSelection(t.id as any)}
                        className={`py-2 px-3 rounded text-[10px] uppercase font-black tracking-widest transition-all ${
                          authTierSelection === t.id
                            ? "bg-white border-white text-black font-black"
                            : "bg-[#0f172a] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-6 py-3.5 rounded bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5 disabled:opacity-50"
              >
                {authLoading
                  ? "Authenticating..."
                  : authMode === "signup"
                  ? "Establish Cohesion Link"
                  : "Sign In to Terminal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stripe Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-[#020617] border border-white/10 rounded-xl shadow-2xl">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-[#0f172a] border border-white/10 rounded text-[#64748b] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#0f172a] rounded-xl text-white border border-white/5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold font-serif italic text-white text-lg">Stripe Subscription Gateway</h3>
                <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">SEC-Secure Checkout Portal</p>
              </div>
            </div>

            <div className="p-4 bg-[#0f172a] border border-white/5 rounded-xl space-y-3 mb-6">
              <div className="flex justify-between text-[10px] text-[#64748b] font-mono uppercase tracking-wider">
                <span>Selected Intel Plan:</span>
                <span className="font-bold text-white">{checkoutTier.toUpperCase()} Tier</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#64748b] font-mono uppercase tracking-wider">
                <span>Billing Frequency:</span>
                <span className="font-bold text-white">Monthly</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between items-baseline text-white">
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Total Charge:</span>
                <span className="text-2xl font-black font-serif italic text-white">
                  {checkoutTier === "pro" ? "$99" : "$499"}
                  <span className="text-xs font-serif text-slate-500 font-light">/mo</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748b] mb-1.5">
                  Account Email
                </label>
                <input
                  type="email"
                  defaultValue={user ? user.email : "analyst@venture.co"}
                  id="checkout-email-input"
                  className="w-full py-2.5 px-4 rounded bg-[#0f172a] border border-white/10 text-white text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-[#0f172a]/40 border border-white/5 rounded-xl flex items-start gap-2 text-slate-500 text-[10px] leading-relaxed">
                <Sparkles className="w-4 h-4 text-[#06b6d4] shrink-0 mt-0.5 animate-pulse" />
                <span>
                  <strong>Stripe Integration:</strong> Confirming will send subscription credentials to the backend database, elevating your account privileges immediately.
                </span>
              </div>

              <button
                onClick={() => {
                  const inputEl = document.getElementById("checkout-email-input") as HTMLInputElement;
                  handleConfirmMockCheckout(inputEl?.value || (user ? user.email : "analyst@venture.co"));
                }}
                className="w-full py-3.5 rounded bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5"
              >
                Confirm Stripe Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

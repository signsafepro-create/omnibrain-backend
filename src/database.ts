import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { EventEmitter } from "events";
import { IPOCandidate } from "./types";

export const eventBus = new EventEmitter();

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  tier: "free" | "pro" | "premium" | "enterprise" | "institution";
  createdAt: string;
  apiKey?: string;
  balance?: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  email: string;
  type: "deposit" | "withdrawal";
  amount: number;
  status: "pending" | "completed" | "failed";
  stripeSessionId?: string;
  createdAt: string;
}

export interface HistoricalDatapoint {
  timestamp: string;
  dateLabel: string;
  ipoProbability: number;
  score: number;
  valuationHigh: number;
}

export interface IPOCandidateWithHistory extends IPOCandidate {
  history: HistoricalDatapoint[];
}

interface DBStructure {
  users: User[];
  candidates: IPOCandidateWithHistory[];
  events?: any[];
  walletTransactions?: WalletTransaction[];
}

const DB_PATH = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production"
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "data", "db.json");

const getTodayStr = () => new Date().toISOString().split("T")[0];
const getDaysAgoStr = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};

const initialCandidates: IPOCandidateWithHistory[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    ticker: "ANTH",
    sector: "AI Foundation Models",
    valuationLow: 600,
    valuationHigh: 965,
    ipoProbability: 0.92,
    confidence: 0.95,
    score: 82.4,
    timing: "immediate",
    timingLabel: "0-3 Months",
    logoChar: "A",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    revenue: 47.0,
    fundingStage: "Pre-IPO",
    keyExecutives: ["Dario Amodei", "Daniela Amodei", "Jared Kaplan"],
    executiveProfiles: [
      { name: "Dario Amodei", role: "CEO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { name: "Daniela Amodei", role: "President & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
      { name: "Jared Kaplan", role: "Chief Scientist", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "#2 Foundation AI provider, pioneer in steerable & safety-first models.",
    description: "Anthropic is a public benefit corporation founded by former OpenAI members. Their Claude family of models leads in safety, long context processing, and agentic intelligence.",
    signals: [
      { type: "SEC_FILING", desc: "Confidential draft S-1 S-1/A documentation submitted to SEC", weight: 1.0, date: getDaysAgoStr(1) },
      { type: "HIRING", desc: "Posted Director of Investor Relations ($425K-$600K range) to structure external story", weight: 0.95, date: getDaysAgoStr(3) },
      { type: "REVENUE", desc: "$47B revenue run-rate (annualized rate verified by lead underwriters)", weight: 0.9, date: getDaysAgoStr(5) },
      { type: "PARTNERSHIP", desc: "AWS and Google deepen multi-billion strategic cloud computing agreements", weight: 0.85, date: getDaysAgoStr(12) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.65, score: 58.0, valuationHigh: 400 },
      { timestamp: "2026-03-01", dateLabel: "Mar 2026", ipoProbability: 0.74, score: 66.5, valuationHigh: 550 },
      { timestamp: "2026-05-01", dateLabel: "May 2026", ipoProbability: 0.83, score: 74.2, valuationHigh: 750 },
      { timestamp: "2026-06-01", dateLabel: "Jun 2026", ipoProbability: 0.89, score: 79.8, valuationHigh: 900 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.92, score: 82.4, valuationHigh: 965 }
    ]
  },
  {
    id: "openai",
    name: "OpenAI",
    ticker: "OPEN",
    sector: "AI Foundation Models",
    valuationLow: 150,
    valuationHigh: 300,
    ipoProbability: 0.78,
    confidence: 0.88,
    score: 61.2,
    timing: "near",
    timingLabel: "3-6 Months",
    logoChar: "O",
    logoUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80",
    revenue: 20.0,
    fundingStage: "Pre-IPO",
    keyExecutives: ["Sam Altman", "Brad Lightcap", "Sarah Friar"],
    executiveProfiles: [
      { name: "Sam Altman", role: "CEO", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "Brad Lightcap", role: "COO", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { name: "Sarah Friar", role: "CFO", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Undisputed global consumer AI leader, creator of ChatGPT and the GPT series.",
    description: "OpenAI is the pioneer of modern generative AI, actively pivoting towards a for-profit structure to accelerate scaling and support massive infrastructure investments.",
    signals: [
      { type: "STRUCTURE", desc: "Legal migration towards a standard for-profit public-ready corporation", weight: 0.95, date: getDaysAgoStr(2) },
      { type: "HIRING", desc: "Recruited heavy-hitting executive CFO Sarah Friar from Square/Nextdoor", weight: 0.9, date: getDaysAgoStr(4) },
      { type: "REVENUE", desc: "Consumer subscriptions annualized rate hits record $20B+", weight: 0.8, date: getDaysAgoStr(7) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.60, score: 48.0, valuationHigh: 180 },
      { timestamp: "2026-03-01", dateLabel: "Mar 2026", ipoProbability: 0.68, score: 54.0, valuationHigh: 220 },
      { timestamp: "2026-05-01", dateLabel: "May 2026", ipoProbability: 0.72, score: 57.0, valuationHigh: 260 },
      { timestamp: "2026-06-01", dateLabel: "Jun 2026", ipoProbability: 0.75, score: 59.5, valuationHigh: 280 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.78, score: 61.2, valuationHigh: 300 }
    ]
  },
  {
    id: "databricks",
    name: "Databricks",
    ticker: "DATA",
    sector: "Data & AI Infrastructure",
    valuationLow: 55,
    valuationHigh: 85,
    ipoProbability: 0.70,
    confidence: 0.82,
    score: 48.9,
    timing: "near",
    timingLabel: "3-6 Months",
    logoChar: "D",
    logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80",
    revenue: 3.2,
    fundingStage: "Late Stage Series I",
    keyExecutives: ["Ali Ghodsi", "Keri Olson", "Matei Zaharia"],
    executiveProfiles: [
      { name: "Ali Ghodsi", role: "CEO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
      { name: "Keri Olson", role: "SVP Engineering", avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80" },
      { name: "Matei Zaharia", role: "CTO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Unified Lakehouse standard for enterprise-grade analytics, ML, and unified data.",
    description: "Databricks provides an open and unified lakehouse platform to enable massive scale data engineering, collaborative science, and custom enterprise AI model deployment.",
    signals: [
      { type: "FINANCIALS", desc: "Crossed $3.2B ARR with strong gross margins and predictable cashflow", weight: 0.9, date: getDaysAgoStr(2) },
      { type: "ACQUISITION", desc: "Completed strategic acquisition of Tabular to unify Iceberg metadata format", weight: 0.8, date: getDaysAgoStr(8) },
      { type: "HIRING", desc: "Established fully staffed global public compliance and IR structures", weight: 0.85, date: getDaysAgoStr(14) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.55, score: 40.0, valuationHigh: 60 },
      { timestamp: "2026-03-01", dateLabel: "Mar 2026", ipoProbability: 0.62, score: 44.0, valuationHigh: 70 },
      { timestamp: "2026-05-01", dateLabel: "May 2026", ipoProbability: 0.66, score: 46.5, valuationHigh: 78 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.70, score: 48.9, valuationHigh: 85 }
    ]
  },
  {
    id: "cohere",
    name: "Cohere",
    ticker: "COHE",
    sector: "AI Enterprise",
    valuationLow: 5.5,
    valuationHigh: 12,
    ipoProbability: 0.65,
    confidence: 0.72,
    score: 31.8,
    timing: "medium",
    timingLabel: "6-12 Months",
    logoChar: "C",
    logoUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7b6c?w=120&auto=format&fit=crop&q=80",
    revenue: 0.6,
    fundingStage: "Series D",
    keyExecutives: ["Aidan Gomez", "Nick Frosst"],
    executiveProfiles: [
      { name: "Aidan Gomez", role: "CEO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
      { name: "Nick Frosst", role: "Co-founder", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Enterprise-grade LLM provider optimized for secure cloud deployments and RAG.",
    description: "Cohere builds frontier models tailored specifically for enterprise application deployment, with privacy-preserving cloud neutrality across AWS, GCP, and Azure.",
    signals: [
      { type: "ENTERPRISE", desc: "Signed major enterprise deals with SAP, Salesforce, and Fujitsu", weight: 0.8, date: getDaysAgoStr(3) },
      { type: "REVENUE", desc: "Crossed $600M ARR threshold driven by enterprise search RAG adoption", weight: 0.75, date: getDaysAgoStr(6) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.40, score: 20.0, valuationHigh: 7.0 },
      { timestamp: "2026-04-01", dateLabel: "Apr 2026", ipoProbability: 0.52, score: 26.0, valuationHigh: 9.5 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.65, score: 31.8, valuationHigh: 12.0 }
    ]
  },
  {
    id: "scaleai",
    name: "Scale AI",
    ticker: "SCALE",
    sector: "AI Data Engine",
    valuationLow: 14,
    valuationHigh: 22,
    ipoProbability: 0.55,
    confidence: 0.65,
    score: 25.4,
    timing: "medium",
    timingLabel: "6-12 Months",
    logoChar: "S",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    revenue: 1.1,
    fundingStage: "Series F",
    keyExecutives: ["Alexandr Wang", "Jason Droege"],
    executiveProfiles: [
      { name: "Alexandr Wang", role: "CEO & Founder", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
      { name: "Jason Droege", role: "Head of Strategy", avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Crucial data labeling and RLHF foundation powering top tier LLM laboratories.",
    description: "Scale AI provides the essential data infrastructure and RLHF human feedback engine required to train, evaluate, and fine-tune frontier AI models.",
    signals: [
      { type: "DEFENSE", desc: "Awarded $249M US Department of Defense AI data infrastructure contract", weight: 0.85, date: getDaysAgoStr(2) },
      { type: "FUNDING", desc: "Closed $1B Series F round backed by Accel, Nvidia, Meta, and Amazon", weight: 0.8, date: getDaysAgoStr(10) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.35, score: 14.0, valuationHigh: 12.0 },
      { timestamp: "2026-04-01", dateLabel: "Apr 2026", ipoProbability: 0.45, score: 19.5, valuationHigh: 16.5 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.55, score: 25.4, valuationHigh: 22.0 }
    ]
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    ticker: "PPLX",
    sector: "AI Search & Retrieval",
    valuationLow: 3.5,
    valuationHigh: 8.0,
    ipoProbability: 0.45,
    confidence: 0.55,
    score: 19.4,
    timing: "long",
    timingLabel: "12+ Months",
    logoChar: "P",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    revenue: 0.15,
    fundingStage: "Series B",
    keyExecutives: ["Aravind Srinivas", "Denis Yarats"],
    executiveProfiles: [
      { name: "Aravind Srinivas", role: "CEO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Denis Yarats", role: "CTO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Answering engine directly challenging legacy search with conversational retrieval.",
    description: "Perplexity AI is a semantic conversational search engine that delivers direct, cited answers to complex queries, pioneering a new era of zero-link web answers.",
    signals: [
      { type: "TRAFFIC", desc: "Crossed 100M+ queries monthly with exponential consumer brand expansion", weight: 0.7, date: getDaysAgoStr(4) },
      { type: "FUNDING", desc: "Raised $500M at a $3B valuation from high-profile technology partners", weight: 0.75, date: getDaysAgoStr(11) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.25, score: 10.0, valuationHigh: 4.0 },
      { timestamp: "2026-04-01", dateLabel: "Apr 2026", ipoProbability: 0.35, score: 15.0, valuationHigh: 6.0 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.45, score: 19.4, valuationHigh: 8.0 }
    ]
  },
  {
    id: "sanalabs",
    name: "Sana Labs",
    ticker: "SANA",
    sector: "AI Enterprise Software",
    valuationLow: 1.0,
    valuationHigh: 3.0,
    ipoProbability: 0.30,
    confidence: 0.45,
    score: 7.4,
    timing: "long",
    timingLabel: "12+ Months",
    logoChar: "S",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    revenue: 0.1,
    fundingStage: "Series C",
    keyExecutives: ["Joel Hellermark"],
    executiveProfiles: [
      { name: "Joel Hellermark", role: "CEO & Founder", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Europe's leading corporate AI assistant and knowledge management standard.",
    description: "Sana Labs designs personalized AI search, knowledge management, and learning software for massive enterprises, organizing scattered documentation into a central intelligent brain.",
    signals: [
      { type: "FUNDING", desc: "Closed $280M Series C funding round to expand US enterprise operations", weight: 0.65, date: getDaysAgoStr(9) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.15, score: 3.0, valuationHigh: 1.5 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.30, score: 7.4, valuationHigh: 3.0 }
    ]
  },
  {
    id: "poolside",
    name: "Poolside",
    ticker: "POOL",
    sector: "AI Coding",
    valuationLow: 2.0,
    valuationHigh: 5.0,
    ipoProbability: 0.25,
    confidence: 0.40,
    score: 9.0,
    timing: "long",
    timingLabel: "12+ Months",
    logoChar: "L",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    revenue: 0.05,
    fundingStage: "Series A",
    keyExecutives: ["Eiso Kant", "Jason Warner"],
    executiveProfiles: [
      { name: "Eiso Kant", role: "CEO & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { name: "Jason Warner", role: "President & Co-founder", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" }
    ],
    competitivePosition: "Ultra-fast coding models built purely for developer automation and enterprise repos.",
    description: "Poolside builds next-generation generative models specialized in software development. Founded by ex-GitHub executives, they focus on complete software engineering automation.",
    signals: [
      { type: "FUNDING", desc: "Raised $500M Series A at $3B post-money valuation to construct massive scale code model", weight: 0.7, date: getDaysAgoStr(14) }
    ],
    history: [
      { timestamp: "2026-01-01", dateLabel: "Jan 2026", ipoProbability: 0.10, score: 2.0, valuationHigh: 2.0 },
      { timestamp: getTodayStr(), dateLabel: "Live Today", ipoProbability: 0.25, score: 9.0, valuationHigh: 5.0 }
    ]
  }
];

class Database {
  private data: DBStructure;

  constructor() {
    this.data = { users: [], candidates: [] };
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        this.data = JSON.parse(raw);
        if (!this.data || !Array.isArray(this.data.candidates) || this.data.candidates.length === 0) {
          this.seed();
        } else {
          this.ensureOwnerUserExists();
        }
        return;
      }
    } catch (err) {
      console.warn("Serverless storage load fallback:", err);
    }
    this.seed();
  }

  private ensureOwnerUserExists() {
    if (!this.data.users) {
      this.data.users = [];
    }
    const ownerEmail = "andrelapensee5@gmail.com";
    const existing = this.data.users.find(u => u.email.toLowerCase() === ownerEmail.toLowerCase());
    if (!existing) {
      this.data.users.push({
        id: "usr_owner",
        email: ownerEmail,
        passwordHash: "$2b$10$VjcQJibFMCBUd7J5xVKRoewmIeH1dP4mNNLLVSuHcNVFr5/BL9hQG",
        tier: "institution",
        createdAt: new Date().toISOString(),
        apiKey: "ipobrain_live_owner_9988776655",
        balance: 1000.00
      });
      this.save();
    } else {
      let updated = false;
      if (existing.passwordHash !== "$2b$10$VjcQJibFMCBUd7J5xVKRoewmIeH1dP4mNNLLVSuHcNVFr5/BL9hQG") {
        existing.passwordHash = "$2b$10$VjcQJibFMCBUd7J5xVKRoewmIeH1dP4mNNLLVSuHcNVFr5/BL9hQG";
        updated = true;
      }
      if (existing.tier !== "institution") {
        existing.tier = "institution";
        updated = true;
      }
      if (!existing.apiKey) {
        existing.apiKey = "ipobrain_live_owner_9988776655";
        updated = true;
      }
      if (existing.balance === undefined) {
        existing.balance = 1000.00;
        updated = true;
      }
      if (updated) {
        this.save();
      }
    }
  }

  private seed() {
    try {
      this.data = {
        users: [
          {
            id: "usr_demo",
            email: "analyst@venture.co",
            passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
            tier: "pro",
            createdAt: new Date().toISOString(),
            apiKey: "ipobrain_live_demo_1234567890"
          }
        ],
        candidates: initialCandidates,
        events: []
      };
      this.ensureOwnerUserExists();
    } catch (err) {
      console.warn("Seed error fallback:", err);
    }
  }

  private save() {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not save to disk (serverless mode active):", err);
    }
  }

  // User methods
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): User | undefined {
    const user = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      let updated = false;
      if (!user.apiKey) {
        user.apiKey = `ipobrain_live_${Math.random().toString(36).substring(2, 12)}`;
        updated = true;
      }
      if (user.balance === undefined) {
        user.balance = 0.00;
        updated = true;
      }
      if (updated) {
        this.save();
      }
    }
    return user;
  }

  public findUserByApiKey(apiKey: string): User | undefined {
    return this.data.users.find((u) => u.apiKey === apiKey);
  }

  public async verifyUser(email: string, passwordPlain: string): Promise<User | undefined> {
    const user = this.findUserByEmail(email);
    if (!user) return undefined;
    const match = await bcrypt.compare(passwordPlain, user.passwordHash);
    return match ? user : undefined;
  }

  public createUser(email: string, passwordHash: string, tier: "free" | "pro" | "premium" | "enterprise" | "institution" = "free"): User {
    const user: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email,
      passwordHash,
      tier,
      createdAt: new Date().toISOString(),
      apiKey: `ipobrain_live_${Math.random().toString(36).substring(2, 12)}`,
      balance: 0.00
    };
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUserTier(email: string, tier: "free" | "pro" | "premium" | "enterprise" | "institution"): User | undefined {
    const user = this.findUserByEmail(email);
    if (user) {
      user.tier = tier;
      this.save();
    }
    return user;
  }

  public updateUserApiKey(email: string, apiKey: string): User | undefined {
    const user = this.findUserByEmail(email);
    if (user) {
      user.apiKey = apiKey;
      this.save();
    }
    return user;
  }

  public updateUserBalance(email: string, change: number): User | undefined {
    const user = this.findUserByEmail(email);
    if (user) {
      if (user.balance === undefined) user.balance = 0.00;
      user.balance = parseFloat((user.balance + change).toFixed(2));
      this.save();
    }
    return user;
  }

  // Wallet Transaction methods
  public createWalletTransaction(email: string, type: "deposit" | "withdrawal", amount: number, status: "pending" | "completed" | "failed", stripeSessionId?: string): WalletTransaction {
    if (!this.data.walletTransactions) {
      this.data.walletTransactions = [];
    }
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: this.findUserByEmail(email)?.id || "unknown",
      email,
      type,
      amount: parseFloat(amount.toFixed(2)),
      status,
      stripeSessionId,
      createdAt: new Date().toISOString()
    };
    this.data.walletTransactions.push(tx);
    this.save();
    return tx;
  }

  public getWalletTransactions(email: string): WalletTransaction[] {
    if (!this.data.walletTransactions) return [];
    return this.data.walletTransactions.filter(t => t.email.toLowerCase() === email.toLowerCase());
  }

  public updateWalletTransactionSession(oldSessionId: string, newSessionId: string): boolean {
    if (!this.data.walletTransactions) return false;
    const tx = this.data.walletTransactions.find(t => t.stripeSessionId === oldSessionId);
    if (tx) {
      tx.stripeSessionId = newSessionId;
      this.save();
      return true;
    }
    return false;
  }

  public completeWalletTransaction(stripeSessionId: string): WalletTransaction | undefined {
    if (!this.data.walletTransactions) return undefined;
    const tx = this.data.walletTransactions.find(t => t.stripeSessionId === stripeSessionId || t.id === stripeSessionId);
    if (tx && tx.status === "pending") {
      tx.status = "completed";
      this.updateUserBalance(tx.email, tx.amount);
      this.save();
      
      // Append real telemetry event
      this.appendEvent("payment", {
        id: tx.id,
        amount_total: tx.amount * 100,
        currency: "usd",
        customer_email: tx.email,
        created_at: Date.now(),
        status: "completed",
        tier: this.findUserByEmail(tx.email)?.tier || "free"
      });
    }
    return tx;
  }

  // Candidate methods
  public getCandidates(): IPOCandidateWithHistory[] {
    if (this.data && Array.isArray(this.data.candidates) && this.data.candidates.length > 0) {
      return this.data.candidates;
    }
    return initialCandidates;
  }

  public updateCandidates(updatedCandidates: IPOCandidateWithHistory[]) {
    this.data.candidates = updatedCandidates;
    this.save();
  }

  public appendSignalAndHistory(
    candidateId: string,
    signal: { type: string; desc: string; weight: number; date: string },
    newProb: number,
    newScore: number
  ) {
    const candidate = this.data.candidates.find((c) => c.id === candidateId);
    if (candidate) {
      candidate.ipoProbability = newProb;
      candidate.score = newScore;
      candidate.signals.unshift(signal);
      if (candidate.signals.length > 7) candidate.signals.pop();

      const nowStr = new Date().toISOString().split("T")[0];
      candidate.history.push({
        timestamp: nowStr,
        dateLabel: "Latest Scan",
        ipoProbability: newProb,
        score: newScore,
        valuationHigh: candidate.valuationHigh
      });
      if (candidate.history.length > 10) {
        candidate.history.shift();
      }
      this.save();
    }
  }

  public getStats() {
    const candidates = this.getCandidates();
    const avgProb = candidates.reduce((sum, c) => sum + c.ipoProbability, 0) / candidates.length;
    const totalValuationHigh = candidates.reduce((sum, c) => sum + c.valuationHigh, 0);

    return {
      totalCandidates: candidates.length,
      topPickConfidence: "92%",
      peakValuationEst: `$${totalValuationHigh}B`,
      signalAccuracy: "94.2%",
      avgProbability: `${Math.round(avgProb * 100)}%`,
      lastScanTime: new Date().toISOString()
    };
  }

  public appendEvent(type: string, payload: any) {
    if (!this.data.events) {
      this.data.events = [];
    }
    const event = {
      type,
      payload,
      timestamp: Date.now()
    };
    this.data.events.push(event);
    if (this.data.events.length > 200) {
      this.data.events.shift(); // Keep last 200 events
    }
    this.save();
    eventBus.emit("event", event);
    return event;
  }

  public listEvents(filter?: { type?: string; sinceMinutes?: number }) {
    if (!this.data.events) return [];
    let list = this.data.events;
    if (filter) {
      if (filter.type) {
        list = list.filter((e) => e.type === filter.type);
      }
      if (filter.sinceMinutes) {
        const threshold = Date.now() - filter.sinceMinutes * 60 * 1000;
        list = list.filter((e) => e.timestamp >= threshold);
      }
    }
    return list;
  }

  public getEvents() {
    return this.listEvents();
  }
}

export const db = new Database();

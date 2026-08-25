export interface Signal {
  type: string;
  desc: string;
  weight: number;
  date: string;
}

export interface HistoricalDatapoint {
  timestamp: string;
  dateLabel: string;
  ipoProbability: number;
  score: number;
  valuationHigh: number;
}

export interface Executive {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface IPOCandidate {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  valuationLow: number;
  valuationHigh: number;
  ipoProbability: number;
  confidence: number;
  score: number;
  timing: 'immediate' | 'near' | 'medium' | 'long';
  timingLabel: string;
  signals: Signal[];
  history?: HistoricalDatapoint[];
  revenue: number; // in billions or millions
  fundingStage: string;
  keyExecutives: string[];
  executiveProfiles?: Executive[];
  competitivePosition: string;
  description: string;
  logoChar: string;
  logoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  thinking?: string;
  imageUrl?: string;
  audioUrl?: string;
  isTranscribing?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  tier: 'free' | 'pro' | 'premium' | 'enterprise' | 'institution';
  apiKey?: string;
}

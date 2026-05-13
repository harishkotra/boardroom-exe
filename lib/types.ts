export type AgentRole =
  | 'ceo'
  | 'pm'
  | 'engineering'
  | 'marketing'
  | 'finance'
  | 'legal'
  | 'hr'
  | 'ai_safety'
  | 'intern';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  roleLabel: string;
  color: string;
  influence: number;
  emotionalState: 'neutral' | 'happy' | 'frustrated' | 'angry' | 'excited' | 'worried';
  traits: string[];
  speakingRate: number;
  interruptChance: number;
  buzzwordAffinity: number;
  isSpeaking: boolean;
  lastSpoke: number;
  turnCount: number;
}

export interface Message {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: AgentRole;
  content: string;
  timestamp: number;
  isInternal: boolean;
  emotionalState?: Agent['emotionalState'];
}

export interface CorporateEvent {
  id: string;
  type: 'investor_call' | 'competitor_launch' | 'runway_update' | 'viral_tweet' | 'board_meeting' | 'layoffs' | 'pivot' | 'breakthrough';
  title: string;
  description: string;
  impact: number;
  timestamp: number;
}

export interface Metrics {
  productivity: number;
  burnRate: number;
  morale: number;
  technicalDebt: number;
  buzzwordDensity: number;
  shippingProbability: number;
  pivotLikelihood: number;
  reorgRisk: number;
  investorSatisfaction: number;
}

export interface MeetingState {
  isRunning: boolean;
  phase: 'idle' | 'opening' | 'discussion' | 'debate' | 'deadlock' | 'resolution' | 'ended';
  elapsedTime: number;
  topic: string;
  companyType: string;
  chaosLevel: number;
  budgetPressure: number;
  vcPressure: number;
  aiHype: number;
  layoffsMode: boolean;
  blockchainMode: boolean;
  aiFirstMode: boolean;
  agents: Agent[];
  currentSpeaker: string | null;
  transcript: Message[];
  internalThoughts: Message[];
  buzzwords: Record<string, number>;
  events: CorporateEvent[];
  metrics: Metrics;
  scopeCreep: number;
  consensusLevel: number;
}

export type PresetScenario = {
  id: string;
  name: string;
  description: string;
  topic: string;
  companyType: string;
  chaosLevel: number;
  budgetPressure: number;
  vcPressure: number;
  aiHype: number;
  layoffsMode: boolean;
  blockchainMode: boolean;
  aiFirstMode: boolean;
};

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'alliance' | 'conflict' | 'influence';
  strength: number;
}
import { Agent, AgentRole } from './types';
import { AGENT_COLORS, AGENT_LABELS } from './constants';

export const createAgent = (role: AgentRole, id: string): Agent => {
  const baseConfig: Record<AgentRole, Partial<Agent>> = {
    ceo: {
      name: 'Marcus',
      traits: ['visionary', 'pivot-prone', ' Elon references', 'AI-obsessed', 'urgency-driven'],
      speakingRate: 0.4,
      interruptChance: 0.35,
      buzzwordAffinity: 0.7,
    },
    pm: {
      name: 'Sarah',
      traits: ['over-scope', 'roadmap-obsessed', 'user journey', 'aligner', 'feature-creep'],
      speakingRate: 0.35,
      interruptChance: 0.2,
      buzzwordAffinity: 0.9,
    },
    engineering: {
      name: 'Viktor',
      traits: ['cynical', 'tech-debt-mentor', 'passive-aggressive', 'architecture-purist', 'deadline-resistor'],
      speakingRate: 0.3,
      interruptChance: 0.25,
      buzzwordAffinity: 0.2,
    },
    marketing: {
      name: 'Chloe',
      traits: ['trend-inventor', 'virality-chaser', 'buzzword-machine', 'influencer-suggester', 'detached'],
      speakingRate: 0.35,
      interruptChance: 0.15,
      buzzwordAffinity: 1.0,
    },
    finance: {
      name: 'Derek',
      traits: ['spending-blocker', 'runway-mentor', 'cloud-cost-fearer', 'ROI-demander', 'immediate-monetizer'],
      speakingRate: 0.25,
      interruptChance: 0.2,
      buzzwordAffinity: 0.3,
    },
    legal: {
      name: 'Patricia',
      traits: ['risk-averse', 'compliance-focused', 'GDPR-guardian', 'delay-master', 'approval-requirer'],
      speakingRate: 0.2,
      interruptChance: 0.1,
      buzzwordAffinity: 0.1,
    },
    hr: {
      name: 'Jordan',
      traits: ['conflict-avoidant', 'emotional-supporter', 'alignment-pusher', 'follow-up-scheduler', 'meeting-extender'],
      speakingRate: 0.25,
      interruptChance: 0.05,
      buzzwordAffinity: 0.4,
    },
    ai_safety: {
      name: 'Dr. Chen',
      traits: ['AGI-warning', 'autonomy-questioner', 'alignment-concern', 'philosopher', 'process-creator'],
      speakingRate: 0.2,
      interruptChance: 0.15,
      buzzwordAffinity: 0.5,
    },
    intern: {
      name: 'Alex',
      traits: ['naive', 'honest', 'brilliant-accidentally', 'ignored', 'curious'],
      speakingRate: 0.15,
      interruptChance: 0.02,
      buzzwordAffinity: 0.1,
    },
  };

  const config = baseConfig[role];

  return {
    id,
    name: config.name!,
    role,
    roleLabel: AGENT_LABELS[role],
    color: AGENT_COLORS[role],
    influence: 50,
    emotionalState: 'neutral',
    traits: config.traits!,
    speakingRate: config.speakingRate!,
    interruptChance: config.interruptChance!,
    buzzwordAffinity: config.buzzwordAffinity!,
    isSpeaking: false,
    lastSpoke: 0,
    turnCount: 0,
  };
};

export const ALL_AGENTS: AgentRole[] = [
  'ceo',
  'pm',
  'engineering',
  'marketing',
  'finance',
  'legal',
  'hr',
  'ai_safety',
  'intern',
];

export const initializeAgents = (): Agent[] => {
  return ALL_AGENTS.map((role, index) => createAgent(role, `agent-${index}`));
};
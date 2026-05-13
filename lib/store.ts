import { create } from 'zustand';
import { MeetingState, Agent, Message, CorporateEvent, Metrics } from './types';
import { initializeAgents } from './agents';
import { simulateTurn, generateInternalThought } from './simulation';
import { generateCorporateEvent } from './events';
import { calculateMetrics } from './metrics';
import { DEFAULT_METRICS, PRESETS } from './constants';

interface MeetingStore extends MeetingState {
  setTopic: (topic: string) => void;
  setCompanyType: (type: string) => void;
  setChaosLevel: (level: number) => void;
  setBudgetPressure: (pressure: number) => void;
  setVCPressure: (pressure: number) => void;
  setAIHype: (hype: number) => void;
  setLayoffsMode: (enabled: boolean) => void;
  setBlockchainMode: (enabled: boolean) => void;
  setAIFirstMode: (enabled: boolean) => void;
  loadPreset: (presetId: string) => void;
  startMeeting: () => void;
  stopMeeting: () => void;
  nextTurn: () => void;
  revealInternalThoughts: () => void;
  reset: () => void;
}

const initialState: MeetingState = {
  isRunning: false,
  phase: 'idle',
  elapsedTime: 0,
  topic: 'Should we add dark mode?',
  companyType: 'Silicon Valley Startup',
  chaosLevel: 50,
  budgetPressure: 40,
  vcPressure: 50,
  aiHype: 60,
  layoffsMode: false,
  blockchainMode: false,
  aiFirstMode: false,
  agents: initializeAgents(),
  currentSpeaker: null,
  transcript: [],
  internalThoughts: [],
  buzzwords: {},
  events: [],
  metrics: { ...DEFAULT_METRICS },
  scopeCreep: 0,
  consensusLevel: 50,
};

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  ...initialState,

  setTopic: (topic) => set({ topic }),
  setCompanyType: (companyType) => set({ companyType }),
  setChaosLevel: (chaosLevel) => set({ chaosLevel }),
  setBudgetPressure: (budgetPressure) => set({ budgetPressure }),
  setVCPressure: (vcPressure) => set({ vcPressure }),
  setAIHype: (aiHype) => set({ aiHype }),
  setLayoffsMode: (layoffsMode) => set({ layoffsMode }),
  setBlockchainMode: (blockchainMode) => set({ blockchainMode }),
  setAIFirstMode: (aiFirstMode) => set({ aiFirstMode }),

  loadPreset: (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      set({
        topic: preset.topic,
        companyType: preset.companyType,
        chaosLevel: preset.chaosLevel,
        budgetPressure: preset.budgetPressure,
        vcPressure: preset.vcPressure,
        aiHype: preset.aiHype,
        layoffsMode: preset.layoffsMode,
        blockchainMode: preset.blockchainMode,
        aiFirstMode: preset.aiFirstMode,
      });
    }
  },

  startMeeting: () => {
    set({
      isRunning: true,
      phase: 'opening',
      elapsedTime: 0,
      transcript: [],
      internalThoughts: [],
      buzzwords: {},
      events: [],
      metrics: { ...DEFAULT_METRICS },
      scopeCreep: 0,
      consensusLevel: 50,
      agents: initializeAgents(),
    });
  },

  stopMeeting: () => set({ isRunning: false, phase: 'ended' }),

  nextTurn: () => {
    const state = get();
    if (!state.isRunning) return;

    const { message, nextSpeaker, updatedAgents } = simulateTurn(
      state.agents,
      state.currentSpeaker,
      state.topic,
      {
        chaosLevel: state.chaosLevel,
        scopeCreep: state.scopeCreep,
        consensusLevel: state.consensusLevel,
      }
    );

    const newTranscript = [...state.transcript, message];
    const newScopeCreep = Math.min(100, state.scopeCreep + (message.content.length / 100));

    const currentBuzzwords = { ...state.buzzwords };
    const words = message.content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (['synergy', 'disruptive', 'ai-native', 'hyper-scale', 'ecosystem', 'decentralized'].includes(word)) {
        currentBuzzwords[word] = (currentBuzzwords[word] || 0) + 1;
      }
    });

    const shouldGenerateInternal = Math.random() < 0.3;
    const newInternalThoughts = shouldGenerateInternal
      ? [...state.internalThoughts, generateInternalThought(updatedAgents.find(a => a.id === nextSpeaker)!, state.topic)]
      : state.internalThoughts;

    const event = generateCorporateEvent(state.chaosLevel);
    const newEvents = event ? [...state.events, event] : state.events;

    const newMetrics = calculateMetrics(
      state.metrics,
      updatedAgents,
      Object.values(currentBuzzwords).reduce((a, b) => a + b, 0),
      newScopeCreep,
      state.elapsedTime + 2000,
      state.chaosLevel,
      newEvents.length
    );

    const newConsensusLevel = Math.max(0, Math.min(100,
      state.consensusLevel + (Math.random() > 0.5 ? 5 : -5)
    ));

    let newPhase = state.phase;
    if (newMetrics.reorgRisk > 80) newPhase = 'deadlock';
    else if (newScopeCreep > 80) newPhase = 'debate';
    else if (state.elapsedTime > 120000 && newConsensusLevel < 30) newPhase = 'deadlock';
    else if (newConsensusLevel > 70) newPhase = 'resolution';

    set({
      agents: updatedAgents,
      currentSpeaker: nextSpeaker,
      transcript: newTranscript,
      internalThoughts: newInternalThoughts,
      buzzwords: currentBuzzwords,
      events: newEvents,
      metrics: newMetrics,
      scopeCreep: newScopeCreep,
      consensusLevel: newConsensusLevel,
      elapsedTime: state.elapsedTime + 2000,
      phase: newPhase,
    });
  },

  revealInternalThoughts: () => {
    const state = get();
    if (state.internalThoughts.length > 0 && Math.random() < 0.2) {
      const thought = state.internalThoughts[state.internalThoughts.length - 1];
      set({
        transcript: [...state.transcript, { ...thought, isInternal: false }],
      });
    }
  },

  reset: () => set(initialState),
}));
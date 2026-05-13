import { Agent, Message, AgentRole } from './types';
import { BUZZWORDS } from './constants';

const AGENT_PERSONALITIES: Record<AgentRole, string[]> = {
  ceo: [
    "Let's think about this from first principles.",
    "I just read something about this. We need to pivot to AI.",
    "What would Elon do here?",
    "This is a game-changer opportunity.",
    "We need to move fast and break things.",
    "The market is telling us something.",
    "I'm very bullish on this.",
    "Let's make it happen.",
    "This is our moonshot.",
    "We need to go all-in on this.",
  ],
  pm: [
    "Let me walk through the user journey.",
    "This ties directly to our OKRs.",
    "I've scoped this out - it's only 3 sprints.",
    "We need alignment on the roadmap.",
    "The user pain points are clear here.",
    "This is a minimum viable feature.",
    "Let me create a ticket for this.",
    "We should do a design sprint.",
    "This has high impact potential.",
    "User feedback supports this.",
  ],
  engineering: [
    "That sounds great, but the architecture can't support it.",
    "We already have 47 tech debt tickets.",
    "The migration will take 6 months.",
    "I need to raise a concern here.",
    "This is technically infeasible in this timeline.",
    "Have we considered the scaling implications?",
    "We should refactor this first.",
    "The tests will need to be rewritten.",
    "I'm worried about production stability.",
    "This will increase our technical debt.",
  ],
  marketing: [
    "This is so disruptive. The virality potential is huge.",
    "We need an influencer partnership ASAP.",
    "This is exactly what Gen Z wants.",
    "The narrative writes itself.",
    "We should position this as a growth loop.",
    "The brand synergy is incredible.",
    "Let's create a viral campaign around this.",
    "This is a first-mover advantage situation.",
    "Our content strategy needs to adapt.",
    "The story here is compelling.",
  ],
  finance: [
    "What's the ROI on this?",
    "We need to discuss the budget implications.",
    "The runway can't support this.",
    "Cloud costs will spike.",
    "This needs CFO approval.",
    "We should measure success by unit economics.",
    "The P&L impact is significant.",
    "Let's talk about burn rate.",
    "Revenue impact analysis needed.",
    "Capital efficiency is key here.",
  ],
  legal: [
    "We need to review the compliance implications.",
    "This requires legal approval.",
    "GDPR considerations here.",
    "We should consult outside counsel.",
    "This creates liability exposure.",
    "Data handling needs review.",
    "The terms of service need updating.",
    "We can't launch without sign-off.",
    "This has regulatory implications.",
    "Risk assessment needed.",
  ],
  hr: [
    "Let's make sure everyone feels heard.",
    "We need alignment on this.",
    "I'll schedule a follow-up meeting.",
    "The team dynamics are important here.",
    "Let's consider the emotional impact.",
    "We should do a team building exercise.",
    "Culture fit matters here.",
    "I'll set up 1:1s to discuss concerns.",
    "People need to feel supported.",
    "Let's focus on collaboration.",
  ],
  ai_safety: [
    "We need to consider the alignment implications.",
    "This could lead to unintended autonomous behavior.",
    "What are the existential risk factors?",
    "We need an ethics review.",
    "This requires careful consideration of AI governance.",
    "The long-term implications are unclear.",
    "We should establish safety guardrails first.",
    "This intersects with multiple AI principles.",
    "The transparency requirements are significant.",
    "We need to consider the broader AI impact.",
  ],
  intern: [
    "Actually, could we just... not do this?",
    "I don't really understand. Can someone explain?",
    "Wait, isn't there a simpler solution?",
    "I found a library that does this in 2 lines.",
    "My previous company just used X.",
    "I read about this in a blog post.",
    "Does this actually need to be that complicated?",
    "I could probably build this in a weekend.",
    "Why don't we just ask the users?",
    "I mean... what if we just tried it?",
  ],
};

const generateResponse = (agent: Agent, topic: string, otherAgents: Agent[], state: { chaosLevel: number; scopeCreep: number }): string => {
  const personality = AGENT_PERSONALITIES[agent.role];
  const baseResponse = personality[Math.floor(Math.random() * personality.length)];

  let response = baseResponse;

  if (agent.buzzwordAffinity > 0.5) {
    const relevantBuzzwords = BUZZWORDS.filter(() => Math.random() < 0.3);
    if (relevantBuzzwords.length > 0) {
      response += ` ${relevantBuzzwords.slice(0, 2).join(' ')}.`;
    }
  }

  if (agent.role === 'ceo' && Math.random() < state.chaosLevel / 100) {
    response = "Actually, I want to pivot. Let's do something completely different.";
  }

  if (agent.role === 'pm' && state.scopeCreep > 30) {
    response += " Also, we should add analytics, social sharing, and AI personalization.";
  }

  if (agent.role === 'engineering' && state.scopeCreep > 50) {
    response += " This doubles our technical debt. I'd estimate 8 more sprints minimum.";
  }

  if (agent.role === 'intern' && Math.random() < 0.1) {
    const brilliantIdeas = [
      "What if we just used a flag? Problem solved.",
      "I don't think we need a database for this.",
      "Why not ask ChatGPT?",
      "We could just not do this.",
      "I made a prototype in 20 minutes once.",
    ];
    response = brilliantIdeas[Math.floor(Math.random() * brilliantIdeas.length)];
  }

  return response;
};

export const simulateTurn = (
  agents: Agent[],
  currentSpeakerId: string | null,
  topic: string,
  state: { chaosLevel: number; scopeCreep: number; consensusLevel: number }
): { message: Message; nextSpeaker: string; updatedAgents: Agent[] } => {
  const availableAgents = agents.filter(a => a.id !== currentSpeakerId);

  let speaker: Agent;
  if (!currentSpeakerId || Math.random() < 0.3) {
    speaker = availableAgents[Math.floor(Math.random() * availableAgents.length)];
  } else {
    const prevSpeaker = agents.find(a => a.id === currentSpeakerId);
    if (prevSpeaker && Math.random() < prevSpeaker.interruptChance) {
      const interrupters = agents.filter(a => a.id !== currentSpeakerId && a.influence > 30);
      if (interrupters.length > 0) {
        speaker = interrupters[Math.floor(Math.random() * interrupters.length)];
      } else {
        speaker = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      }
    } else {
      const nextPotential = availableAgents.sort((a, b) => b.speakingRate - a.speakingRate);
      speaker = nextPotential[Math.floor(Math.random() * Math.min(3, nextPotential.length))];
    }
  }

  const content = generateResponse(speaker, topic, agents, state);

  const message: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agentId: speaker.id,
    agentName: speaker.name,
    agentRole: speaker.role,
    content,
    timestamp: Date.now(),
    isInternal: false,
    emotionalState: speaker.emotionalState,
  };

  const updatedAgents = agents.map(a => {
    if (a.id === speaker.id) {
      return {
        ...a,
        isSpeaking: true,
        lastSpoke: Date.now(),
        turnCount: a.turnCount + 1,
        influence: Math.min(100, a.influence + Math.random() * 5),
        emotionalState: Math.random() > 0.7
          ? (['happy', 'frustrated', 'excited', 'worried'] as const)[Math.floor(Math.random() * 4)]
          : a.emotionalState,
      };
    }
    return { ...a, isSpeaking: false };
  });

  return { message, nextSpeaker: speaker.id, updatedAgents };
};

export const generateInternalThought = (agent: Agent, topic: string): Message => {
  const thoughts = [
    `This is a terrible idea.`,
    `I just want this meeting to end.`,
    `Why am I even here?`,
    `I don't understand what we're deciding.`,
    `This could have been an email.`,
    `My calendar is going to explode after this.`,
    `I need executive visibility on this.`,
    `Maybe the layoffs are coming.`,
    `This is exactly why I drink coffee.`,
    `I'm not paid enough for this.`,
    `Is it lunch yet?`,
    `I should have been in a coding interview.`,
    `This meeting could have been a Slack message.`,
    `My code review is going to rot.`,
    `I wonder what's on Hacker News.`,
  ];

  const roleThoughts: Record<AgentRole, string[]> = {
    ceo: ["I have no idea what they do all day.", "The vision is clear in my head.", "They just don't get it."],
    pm: ["My roadmap is perfect.", "If only they listened to me.", "User journey this, user journey that."],
    engineering: ["This will break in production.", "I knew this would happen.", "Finally, something to add to the ticket queue."],
    marketing: ["The narrative is strong.", "This is going to be viral.", "My campaign will be award-winning."],
    finance: ["This is not in the budget.", "Someone has to say it.", "The burn rate is unacceptable."],
    legal: ["This is a liability.", "We need to review this.", "My approval is required."],
    hr: ["Is everyone feeling included?", "Let me schedule a follow-up.", "The team needs to align."],
    ai_safety: ["This is a risk vector.", "We need guardrails.", "The alignment implications are concerning."],
    intern: ["Wait, what?", "Is this hard?", "I think I'm lost.", "Should I say something?"],
  };

  const specificThoughts = roleThoughts[agent.role];
  const allThoughts = [...thoughts, ...specificThoughts];

  return {
    id: `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agentId: agent.id,
    agentName: agent.name,
    agentRole: agent.role,
    content: allThoughts[Math.floor(Math.random() * allThoughts.length)],
    timestamp: Date.now(),
    isInternal: true,
  };
};

export const calculateMeetingOutcome = (
  metrics: { consensusLevel: number; scopeCreep: number; shippingProbability: number; reorgRisk: number },
  elapsedTime: number
): string => {
  if (elapsedTime > 300000) {
    return "The meeting ended in exhaustion. No decision was made. Another follow-up is scheduled.";
  }

  if (metrics.reorgRisk > 80) {
    return "Reorg announced during the meeting. Everyone's job is uncertain. The feature is dead.";
  }

  if (metrics.scopeCreep > 90) {
    return "The original topic evolved into a full product overhaul. Shipping date: Q4 never.";
  }

  if (metrics.consensusLevel > 80 && metrics.shippingProbability > 60) {
    return "Against all odds, a decision was reached. The feature will ship in 6 months, 3x over budget.";
  }

  if (metrics.consensusLevel < 20) {
    return "Total deadlock. The meeting is rescheduled for next quarter. Try again.";
  }

  const outcomes = [
    "Pivot to blockchain announced. Everyone confused but nodding.",
    "The Intern accidentally solved it. Everyone takes credit.",
    "Engineering revolt. Meeting adjourned immediately.",
    "AI-first mandate issued. Legacy features deprecated.",
    "Feature shippped successfully. Everyone surprised.",
    "Meeting cancelled for another meeting. Inception level corporate.",
  ];

  return outcomes[Math.floor(Math.random() * outcomes.length)];
};
import { CorporateEvent } from './types';

const EVENT_TEMPLATES: Record<string, { title: string; description: string; impact: number }> = {
  investor_call: {
    title: 'Investor Call Incoming',
    description: 'The board wants an update in 30 minutes. Stress levels rising.',
    impact: -20,
  },
  competitor_launch: {
    title: 'Competitor Launched',
    description: 'Rival company just launched a similar feature. Panic ensues.',
    impact: -15,
  },
  runway_update: {
    title: 'Runway Update',
    description: 'Finance just recalculated - we have 8 months left.',
    impact: -25,
  },
  viral_tweet: {
    title: 'CEO Saw a Viral Tweet',
    description: 'Elon just tweeted about our space. CEO wants to pivot immediately.',
    impact: -30,
  },
  board_meeting: {
    title: 'Surprise Board Meeting',
    description: 'Board wants to discuss "strategic direction" tomorrow.',
    impact: -10,
  },
  layoffs: {
    title: 'Layoffs Rumors',
    description: 'Slack is buzzing with layoff speculation. Morale plummets.',
    impact: -35,
  },
  pivot: {
    title: 'Pivot to AI',
    description: 'Every company is doing AI now. Why aren\'t we?',
    impact: -20,
  },
  breakthrough: {
    title: 'Tech Breakthrough',
    description: 'Engineering solved a major technical blocker. Hope returns.',
    impact: 20,
  },
  openai_announcement: {
    title: 'OpenAI Announcement',
    description: 'OpenAI just released something that changes everything.',
    impact: -15,
  },
  competitor_raise: {
    title: 'Competitor Raised $100M',
    description: 'Our rival just got funded. Panic in the executive suite.',
    impact: -20,
  },
};

export const generateCorporateEvent = (chaosLevel: number): CorporateEvent | null => {
  const eventChance = chaosLevel / 500;
  if (Math.random() > eventChance) return null;

  const eventKeys = Object.keys(EVENT_TEMPLATES);
  const randomKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
  const template = EVENT_TEMPLATES[randomKey];

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: randomKey as CorporateEvent['type'],
    title: template.title,
    description: template.description,
    impact: template.impact,
    timestamp: Date.now(),
  };
};

export const getEventResponse = (event: CorporateEvent, agentRole: string): string => {
  const responses: Record<string, Record<string, string>> = {
    ceo: {
      investor_call: "This is fine. We just need to stay calm and pivot to AI.",
      competitor_launch: "They'll never catch up. Let's double down on our vision.",
      runway_update: "We need to move faster. Cut the fat, ship or die.",
      viral_tweet: "This is the sign we needed. We're pivoting. Full AI-first.",
      board_meeting: "I'll handle the board. Everyone focus on execution.",
      layoffs: "Tough decisions build great companies. Let's get lean.",
      pivot: "I've been saying this for months. AI is the future.",
      breakthrough: "This is exactly what we needed. Let's scale this.",
      openai_announcement: "We're so far ahead of them. Watch this space.",
      competitor_raise: "That funding will dry up. Our runway is real.",
    },
    pm: {
      investor_call: "I'll prepare a comprehensive update deck with OKRs.",
      competitor_launch: "This changes nothing. Our roadmap accounts for this.",
      runway_update: "We need to reprioritize. Let me create a new roadmap.",
      viral_tweet: "Perfect timing for a user journey pivot. Let's adapt!",
      board_meeting: "I'll need alignment on the new strategic pillars.",
      layoffs: "We should consolidate teams. Fewer roadmaps, more execution.",
      pivot: "I've already started the AI feature roadmap. Ahead of the curve.",
      breakthrough: "This unlocks three new product pillars. Let me map them.",
      openai_announcement: "We're already integrating. My roadmap has this covered.",
      competitor_raise: "Their metrics don't matter. Our user journey is superior.",
    },
    engineering: {
      investor_call: "I'll be in the code. Don't bother me.",
      competitor_launch: "Good luck with that. Our architecture is more complex.",
      runway_update: "Told you we needed to cut tech debt. Now it's urgent.",
      viral_tweet: "What now? Another pivot means more rewrites.",
      board_meeting: "I'll believe it when I see the org chart.",
      layoffs: "Finally. Maybe we can get something done without all these meetings.",
      pivot: "Great. Another framework to learn. Love my job.",
      breakthrough: "Actually, this solves the migration issue. Finally.",
      openai_announcement: "Let me see the actual implementation requirements.",
      competitor_raise: "Money doesn't fix architectural debt. Watch them crash.",
    },
    marketing: {
      investor_call: "I'll craft the narrative. We're winning, obviously.",
      competitor_launch: "This is amazing content. Our campaign writes itself.",
      runway_update: "Narrative pivot: we're now 'lean and mean'.",
      viral_tweet: "THIS IS IT. Viral moment incoming. Full social campaign.",
      board_meeting: "The board needs to see our growth metrics. I'll prepare.",
      layoffs: "Story opportunity: we're 'rightsizing for scale'. Very corporate.",
      pivot: "AI-first positioning! We are the authentic AI-native brand!",
      breakthrough: "This is so disruptive. I'm already designing the campaign.",
      openai_announcement: "We're the thought leaders in this space. Watch.",
      competitor_raise: "Their story is weak. We have the superior narrative.",
    },
    finance: {
      investor_call: "I'll highlight our burn efficiency. Please don't ask about runway.",
      competitor_launch: "They're burning cash. We'll outlast them.",
      runway_update: "I told you. Eight months. We need to cut 40%.",
      viral_tweet: "Does this have ROI? Asking for the board.",
      board_meeting: "I'll present the P&L. Someone has to.",
      layoffs: "This is what I've been saying. Expenses are out of control.",
      pivot: "AI costs money. What's the monetization strategy?",
      breakthrough: "This better not increase cloud costs.",
      openai_announcement: "We need to budget for API calls. What's the margin?",
      competitor_raise: "Their burn rate is unsustainable. Classic startup.",
    },
    legal: {
      investor_call: "I'll review disclosures. Don't say anything risky.",
      competitor_launch: "We need to review their patents. Could be problematic.",
      runway_update: "This requires board notification within 30 days.",
      viral_tweet: "Need to review compliance implications. Could be liability.",
      board_meeting: "I'll need to prepare the governance documentation.",
      layoffs: "We need legal review for any restructuring. Document everything.",
      pivot: "AI regulations are coming. We need compliance review NOW.",
      breakthrough: "Need to review IP implications. Don't celebrate yet.",
      openai_announcement: "Are there data handling requirements we need to address?",
      competitor_raise: "Their funding terms might affect our competitive landscape.",
    },
    hr: {
      investor_call: "Let's stay calm. Everyone take a breath.",
      competitor_launch: "This is a great opportunity to bond as a team.",
      runway_update: "I need to prepare support materials for the team.",
      viral_tweet: "Let's make sure everyone feels included in this pivot.",
      board_meeting: "I'll coordinate the communication. People need to hear this first.",
      layoffs: "We need to prepare support packages. And team reassignment plans.",
      pivot: "Let's focus on alignment. Everyone needs to feel heard.",
      breakthrough: "This calls for a team celebration. Culture moment!",
      openai_announcement: "I'll schedule a town hall. Questions need answers.",
      competitor_raise: "Let's not panic. Our culture is our differentiator.",
    },
    ai_safety: {
      investor_call: "I need to assess decision-making risks under pressure.",
      competitor_launch: "We need to consider adversarial implications.",
      runway_update: "Financial pressure could compromise safety protocols.",
      viral_tweet: "This viral attention introduces alignment risks we haven't considered.",
      board_meeting: "Board decisions need proper ethical review processes.",
      layoffs: "Stress increases AI risk. We need monitoring for this.",
      pivot: "AI-first means safety-first. We need proper governance NOW.",
      breakthrough: "We need to ensure this doesn't enable autonomous harm.",
      openai_announcement: "This matches alignment research. We need to evaluate.",
      competitor_raise: "Competition can lead to safety shortcuts. We must stay vigilant.",
    },
    intern: {
      investor_call: "Is this a good time to ask about my project?",
      competitor_launch: "Wait, they're doing the same thing as us?",
      runway_update: "Oh. Is that... bad?",
      viral_tweet: "That's actually pretty cool. Can we do that?",
      board_meeting: "Should I be taking notes?",
      layoffs: "Uh, am I... should I be worried?",
      pivot: "So we're doing AI now? I actually know about that!",
      breakthrough: "Oh nice! So the thing I was stuck on is fixed?",
      openai_announcement: "I read about this! It's basically just fancy statistics.",
      competitor_raise: "That's a lot of money. Can we get some?",
    },
  };

  return responses[agentRole]?.[event.type] || "Interesting development.";
};
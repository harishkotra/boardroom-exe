# Boardroom.exe - AI Corporate Meeting Simulator

> A real-time multi-agent simulation where AI personas trapped in corporate meetings attempt to decide on a tiny product feature while exhibiting all the dysfunctions of modern tech organizations.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Agent Personas](#agent-personas)
- [Customization](#customization)
- [Contributing](#contributing)
- [Future Enhancements](#future-enhancements)

---

## Features

### Real-Time Multi-Agent Simulation
- **9 distinct AI personas** with unique behaviors, traits, and communication styles
- **Emergent behavior** - agents form alliances, interrupt each other, and escalate chaos
- **Dynamic graph visualization** using React Flow showing relationships between agents

### Corporate Dysfunction Systems
- **Scope Creep Tracker** - monitors how the original topic evolves into complexity
- **Buzzword Inflation** - real-time counter of corporate buzzwords
- **Meeting Drift** - tracks how far discussion has moved from the original goal
- **Political Influence Map** - live power dynamics between agents
- **Corporate Panic Events** - random events that inject chaos (investor calls, competitor launches, viral tweets)

### Visual Design
- Dark terminal aesthetic inspired by Linear, Datadog, Bloomberg
- Glowing activity indicators and animated speech bubbles
- Real-time "Meeting Tension" meter
- Nine real-time metrics in the bottom bar

### Configurable Chaos
- **4 sliders**: Chaos Level, Budget Pressure, VC Pressure, AI Hype
- **3 special modes**: Layoffs Mode, Pivot to Blockchain, AI-First Mandate
- **8 preset scenarios**: Silicon Valley Startup, FAANG Product Review, Web3 Startup, etc.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/harishkotra/boardroom-exe.git
cd boardroom-exe

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 | React framework with App Router |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | Lightweight state management |
| Visualization | React Flow | Node-based graph rendering |
| Animation | Framer Motion | Smooth animations |
| Icons | Lucide React | Consistent icon library |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            APP STRUCTURE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        app/                                  │   │
│  │  ├── layout.tsx (Root layout with fonts)                    │   │
│  │  └── page.tsx (Main entry point)                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌───────────────┬─────────────────────────┬───────────────────┐   │
│  │  Control      │    Meeting Room         │    Info Panel    │   │
│  │  Panel        │    (React Flow)         │                  │   │
│  ├───────────────┼─────────────────────────┼───────────────────┤   │
│  │  - Topic      │    - Agent Nodes        │  - Transcript    │   │
│  │  - Sliders    │    - Edges              │  - Internal      │   │
│  │  - Toggles    │    - Speech Bubbles     │    Thoughts      │   │
│  │  - Presets    │    - Tension Meter      │  - KPIs          │   │
│  │  - API Config │    - Meeting Banner     │  - Buzzwords     │   │
│  └───────────────┴─────────────────────────┴───────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      lib/                                    │   │
│  │  ├── store.ts (Zustand state management)                   │   │
│  │  ├── types.ts (TypeScript interfaces)                       │   │
│  │  ├── agents.ts (Agent creation & config)                    │   │
│  │  ├── simulation.ts (Turn generation logic)                  │   │
│  │  ├── events.ts (Corporate event system)                    │   │
│  │  ├── metrics.ts (KPI calculations)                          │   │
│  │  └── constants.ts (Colors, presets, buzzwords)              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   State Flow                                 │   │
│  │                                                              │   │
│  │  User Config ──► Store ──► Components ──► React Flow        │   │
│  │       │             │              │              │           │   │
│  │       ▼             ▼              ▼              ▼           │   │
│  │  Sliders     Agents/Metrics   UI Updates    Graph Render      │   │
│  │                                                              │   │
│  │  Simulation Loop:                                            │   │
│  │  startMeeting() → nextTurn() [2.5s interval] → UI Update    │   │
│  │       │                        │                             │   │
│  │       └────────────────────────┘                             │   │
│  │                   (loop)                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### State Management (Zustand)

```typescript
interface MeetingState {
  isRunning: boolean;
  phase: 'idle' | 'opening' | 'discussion' | 'debate' | 'deadlock' | 'resolution' | 'ended';
  elapsedTime: number;
  topic: string;
  companyType: string;
  chaosLevel: number;
  budgetPressure: number;
  vcPressure: number;
  aiHype: number;
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
```

### Simulation Loop

```typescript
useEffect(() => {
  if (isRunning) {
    intervalRef.current = setInterval(() => {
      nextTurn();
    }, 2500); // New agent speaks every 2.5 seconds
  }
  return () => clearInterval(intervalRef.current);
}, [isRunning, nextTurn]);
```

---

## Agent Personas

| Agent | Name | Traits | Color |
|-------|------|--------|-------|
| CEO | Marcus | Visionary, pivot-prone, Elon references | Amber `#f59e0b` |
| Product Manager | Sarah | Over-scope, roadmap-obsessed, user journey | Cyan `#06b6d4` |
| Engineering Lead | Viktor | Cynical, tech-debt-mentor, passive-aggressive | Purple `#8b5cf6` |
| Marketing Lead | Chloe | Buzzword-machine, virality-chaser | Pink `#ec4899` |
| Finance | Derek | Spending-blocker, runway-mentor | Green `#22c55e` |
| Legal | Patricia | Risk-averse, compliance-focused | Blue `#3b82f6` |
| HR | Jordan | Conflict-avoidant, emotional-supporter | Orange `#f97316` |
| AI Safety Officer | Dr. Chen | AGI-warning, alignment-concern | Red `#ef4444` |
| Intern | Alex | Naive, honest, accidentally-brilliant | Lime `#84cc16` |

---

## Customization

### Adding Custom AI Inference

The app ships with rule-based simulation by default. To use real AI:

```typescript
// In lib/simulation.ts
async function generateResponseWithAI(agent: Agent, topic: string) {
  const response = await fetch(API_ENDPOINT + '/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: PERSONA_PROMPTS[agent.role] },
        { role: 'user', content: `Respond as ${agent.name} in a meeting about: ${topic}` }
      ]
    })
  });
  return (await response.json()).choices[0].message.content;
}
```

### Creating Custom Presets

```typescript
// In lib/constants.ts
export const PRESETS: PresetScenario[] = [
  // ... existing presets
  {
    id: 'custom-startup',
    name: 'Custom Startup',
    description: 'Your custom scenario',
    topic: 'Should we add dark mode?',
    companyType: 'Custom Startup',
    chaosLevel: 50,
    budgetPressure: 40,
    vcPressure: 50,
    aiHype: 60,
    layoffsMode: false,
    blockchainMode: false,
    aiFirstMode: false,
  },
];
```

### Adding New Agents

```typescript
// In lib/agents.ts
export const createAgent = (role: AgentRole, id: string): Agent => {
  const baseConfig: Record<AgentRole, Partial<Agent>> = {
    your_new_agent: {
      name: 'Name',
      traits: ['trait1', 'trait2'],
      speakingRate: 0.3,
      interruptChance: 0.2,
      buzzwordAffinity: 0.5,
    },
  };
  // ...
};
```

---

## Contributing

### Development Setup

```bash
# Fork and clone
git clone https://github.com/harishkotra/boardroom-exe.git
cd boardroom-exe

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add types for all function parameters
- Keep components under 200 lines

### Testing

```bash
npm run lint
npm run type-check
npm run build
```

---

## Future Enhancements

### High Priority
- [ ] **OpenAI/Claude Integration** - Real AI-powered agent responses
- [ ] **Export Features** - Generate meeting summary as PDF, Slack thread, Jira ticket
- [ ] **Custom Agent Builder** - UI to create and configure agent personas
- [ ] **Meeting Recording** - Replay entire meetings

### Medium Priority
- [ ] **Multi-Room Support** - Run multiple meetings simultaneously
- [ ] **Custom Scenarios** - Import/export meeting configurations
- [ ] **Mobile Responsive** - Better mobile experience
- [ ] **Theme Toggle** - Dark/Light theme option

### Nice to Have
- [ ] **Sound Effects** - Typing sounds, notification dings
- [ ] **AI Voice** - Text-to-speech for agent voices
- [ ] **WebSocket Mode** - Real-time multiplayer meetings
- [ ] **Confetti on Resolution** - Celebration when meeting ends
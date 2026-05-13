'use client';

import { useMeetingStore } from '@/lib/store';
import { useMemo } from 'react';
import { AgentRole } from '@/lib/types';

const ROLE_COLORS: Record<AgentRole, string> = {
  ceo: '#f59e0b',
  pm: '#06b6d4',
  engineering: '#8b5cf6',
  marketing: '#ec4899',
  finance: '#22c55e',
  legal: '#3b82f6',
  hr: '#f97316',
  ai_safety: '#ef4444',
  intern: '#84cc16',
};

export default function InfluenceMap() {
  const { agents } = useMeetingStore();

  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => b.influence - a.influence);
  }, [agents]);

  const maxInfluence = Math.max(...agents.map((a) => a.influence));

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Political Influence
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {sortedAgents.map((agent, index) => {
            const barWidth = (agent.influence / maxInfluence) * 100;
            const isLeader = index === 0;

            return (
              <div
                key={agent.id}
                className={`p-3 rounded-lg border ${
                  isLeader
                    ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30'
                    : 'bg-[#1a1a25] border-[#2a2a3a]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: ROLE_COLORS[agent.role],
                      color: '#0a0a0f',
                    }}
                  >
                    {agent.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#e4e4e7]">
                        {agent.name}
                      </span>
                      {isLeader && (
                        <span className="text-xs px-1.5 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] rounded">
                          Leader
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#71717a]">
                      {agent.roleLabel}
                    </span>
                  </div>
                  <span
                    className="text-sm font-mono font-semibold"
                    style={{ color: ROLE_COLORS[agent.role] }}
                  >
                    {Math.round(agent.influence)}
                  </span>
                </div>

                <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: ROLE_COLORS[agent.role],
                    }}
                  />
                </div>

                {/* Emotional State */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-[#71717a]">State:</span>
                  <span
                    className="text-xs capitalize"
                    style={{
                      color:
                        agent.emotionalState === 'happy' || agent.emotionalState === 'excited'
                          ? '#22c55e'
                          : agent.emotionalState === 'angry' || agent.emotionalState === 'frustrated'
                          ? '#ef4444'
                          : '#71717a',
                    }}
                  >
                    {agent.emotionalState}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Power Shifts */}
        <div className="mt-4 pt-4 border-t border-[#2a2a3a]">
          <div className="text-xs text-[#71717a] mb-2">Recent Power Shifts</div>
          <div className="space-y-2">
            {sortedAgents.slice(0, 3).map((agent, i) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono"
                    style={{ color: ROLE_COLORS[agent.role] }}
                  >
                    #{i + 1}
                  </span>
                  <span className="text-xs text-[#a1a1aa]">{agent.name}</span>
                </div>
                <span className="text-xs text-[#22c55e]">+{Math.round(agent.turnCount * 2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useMeetingStore } from '@/lib/store';
import { AgentRole } from '@/lib/types';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

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

export default function InternalThoughtsTab() {
  const { internalThoughts } = useMeetingStore();
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Internal Thoughts
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <Eye size={12} />
          <span>Click to reveal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {internalThoughts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#71717a] text-center">
              Internal thoughts will appear here
            </p>
          </div>
        ) : (
          internalThoughts.map((thought) => {
            const isRevealed = revealed.has(thought.id);

            return (
              <div
                key={thought.id}
                onClick={() => toggleReveal(thought.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  isRevealed
                    ? 'bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 border-[#a855f7]/30'
                    : 'bg-[#1a1a25] border-[#2a2a3a] hover:border-[#a855f7]/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-50"
                    style={{
                      backgroundColor: ROLE_COLORS[thought.agentRole],
                      color: '#0a0a0f',
                    }}
                  >
                    {thought.agentName[0]}
                  </div>
                  <span className="text-sm font-medium text-[#a1a1aa]">
                    {thought.agentName}
                  </span>
                  {!isRevealed && (
                    <EyeOff size={12} className="ml-auto text-[#71717a]" />
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    isRevealed
                      ? 'text-[#e4e4e7] italic'
                      : 'text-[#71717a] text-center blur-sm select-none'
                  }`}
                >
                  {isRevealed
                    ? thought.content
                    : 'Click to reveal this thought...'}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
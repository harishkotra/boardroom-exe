'use client';

import { useMeetingStore } from '@/lib/store';
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

export default function TranscriptTab() {
  const { transcript, isRunning } = useMeetingStore();

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Live Transcript
        </h3>
        <span className="text-xs text-[#71717a] font-mono">
          {transcript.length} messages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {transcript.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#71717a] text-center">
              {isRunning
                ? 'Meeting in progress...'
                : 'Start a meeting to see the transcript'}
            </p>
          </div>
        ) : (
          transcript.map((msg) => (
            <div
              key={msg.id}
              className="p-3 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: ROLE_COLORS[msg.agentRole],
                    color: '#0a0a0f',
                  }}
                >
                  {msg.agentName[0]}
                </div>
                <span className="text-sm font-medium text-[#e4e4e7]">
                  {msg.agentName}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${ROLE_COLORS[msg.agentRole]}20`,
                    color: ROLE_COLORS[msg.agentRole],
                  }}
                >
                  {msg.agentRole.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {msg.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
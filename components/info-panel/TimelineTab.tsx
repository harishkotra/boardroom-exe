'use client';

import { useMeetingStore } from '@/lib/store';
import { AlertTriangle, TrendingUp, TrendingDown, Users, Zap, Clock } from 'lucide-react';

const EVENT_ICONS: Record<string, typeof AlertTriangle> = {
  investor_call: TrendingDown,
  competitor_launch: TrendingUp,
  runway_update: AlertTriangle,
  viral_tweet: Zap,
  board_meeting: Users,
  layoffs: AlertTriangle,
  pivot: TrendingUp,
  breakthrough: Zap,
};

const EVENT_COLORS: Record<string, string> = {
  investor_call: '#f59e0b',
  competitor_launch: '#ef4444',
  runway_update: '#ef4444',
  viral_tweet: '#a855f7',
  board_meeting: '#3b82f6',
  layoffs: '#ef4444',
  pivot: '#06b6d4',
  breakthrough: '#22c55e',
};

export default function TimelineTab() {
  const { events, transcript, scopeCreep, elapsedTime, isRunning } = useMeetingStore();

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const timelineItems = [
    ...events.map((e) => ({
      type: 'event' as const,
      id: e.id,
      timestamp: e.timestamp,
      title: e.title,
      description: e.description,
      color: EVENT_COLORS[e.type] || '#71717a',
    })),
    ...transcript.slice(-5).map((t) => ({
      type: 'message' as const,
      id: t.id,
      timestamp: t.timestamp,
      title: t.agentName,
      description: t.content.slice(0, 50) + (t.content.length > 50 ? '...' : ''),
      color: '#71717a',
    })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Timeline
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <Clock size={12} />
          <span className="font-mono">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Scope Creep Indicator */}
      <div className="mb-4 p-3 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#71717a]">Scope Creep</span>
          <span className="text-xs font-mono" style={{ color: scopeCreep > 50 ? '#ef4444' : '#22c55e' }}>
            {Math.round(scopeCreep)}%
          </span>
        </div>
        <div className="h-1.5 bg-[#2a2a3a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${scopeCreep}%`,
              backgroundColor: scopeCreep > 50 ? '#ef4444' : '#22c55e',
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {timelineItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#71717a] text-center">
              {isRunning ? 'Timeline building...' : 'Start a meeting to see timeline'}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#2a2a3a]" />

            <div className="space-y-3">
              {timelineItems.map((item, index) => (
                <div key={item.id} className="flex gap-3 relative">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.type === 'event' ? (
                      <AlertTriangle size={12} className="text-[#0a0a0f]" />
                    ) : (
                      <span className="text-xs font-bold text-[#0a0a0f]">
                        {item.title[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="text-sm font-medium text-[#e4e4e7]">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#71717a] mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
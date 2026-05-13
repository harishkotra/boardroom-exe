'use client';

import { useEffect, useRef } from 'react';
import { useMeetingStore } from '@/lib/store';
import ControlPanel from '@/components/control-panel/ControlPanel';
import MeetingRoom from '@/components/meeting-room/MeetingRoom';
import InfoPanel from '@/components/info-panel/InfoPanel';
import MetricsBar from '@/components/metrics-bar/MetricsBar';

export default function Home() {
  const { isRunning, nextTurn } = useMeetingStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        nextTurn();
      }, 2500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, nextTurn]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#2a2a3a] bg-[#12121a]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#a855f7] flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">B</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-[#e4e4e7]">
              Boardroom<span className="text-[#06b6d4]">.exe</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-[#2a2a3a]" />
          <span className="text-xs text-[#71717a] font-mono">AI CORPORATE MEETING SIMULATOR</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#22c55e] animate-pulse' : 'bg-[#71717a]'}`} />
          <span className="text-xs text-[#71717a] font-mono">
            {isRunning ? 'SIMULATION ACTIVE' : 'IDLE'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Controls */}
        <aside className="w-[320px] border-r border-[#2a2a3a] bg-[#12121a] overflow-y-auto">
          <ControlPanel />
        </aside>

        {/* Center Panel - Meeting Room */}
        <main className="flex-1 bg-[#0a0a0f] relative overflow-hidden">
          <MeetingRoom />
        </main>

        {/* Right Panel - Info */}
        <aside className="w-[380px] border-l border-[#2a2a3a] bg-[#12121a] overflow-y-auto">
          <InfoPanel />
        </aside>
      </div>

      {/* Bottom Panel - Metrics */}
      <footer className="h-[80px] border-t border-[#2a2a3a] bg-[#12121a]">
        <MetricsBar />
      </footer>
    </div>
  );
}
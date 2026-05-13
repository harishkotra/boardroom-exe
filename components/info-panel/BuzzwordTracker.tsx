'use client';

import { useMeetingStore } from '@/lib/store';
import { useMemo } from 'react';

export default function BuzzwordTracker() {
  const { buzzwords } = useMeetingStore();

  const sortedBuzzwords = useMemo(() => {
    const entries = Object.entries(buzzwords);
    return entries.sort((a, b) => b[1] - a[1]);
  }, [buzzwords]);

  const totalCount = useMemo(() => {
    return Object.values(buzzwords).reduce((sum, count) => sum + count, 0);
  }, [buzzwords]);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Buzzword Tracker
        </h3>
        <span className="text-xs text-[#71717a] font-mono">
          {totalCount} total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedBuzzwords.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#71717a] text-center">
              No buzzwords detected yet
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sortedBuzzwords.map(([word, count]) => {
              const intensity = Math.min(1, count / 10);
              const hue = 180 + intensity * 60;
              const saturation = 70 + intensity * 30;
              const lightness = 50 - intensity * 20;

              return (
                <div
                  key={word}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`,
                    border: `1px solid hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`,
                  }}
                >
                  <span className="text-sm text-[#e4e4e7] capitalize buzzword-tag">
                    {word}
                  </span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Most Used */}
      {sortedBuzzwords.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#2a2a3a]">
          <div className="text-xs text-[#71717a] mb-2">Most Used</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#06b6d4]">
              {sortedBuzzwords[0]?.[0]}
            </span>
            <span className="text-xs text-[#71717a]">
              ({sortedBuzzwords[0]?.[1]}x)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
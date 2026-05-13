'use client';

import { useMeetingStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricConfig {
  key: 'productivity' | 'burnRate' | 'morale' | 'technicalDebt' | 'buzzwordDensity' | 'shippingProbability' | 'pivotLikelihood' | 'reorgRisk' | 'investorSatisfaction';
  label: string;
  reverse?: boolean;
}

const METRICS_CONFIG: MetricConfig[] = [
  { key: 'productivity', label: 'Productivity', reverse: false },
  { key: 'burnRate', label: 'Burn Rate', reverse: true },
  { key: 'morale', label: 'Morale', reverse: false },
  { key: 'technicalDebt', label: 'Tech Debt', reverse: true },
  { key: 'buzzwordDensity', label: 'Buzzwords', reverse: true },
  { key: 'shippingProbability', label: 'Shipping', reverse: false },
  { key: 'pivotLikelihood', label: 'Pivot Risk', reverse: true },
  { key: 'reorgRisk', label: 'Reorg Risk', reverse: true },
  { key: 'investorSatisfaction', label: 'Investor Sat', reverse: false },
];

export default function MetricsBar() {
  const { metrics } = useMeetingStore();

  const getMetricColor = (value: number, reverse: boolean): string => {
    if (reverse) {
      return value > 60 ? '#ef4444' : value > 30 ? '#f59e0b' : '#22c55e';
    }
    return value > 60 ? '#22c55e' : value > 30 ? '#f59e0b' : '#ef4444';
  };

  const getTrend = (): 'up' | 'down' | 'stable' => {
    return 'stable';
  };

  return (
    <div className="flex items-center h-full px-6 gap-6 overflow-x-auto">
      {METRICS_CONFIG.map((config) => {
        const value = metrics[config.key as keyof typeof metrics] as number;
        const color = getMetricColor(value, config.reverse || false);
        const trend = getTrend();

        return (
          <div
            key={config.key}
            className="flex flex-col gap-1 min-w-[120px] px-3 py-2 rounded-lg hover:bg-[#1a1a25] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#71717a] truncate">{config.label}</span>
              {trend === 'up' && <TrendingUp size={10} className="text-[#22c55e]" />}
              {trend === 'down' && <TrendingDown size={10} className="text-[#ef4444]" />}
              {trend === 'stable' && <Minus size={10} className="text-[#71717a]" />}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold font-mono"
                style={{ color }}
              >
                {Math.round(value)}%
              </span>
            </div>
            {/* Mini Sparkline */}
            <div className="h-1 w-full bg-[#2a2a3a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${value}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
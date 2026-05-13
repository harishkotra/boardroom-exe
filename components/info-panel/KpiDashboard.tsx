'use client';

import { useMeetingStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiItem {
  key: 'productivity' | 'burnRate' | 'morale' | 'technicalDebt' | 'buzzwordDensity' | 'shippingProbability' | 'pivotLikelihood' | 'reorgRisk' | 'investorSatisfaction';
  label: string;
  color: string;
}

const KPIS: KpiItem[] = [
  { key: 'productivity', label: 'Productivity', color: '#22c55e' },
  { key: 'burnRate', label: 'Burn Rate', color: '#ef4444' },
  { key: 'morale', label: 'Morale', color: '#06b6d4' },
  { key: 'technicalDebt', label: 'Tech Debt', color: '#ef4444' },
  { key: 'buzzwordDensity', label: 'Buzzwords', color: '#f59e0b' },
  { key: 'shippingProbability', label: 'Shipping', color: '#22c55e' },
  { key: 'pivotLikelihood', label: 'Pivot Risk', color: '#ef4444' },
  { key: 'reorgRisk', label: 'Reorg Risk', color: '#ef4444' },
  { key: 'investorSatisfaction', label: 'Investor Sat', color: '#06b6d4' },
];

export default function KpiDashboard() {
  const { metrics } = useMeetingStore();

  const getTrend = (key: string): 'up' | 'down' | 'stable' => {
    return 'stable'; // Simplified for demo
  };

  const getBarWidth = (value: number, isReverse: boolean = false): number => {
    if (isReverse) {
      return 100 - value;
    }
    return value;
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          KPI Dashboard
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {KPIS.map((kpi) => {
          const value = metrics[kpi.key] as number;
          const trend = getTrend(kpi.key);
          const isReverse = ['burnRate', 'technicalDebt', 'buzzwordDensity', 'pivotLikelihood', 'reorgRisk'].includes(kpi.key);

          return (
            <div key={kpi.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#a1a1aa]">{kpi.label}</span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-mono font-semibold"
                    style={{ color: kpi.color }}
                  >
                    {Math.round(value)}%
                  </span>
                  {trend === 'up' && <TrendingUp size={12} className="text-[#22c55e]" />}
                  {trend === 'down' && <TrendingDown size={12} className="text-[#ef4444]" />}
                  {trend === 'stable' && <Minus size={12} className="text-[#71717a]" />}
                </div>
              </div>
              <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${getBarWidth(value, isReverse)}%`,
                    backgroundColor: kpi.color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
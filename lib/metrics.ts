import { Metrics, Agent } from './types';
import { DEFAULT_METRICS } from './constants';

export const calculateMetrics = (
  currentMetrics: Metrics,
  agents: Agent[],
  buzzwordCount: number,
  scopeCreep: number,
  elapsedTime: number,
  chaosLevel: number,
  events: number
): Metrics => {
  const agentInfluence = agents.reduce((sum, a) => sum + a.influence, 0) / agents.length;
  const moraleImpact = agents.filter(a => a.emotionalState === 'frustrated' || a.emotionalState === 'angry').length * 5;

  const productivityDelta = -1 - (events * 2) + (agentInfluence / 20);
  const burnRateDelta = (chaosLevel / 50) + (events * 3) + (scopeCreep / 20);
  const moraleDelta = -moraleImpact - (events * 5) + (agentInfluence / 30);
  const debtDelta = scopeCreep / 15 + chaosLevel / 30;
  const buzzwordDelta = buzzwordCount * 0.1 + (chaosLevel / 20);
  const shippingDelta = -scopeCreep / 10 - debtDelta / 5 + (agentInfluence / 25);
  const pivotDelta = (chaosLevel / 20) + (events * 5);
  const reorgDelta = (chaosLevel / 15) + (events * 3) + (moraleImpact / 5);
  const investorDelta = -burnRateDelta * 2 + shippingDelta * 3 - (events * 5);

  return {
    productivity: Math.max(0, Math.min(100, currentMetrics.productivity + productivityDelta)),
    burnRate: Math.max(0, Math.min(100, currentMetrics.burnRate + burnRateDelta)),
    morale: Math.max(0, Math.min(100, currentMetrics.morale + moraleDelta)),
    technicalDebt: Math.max(0, Math.min(100, currentMetrics.technicalDebt + debtDelta)),
    buzzwordDensity: Math.max(0, Math.min(100, currentMetrics.buzzwordDensity + buzzwordDelta)),
    shippingProbability: Math.max(0, Math.min(100, 80 + shippingDelta)),
    pivotLikelihood: Math.max(0, Math.min(100, currentMetrics.pivotLikelihood + pivotDelta)),
    reorgRisk: Math.max(0, Math.min(100, currentMetrics.reorgRisk + reorgDelta)),
    investorSatisfaction: Math.max(0, Math.min(100, currentMetrics.investorSatisfaction + investorDelta)),
  };
};

export const getMetricsTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  const diff = current - previous;
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
};

export const getMetricColor = (metric: keyof Metrics, value: number): string => {
  const thresholds: Record<keyof Metrics, { low: number; high: number }> = {
    productivity: { low: 30, high: 70 },
    burnRate: { low: 70, high: 30 },
    morale: { low: 30, high: 70 },
    technicalDebt: { low: 70, high: 30 },
    buzzwordDensity: { low: 70, high: 30 },
    shippingProbability: { low: 30, high: 70 },
    pivotLikelihood: { low: 70, high: 30 },
    reorgRisk: { low: 70, high: 30 },
    investorSatisfaction: { low: 30, high: 70 },
  };

  const threshold = thresholds[metric];

  if (metric === 'burnRate' || metric === 'technicalDebt' || metric === 'buzzwordDensity' || metric === 'pivotLikelihood' || metric === 'reorgRisk') {
    if (value < threshold.low) return '#22c55e';
    if (value > threshold.high) return '#ef4444';
  } else {
    if (value > threshold.high) return '#22c55e';
    if (value < threshold.low) return '#ef4444';
  }

  return '#f59e0b';
};

export const getMetricLabel = (metric: keyof Metrics): string => {
  const labels: Record<keyof Metrics, string> = {
    productivity: 'Productivity',
    burnRate: 'Burn Rate',
    morale: 'Morale',
    technicalDebt: 'Tech Debt',
    buzzwordDensity: 'Buzzword Density',
    shippingProbability: 'Shipping Prob',
    pivotLikelihood: 'Pivot Risk',
    reorgRisk: 'Reorg Risk',
    investorSatisfaction: 'Investor Sat',
  };
  return labels[metric];
};
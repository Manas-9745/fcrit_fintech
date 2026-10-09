import { AssetType, PortfolioSummary, SimulationResult, SimulatedAllocationTarget } from '../types';
import { ASSET_COLORS, formatINR } from './portfolioEngine';

export interface WhatIfScenarioPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  weights: Record<AssetType, number>;
}

export const PRESET_SCENARIOS: WhatIfScenarioPreset[] = [
  {
    id: 'de-risk-10-bonds',
    name: 'Shift 10% Equity to Bonds',
    description: 'Reduce equity drawdown risk by reallocating 10 percentage points of capital into sovereign & AAA fixed income.',
    badge: 'Capital Safety',
    weights: {
      EQUITY: 40,
      BOND: 30,
      REIT: 15,
      INVIT: 8,
      ETF: 7,
      OTHER: 0,
    },
  },
  {
    id: 'boost-reit-invit',
    name: 'Add 10% to REITs & InvITs',
    description: 'Enhance quarterly recurring dividend cash flow through high-yield infrastructure and grade-A commercial real estate.',
    badge: 'Cash Flow Boost',
    weights: {
      EQUITY: 42,
      BOND: 18,
      REIT: 20,
      INVIT: 12,
      ETF: 8,
      OTHER: 0,
    },
  },
  {
    id: 'classic-60-40',
    name: 'Classic 60/40 Balanced Strategy',
    description: 'Institutional asset allocation standard consisting of 60% growth equities and 40% income & real assets.',
    badge: 'Institutional',
    weights: {
      EQUITY: 60,
      BOND: 25,
      REIT: 8,
      INVIT: 4,
      ETF: 3,
      OTHER: 0,
    },
  },
  {
    id: 'income-maximizer',
    name: 'Income Maximizer (High Yield)',
    description: 'Designed for passive income generation with substantial weight in InvITs, REITs, and corporate bonds.',
    badge: 'Passive Income',
    weights: {
      EQUITY: 30,
      BOND: 30,
      REIT: 22,
      INVIT: 15,
      ETF: 3,
      OTHER: 0,
    },
  },
  {
    id: 'high-growth',
    name: 'Aggressive Equity Growth',
    description: 'Maximizes long-term capital appreciation by concentrating heavily in direct equities and broad market ETFs.',
    badge: 'High Growth',
    weights: {
      EQUITY: 75,
      BOND: 10,
      REIT: 5,
      INVIT: 3,
      ETF: 7,
      OTHER: 0,
    },
  },
];

// Conservative benchmark annual yields for hypothetical projection
const ASSET_YIELD_BENCHMARKS: Record<AssetType, number> = {
  EQUITY: 1.35,  // Nifty 50 avg dividend yield %
  BOND: 7.25,    // Sovereign G-Sec / AAA coupon %
  REIT: 7.40,    // Commercial REIT distribution %
  INVIT: 10.20,  // Infrastructure InvIT cash flow %
  ETF: 0.80,     // ETF dividend %
  OTHER: 4.50,   // Cash / Liquid
};

// Volatility index proxy (1 - 100)
const ASSET_VOLATILITY_INDEX: Record<AssetType, number> = {
  EQUITY: 85,
  ETF: 75,
  REIT: 45,
  INVIT: 40,
  BOND: 18,
  OTHER: 10,
};

export function runWhatIfSimulation(
  summary: PortfolioSummary,
  targetWeights: Record<AssetType, number>
): SimulationResult {
  const totalValue = summary.totalCurrentValue;
  const assetTypes: AssetType[] = ['EQUITY', 'BOND', 'REIT', 'INVIT', 'ETF', 'OTHER'];

  const assetLabels: Record<AssetType, string> = {
    EQUITY: 'Direct Equities',
    BOND: 'Bonds & Debt',
    REIT: 'REITs (Real Estate)',
    INVIT: 'InvITs (Infrastructure)',
    ETF: 'ETFs & Index Funds',
    OTHER: 'Other / Alternatives',
  };

  const currentAllocationMap = new Map<AssetType, number>();
  summary.assetAllocation.forEach((item) => {
    currentAllocationMap.set(item.type, item.value);
  });

  let totalSimulatedWeight = 0;
  const targets: SimulatedAllocationTarget[] = [];
  const rebalanceTransactions: SimulationResult['rebalanceTransactions'] = [];

  for (const type of assetTypes) {
    const simulatedWeight = targetWeights[type] || 0;
    totalSimulatedWeight += simulatedWeight;

    const currentAmount = currentAllocationMap.get(type) || 0;
    const currentWeight = totalValue > 0 ? (currentAmount / totalValue) * 100 : 0;
    const simulatedAmount = (simulatedWeight / 100) * totalValue;
    const deltaAmount = simulatedAmount - currentAmount;
    const deltaWeight = simulatedWeight - currentWeight;

    targets.push({
      assetType: type,
      label: assetLabels[type],
      currentWeight,
      simulatedWeight,
      currentAmount,
      simulatedAmount,
      deltaWeight,
      deltaAmount,
      color: ASSET_COLORS[type] || '#64748B',
    });

    if (Math.abs(deltaAmount) > 10) {
      rebalanceTransactions.push({
        action: deltaAmount > 0 ? 'BUY' : 'SELL',
        assetType: type,
        amount: Math.abs(deltaAmount),
        weightDelta: Math.abs(deltaWeight),
      });
    }
  }

  // Sort rebalancing: SELL first, then BUY
  rebalanceTransactions.sort((a, b) => (a.action === 'SELL' ? -1 : 1));

  // Yield calculations
  let currentYield = 0;
  let simulatedYield = 0;
  let currentVolatility = 0;
  let simulatedVolatility = 0;

  for (const target of targets) {
    const yieldRate = ASSET_YIELD_BENCHMARKS[target.assetType];
    const volRate = ASSET_VOLATILITY_INDEX[target.assetType];

    currentYield += (target.currentWeight / 100) * yieldRate;
    simulatedYield += (target.simulatedWeight / 100) * yieldRate;

    currentVolatility += (target.currentWeight / 100) * volRate;
    simulatedVolatility += (target.simulatedWeight / 100) * volRate;
  }

  const deltaYield = simulatedYield - currentYield;
  const isValid = Math.abs(totalSimulatedWeight - 100) < 0.1;

  // Generate neutral explanation
  const equityDelta = targets.find((t) => t.assetType === 'EQUITY')?.deltaWeight || 0;
  const bondDelta = targets.find((t) => t.assetType === 'BOND')?.deltaWeight || 0;
  const reitDelta = (targets.find((t) => t.assetType === 'REIT')?.deltaWeight || 0) + (targets.find((t) => t.assetType === 'INVIT')?.deltaWeight || 0);

  let explanation = '';
  if (equityDelta < -3 && bondDelta > 3) {
    explanation = `Shifting ${Math.abs(equityDelta).toFixed(1)}% of capital from equities into fixed-income bonds lowers portfolio volatility score from ${currentVolatility.toFixed(0)}/100 to ${simulatedVolatility.toFixed(0)}/100, while raising estimated passive distribution yield by +${deltaYield.toFixed(2)}% per year.`;
  } else if (reitDelta > 3) {
    explanation = `Increasing allocation to REITs and InvITs by +${reitDelta.toFixed(1)}% introduces asset-backed quarterly rental and transmission distributions, raising projected income from ${currentYield.toFixed(2)}% to ${simulatedYield.toFixed(2)}% annually.`;
  } else if (equityDelta > 3) {
    explanation = `Increasing equity exposure by +${equityDelta.toFixed(1)}% enhances long-term capital growth potential at the expense of higher drawdown volatility (score increases to ${simulatedVolatility.toFixed(0)}/100).`;
  } else {
    explanation = `This hypothetical adjustment balances portfolio weights across ${targets.filter((t) => t.simulatedWeight > 0).length} asset classes, resulting in a projected average distribution yield of ${simulatedYield.toFixed(2)}%.`;
  }

  let volDescription = 'Balanced Risk Profile';
  if (simulatedVolatility < 35) volDescription = 'Conservative & Defensive';
  else if (simulatedVolatility > 65) volDescription = 'Growth & Volatile';

  return {
    targets: targets.filter((t) => t.currentWeight > 0 || t.simulatedWeight > 0),
    totalCurrentValue: totalValue,
    totalSimulatedValue: totalValue,
    isValid,
    totalSimulatedWeight,
    rebalanceTransactions,
    projectedEstimatedYield: {
      currentYield,
      simulatedYield,
      deltaYield,
    },
    volatilityScore: {
      current: currentVolatility,
      simulated: simulatedVolatility,
      description: volDescription,
    },
    explanation,
  };
}

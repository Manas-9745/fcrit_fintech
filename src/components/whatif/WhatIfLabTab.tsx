import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AssetType } from '../../types';
import {
  PRESET_SCENARIOS,
  runWhatIfSimulation,
  WhatIfScenarioPreset,
} from '../../services/whatIfEngine';
import {
  formatINR,
  formatPercent,
  ASSET_COLORS,
} from '../../services/portfolioEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Info,
} from 'lucide-react';

export const WhatIfLabTab: React.FC = () => {
  const { summary } = usePortfolio();

  // Initialize weights with current portfolio weights
  const initialWeights: Record<AssetType, number> = useMemo(() => {
    const weights: Record<AssetType, number> = {
      EQUITY: 0,
      BOND: 0,
      REIT: 0,
      INVIT: 0,
      ETF: 0,
      OTHER: 0,
    };
    summary.assetAllocation.forEach((item) => {
      weights[item.type] = Math.round(item.percentage);
    });

    // Normalize to exact 100
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum !== 100 && weights.EQUITY > 0) {
      weights.EQUITY += 100 - sum;
    }
    return weights;
  }, [summary]);

  const [simulatedWeights, setSimulatedWeights] =
    useState<Record<AssetType, number>>(initialWeights);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const simulation = useMemo(() => {
    return runWhatIfSimulation(summary, simulatedWeights);
  }, [summary, simulatedWeights]);

  const handleWeightChange = (type: AssetType, val: number) => {
    setSelectedPresetId(null);
    const newWeight = Math.max(0, Math.min(100, Math.round(val)));
    setSimulatedWeights((prev) => ({
      ...prev,
      [type]: newWeight,
    }));
  };

  const handleApplyPreset = (preset: WhatIfScenarioPreset) => {
    setSelectedPresetId(preset.id);
    setSimulatedWeights(preset.weights);
  };

  const handleReset = () => {
    setSelectedPresetId(null);
    setSimulatedWeights(initialWeights);
  };

  // Prepare chart comparison data
  const comparisonChartData = simulation.targets.map((t) => ({
    name: t.label.split(' ')[0],
    fullName: t.label,
    Current: Number(t.currentWeight.toFixed(1)),
    Simulated: Number(t.simulatedWeight.toFixed(1)),
    color: t.color,
  }));

  const totalSum = Object.values(simulatedWeights).reduce((a, b) => a + b, 0);
  const isSumValid = Math.abs(totalSum - 100) === 0;

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-subtle">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-slate-900 block">
            Hypothetical Simulation Engine — Not an Execution or Investment Advice
          </span>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            This module models hypothetical asset class rebalancing against benchmark yield & risk parameters. No trade orders are placed.
          </p>
        </div>
      </div>

      {/* Preset Strategy Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Quick Scenario Presets
          </span>
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Current
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
          {PRESET_SCENARIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPresetId === p.id
                  ? 'bg-teal-50/90 border-teal-500 shadow-sm ring-1 ring-teal-500/20'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {p.name}
                </span>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulator Controls & Before/After Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Input Panel (5 Cols) */}
        <Card
          title="Adjust Target Asset Class Weights"
          subtitle="Sliders must total exactly 100%"
          className="lg:col-span-5"
          action={
            <Badge
              variant={isSumValid ? 'emerald' : 'coral'}
              size="sm"
            >
              Total: {totalSum}%
            </Badge>
          }
        >
          <div className="space-y-4">
            {(
              [
                { type: 'EQUITY', label: 'Direct Equities', color: ASSET_COLORS.EQUITY },
                { type: 'BOND', label: 'Bonds & Fixed Debt', color: ASSET_COLORS.BOND },
                { type: 'REIT', label: 'REITs (Commercial Real Estate)', color: ASSET_COLORS.REIT },
                { type: 'INVIT', label: 'InvITs (Infrastructure)', color: ASSET_COLORS.INVIT },
                { type: 'ETF', label: 'ETFs & Index Funds', color: ASSET_COLORS.ETF },
              ] as { type: AssetType; label: string; color: string }[]
            ).map((asset) => {
              const currentVal = simulatedWeights[asset.type] || 0;
              const originalWeight =
                summary.assetAllocation.find((a) => a.type === asset.type)?.percentage || 0;
              const delta = currentVal - originalWeight;

              return (
                <div key={asset.type} className="space-y-1.5 p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: asset.color }}
                      />
                      <span className="font-bold text-slate-800">{asset.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {Math.abs(delta) > 0.5 && (
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            delta > 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {delta > 0 ? '+' : ''}
                          {delta.toFixed(0)}%
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentVal}
                          onChange={(e) =>
                            handleWeightChange(asset.type, Number(e.target.value))
                          }
                          className="w-12 px-1.5 py-0.5 text-right font-mono font-bold text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <span className="text-slate-400 text-xs">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentVal}
                    onChange={(e) =>
                      handleWeightChange(asset.type, Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
              );
            })}

            {!isSumValid && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Total simulated weight is currently <strong>{totalSum}%</strong>. Please balance weights to reach 100%.
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Before vs After Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparison Bar Chart */}
          <Card
            title="Before vs After Allocation Comparison"
            subtitle="Side-by-side asset weight distribution"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonChartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                  />
                  <RechartsTooltip
                    formatter={(val: any) => [`${val}%`, '']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Bar
                    dataKey="Current"
                    fill="#94A3B8"
                    name="Current Weight %"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Simulated"
                    fill="#0D9488"
                    name="Simulated Target %"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Projected Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Projected Estimated Yield */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-subtle">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Estimated Distribution Yield
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {simulation.projectedEstimatedYield.simulatedYield.toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (was {simulation.projectedEstimatedYield.currentYield.toFixed(2)}%)
                </span>
              </div>
              <span
                className={`text-[11px] font-bold font-mono mt-1.5 block ${
                  simulation.projectedEstimatedYield.deltaYield >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {simulation.projectedEstimatedYield.deltaYield >= 0 ? '+' : ''}
                {simulation.projectedEstimatedYield.deltaYield.toFixed(2)}% passive income delta
              </span>
            </div>

            {/* Volatility Risk Score */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-subtle">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Portfolio Volatility Score
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {simulation.volatilityScore.simulated.toFixed(0)}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (was {simulation.volatilityScore.current.toFixed(0)})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 mt-1.5 block">
                {simulation.volatilityScore.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Neutral Educational Explanation & Rebalancing Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Explanation Rationale (6 Cols) */}
        <Card
          title="Neutral Simulation Analysis"
          subtitle="Model-generated structural feedback"
          className="lg:col-span-6"
        >
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            {simulation.explanation}
          </p>
        </Card>

        {/* Rebalancing Steps (6 Cols) */}
        <Card
          title="Hypothetical Rebalancing Plan"
          subtitle="Capital shifts required to match target allocations"
          className="lg:col-span-6"
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {simulation.rebalanceTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Allocations match current portfolio. No rebalancing shifts needed.
              </p>
            ) : (
              simulation.rebalanceTransactions.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={tx.action === 'BUY' ? 'emerald' : 'coral'}
                      size="sm"
                    >
                      {tx.action}
                    </Badge>
                    <span className="font-semibold text-slate-800">
                      {tx.assetType}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">
                      {formatINR(tx.amount)}
                    </span>
                    <span className="text-slate-400 text-[10px] block">
                      {tx.weightDelta.toFixed(1)}% shift
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

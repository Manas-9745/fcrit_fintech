import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  formatINR,
  formatINRLakhs,
  formatPercent,
  SECTOR_COLORS,
} from '../../services/portfolioEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PieChart as PieIcon,
  Layers,
  Building,
  Info,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const PortfolioXRayTab: React.FC = () => {
  const { summary, accounts, setActiveTab, sendAIMessage } = usePortfolio();
  const [sectorDenominator, setSectorDenominator] = useState<'equity' | 'total'>('equity');

  const { concentrationMetrics, sectorAllocation, overlaps } = summary;

  const handleAskAISector = (sectorName: string) => {
    setActiveTab('ai');
    sendAIMessage(`Explain my exposure in ${sectorName} sector and what risks I should monitor.`);
  };

  const handleAskAIConcentration = () => {
    setActiveTab('ai');
    sendAIMessage(`Analyze my portfolio concentration risk (HHI score: ${concentrationMetrics.hhiScore}) and suggest ways to optimize.`);
  };

  const sectorChartData = sectorAllocation.map((s) => ({
    sector: s.sector,
    value: s.value,
    percentage:
      sectorDenominator === 'equity'
        ? Number(s.percentageOfEquity.toFixed(1))
        : Number(s.percentageOfTotal.toFixed(1)),
    color: s.color,
    topStock: s.topStock,
  }));

  const accountDistributionData = accounts.map((a) => ({
    name: a.name,
    value: a.totalValue,
    percentage:
      summary.totalCurrentValue > 0
        ? (a.totalValue / summary.totalCurrentValue) * 100
        : 0,
    color: a.avatarColor,
    holdingsCount: a.holdingsCount,
  }));

  return (
    <div className="space-y-6">
      {/* Concentration & Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* HHI Concentration Score */}
        <Card
          title="Concentration Index (HHI)"
          subtitle="Herfindahl-Hirschman measurement of position concentration"
          action={
            <Badge
              variant={
                concentrationMetrics.concentrationLevel === 'HEALTHY'
                  ? 'emerald'
                  : concentrationMetrics.concentrationLevel === 'MODERATE'
                  ? 'amber'
                  : 'coral'
              }
              size="sm"
            >
              {concentrationMetrics.concentrationLevel} RISK
            </Badge>
          }
        >
          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {concentrationMetrics.hhiScore}
              </span>
              <span className="text-xs text-slate-400 font-mono ml-2">/ 10,000 pts</span>
            </div>
          </div>

          {/* Concentration Meter Bar */}
          <div className="mt-3.5 space-y-1.5">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(100, (1500 / 10000) * 100)}%` }}
                title="Healthy (<1500)"
              />
              <div
                className="h-full bg-amber-400"
                style={{ width: `${Math.min(100, (1000 / 10000) * 100)}%` }}
                title="Moderate (1500-2500)"
              />
              <div
                className="h-full bg-rose-500"
                style={{ width: `${Math.min(100, (7500 / 10000) * 100)}%` }}
                title="High (>2500)"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Healthy (&lt;1500)</span>
              <span>Moderate</span>
              <span>High (&gt;2500)</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Largest single holding is{' '}
            <span className="font-semibold text-slate-800">
              {concentrationMetrics.topHoldingSymbol}
            </span>{' '}
            representing {concentrationMetrics.topHoldingWeight.toFixed(1)}% of your capital.
          </p>

          <button
            onClick={handleAskAIConcentration}
            className="mt-3.5 text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Ask AI to evaluate concentration risk →
          </button>
        </Card>

        {/* Top 3 & Top 5 Exposure Weights */}
        <Card
          title="Holdings Concentration"
          subtitle="Proportion of total wealth in top holdings"
        >
          <div className="space-y-3.5 mt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Top 3 Holdings Exposure</span>
                <span className="font-mono text-slate-900">
                  {concentrationMetrics.top3Weight.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${concentrationMetrics.top3Weight}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Top 5 Holdings Exposure</span>
                <span className="font-mono text-slate-900">
                  {concentrationMetrics.top5Weight.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full"
                  style={{ width: `${concentrationMetrics.top5Weight}%` }}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            A top-3 weight below 40% ensures strong single-stock risk insulation.
          </p>
        </Card>

        {/* Cross-Broker Overlap Summary */}
        <Card
          title="Cross-Account Duplication"
          subtitle="Identical securities held in >1 broker"
          action={
            <Badge variant="amber" size="sm">
              {overlaps.length} Overlaps
            </Badge>
          }
        >
          <div className="mt-1">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">
              {formatINR(summary.overlapCapital)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              total capital in duplicate holdings
            </span>
          </div>

          <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
            {overlaps.map((o) => (
              <span
                key={o.isin}
                className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold rounded-lg"
              >
                {o.symbol} ({o.duplicateCount} brokers)
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Consolidated in NiveshIQ to prevent skewed risk perception.
          </p>
        </Card>
      </div>

      {/* Sector Breakdown with Denominator Toggle */}
      <Card
        title="Equity Sector Exposure Analysis"
        subtitle="Understand where your stock market capital is concentrated"
        action={
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              onClick={() => setSectorDenominator('equity')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                sectorDenominator === 'equity'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              % of Direct Equities
            </button>
            <button
              onClick={() => setSectorDenominator('total')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                sectorDenominator === 'total'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              % of Total Portfolio
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Horizontal Bar Chart */}
          <div className="lg:col-span-7 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 'dataMax + 5']}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <YAxis
                  dataKey="sector"
                  type="category"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  width={140}
                />
                <RechartsTooltip
                  formatter={(val: any) => [`${val}%`, `Share of ${sectorDenominator === 'equity' ? 'Equities' : 'Total'}`]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {sectorChartData.map((entry, index) => (
                    <Cell key={`sector-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Breakdown Data Cards */}
          <div className="lg:col-span-5 space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {sectorAllocation.map((s) => (
              <div
                key={s.sector}
                className="p-3 rounded-xl border border-slate-200/70 hover:border-teal-300 hover:bg-slate-50/70 transition-all flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {s.sector}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Top holding: <span className="font-semibold text-slate-600">{s.topStock}</span>
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900 font-mono block">
                    {sectorDenominator === 'equity'
                      ? `${s.percentageOfEquity.toFixed(1)}%`
                      : `${s.percentageOfTotal.toFixed(1)}%`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatINR(s.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Account-wise Distribution & Duplicate Overlap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Capital Distribution */}
        <Card
          title="Account-Wise Distribution"
          subtitle="Capital allocation across connected broker & depository accounts"
        >
          <div className="space-y-4">
            {accountDistributionData.map((acc) => (
              <div key={acc.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: acc.color }}
                    />
                    <span className="font-bold text-slate-800">{acc.name}</span>
                    <span className="text-[11px] text-slate-400">
                      ({acc.holdingsCount} positions)
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">
                      {formatINR(acc.value)}
                    </span>{' '}
                    <span className="text-slate-400 text-[11px]">
                      ({acc.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${acc.percentage}%`,
                      backgroundColor: acc.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed Overlap Matrix */}
        <Card
          title="Multi-Broker Overlap Matrix"
          subtitle="Exact breakdown of duplicated positions across accounts"
        >
          <div className="space-y-3">
            {overlaps.map((o) => (
              <div
                key={o.isin}
                className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      {o.name}
                    </span>
                    <Badge variant="amber" size="sm">
                      {o.symbol}
                    </Badge>
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-xs">
                    {formatINR(o.totalValue)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded-lg border border-amber-100">
                  {o.quantitiesByAccount.map((q) => (
                    <div key={q.accountName}>
                      <span className="font-semibold text-slate-700 block">
                        {q.accountName}:
                      </span>
                      <span className="text-slate-500 font-mono">
                        {q.quantity} shares @ {formatINR(q.avgPrice)} ({formatINR(q.value)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

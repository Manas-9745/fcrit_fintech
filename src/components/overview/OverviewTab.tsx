import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  formatINR,
  formatINRLakhs,
  formatPercent,
  ASSET_COLORS,
} from '../../services/portfolioEngine';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TrendingUp,
  Wallet,
  Coins,
  ArrowUpRight,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Activity,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  RefreshCw,
  Building,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    summary,
    accounts,
    setActiveTab,
    startSyncSequence,
    isSyncing,
    sendAIMessage,
  } = usePortfolio();

  const pieData = summary.assetAllocation.map((item) => ({
    name: item.label,
    value: item.value,
    percentage: item.percentage,
    color: item.color,
    type: item.type,
  }));

  const handleAskAIAboutOverlaps = () => {
    setActiveTab('ai');
    sendAIMessage('Do I have duplicate or overlapping holdings across brokers?');
  };

  return (
    <div className="space-y-6">
      {/* Top Overlap Notification Banner if duplicates exist */}
      {summary.overlapCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Cross-Broker Holding Overlap Detected
                </h4>
                <Badge variant="amber" size="sm">
                  {summary.overlapCount} Securities
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                You hold identical positions in{' '}
                <span className="font-semibold text-slate-800">
                  {summary.overlaps.map((o) => o.symbol).join(', ')}
                </span>{' '}
                across multiple brokers, locking{' '}
                <span className="font-semibold text-slate-800 font-mono">
                  {formatINR(summary.overlapCapital)}
                </span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button
              onClick={handleAskAIAboutOverlaps}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Ask AI Explainer
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              View in Portfolio
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Portfolio Value"
          value={formatINR(summary.totalCurrentValue)}
          subValue={`(${formatINRLakhs(summary.totalCurrentValue)})`}
          changePercent={summary.totalPnLPercent}
          changeLabel="overall return"
          icon={<Wallet className="w-4 h-4" />}
          iconBgColor="bg-teal-50 text-teal-700 border-teal-200"
          highlight={true}
        />

        <StatCard
          title="Total Invested Basis"
          value={formatINR(summary.totalInvestedValue)}
          subValue={`across ${summary.connectedAccountsCount} sources`}
          icon={<Coins className="w-4 h-4" />}
          iconBgColor="bg-slate-50 text-slate-700 border-slate-200"
        />

        <StatCard
          title="Unrealized P&L"
          value={`${summary.totalPnL >= 0 ? '+' : ''}${formatINR(summary.totalPnL)}`}
          changePercent={summary.totalPnLPercent}
          changeLabel="net gain"
          icon={<TrendingUp className="w-4 h-4" />}
          iconBgColor={
            summary.totalPnL >= 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }
        />

        <StatCard
          title="Today's Change"
          value={`${summary.dayChange >= 0 ? '+' : ''}${formatINR(summary.dayChange)}`}
          changePercent={summary.dayChangePercent}
          changeLabel="day movement"
          icon={<Activity className="w-4 h-4" />}
          iconBgColor="bg-sky-50 text-sky-700 border-sky-200"
        />
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation Chart (2 Cols) */}
        <Card
          title="Consolidated Asset Allocation"
          subtitle="Unified exposure distribution calculated across all active accounts"
          className="lg:col-span-2"
          action={
            <button
              onClick={() => setActiveTab('whatif')}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              Simulate Shifts <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Donut Chart */}
            <div className="md:col-span-5 h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [formatINR(Number(val)), 'Current Value']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Total Assets
                </span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatINRLakhs(summary.totalCurrentValue)}
                </span>
              </div>
            </div>

            {/* Asset Breakdown List */}
            <div className="md:col-span-7 space-y-2.5">
              {summary.assetAllocation.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {item.holdingsCount} holding{item.holdingsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono block">
                      {formatINR(item.value)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 font-mono">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Connected Accounts Status Card (1 Col) */}
        <Card
          title="Connected Sources"
          subtitle="Real-time multi-broker status"
          action={
            <button
              onClick={startSyncSequence}
              disabled={isSyncing}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync
            </button>
          }
        >
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold text-[11px] flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: acc.avatarColor }}
                    >
                      {acc.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {acc.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {acc.accountNumber}
                      </span>
                    </div>
                  </div>

                  <Badge variant="emerald" size="sm">
                    Connected
                  </Badge>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {acc.holdingsCount} positions
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatINR(acc.totalValue)}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setActiveTab('accounts')}
              className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-subtle transition-all flex items-center justify-center gap-1.5"
            >
              <span>Manage & Add Accounts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Top Holdings Preview & Quick Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Consolidated Holdings (2 Cols) */}
        <Card
          title="Top Consolidated Holdings"
          subtitle="Aggregated by ISIN across all active broker accounts"
          className="lg:col-span-2"
          action={
            <button
              onClick={() => setActiveTab('portfolio')}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              View All {summary.uniqueHoldingsCount} Holdings <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5">Security</th>
                  <th className="pb-2.5">Asset Type</th>
                  <th className="pb-2.5">Holdings Source</th>
                  <th className="pb-2.5 text-right">Current Value</th>
                  <th className="pb-2.5 text-right">Weight</th>
                  <th className="pb-2.5 text-right">Gain / Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.topHoldings.map((h) => (
                  <tr key={h.isin} className="table-row-hover">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-slate-900">{h.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {h.symbol} • {h.isin}
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <Badge
                        variant={
                          h.assetType === 'EQUITY'
                            ? 'teal'
                            : h.assetType === 'BOND'
                            ? 'emerald'
                            : h.assetType === 'REIT'
                            ? 'sky'
                            : 'purple'
                        }
                        size="sm"
                      >
                        {h.assetType}
                      </Badge>
                    </td>
                    <td className="py-3 pr-2">
                      {h.accountCount > 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {h.accountCount} Accounts (Overlap)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {h.accounts[0]?.accountName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900 font-mono">
                      {formatINR(h.totalCurrentValue)}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-600 font-mono">
                      {h.portfolioWeight.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`font-semibold font-mono text-[11px] ${
                          h.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {h.totalPnL >= 0 ? '+' : ''}
                        {h.totalPnLPercent.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Intelligence Quick Cards */}
        <div className="space-y-4">
          {/* Ask AI Card */}
          <div
            onClick={() => setActiveTab('ai')}
            className="p-4 bg-gradient-to-br from-teal-900 to-teal-800 text-white rounded-2xl shadow-card cursor-pointer hover:shadow-elevated transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-800/80 px-2 py-0.5 rounded-full border border-teal-700/60">
                Grounded Assistant
              </span>
              <Sparkles className="w-4 h-4 text-teal-300 group-hover:rotate-12 transition-transform" />
            </div>
            <h4 className="text-sm font-bold text-white">
              Ask NiveshIQ AI
            </h4>
            <p className="text-xs text-teal-100/80 mt-1 leading-relaxed">
              "What is my largest sector exposure?" or "Explain my duplicate holdings."
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-teal-200 group-hover:translate-x-1 transition-transform">
              Open Chat Assistant →
            </div>
          </div>

          {/* Explore Real Assets Card */}
          <div
            onClick={() => setActiveTab('discovery')}
            className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-subtle hover:border-slate-300 hover:shadow-card cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                Alternative Yields
              </span>
              <Compass className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Discover REITs & InvITs
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Learn how commercial real estate & infrastructure generate 7-11% cash flow yields.
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
              Explore Guide & Matrix →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

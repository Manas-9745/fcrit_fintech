import React, { useState } from 'react';
import { DISCOVERY_ASSETS } from '../../services/discoveryData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Building2,
  Zap,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const DiscoveryTab: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('reits');

  const currentAsset =
    DISCOVERY_ASSETS.find((a) => a.id === selectedAssetId) || DISCOVERY_ASSETS[0];

  return (
    <div className="space-y-6">
      {/* Category Tabs Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DISCOVERY_ASSETS.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-teal-500/80 shadow-card ring-1 ring-teal-500/20'
                  : 'bg-white/80 border-slate-200/90 shadow-subtle hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                    asset.id === 'reits'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : asset.id === 'invits'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {asset.id === 'reits' ? (
                    <Building2 className="w-5 h-5" />
                  ) : asset.id === 'invits' ? (
                    <Zap className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${asset.badgeColor}`}
                >
                  {asset.badgeText}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{asset.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {asset.tagline}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Asset Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Definition & Mechanism (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Definition Card */}
          <Card
            title={currentAsset.title}
            subtitle={currentAsset.tagline}
            action={
              <Badge variant="teal" size="sm">
                SEBI Regulated
              </Badge>
            }
          >
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {currentAsset.definition}
            </p>

            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                How It Works & Generates Cash Flow
              </h4>
              <div className="space-y-2">
                {currentAsset.howItWorks.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Visual 5-Step Structuring Diagram */}
          <Card
            title="Institutional Trust Structure Diagram"
            subtitle="How capital, assets, and distributions flow through the trust"
          >
            <div className="space-y-3 font-mono text-xs">
              {/* Sponsor */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">1. Sponsor / Promoters</span>
                <span className="text-[11px] text-slate-500 font-sans">
                  {currentAsset.structureDiagram.sponsor}
                </span>
              </div>
              <div className="text-center text-slate-400 text-xs font-sans">↓ Transmits assets & governance</div>

              {/* Trustee & Manager */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-0.5">2. SEBI Trustee</span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    {currentAsset.structureDiagram.trustee}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-0.5">3. Investment Manager</span>
                  <span className="text-[11px] text-slate-500 font-sans">
                    {currentAsset.structureDiagram.manager}
                  </span>
                </div>
              </div>
              <div className="text-center text-slate-400 text-xs font-sans">↓ Manages cash-generating SPV properties</div>

              {/* SPV Assets */}
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80">
                <span className="font-bold text-teal-950 block mb-1.5">
                  4. Revenue-Generating Assets (SPVs)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-teal-900 font-sans">
                  {currentAsset.structureDiagram.assets.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-slate-400 text-xs font-sans">↓ 90% Net Distributable Cash Flows (NDCF)</div>

              {/* Investor Distribution */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-950">5. Retail & HNI Unitholders</span>
                <span className="text-[11px] text-emerald-800 font-sans font-semibold">
                  {currentAsset.structureDiagram.investorPayout}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Income, Indian Taxation, Risks & Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Income Mechanism & Yield Range */}
          <Card
            title="Distribution Yield & Cash Flow"
            subtitle="Frequency, yield benchmarks & income sources"
          >
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Typical Annual Yield</span>
                <span className="text-sm font-bold text-teal-700 font-mono">
                  {currentAsset.incomeMechanism.typicalRange}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Distribution Schedule</span>
                <span className="text-xs font-bold text-slate-800">
                  {currentAsset.incomeMechanism.payoutFrequency}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Cash Flow Sources:
                </span>
                <ul className="space-y-1">
                  {currentAsset.incomeMechanism.sources.map((s, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Indian Taxation Rules */}
          <Card
            title="Indian Taxation Framework"
            subtitle="Tax rules under Section 115UA for Indian investors"
          >
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800 block">Dividend Income:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                  {currentAsset.taxationIndia.dividend}
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800 block">Interest Component:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                  {currentAsset.taxationIndia.interest}
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800 block">Capital Gains:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                  {currentAsset.taxationIndia.capitalGains}
                </p>
              </div>
            </div>
          </Card>

          {/* Key Risks */}
          <Card title="Key Risk Considerations" subtitle="Factors to evaluate before allocating">
            <div className="space-y-2">
              {currentAsset.keyRisks.map((risk, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{risk}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Indian Listed Examples Directory */}
      <Card
        title={`Indian Listed ${currentAsset.shortCode} Directory`}
        subtitle="Benchmark securities trading on the National Stock Exchange (NSE) & BSE"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentAsset.indianExamples.map((item) => (
            <div
              key={item.symbol}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">{item.name}</span>
                <Badge variant="teal" size="sm">
                  {item.symbol}
                </Badge>
              </div>
              <span className="text-[10px] text-teal-700 font-semibold block mb-1">
                {item.category}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Cross-Asset Comparison Matrix Table */}
      <Card
        padding="none"
        title={
          <div className="px-5 pt-4">
            <h3 className="text-base font-semibold text-slate-900">
              Institutional Asset Class Comparison Matrix
            </h3>
          </div>
        }
        subtitle={
          <span className="px-5 text-slate-400">
            Side-by-side evaluation across Equities, Commercial REITs, Infrastructure InvITs, and Sovereign/Corporate Debt
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-3 text-teal-800">Equities</th>
                <th className="py-3 px-3 text-sky-800">REITs (Real Estate)</th>
                <th className="py-3 px-3 text-purple-800">InvITs (Infra)</th>
                <th className="py-3 px-4 text-emerald-800">Bonds (Fixed Income)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-800">Primary Objective</td>
                <td className="py-3 px-3 text-slate-600">Long-term Capital Growth</td>
                <td className="py-3 px-3 text-slate-600">Quarterly Dividends + Property Growth</td>
                <td className="py-3 px-3 text-slate-600">High Distribution Yield</td>
                <td className="py-3 px-4 text-slate-600">Capital Safety + Fixed Coupons</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-800">Typical Annual Yield</td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-700">1.2% – 1.8%</td>
                <td className="py-3 px-3 font-mono font-bold text-sky-700">6.5% – 8.0%</td>
                <td className="py-3 px-3 font-mono font-bold text-purple-700">9.0% – 12.0%</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">7.0% – 8.5%</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-800">Cash Flow Mandate</td>
                <td className="py-3 px-3 text-slate-600">Board Discretion (0-100%)</td>
                <td className="py-3 px-3 font-semibold text-slate-800">Mandatory 90% of NDCF</td>
                <td className="py-3 px-3 font-semibold text-slate-800">Mandatory 90% of NDCF</td>
                <td className="py-3 px-4 font-semibold text-slate-800">Contractual Coupon Obligation</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-800">Volatility Profile</td>
                <td className="py-3 px-3 text-rose-700 font-semibold">High Volatility</td>
                <td className="py-3 px-3 text-amber-700 font-semibold">Moderate Volatility</td>
                <td className="py-3 px-3 text-amber-700 font-semibold">Moderate Volatility</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Low Volatility</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-800">Exchange Liquidity</td>
                <td className="py-3 px-3 text-slate-600">High (T+1 Settlement)</td>
                <td className="py-3 px-3 text-slate-600">High (1 Unit Lot on NSE/BSE)</td>
                <td className="py-3 px-3 text-slate-600">Moderate (1 Unit Lot on NSE/BSE)</td>
                <td className="py-3 px-4 text-slate-600">Moderate (NSE/BSE & RBI Retail Direct)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  TrendingUp,
  Layers,
  Activity,
  Sparkles,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Zap,
  ShieldAlert,
  BarChart3,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatINR, formatINRLakhs } from '../../services/portfolioEngine';

export const LandingPage: React.FC = () => {
  const { setIsLandingPage, setActiveTab, summary, startSyncSequence } = usePortfolio();

  const handleEnterDemo = (targetTab = 'overview') => {
    setIsLandingPage(false);
    setActiveTab(targetTab as any);
  };

  const featurePillars = [
    {
      step: '01',
      title: 'UNIFY',
      subtitle: 'Multi-Broker ISIN Normalization',
      description:
        'Connect Zerodha, Groww, and CDSL Demat. Automatically merge duplicate stock positions across brokers into clean consolidated ISIN records.',
      icon: <Layers className="w-5 h-5 text-teal-600" />,
      tab: 'portfolio',
      metric: `${summary.totalHoldingsCount} Positions → ${summary.uniqueHoldingsCount} Normalized Securities`,
    },
    {
      step: '02',
      title: 'X-RAY',
      subtitle: 'True Exposure & Overlap Detection',
      description:
        'Uncover hidden sector concentration and pinpoint identical equities held across multiple accounts with accurate denominators.',
      icon: <Activity className="w-5 h-5 text-sky-600" />,
      tab: 'xray',
      metric: `${summary.overlapCount} Overlapping Securities Detected`,
    },
    {
      step: '03',
      title: 'ASK AI',
      subtitle: 'Grounded Portfolio Assistant',
      description:
        'Ask plain-English questions backed by deterministic math tools without hallucinated numbers or unauthorized recommendations.',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      tab: 'ai',
      metric: '8 Grounded Analytical Tools',
    },
    {
      step: '04',
      title: 'SIMULATE',
      subtitle: 'What-If Asset Rebalancer',
      description:
        'Model hypothetical shifts (e.g., reallocating 10% from equity to bonds) and evaluate projected yields and drawdown volatility.',
      icon: <SlidersHorizontal className="w-5 h-5 text-amber-600" />,
      tab: 'whatif',
      metric: 'Real-time 100% Allocation Validation',
    },
    {
      step: '05',
      title: 'DISCOVER',
      subtitle: 'Institutional Alternative Education',
      description:
        'Explore REITs, InvITs, and Sovereign/Corporate Debt with visual structuring diagrams, Indian taxation rules, and yield analysis.',
      icon: <Compass className="w-5 h-5 text-emerald-600" />,
      tab: 'discovery',
      metric: 'Complete SEBI-Regulated Guide',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-1 ring-teal-700/20">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Nivesh<span className="text-teal-600">IQ</span>
              </span>
              <span className="ml-2 text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 px-2 py-0.5 rounded-full">
                PS2 Hackathon Prototype
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEnterDemo('overview')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-card transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Explore Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-18 lg:pb-24 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/90 text-xs font-semibold mb-6 shadow-subtle animate-subtle-pulse">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Problem Statement 2 • Unified Investment Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Your investments, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
              finally in one place.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Unify fragmented portfolios across multiple brokers and depositories. Understand true sector exposure, detect cross-account overlaps, simulate what-if allocations, and discover high-yield REITs & InvITs.
          </p>

          {/* Key 3-Step Narrative */}
          <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-700 flex-wrap">
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm text-rose-700 font-mono">
              FRAGMENTED
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm text-teal-700 font-mono">
              UNIFIED
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm text-emerald-700 font-mono">
              UNDERSTOOD
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={() => handleEnterDemo('overview')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-card hover:shadow-elevated transition-all flex items-center gap-2 group"
            >
              <span>Launch Unified Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => handleEnterDemo('xray')}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold shadow-subtle transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-sky-600" />
              <span>View Portfolio X-Ray</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Unified Portfolio</span>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {formatINR(summary.totalCurrentValue, false)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">+12.37% Return</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Connected Sources</span>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                3 Accounts
              </p>
              <span className="text-[11px] text-slate-500">Zerodha, Groww, CDSL</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Overlapping Holdings</span>
              <p className="text-lg font-bold text-amber-600 font-mono mt-0.5">
                {summary.overlapCount} Securities
              </p>
              <span className="text-[11px] text-slate-500 font-mono">{formatINRLakhs(summary.overlapCapital)} capital</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Asset Classes</span>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                5 Classes
              </p>
              <span className="text-[11px] text-slate-500">Equity, REIT, InvIT, Bond, ETF</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Feature Pillars */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="teal" size="sm" className="mb-3">
            System Capabilities
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Five Pillars of Investment Intelligence
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Click any pillar to directly interact with that live module in the prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featurePillars.map((p) => (
            <div
              key={p.step}
              onClick={() => handleEnterDemo(p.tab)}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:bg-teal-50 group-hover:border-teal-200 transition-colors">
                    {p.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {p.step}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {p.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">
                    {p.subtitle}
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                  {p.metric}
                </span>
                <span className="text-xs font-semibold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison: Fragmented Reality vs NiveshIQ */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Why Investors Need Unified Intelligence
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Traditional multi-app investing creates blind spots that cost money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Fragmented */}
            <div className="bg-rose-50/40 rounded-2xl border border-rose-200/80 p-6">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>The Fragmented Reality</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Unaware of duplicate stocks (e.g. holding Reliance in Zerodha & Groww).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Confusing equity-only sector weights with whole-portfolio asset risk.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Zero visibility into alternative cash-flow assets like REITs and InvITs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Manual spreadsheet updates that quickly become obsolete.</span>
                </li>
              </ul>
            </div>

            {/* NiveshIQ */}
            <div className="bg-teal-50/40 rounded-2xl border border-teal-200/80 p-6">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>With NiveshIQ Intelligence</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Normalized ISIN consolidation across brokers with account-level drilling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Portfolio X-Ray calculating precise HHI risk and dual-denominator sectors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Grounded AI assistant answering "What do I actually own?" with zero fluff.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Interactive What-If simulator validating 100% allocation rebalancing.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-100 text-slate-500 text-xs border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">NiveshIQ</span>
            <span>• FinTech Intelligence Prototype</span>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Educational demo for PS2 Hackathon • Synthetic Indian INR Data • All rights reserved.
          </p>
          <button
            onClick={() => handleEnterDemo('overview')}
            className="text-teal-700 hover:text-teal-800 font-semibold"
          >
            Launch Prototype →
          </button>
        </div>
      </footer>
    </div>
  );
};

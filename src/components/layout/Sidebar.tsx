import React from 'react';
import { usePortfolio, TabType } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Sparkles,
  SlidersHorizontal,
  Compass,
  Link2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Info,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  setMobileOpen,
}) => {
  const {
    activeTab,
    setActiveTab,
    startSyncSequence,
    isSyncing,
    summary,
    accounts,
  } = usePortfolio();

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'portfolio',
      label: 'Unified Portfolio',
      icon: <Layers className="w-4 h-4" />,
      badge: `${summary.uniqueHoldingsCount}`,
    },
    {
      id: 'xray',
      label: 'Portfolio X-Ray',
      icon: <Activity className="w-4 h-4" />,
      badge: summary.overlapCount > 0 ? `${summary.overlapCount} overlaps` : undefined,
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      icon: <Sparkles className="w-4 h-4 text-teal-600" />,
      badge: 'Grounded',
    },
    {
      id: 'whatif',
      label: 'What-If Lab',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
    {
      id: 'discovery',
      label: 'Explore Real Assets',
      icon: <Compass className="w-4 h-4" />,
      badge: 'REITs & Bonds',
    },
    {
      id: 'accounts',
      label: 'Connected Sources',
      icon: <Link2 className="w-4 h-4" />,
      badge: `${accounts.length}`,
    },
  ];

  const handleSelectTab = (id: TabType) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-1 ring-teal-700/20">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Nivesh<span className="text-teal-600">IQ</span>
              </span>
              <span className="text-[10px] font-semibold uppercase bg-teal-50 text-teal-700 border border-teal-200/80 px-1.5 py-0.5 rounded-md">
                PS2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Unified Wealth Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Platform
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-50/90 text-teal-900 border border-teal-200/80 shadow-subtle'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : item.badge.includes('overlap')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sync & Status Box */}
      <div className="p-3 space-y-3 border-t border-slate-100">
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Sync Engine
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              3 Sources Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Zerodha, Groww & CDSL Demat synced via mock adapters.
          </p>

          <button
            onClick={startSyncSequence}
            disabled={isSyncing}
            className="mt-2.5 w-full py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className={`w-3 h-3 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing...' : 'Run Pipeline Sync'}
          </button>
        </div>

        {/* Demo Disclaimer notice */}
        <div className="px-2 text-center">
          <p className="text-[10px] text-slate-400 font-normal leading-tight">
            NiveshIQ Demo Prototype • Synthetic Indian Portfolio Data (INR)
          </p>
        </div>
      </div>
    </aside>
  );
};

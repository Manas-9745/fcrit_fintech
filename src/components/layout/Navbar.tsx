import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Badge } from '../ui/Badge';
import {
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldAlert,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    accounts,
    activeAccountIds,
    toggleAccountFilter,
    selectAllAccounts,
    summary,
    startSyncSequence,
    isSyncing,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    setIsLandingPage,
    resetToDemoData,
  } = usePortfolio();

  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Portfolio Overview',
      subtitle: 'Unified view across Zerodha Kite, Groww & CDSL Demat',
    },
    portfolio: {
      title: 'Unified Holdings',
      subtitle: 'Consolidated security holdings aggregated by canonical ISIN',
    },
    xray: {
      title: 'Portfolio X-Ray & Analytics',
      subtitle: 'Deep-dive sector concentration, cross-broker overlaps & HHI risk',
    },
    ai: {
      title: 'AI Portfolio Assistant',
      subtitle: 'Grounded conversational intelligence backed by real calculations',
    },
    whatif: {
      title: 'What-If Allocation Lab',
      subtitle: 'Simulate hypothetical asset class weight rebalancing & projected yields',
    },
    discovery: {
      title: 'Investment Discovery & Education',
      subtitle: 'Institutional guide to REITs, InvITs, and Sovereign/Corporate Debt',
    },
    accounts: {
      title: 'Connected Accounts & Sync',
      subtitle: 'Manage multi-broker integrations, demat holdings, and sync pipelines',
    },
  };

  const currentMeta = tabTitles[activeTab] || {
    title: 'NiveshIQ',
    subtitle: 'Investment Intelligence Platform',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Page Title & Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {currentMeta.title}
            </h1>
            <Badge variant="teal" size="sm" className="hidden sm:inline-flex">
              <Database className="w-3 h-3 text-teal-600" />
              Demo Environment
            </Badge>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5 hidden md:block">
            {currentMeta.subtitle}
          </p>
        </div>

        {/* Center: Multi-Account Filter Pills */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={selectAllAccounts}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              activeAccountIds.length === accounts.length
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Accounts ({accounts.length})
          </button>
          {accounts.map((acc) => {
            const isSelected = activeAccountIds.includes(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => toggleAccountFilter(acc.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: acc.avatarColor }}
                />
                {acc.name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sync Button */}
          <button
            onClick={startSyncSequence}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100/80 border border-teal-200/80 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Sync all connected broker accounts"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-teal-600' : ''}`}
            />
            <span className="hidden sm:inline">
              {isSyncing ? 'Syncing...' : 'Sync Sources'}
            </span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifPopover(!showNotifPopover);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifPopover && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200/90 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">
                    System Alerts & Logs ({notifications.length})
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3 ${
                          !n.read ? 'bg-teal-50/20' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Info className="w-4 h-4 text-sky-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Demo Controls */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifPopover(false);
              }}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/70"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                NI
              </div>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  Manas Parekar
                </p>
                <p className="text-[10px] text-slate-400">Pro Investor</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">NiveshIQ Demo Session</p>
                  <p className="text-slate-400 text-[11px]">PS2 FinTech Prototype</p>
                </div>
                <button
                  onClick={() => {
                    setIsLandingPage(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  View Landing Page
                </button>
                <button
                  onClick={() => {
                    resetToDemoData();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-amber-600 flex items-center gap-2 border-t border-slate-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Demo Portfolio Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

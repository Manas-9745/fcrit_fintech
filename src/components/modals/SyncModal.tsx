import React from 'react';
import { usePortfolio, SyncStep } from '../../context/PortfolioContext';
import { Modal } from '../ui/Modal';
import {
  CheckCircle2,
  RefreshCw,
  Server,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const SyncModal: React.FC = () => {
  const {
    showSyncModal,
    setShowSyncModal,
    isSyncing,
    syncStep,
    syncProgress,
    syncStepMessage,
    startSyncSequence,
    summary,
  } = usePortfolio();

  const steps: { key: SyncStep; label: string; icon: React.ReactNode }[] = [
    {
      key: 'CONNECT',
      label: 'Connect Adapters',
      icon: <Server className="w-4 h-4" />,
    },
    {
      key: 'SYNC',
      label: 'Pull Raw Positions',
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      key: 'NORMALIZE',
      label: 'Normalize ISINs',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      key: 'MERGE',
      label: 'Consolidate Holdings',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      key: 'ANALYZE',
      label: 'Risk & X-Ray Analysis',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const getStepStatus = (stepKey: SyncStep) => {
    const order: SyncStep[] = ['CONNECT', 'SYNC', 'NORMALIZE', 'MERGE', 'ANALYZE', 'COMPLETE'];
    const currentIndex = order.indexOf(syncStep);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex || syncStep === 'COMPLETE') return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <Modal
      isOpen={showSyncModal}
      onClose={() => setShowSyncModal(false)}
      title="Synchronize Investment Sources"
      subtitle="Deterministic multi-account normalization & ISIN consolidation pipeline"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Pipeline Execution Progress</span>
            <span className="font-mono text-teal-600">{syncProgress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        </div>

        {/* 5-Step Pipeline visual */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {steps.map((s) => {
            const status = getStepStatus(s.key);
            return (
              <div
                key={s.key}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  status === 'completed'
                    ? 'bg-teal-50/80 border-teal-200 text-teal-900'
                    : status === 'active'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900 shadow-sm ring-2 ring-teal-500/20'
                    : 'bg-slate-50/50 border-slate-200/60 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    status === 'completed'
                      ? 'bg-teal-600 text-white'
                      : status === 'active'
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    s.icon
                  )}
                </div>
                <span className="text-[10px] font-semibold leading-tight">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live log message */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 font-mono text-xs border border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            Active Stage: {syncStep}
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            &gt; {syncStepMessage || 'Pipeline ready.'}
          </p>
        </div>

        {/* Summary on complete */}
        {syncStep === 'COMPLETE' && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Synchronization Successful
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Aggregated {summary.totalHoldingsCount} position records across 3 connected accounts into{' '}
                <span className="font-semibold">{summary.uniqueHoldingsCount} unified ISIN securities</span> with {summary.overlapCount} detected multi-broker overlaps.
              </p>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          {syncStep === 'COMPLETE' ? (
            <button
              onClick={() => setShowSyncModal(false)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Done & View Portfolio
            </button>
          ) : (
            <button
              onClick={startSyncSequence}
              disabled={isSyncing}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Running Sync...' : 'Restart Sync'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

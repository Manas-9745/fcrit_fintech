import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  BrokerAccount,
  RawPosition,
} from '../../types';
import {
  formatINR,
  formatINRLakhs,
  formatPercent,
} from '../../services/portfolioEngine';
import {
  Link2,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Layers,
  Building,
  Lock,
  RotateCcw,
} from 'lucide-react';

export const ConnectedAccountsTab: React.FC = () => {
  const {
    accounts,
    positions,
    startSyncSequence,
    isSyncing,
    addAccount,
    disconnectAccount,
    resetToDemoData,
  } = usePortfolio();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrokerName, setNewBrokerName] = useState('Upstox Pro');
  const [newBrokerCode, setNewBrokerCode] = useState<'UPSTOX' | 'ICICI_DIRECT'>('UPSTOX');
  const [newAccountNum, setNewAccountNum] = useState('UP-772910');

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({
      name: newBrokerName,
      brokerCode: newBrokerCode,
      type: 'BROKER',
      accountNumber: newAccountNum,
      avatarColor: newBrokerCode === 'UPSTOX' ? '#6366F1' : '#EA580C',
      notes: 'User-connected simulated brokerage account',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Connected Investment Sources
            </h2>
            <Badge variant="teal" size="sm">
              {accounts.length} Active Sources
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated broker adapters and central depository accounts with automatic ISIN normalization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect New Broker</span>
          </button>

          <button
            onClick={startSyncSequence}
            disabled={isSyncing}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync All Sources'}</span>
          </button>

          <button
            onClick={resetToDemoData}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const accPositions = positions.filter((p) => p.accountId === acc.id);
          const totalVal = accPositions.reduce((s, p) => s + p.currentValue, 0);
          const investedVal = accPositions.reduce((s, p) => s + p.investedValue, 0);
          const pnl = totalVal - investedVal;
          const pnlPercent = investedVal > 0 ? (pnl / investedVal) * 100 : 0;

          return (
            <Card
              key={acc.id}
              padding="none"
              className="overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: acc.avatarColor }}
                    >
                      {acc.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">
                          {acc.name}
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {acc.accountNumber} • {acc.type}
                      </span>
                    </div>
                  </div>

                  <Badge variant="emerald" size="sm">
                    Active Sync
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      Valuation
                    </span>
                    <p className="text-base font-bold text-slate-900 font-mono">
                      {formatINR(totalVal)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      Unrealized Gain
                    </span>
                    <p
                      className={`text-xs font-bold font-mono mt-0.5 ${
                        pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {pnl >= 0 ? '+' : ''}
                      {formatINR(pnl)} ({formatPercent(pnlPercent)})
                    </p>
                  </div>
                </div>
              </div>

              {/* Positions Preview */}
              <div className="p-5 space-y-2 flex-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                  <span>Holdings in Account ({accPositions.length})</span>
                  <span>Share of Total</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {accPositions.map((pos) => (
                    <div
                      key={pos.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-slate-800 block truncate">
                          {pos.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pos.quantity} shares @ {formatINR(pos.avgPrice)}
                        </span>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-900 flex-shrink-0">
                        {formatINR(pos.currentValue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Last Synced:{' '}
                  {new Date(acc.lastSynced).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                {accounts.length > 1 && (
                  <button
                    onClick={() => disconnectAccount(acc.id)}
                    className="text-rose-600 hover:text-rose-700 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Disconnect
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Account Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Connect Simulated Broker Account"
        subtitle="Simulate an encrypted read-only brokerage connection"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Broker / Platform
            </label>
            <select
              value={newBrokerCode}
              onChange={(e) => {
                const code = e.target.value as any;
                setNewBrokerCode(code);
                setNewBrokerName(code === 'UPSTOX' ? 'Upstox Pro' : 'ICICI Direct');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              <option value="UPSTOX">Upstox Pro (Direct Equities)</option>
              <option value="ICICI_DIRECT">ICICI Direct (3-in-1 Account)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Account Identifier (Mock)
            </label>
            <input
              type="text"
              value={newAccountNum}
              onChange={(e) => setNewAccountNum(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono"
            />
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200/80 text-xs text-teal-800 flex items-start gap-2">
            <Lock className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Security Protocol: Zero credentials stored. Mock OAuth token simulated locally with read-only holding permissions.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Connect & Verify
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

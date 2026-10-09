import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AssetType, ConsolidatedHolding } from '../../types';
import {
  formatINR,
  formatPercent,
  ASSET_COLORS,
} from '../../services/portfolioEngine';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Building,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const PortfolioTab: React.FC = () => {
  const {
    consolidatedHoldings,
    summary,
    accounts,
    setActiveTab,
    sendAIMessage,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>('ALL');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('ALL');
  const [expandedIsins, setExpandedIsins] = useState<Set<string>>(
    new Set(['INE002A01018']) // default expand Reliance to showcase multi-account consolidation
  );
  const [sortField, setSortField] = useState<keyof ConsolidatedHolding>('totalCurrentValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleExpand = (isin: string) => {
    setExpandedIsins((prev) => {
      const next = new Set(prev);
      if (next.has(isin)) next.delete(isin);
      else next.add(isin);
      return next;
    });
  };

  const handleSort = (field: keyof ConsolidatedHolding) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHoldings = useMemo(() => {
    return consolidatedHoldings.filter((h) => {
      // Search filter
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.isin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.sector.toLowerCase().includes(searchQuery.toLowerCase());

      // Asset Type filter
      const matchesAsset =
        selectedAssetFilter === 'ALL' || h.assetType === selectedAssetFilter;

      // Account filter
      const matchesAccount =
        selectedAccountFilter === 'ALL' ||
        h.accounts.some((a) => a.accountId === selectedAccountFilter);

      return matchesSearch && matchesAsset && matchesAccount;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [
    consolidatedHoldings,
    searchQuery,
    selectedAssetFilter,
    selectedAccountFilter,
    sortField,
    sortDirection,
  ]);

  // Export CSV mock
  const handleExportCSV = () => {
    const headers = 'ISIN,Symbol,Name,AssetType,Sector,Quantity,AvgPrice,CurrentPrice,InvestedValue,CurrentValue,PnL\n';
    const rows = filteredHoldings
      .map(
        (h) =>
          `"${h.isin}","${h.symbol}","${h.name}","${h.assetType}","${h.sector}",${h.totalQuantity},${h.weightedAvgPrice.toFixed(2)},${h.currentPrice.toFixed(2)},${h.totalInvestedValue.toFixed(2)},${h.totalCurrentValue.toFixed(2)},${h.totalPnL.toFixed(2)}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NiveshIQ_Unified_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by security name, ticker symbol, or ISIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Asset Type Filter Dropdown/Pills */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
            {['ALL', 'EQUITY', 'REIT', 'INVIT', 'BOND', 'ETF'].map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAssetFilter(asset)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedAssetFilter === asset
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {asset === 'ALL' ? 'All Classes' : asset}
              </button>
            ))}
          </div>

          {/* Account Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedAccountFilter}
              onChange={(e) => setSelectedAccountFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer shadow-sm"
            >
              <option value="ALL">All Sources ({accounts.length})</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Unified Holdings Table */}
      <Card
        padding="none"
        title={
          <div className="flex items-center gap-2 px-5 pt-4">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Consolidated Security Holdings</span>
            <Badge variant="teal" size="sm">
              {filteredHoldings.length} Securities
            </Badge>
          </div>
        }
        subtitle={
          <span className="px-5 text-slate-400">
            Holdings appearing across multiple accounts are normalized by ISIN and expandable to inspect broker-level positions.
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-8"></th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Security / ISIN
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Asset Type</th>
                <th className="py-3 px-3">Sector</th>
                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('totalQuantity')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Total Qty
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Avg Price</th>
                <th className="py-3 px-3 text-right">CMP</th>
                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('totalInvestedValue')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Invested
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('totalCurrentValue')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Current Value
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('totalPnL')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Overall P&L
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No securities match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((h) => {
                  const isExpanded = expandedIsins.has(h.isin);
                  const isOverlapping = h.isOverlapping;

                  return (
                    <React.Fragment key={h.isin}>
                      {/* Main Consolidated Row */}
                      <tr
                        onClick={() => toggleExpand(h.isin)}
                        className={`table-row-hover cursor-pointer transition-colors ${
                          isExpanded ? 'bg-slate-50/60' : ''
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-1 text-center">
                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-teal-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {h.name}
                            </span>
                            {isOverlapping && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold"
                                title={`Appears in ${h.accountCount} connected accounts`}
                              >
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                {h.accountCount} Accounts
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                            <span className="font-semibold text-slate-600">
                              {h.symbol}
                            </span>
                            <span>•</span>
                            <span>{h.isin}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <Badge
                            variant={
                              h.assetType === 'EQUITY'
                                ? 'teal'
                                : h.assetType === 'BOND'
                                ? 'emerald'
                                : h.assetType === 'REIT'
                                ? 'sky'
                                : h.assetType === 'INVIT'
                                ? 'purple'
                                : 'amber'
                            }
                            size="sm"
                          >
                            {h.assetType}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                          {h.sector}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800">
                          {h.totalQuantity}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                          {formatINR(h.weightedAvgPrice)}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-900">
                          {formatINR(h.currentPrice)}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                          {formatINR(h.totalInvestedValue)}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatINR(h.totalCurrentValue)}
                          <span className="block text-[10px] font-normal text-slate-400">
                            {h.portfolioWeight.toFixed(1)}% of total
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`font-mono font-bold text-xs ${
                              h.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {h.totalPnL >= 0 ? '+' : ''}
                            {formatINR(h.totalPnL)}
                          </span>
                          <span
                            className={`block text-[10px] font-mono font-semibold ${
                              h.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {formatPercent(h.totalPnLPercent)}
                          </span>
                        </td>
                      </tr>

                      {/* Expandable Multi-Account Breakdown Sub-Rows */}
                      {isExpanded && (
                        <tr className="bg-teal-50/20 border-y border-teal-100">
                          <td colSpan={10} className="py-3 px-6 sm:px-8">
                            <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-subtle">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <Building className="w-3.5 h-3.5 text-teal-600" />
                                  Underlying Account Distribution ({h.accounts.length} source{h.accounts.length > 1 ? 's' : ''})
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  ISIN: {h.isin}
                                </span>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px]">
                                  <thead>
                                    <tr className="text-slate-400 border-b border-slate-100 font-medium">
                                      <th className="pb-1.5">Broker / Source</th>
                                      <th className="pb-1.5 text-right">Quantity</th>
                                      <th className="pb-1.5 text-right">Avg Buy Price</th>
                                      <th className="pb-1.5 text-right">Invested Value</th>
                                      <th className="pb-1.5 text-right">Current Value</th>
                                      <th className="pb-1.5 text-right">Unrealized P&L</th>
                                      <th className="pb-1.5 text-right">Weight in Account</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {h.accounts.map((acc) => (
                                      <tr key={acc.accountId} className="hover:bg-slate-50">
                                        <td className="py-2 font-semibold text-slate-800 flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                                          {acc.accountName}
                                        </td>
                                        <td className="py-2 text-right font-mono text-slate-700">
                                          {acc.quantity} units
                                        </td>
                                        <td className="py-2 text-right font-mono text-slate-600">
                                          {formatINR(acc.avgPrice)}
                                        </td>
                                        <td className="py-2 text-right font-mono text-slate-600">
                                          {formatINR(acc.investedValue)}
                                        </td>
                                        <td className="py-2 text-right font-mono font-bold text-slate-900">
                                          {formatINR(acc.currentValue)}
                                        </td>
                                        <td className="py-2 text-right font-mono">
                                          <span
                                            className={
                                              acc.unrealizedPnL >= 0
                                                ? 'text-emerald-600 font-semibold'
                                                : 'text-rose-600 font-semibold'
                                            }
                                          >
                                            {acc.unrealizedPnL >= 0 ? '+' : ''}
                                            {formatINR(acc.unrealizedPnL)} ({formatPercent(acc.unrealizedPnLPercent)})
                                          </span>
                                        </td>
                                        <td className="py-2 text-right font-mono text-slate-500">
                                          {acc.weightInAccount.toFixed(1)}%
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with exact sums matching summary */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-bold text-slate-900">{filteredHoldings.length}</span> of{' '}
              <span className="font-bold text-slate-900">{consolidatedHoldings.length}</span> consolidated securities
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono font-semibold text-slate-800">
            <div>
              <span className="text-slate-400 font-normal text-[11px] mr-1.5">Total Invested:</span>
              <span>{formatINR(summary.totalInvestedValue)}</span>
            </div>
            <div>
              <span className="text-slate-400 font-normal text-[11px] mr-1.5">Total Valuation:</span>
              <span className="text-teal-700 font-bold">{formatINR(summary.totalCurrentValue)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

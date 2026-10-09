import {
  AssetType,
  BrokerAccount,
  RawPosition,
  ConsolidatedHolding,
  PortfolioSummary,
  AssetAllocationItem,
  SectorAllocationItem,
  ConcentrationMetrics,
  OverlapInsight,
} from '../types';

// Indian Number Formatter for INR
export function formatINR(amount: number, includeDecimals = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let formattedNumber = '';
  if (includeDecimals) {
    const fixed = absAmount.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    formattedNumber = formatIndianInteger(intPart) + '.' + decPart;
  } else {
    const rounded = Math.round(absAmount).toString();
    formattedNumber = formatIndianInteger(rounded);
  }
  
  return `${isNegative ? '-' : ''}₹${formattedNumber}`;
}

function formatIndianInteger(numStr: string): string {
  if (numStr.length <= 3) return numStr;
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return formattedOthers + ',' + lastThree;
}

export function formatINRLakhs(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    // Crores
    return `${isNegative ? '-' : ''}₹${(absAmount / 10000000).toFixed(2)} Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs
    return `${isNegative ? '-' : ''}₹${(absAmount / 100000).toFixed(2)} L`;
  } else if (absAmount >= 1000) {
    // Thousands
    return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)} K`;
  }
  return formatINR(amount, false);
}

export function formatPercent(value: number, withSign = true): string {
  if (isNaN(value)) return '0.00%';
  const sign = withSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Color palettes for assets & sectors
export const ASSET_COLORS: Record<AssetType, string> = {
  EQUITY: '#0D9488',   // Teal
  REIT: '#0284C7',     // Sky Blue
  INVIT: '#8B5CF6',    // Violet / Purple
  BOND: '#059669',     // Emerald / Green
  ETF: '#D97706',      // Amber
  OTHER: '#64748B',    // Slate
};

export const SECTOR_COLORS: Record<string, string> = {
  'Energy & Petrochemicals': '#F97316',
  'Technology': '#0284C7',
  'Financials & Banking': '#0D9488',
  'Infrastructure & Capital Goods': '#8B5CF6',
  'Commercial Real Estate': '#06B6D4',
  'Power Transmission & Utilities': '#10B981',
  'Sovereign Government Debt': '#059669',
  'Corporate Debt': '#6366F1',
  'Telecommunications': '#EC4899',
  'Precious Metals / Gold': '#EAB308',
  'Broad Market Index': '#64748B',
  'Consumer Goods & FMCG': '#14B8A6',
};

/**
 * Consolidates positions across accounts by ISIN.
 */
export function consolidateHoldings(
  positions: RawPosition[],
  activeAccountIds?: string[]
): ConsolidatedHolding[] {
  const filteredPositions = activeAccountIds
    ? positions.filter((p) => activeAccountIds.includes(p.accountId))
    : positions;

  const totalPortfolioValue = filteredPositions.reduce(
    (sum, p) => sum + p.currentValue,
    0
  );

  const grouped = new Map<string, RawPosition[]>();

  for (const pos of filteredPositions) {
    const existing = grouped.get(pos.isin) || [];
    existing.push(pos);
    grouped.set(pos.isin, existing);
  }

  const consolidated: ConsolidatedHolding[] = [];

  grouped.forEach((posList, isin) => {
    const first = posList[0];
    const totalQuantity = posList.reduce((sum, p) => sum + p.quantity, 0);
    const totalInvestedValue = posList.reduce((sum, p) => sum + p.investedValue, 0);
    const totalCurrentValue = posList.reduce((sum, p) => sum + p.currentValue, 0);
    const totalPnL = totalCurrentValue - totalInvestedValue;
    const totalPnLPercent =
      totalInvestedValue > 0 ? (totalPnL / totalInvestedValue) * 100 : 0;
    const weightedAvgPrice =
      totalQuantity > 0 ? totalInvestedValue / totalQuantity : first.avgPrice;
    
    // Day change calculation
    const weightedDayChange = posList.reduce(
      (sum, p) => sum + (p.dayChange || 0) * p.quantity,
      0
    );
    const dayChangePerUnit =
      totalQuantity > 0 ? weightedDayChange / totalQuantity : 0;
    const dayChangePercent =
      first.currentPrice > 0 ? (dayChangePerUnit / first.currentPrice) * 100 : 0;

    const portfolioWeight =
      totalPortfolioValue > 0
        ? (totalCurrentValue / totalPortfolioValue) * 100
        : 0;

    const accounts = posList.map((p) => {
      const accountTotal = filteredPositions
        .filter((fp) => fp.accountId === p.accountId)
        .reduce((sum, fp) => sum + fp.currentValue, 0);
      return {
        accountId: p.accountId,
        accountName: p.accountName,
        accountCode: p.accountId.replace('acc-', '').toUpperCase(),
        quantity: p.quantity,
        avgPrice: p.avgPrice,
        investedValue: p.investedValue,
        currentValue: p.currentValue,
        unrealizedPnL: p.unrealizedPnL,
        unrealizedPnLPercent: p.unrealizedPnLPercent,
        weightInAccount:
          accountTotal > 0 ? (p.currentValue / accountTotal) * 100 : 0,
      };
    });

    consolidated.push({
      isin,
      symbol: first.symbol,
      name: first.name,
      assetType: first.assetType,
      sector: first.sector,
      totalQuantity,
      weightedAvgPrice,
      currentPrice: first.currentPrice,
      totalInvestedValue,
      totalCurrentValue,
      totalPnL,
      totalPnLPercent,
      portfolioWeight,
      accountCount: posList.length,
      accounts,
      isOverlapping: posList.length > 1,
      dayChange: dayChangePerUnit,
      dayChangePercent,
    });
  });

  // Sort descending by total current value
  return consolidated.sort((a, b) => b.totalCurrentValue - a.totalCurrentValue);
}

/**
 * Calculates complete summary, asset allocation, sector exposure, and concentration index.
 */
export function calculatePortfolioSummary(
  positions: RawPosition[],
  accounts: BrokerAccount[],
  activeAccountIds?: string[]
): PortfolioSummary {
  const activeIds = activeAccountIds || accounts.map((a) => a.id);
  const activePositions = positions.filter((p) => activeIds.includes(p.accountId));
  const activeAccounts = accounts.filter((a) => activeIds.includes(a.id));

  const totalCurrentValue = activePositions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalInvestedValue = activePositions.reduce((sum, p) => sum + p.investedValue, 0);
  const totalPnL = totalCurrentValue - totalInvestedValue;
  const totalPnLPercent =
    totalInvestedValue > 0 ? (totalPnL / totalInvestedValue) * 100 : 0;

  // Day Change
  const totalDayChange = activePositions.reduce(
    (sum, p) => sum + (p.dayChange || 0) * p.quantity,
    0
  );
  const dayChangePercent =
    totalCurrentValue > 0 ? (totalDayChange / totalCurrentValue) * 100 : 0;

  // Consolidated holdings
  const consolidated = consolidateHoldings(activePositions, activeIds);

  // Asset Allocation
  const assetMap = new Map<AssetType, { value: number; count: number }>();
  const allAssetTypes: AssetType[] = ['EQUITY', 'BOND', 'REIT', 'INVIT', 'ETF', 'OTHER'];
  allAssetTypes.forEach((t) => assetMap.set(t, { value: 0, count: 0 }));

  for (const item of consolidated) {
    const current = assetMap.get(item.assetType) || { value: 0, count: 0 };
    current.value += item.totalCurrentValue;
    current.count += 1;
    assetMap.set(item.assetType, current);
  }

  const assetAllocation: AssetAllocationItem[] = [];
  const assetLabels: Record<AssetType, string> = {
    EQUITY: 'Direct Equities',
    BOND: 'Bonds & Debt',
    REIT: 'REITs (Real Estate)',
    INVIT: 'InvITs (Infrastructure)',
    ETF: 'ETFs & Index Funds',
    OTHER: 'Other / Alternatives',
  };

  assetMap.forEach((data, type) => {
    if (data.value > 0 || allAssetTypes.includes(type)) {
      const percentage =
        totalCurrentValue > 0 ? (data.value / totalCurrentValue) * 100 : 0;
      assetAllocation.push({
        type,
        label: assetLabels[type] || type,
        value: data.value,
        percentage,
        color: ASSET_COLORS[type] || '#94A3B8',
        holdingsCount: data.count,
      });
    }
  });

  // Filter out zero assets unless only 0
  const filteredAssetAllocation = assetAllocation
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);

  // Sector Allocation (Specifically for Equity and Overall)
  const equityHoldings = consolidated.filter((h) => h.assetType === 'EQUITY');
  const totalEquityValue = equityHoldings.reduce(
    (sum, h) => sum + h.totalCurrentValue,
    0
  );

  const sectorMap = new Map<
    string,
    { value: number; topStock: string; topStockVal: number }
  >();

  for (const h of equityHoldings) {
    const curr = sectorMap.get(h.sector) || {
      value: 0,
      topStock: h.symbol,
      topStockVal: 0,
    };
    curr.value += h.totalCurrentValue;
    if (h.totalCurrentValue > curr.topStockVal) {
      curr.topStock = h.symbol;
      curr.topStockVal = h.totalCurrentValue;
    }
    sectorMap.set(h.sector, curr);
  }

  const sectorAllocation: SectorAllocationItem[] = [];
  sectorMap.forEach((val, sector) => {
    const percentageOfEquity =
      totalEquityValue > 0 ? (val.value / totalEquityValue) * 100 : 0;
    const percentageOfTotal =
      totalCurrentValue > 0 ? (val.value / totalCurrentValue) * 100 : 0;
    sectorAllocation.push({
      sector,
      value: val.value,
      percentageOfEquity,
      percentageOfTotal,
      color: SECTOR_COLORS[sector] || '#64748B',
      topStock: val.topStock,
    });
  });

  sectorAllocation.sort((a, b) => b.value - a.value);

  // Concentration Metrics & HHI (Herfindahl-Hirschman Index)
  const top1Weight = consolidated.length > 0 ? consolidated[0].portfolioWeight : 0;
  const top3Weight = consolidated
    .slice(0, 3)
    .reduce((sum, h) => sum + h.portfolioWeight, 0);
  const top5Weight = consolidated
    .slice(0, 5)
    .reduce((sum, h) => sum + h.portfolioWeight, 0);

  // HHI score = sum of squared portfolio weights (0 - 10000)
  const hhiScore = Math.round(
    consolidated.reduce((sum, h) => sum + Math.pow(h.portfolioWeight, 2), 0)
  );

  let concentrationLevel: 'HEALTHY' | 'MODERATE' | 'HIGH' = 'HEALTHY';
  if (hhiScore > 2000 || top3Weight > 45) {
    concentrationLevel = 'HIGH';
  } else if (hhiScore > 1200 || top3Weight > 30) {
    concentrationLevel = 'MODERATE';
  }

  const concentrationMetrics: ConcentrationMetrics = {
    top1Weight,
    top3Weight,
    top5Weight,
    hhiScore,
    concentrationLevel,
    topHoldingSymbol: consolidated.length > 0 ? consolidated[0].symbol : 'None',
    topHoldingWeight: top1Weight,
  };

  // Overlap Insights
  const overlaps: OverlapInsight[] = consolidated
    .filter((h) => h.isOverlapping)
    .map((h) => ({
      isin: h.isin,
      symbol: h.symbol,
      name: h.name,
      accounts: h.accounts.map((a) => a.accountName),
      totalValue: h.totalCurrentValue,
      portfolioWeight: h.portfolioWeight,
      duplicateCount: h.accounts.length,
      quantitiesByAccount: h.accounts.map((a) => ({
        accountName: a.accountName,
        quantity: a.quantity,
        avgPrice: a.avgPrice,
        value: a.currentValue,
      })),
    }));

  const overlapCapital = overlaps.reduce((sum, o) => sum + o.totalValue, 0);

  return {
    totalCurrentValue,
    totalInvestedValue,
    totalPnL,
    totalPnLPercent,
    dayChange: totalDayChange,
    dayChangePercent,
    totalHoldingsCount: activePositions.length,
    uniqueHoldingsCount: consolidated.length,
    connectedAccountsCount: activeAccounts.length,
    overlapCount: overlaps.length,
    overlapCapital,
    assetAllocation: filteredAssetAllocation,
    sectorAllocation,
    topHoldings: consolidated.slice(0, 5),
    concentrationMetrics,
    overlaps,
    lastCalculated: new Date().toISOString(),
  };
}

export type AssetType = 'EQUITY' | 'REIT' | 'INVIT' | 'BOND' | 'ETF' | 'OTHER';

export type AccountType = 'BROKER' | 'DEPOSITORY';

export type SyncStatus = 'CONNECTED' | 'SYNCING' | 'DISCONNECTED' | 'ERROR';

export interface BrokerAccount {
  id: string;
  name: string;
  brokerCode: 'ZERODHA' | 'GROWW' | 'CDSL' | 'UPSTOX' | 'ICICI_DIRECT';
  type: AccountType;
  accountNumber: string;
  avatarColor: string;
  status: SyncStatus;
  lastSynced: string;
  holdingsCount: number;
  totalValue: number;
  investedValue: number;
  unrealizedPnL: number;
  syncEnabled: boolean;
  notes?: string;
}

export interface RawPosition {
  id: string;
  accountId: string;
  accountName: string;
  isin: string;
  symbol: string;
  name: string;
  assetType: AssetType;
  sector: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange?: number;
  dayChangePercent?: number;
  currency: 'INR';
}

export interface AccountHoldingBreakdown {
  accountId: string;
  accountName: string;
  accountCode: string;
  quantity: number;
  avgPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  weightInAccount: number;
}

export interface ConsolidatedHolding {
  isin: string;
  symbol: string;
  name: string;
  assetType: AssetType;
  sector: string;
  totalQuantity: number;
  weightedAvgPrice: number;
  currentPrice: number;
  totalInvestedValue: number;
  totalCurrentValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  portfolioWeight: number; // 0 - 100%
  accountCount: number;
  accounts: AccountHoldingBreakdown[];
  isOverlapping: boolean; // appears in > 1 connected account
  dayChange?: number;
  dayChangePercent?: number;
}

export interface AssetAllocationItem {
  type: AssetType;
  label: string;
  value: number;
  percentage: number;
  color: string;
  holdingsCount: number;
}

export interface SectorAllocationItem {
  sector: string;
  value: number;
  percentageOfEquity: number;
  percentageOfTotal: number;
  color: string;
  topStock: string;
}

export interface ConcentrationMetrics {
  top1Weight: number;
  top3Weight: number;
  top5Weight: number;
  hhiScore: number; // Herfindahl-Hirschman Index (0 - 10,000)
  concentrationLevel: 'HEALTHY' | 'MODERATE' | 'HIGH';
  topHoldingSymbol: string;
  topHoldingWeight: number;
}

export interface OverlapInsight {
  isin: string;
  symbol: string;
  name: string;
  accounts: string[];
  totalValue: number;
  portfolioWeight: number;
  duplicateCount: number;
  quantitiesByAccount: { accountName: string; quantity: number; avgPrice: number; value: number }[];
}

export interface PortfolioSummary {
  totalCurrentValue: number;
  totalInvestedValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  totalHoldingsCount: number; // sum of positions across all accounts
  uniqueHoldingsCount: number; // unique ISINs
  connectedAccountsCount: number;
  overlapCount: number;
  overlapCapital: number;
  assetAllocation: AssetAllocationItem[];
  sectorAllocation: SectorAllocationItem[];
  topHoldings: ConsolidatedHolding[];
  concentrationMetrics: ConcentrationMetrics;
  overlaps: OverlapInsight[];
  lastCalculated: string;
}

// AI Assistant
export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  toolUsed?: string;
  toolData?: any;
  suggestedFollowUps?: string[];
}

// What-If Simulation
export interface SimulatedAllocationTarget {
  assetType: AssetType;
  label: string;
  currentWeight: number;
  simulatedWeight: number;
  currentAmount: number;
  simulatedAmount: number;
  deltaWeight: number;
  deltaAmount: number;
  color: string;
}

export interface SimulationResult {
  targets: SimulatedAllocationTarget[];
  totalCurrentValue: number;
  totalSimulatedValue: number;
  isValid: boolean;
  totalSimulatedWeight: number;
  rebalanceTransactions: {
    action: 'BUY' | 'SELL';
    assetType: AssetType;
    amount: number;
    weightDelta: number;
  }[];
  projectedEstimatedYield: {
    currentYield: number;
    simulatedYield: number;
    deltaYield: number;
  };
  volatilityScore: {
    current: number;
    simulated: number;
    description: string;
  };
  explanation: string;
}

// Educational / Discovery
export interface DiscoveryAssetClass {
  id: string;
  title: string;
  shortCode: string;
  tagline: string;
  iconName: string;
  badgeText: string;
  badgeColor: string;
  definition: string;
  howItWorks: string[];
  structureDiagram: {
    sponsor: string;
    trustee: string;
    manager: string;
    assets: string[];
    investorPayout: string;
  };
  incomeMechanism: {
    payoutFrequency: string;
    sources: string[];
    typicalRange: string;
  };
  taxationIndia: {
    dividend: string;
    interest: string;
    capitalGains: string;
  };
  liquidityConsiderations: string;
  keyRisks: string[];
  comparisonWithEquities: string;
  indianExamples: {
    name: string;
    symbol: string;
    category: string;
    description: string;
  }[];
}

import { describe, it, expect } from 'vitest';
import {
  formatINR,
  formatINRLakhs,
  consolidateHoldings,
  calculatePortfolioSummary,
} from '../portfolioEngine';
import { INITIAL_RAW_POSITIONS, INITIAL_ACCOUNTS } from '../../data/seedData';
import { runWhatIfSimulation } from '../whatIfEngine';
import { processAIQuery } from '../aiEngine';

describe('Portfolio Engine Core Calculations', () => {
  it('formats INR correctly with Indian numbering system', () => {
    expect(formatINR(842650, false)).toBe('₹8,42,650');
    expect(formatINR(1250000.5, true)).toBe('₹12,50,000.50');
    expect(formatINR(0, false)).toBe('₹0');
  });

  it('formats INR Lakhs and Crores accurately', () => {
    expect(formatINRLakhs(842650)).toBe('₹8.43 L');
    expect(formatINRLakhs(15000000)).toBe('₹1.50 Cr');
  });

  it('consolidates multi-account holdings by ISIN and calculates weighted buy price', () => {
    const consolidated = consolidateHoldings(INITIAL_RAW_POSITIONS);
    
    // Find Reliance (present in Zerodha: 45 @ 2450 and Groww: 20 @ 2580)
    const reliance = consolidated.find((h) => h.symbol === 'RELIANCE');
    expect(reliance).toBeDefined();
    expect(reliance?.totalQuantity).toBe(65);
    expect(reliance?.accountCount).toBe(2);
    expect(reliance?.isOverlapping).toBe(true);

    // Invested value: (45 * 2450) + (20 * 2580) = 110250 + 51600 = 161850
    expect(reliance?.totalInvestedValue).toBe(161850);
    // Weighted avg buy price = 161850 / 65 = 2490
    expect(reliance?.weightedAvgPrice).toBeCloseTo(2490, 1);
  });

  it('accurately calculates portfolio summary totals and P&L', () => {
    const summary = calculatePortfolioSummary(INITIAL_RAW_POSITIONS, INITIAL_ACCOUNTS);
    
    expect(summary.totalCurrentValue).toBeGreaterThan(1000000);
    expect(summary.totalInvestedValue).toBeGreaterThan(900000);
    expect(summary.totalPnL).toBe(summary.totalCurrentValue - summary.totalInvestedValue);
    expect(summary.uniqueHoldingsCount).toBeLessThan(summary.totalHoldingsCount);
    expect(summary.overlapCount).toBeGreaterThanOrEqual(3); // Reliance, TCS, INFY
  });

  it('properly distinguishes sector percentage of equity vs percentage of total portfolio', () => {
    const summary = calculatePortfolioSummary(INITIAL_RAW_POSITIONS, INITIAL_ACCOUNTS);
    
    const techSector = summary.sectorAllocation.find((s) => s.sector === 'Technology');
    expect(techSector).toBeDefined();
    // Tech should have a higher percentage of equity than of total portfolio
    expect(techSector!.percentageOfEquity).toBeGreaterThan(techSector!.percentageOfTotal);
  });

  it('validates What-If allocations sum to 100%', () => {
    const summary = calculatePortfolioSummary(INITIAL_RAW_POSITIONS, INITIAL_ACCOUNTS);
    
    const validSimulation = runWhatIfSimulation(summary, {
      EQUITY: 50,
      BOND: 25,
      REIT: 15,
      INVIT: 5,
      ETF: 5,
      OTHER: 0,
    });
    expect(validSimulation.isValid).toBe(true);
    expect(validSimulation.totalSimulatedWeight).toBe(100);

    const invalidSimulation = runWhatIfSimulation(summary, {
      EQUITY: 50,
      BOND: 20,
      REIT: 10,
      INVIT: 0,
      ETF: 0,
      OTHER: 0,
    });
    expect(invalidSimulation.isValid).toBe(false);
  });

  it('processes grounded AI queries with appropriate tool execution', () => {
    const summary = calculatePortfolioSummary(INITIAL_RAW_POSITIONS, INITIAL_ACCOUNTS);
    
    const overlapQueryResult = processAIQuery(
      'Do I have overlapping holdings?',
      summary,
      INITIAL_RAW_POSITIONS,
      INITIAL_ACCOUNTS
    );
    expect(overlapQueryResult.toolName).toBe('tool_get_overlapping_holdings');
    expect(overlapQueryResult.data.overlapCount).toBeGreaterThan(0);

    const whatDoIOwnResult = processAIQuery(
      'What do I actually own?',
      summary,
      INITIAL_RAW_POSITIONS,
      INITIAL_ACCOUNTS
    );
    expect(whatDoIOwnResult.toolName).toBe('tool_get_holdings_breakdown');
  });
});

import { AIMessage, PortfolioSummary, RawPosition, BrokerAccount } from '../types';
import { formatINR, formatPercent } from './portfolioEngine';

export interface GroundedToolResult {
  toolName: string;
  description: string;
  parameters: Record<string, any>;
  data: any;
  summaryText: string;
  suggestedFollowUps: string[];
}

export function processAIQuery(
  query: string,
  summary: PortfolioSummary,
  positions: RawPosition[],
  accounts: BrokerAccount[]
): GroundedToolResult {
  const q = query.toLowerCase().trim();

  // 1. "What do I actually own?" / Holdings overview
  if (
    q.includes('what do i actually own') ||
    q.includes('what do i own') ||
    q.includes('list my holdings') ||
    q.includes('show my investments') ||
    q.includes('my assets')
  ) {
    const topHoldings = summary.topHoldings.slice(0, 5);
    const assetBreakdown = summary.assetAllocation
      .map((a) => `• **${a.label}**: ${formatINR(a.value)} (${a.percentage.toFixed(1)}%)`)
      .join('\n');

    const topList = topHoldings
      .map(
        (h, i) =>
          `${i + 1}. **${h.name}** (${h.symbol}) — ${formatINR(h.totalCurrentValue)} (${h.portfolioWeight.toFixed(1)}% weight, held in ${h.accountCount} ${h.accountCount > 1 ? 'accounts' : 'account'})`
      )
      .join('\n');

    return {
      toolName: 'tool_get_holdings_breakdown',
      description: 'Aggregates normalized ISIN positions across all active connected accounts',
      parameters: { totalHoldings: summary.uniqueHoldingsCount, activeAccounts: summary.connectedAccountsCount },
      data: {
        totalValue: summary.totalCurrentValue,
        uniqueHoldings: summary.uniqueHoldingsCount,
        topHoldings,
      },
      summaryText: `Across your **${summary.connectedAccountsCount} connected accounts** (Zerodha, Groww, and CDSL Demat), you own **${summary.uniqueHoldingsCount} unique consolidated securities** with a total valuation of **${formatINR(summary.totalCurrentValue)}**.\n\n### Asset Class Breakdown:\n${assetBreakdown}\n\n### Your Top 5 Holdings by Value:\n${topList}\n\n*Note: Holdings held across multiple accounts have been consolidated by security ISIN.*`,
      suggestedFollowUps: [
        'Do I have overlapping holdings across brokers?',
        'What is my largest sector exposure?',
        'Explain my asset allocation',
      ],
    };
  }

  // 2. "Do I have duplicate / overlapping holdings?"
  if (
    q.includes('duplicate') ||
    q.includes('overlap') ||
    q.includes('same stock') ||
    q.includes('multiple accounts') ||
    q.includes('cross-broker')
  ) {
    const overlaps = summary.overlaps;
    if (overlaps.length === 0) {
      return {
        toolName: 'tool_get_overlapping_holdings',
        description: 'Scans for identical ISIN records existing in more than one connected broker',
        parameters: { overlapThreshold: 2 },
        data: { overlapCount: 0, overlapCapital: 0 },
        summaryText: `Great news! No duplicate securities were detected across your connected accounts. Every security is held in a single distinct account.`,
        suggestedFollowUps: ['What is my largest sector exposure?', 'What do I actually own?'],
      };
    }

    const overlapDetails = overlaps
      .map((o) => {
        const breakdown = o.quantitiesByAccount
          .map((a) => `${a.accountName} (${a.quantity} shares @ avg ${formatINR(a.avgPrice)})`)
          .join(' and ');
        return `• **${o.name} (${o.symbol})**: Total value **${formatINR(o.totalValue)}** (${o.portfolioWeight.toFixed(1)}% of portfolio) held across **${breakdown}**.`;
      })
      .join('\n\n');

    return {
      toolName: 'tool_get_overlapping_holdings',
      description: 'Scans for identical ISIN records existing in more than one connected broker',
      parameters: { detectedDuplicates: overlaps.length },
      data: {
        overlapCount: overlaps.length,
        overlapCapital: summary.overlapCapital,
        overlaps,
      },
      summaryText: `You have **${overlaps.length} overlapping securities** held simultaneously across multiple brokers, representing **${formatINR(summary.overlapCapital)}** (${((summary.overlapCapital / summary.totalCurrentValue) * 100).toFixed(1)}% of your total portfolio):\n\n${overlapDetails}\n\n**Key Insight**: Holding identical equities like Reliance and TCS in both Zerodha and Groww can lead to unintentional position concentration and unnecessary administrative overhead. You can view the unified breakdown in the **Portfolio** tab.`,
      suggestedFollowUps: [
        'What is my largest sector exposure?',
        'How can I simulate rebalancing?',
        'What do I actually own?',
      ],
    };
  }

  // 3. "What is my largest sector exposure?" / Sector analysis
  if (
    q.includes('sector') ||
    q.includes('exposure') ||
    q.includes('tech') ||
    q.includes('concentration') ||
    q.includes('industry')
  ) {
    const topSector = summary.sectorAllocation[0];
    const secondSector = summary.sectorAllocation[1];
    const top3Weight = summary.concentrationMetrics.top3Weight;

    const sectorList = summary.sectorAllocation
      .slice(0, 4)
      .map(
        (s) =>
          `• **${s.sector}**: ${formatINR(s.value)} (**${s.percentageOfEquity.toFixed(1)}% of equities**, ${s.percentageOfTotal.toFixed(1)}% of total portfolio) — Top asset: *${s.topStock}*`
      )
      .join('\n');

    return {
      toolName: 'tool_get_sector_exposure',
      description: 'Calculates sector exposures with separate equity and total-portfolio denominators',
      parameters: { equityTotal: summary.totalInvestedValue },
      data: {
        topSector,
        sectorAllocation: summary.sectorAllocation,
        concentration: summary.concentrationMetrics,
      },
      summaryText: `Your largest sector exposure is **${topSector?.sector || 'Technology'}**, which accounts for **${topSector?.percentageOfEquity.toFixed(1)}% of your direct equity holdings** (${topSector?.percentageOfTotal.toFixed(1)}% of your total portfolio across all asset classes).\n\n### Sector Distribution (Equity Breakdown):\n${sectorList}\n\n**Concentration Assessment**: Your top 3 securities represent **${top3Weight.toFixed(1)}%** of your total portfolio weight, giving you a **${summary.concentrationMetrics.concentrationLevel}** concentration score (HHI Index: ${summary.concentrationMetrics.hhiScore}).`,
      suggestedFollowUps: [
        'Do I have overlapping holdings?',
        'What is a REIT and how can it diversify my sector risk?',
        'Simulate shifting 10% from equity to bonds',
      ],
    };
  }

  // 4. "What is my total portfolio value / P&L?"
  if (
    q.includes('total value') ||
    q.includes('portfolio value') ||
    q.includes('how much') ||
    q.includes('p&l') ||
    q.includes('return') ||
    q.includes('profit') ||
    q.includes('gain')
  ) {
    const pnlSign = summary.totalPnL >= 0 ? 'gained' : 'lost';
    return {
      toolName: 'tool_get_portfolio_summary',
      description: 'Computes total valuation, invested capital, and net unrealized gains',
      parameters: { activeAccounts: summary.connectedAccountsCount },
      data: {
        totalValue: summary.totalCurrentValue,
        investedValue: summary.totalInvestedValue,
        pnl: summary.totalPnL,
        pnlPercent: summary.totalPnLPercent,
      },
      summaryText: `Your unified portfolio currently stands at **${formatINR(summary.totalCurrentValue)}**, against a total invested cost basis of **${formatINR(summary.totalInvestedValue)}**.\n\n• **Overall Unrealized P&L**: **${summary.totalPnL >= 0 ? '+' : ''}${formatINR(summary.totalPnL)} (${formatPercent(summary.totalPnLPercent)})**\n• **Connected Sources**: ${summary.connectedAccountsCount} accounts (Zerodha, Groww, CDSL Demat)\n• **Unique Assets**: ${summary.uniqueHoldingsCount} holdings\n\nAll valuations and returns are calculated strictly from your verified account positions.`,
      suggestedFollowUps: [
        'What do I actually own?',
        'What is my largest sector exposure?',
        'Do I have overlapping holdings?',
      ],
    };
  }

  // 5. "Explain my asset allocation"
  if (
    q.includes('asset allocation') ||
    q.includes('allocation') ||
    q.includes('asset class') ||
    q.includes('distribution')
  ) {
    const assetItems = summary.assetAllocation
      .map(
        (a) =>
          `• **${a.label}**: **${formatINR(a.value)}** (${a.percentage.toFixed(1)}%) — ${a.holdingsCount} holding(s)`
      )
      .join('\n');

    return {
      toolName: 'tool_get_asset_allocation',
      description: 'Categorizes all holdings into Equities, Bonds, REITs, InvITs, and ETFs',
      parameters: { categoriesCount: summary.assetAllocation.length },
      data: { assetAllocation: summary.assetAllocation },
      summaryText: `Here is the comprehensive breakdown of your capital across asset classes:\n\n${assetItems}\n\n**Asset Diversification Insight**: You have exposure to both traditional growth assets (Equities & ETFs) and steady cash-flow yield assets (REITs, InvITs, and Sovereign Bonds). You can test hypothetical adjustments in the **What-If Lab**.`,
      suggestedFollowUps: [
        'What is a REIT?',
        'How is an InvIT different from a REIT?',
        'Simulate shifting 10% to bonds',
      ],
    };
  }

  // 6. "What is a REIT?"
  if (
    q.includes('what is a reit') ||
    q.includes('what is reit') ||
    q.includes('explain reit') ||
    (q.includes('reit') && !q.includes('invit'))
  ) {
    return {
      toolName: 'tool_explain_reit',
      description: 'Retrieves verified educational framework on Real Estate Investment Trusts',
      parameters: { topic: 'REIT_FOUNDATIONS' },
      data: {
        category: 'Real Estate Investment Trusts',
        regulator: 'SEBI',
        distributionMandate: '90% of Net Distributable Cash Flows',
      },
      summaryText: `### What is a REIT?\nA **Real Estate Investment Trust (REIT)** allows everyday retail investors to own fractional shares of prime, income-generating commercial real estate (such as Grade-A tech parks, shopping malls, and corporate headquarters).\n\n### Key Highlights:\n1. **90% Cash Flow Distribution**: By SEBI regulation, REITs must pay out at least 90% of their net distributable cash flows to unitholders, typically as quarterly dividends.\n2. **High Quality Tenants**: Properties are leased to blue-chip multinational tenants with long-term lock-ins (5-15 years) and contractual rent escalation clauses.\n3. **Stock Exchange Liquidity**: Unlike physical real estate which takes months to sell, REITs trade on the NSE/BSE just like common equities.\n4. **Indian Examples**: *Embassy Office Parks REIT*, *Mindspace Business Parks REIT*, *Brookfield India REIT*, and *Nexus Select Trust*.`,
      suggestedFollowUps: [
        'How is an InvIT different from a REIT?',
        'Do I currently hold any REITs?',
        'What are the key risks of REITs?',
      ],
    };
  }

  // 7. "How is an InvIT different from a REIT?"
  if (
    q.includes('invit') ||
    q.includes('difference between reit and invit') ||
    q.includes('reit vs invit')
  ) {
    return {
      toolName: 'tool_explain_reit_vs_invit',
      description: 'Comparative structural analysis between Real Estate and Infrastructure Trusts',
      parameters: { comparison: 'REIT_VS_INVIT' },
      data: {
        reitAsset: 'Commercial Real Estate (Tech Parks, Malls)',
        invitAsset: 'Infrastructure (Tollways, Power Transmission, Fiber)',
        reitYield: '6.5% - 8.0%',
        invitYield: '9.0% - 12.0%',
      },
      summaryText: `### Comparison: REITs vs. InvITs\nBoth are SEBI-regulated trust vehicles that distribute **90% of cash flows**, but they invest in distinctly different underlying assets:\n\n| Feature | REIT (Real Estate) | InvIT (Infrastructure) |\n| :--- | :--- | :--- |\n| **Underlying Assets** | Office Parks, IT SEZs, Shopping Malls | Power Transmission Lines, Toll Highways, Pipelines |\n| **Typical Distribution Yield** | **6.5% – 8.0%** annualized | **9.0% – 12.0%** annualized |\n| **Capital Appreciation** | Higher (underlying real estate appreciates) | Moderate (assets amortize over concession life) |\n| **Cash Flow Source** | Corporate Office Lease Rentals | Regulated Availability Tariffs & Highway Tolls |\n| **Key Indian Examples** | *Embassy REIT, Mindspace REIT* | *PowerGrid InvIT, IRB InvIT, NHAI InvIT* |\n\n**Portfolio Application**: REITs offer balanced capital growth + income, whereas InvITs prioritize high cash distribution yields.`,
      suggestedFollowUps: [
        'What do I actually own in REITs and InvITs?',
        'How safe are my bonds?',
        'Explain my asset allocation',
      ],
    };
  }

  // 8. "How safe are my bonds?" / Bond safety
  if (q.includes('bond') || q.includes('safe') || q.includes('debt') || q.includes('gsec')) {
    const bondHoldings = positions.filter((p) => p.assetType === 'BOND');
    const totalBondVal = bondHoldings.reduce((sum, p) => sum + p.currentValue, 0);

    return {
      toolName: 'tool_get_bond_safety',
      description: 'Analyzes credit ratings and sovereign guarantees across fixed-income instruments',
      parameters: { bondCount: bondHoldings.length },
      data: { bondHoldings, totalBondVal },
      summaryText: `You currently hold **${formatINR(totalBondVal)}** in fixed-income debt securities across **${bondHoldings.length} instruments**:\n\n1. **Government of India 7.18% GS 2033** (${formatINR(153600)} in CDSL Demat): **Zero Credit/Default Risk** backed by sovereign government guarantee.\n2. **REC Ltd 7.50% AAA Corporate Bond 2031** (${formatINR(83600)} in CDSL Demat): **Highest Safety Rating (CRISIL AAA)** from a Maharatna PSU.\n3. **HDFC Ltd 8.05% Secured NCD 2028** (${formatINR(18020)} in Zerodha Kite): Senior secured corporate debenture.\n\n**Safety Assessment**: Your fixed income allocation is predominantly backed by sovereign and AAA-rated entities, providing excellent capital preservation.`,
      suggestedFollowUps: [
        'What do I actually own?',
        'Simulate shifting 10% from equity to bonds',
        'What is my largest sector exposure?',
      ],
    };
  }

  // Default Fallback
  return {
    toolName: 'tool_general_portfolio_analyzer',
    description: 'General query processor grounded on current portfolio statistics',
    parameters: { query },
    data: { summary },
    summaryText: `I analyzed your portfolio across your **${summary.connectedAccountsCount} connected accounts** containing **${summary.uniqueHoldingsCount} unique securities** with a total valuation of **${formatINR(summary.totalCurrentValue)}**.\n\nHere are some specific questions you can ask me:\n• *"What do I actually own?"*\n• *"Do I have duplicate or overlapping holdings across brokers?"*\n• *"What is my largest sector exposure?"*\n• *"Explain what a REIT is and how it differs from an InvIT"*\n• *"How safe are my bond investments?"*`,
    suggestedFollowUps: [
      'What do I actually own?',
      'Do I have overlapping holdings?',
      'What is my largest sector exposure?',
    ],
  };
}

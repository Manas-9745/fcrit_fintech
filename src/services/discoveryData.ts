import { DiscoveryAssetClass } from '../types';

export const DISCOVERY_ASSETS: DiscoveryAssetClass[] = [
  {
    id: 'reits',
    title: 'Real Estate Investment Trusts (REITs)',
    shortCode: 'REIT',
    tagline: 'Fractional ownership in grade-A commercial real estate with regular dividend yields.',
    iconName: 'Building2',
    badgeText: 'Stable Income + Inflation Hedge',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    definition:
      'A Real Estate Investment Trust (REIT) is a company that owns, operates, or finances income-generating commercial real estate. Modeled like mutual funds, REITs pool capital from multiple investors to acquire large-scale properties such as tech parks, office complexes, and shopping malls.',
    howItWorks: [
      'The trust acquires premium rent-yielding commercial properties with institutional-grade tenants (e.g., Fortune 500 companies).',
      'Tenants pay regular lease rentals with built-in inflation escalation clauses (typically 10-15% every 3 years).',
      'By SEBI regulation, REITs must distribute at least 90% of their Net Distributable Cash Flows (NDCF) to unitholders at least semi-annually (most distribute quarterly).',
      'Unitholders benefit from quarterly cash distributions (dividends/interest) plus unit price appreciation as property values rise.',
    ],
    structureDiagram: {
      sponsor: 'Promoter / Real Estate Developer (e.g., Blackstone, Embassy Group, K Raheja Corp)',
      trustee: 'SEBI Registered Independent Trustee (holds assets for unitholders)',
      manager: 'Investment Manager (executes leasing, property upkeep & asset acquisition)',
      assets: [
        'Express Towers, Nariman Point (Mumbai)',
        'Embassy Manyata Tech Park (Bengaluru)',
        'Mindspace Madhapur (Hyderabad)',
        'Brookfield Giga Space (Pune)',
      ],
      investorPayout: 'Quarterly distributions composed of Dividends, Interest, and Return of Capital',
    },
    incomeMechanism: {
      payoutFrequency: 'Quarterly (Every 3 months)',
      sources: ['Rental Leases from Corporate Tenants', 'Maintenance & Amenities Fees', 'Short-term treasury yields on reserves'],
      typicalRange: '6.5% – 8.0% annualized distribution yield',
    },
    taxationIndia: {
      dividend: 'Tax-free if SPV did not opt for lower corporate tax rate; taxable at slab rate otherwise.',
      interest: 'Taxable at investor’s applicable marginal income tax slab rate.',
      capitalGains: 'LTCG (>36 months holding): 12.5% without indexation; STCG (<=36 months): 20%.',
    },
    liquidityConsiderations:
      'Listed on NSE and BSE like common stocks. Investors can buy or sell 1 unit with zero lock-in during market trading hours.',
    keyRisks: [
      'Tenant Vacancy Risk: If major corporate tenants vacate or downsize office footprints.',
      'Interest Rate Sensitivity: Rising repo rates increase debt servicing costs and make bond yields relatively more attractive.',
      'Geographic Concentration: Over-reliance on a single IT tech-corridor or city.',
    ],
    comparisonWithEquities:
      'Unlike pure growth equities that reinvest all profits, REITs are mandated to return 90% of cash flows. They offer lower volatility than small/mid-cap equities and higher yields than traditional fixed deposits.',
    indianExamples: [
      {
        name: 'Embassy Office Parks REIT',
        symbol: 'EMBASSY',
        category: 'Office Tech Parks',
        description: 'India’s first listed REIT, holding 45+ MSF across Bengaluru, Mumbai, Pune, and Noida.',
      },
      {
        name: 'Mindspace Business Parks REIT',
        symbol: 'MINDSPACE',
        category: 'Grade-A Commercial SEZ',
        description: 'Sponsored by K Raheja Corp with top micro-market campuses in Mumbai MMR, Hyderabad, and Chennai.',
      },
      {
        name: 'Brookfield India Real Estate Trust',
        symbol: 'BIRET',
        category: 'Institutional Campus Offices',
        description: 'Backed by global asset manager Brookfield with premier properties in Gurugram, Noida, and Kolkata.',
      },
      {
        name: 'Nexus Select Trust',
        symbol: 'NXST',
        category: 'Retail Malls & Shopping Centers',
        description: 'India’s first pure-play retail REIT with 17 Grade-A urban shopping malls across 14 cities.',
      },
    ],
  },
  {
    id: 'invits',
    title: 'Infrastructure Investment Trusts (InvITs)',
    shortCode: 'INVIT',
    tagline: 'Invest in critical nation-building infrastructure assets with high predictable cash flows.',
    iconName: 'Zap',
    badgeText: 'High Distribution Yield (9-12%)',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    definition:
      'An Infrastructure Investment Trust (InvIT) is a collective investment scheme regulated by SEBI that pools funds from institutional and retail investors to invest in long-term revenue-generating infrastructure assets, such as power transmission lines, toll highways, and renewable pipelines.',
    howItWorks: [
      'The trust owns operational infrastructure concessions backed by long-term government contracts or regulated tariff mechanisms.',
      'Assets generate steady concession toll fees, availability-based power tariffs, or pipeline transmission charges.',
      'At least 80% of assets must be completed and revenue-generating (minimizing construction execution risk).',
      'At least 90% of Net Distributable Cash Flows are paid out to unitholders semi-annually or quarterly.',
    ],
    structureDiagram: {
      sponsor: 'Infrastructure Conglomerate (e.g., Power Grid Corporation of India, NHAI, IRB Infrastructure)',
      trustee: 'Independent Custodial Trustee (e.g., IDBI Trusteeship Services)',
      manager: 'Investment Manager & Project Manager (ensures 99.5%+ transmission/tollway uptime)',
      assets: [
        '765 kV Inter-state Power Transmission Lines (Pan-India)',
        'Golden Quadrilateral Toll Road Concessions',
        'Optical Fiber Telecom Backbone Networks',
      ],
      investorPayout: 'Quarterly Cash Flow distributions (Interest, Dividend, and Principal Amortization)',
    },
    incomeMechanism: {
      payoutFrequency: 'Quarterly / Semi-annually',
      sources: ['CERC-regulated Availability Tariffs', 'FASTag National Toll Collections', 'Long-term Pipeline Off-take Agreements'],
      typicalRange: '9.0% – 12.0% pre-tax annualized cash distribution yield',
    },
    taxationIndia: {
      dividend: 'Tax-exempt in the hands of unit holders if SPV pays standard tax; otherwise taxed at slab.',
      interest: 'Taxable at the individual investor’s marginal income slab rate.',
      capitalGains: 'LTCG (>36 months): 12.5% beyond threshold; STCG (<=36 months): 20%.',
    },
    liquidityConsiderations:
      'Units trade on NSE/BSE. Trading volume is slightly lower than large-cap equities, but retail lot size has been reduced by SEBI to 1 unit to maximize liquidity.',
    keyRisks: [
      'Concession Termination Risk: Toll road or transmission concessions have defined lifespans (e.g. 25-35 years).',
      'Traffic Volume Fluctuation: For toll road InvITs, macroeconomic downturns can impact heavy commercial vehicle traffic.',
      'Regulatory & Tariff Revisions: Policy updates by CERC/NHAI on tariff calculation or transmission corridors.',
    ],
    comparisonWithEquities:
      'InvITs have significantly higher cash distribution yields (9-12%) compared to the average Nifty 50 dividend yield (1.2-1.5%). However, capital appreciation is moderate as assets amortize over their concession life.',
    indianExamples: [
      {
        name: 'PowerGrid Infrastructure Investment Trust',
        symbol: 'PGINVIT',
        category: 'Power Transmission Lines',
        description: 'Sponsored by Maharatna PSU PowerGrid, operating 5 key inter-state transmission lines with 99.8% availability.',
      },
      {
        name: 'IRB InvIT Fund',
        symbol: 'IRBINVIT',
        category: 'Toll Highways & Concessions',
        description: 'First listed Indian InvIT managing 7 operational highway stretches across Maharashtra, Gujarat, and Rajasthan.',
      },
      {
        name: 'National Highways Infra Trust (NHAI InvIT)',
        symbol: 'NHIT',
        category: 'National Highway Corridors',
        description: 'Sponsored by the National Highways Authority of India (NHAI), operating critical economic freight corridors.',
      },
    ],
  },
  {
    id: 'bonds',
    title: 'Government & Corporate Bonds (Fixed Income)',
    shortCode: 'BOND',
    tagline: 'Capital preservation and guaranteed periodic coupon payments with sovereign and AAA ratings.',
    iconName: 'ShieldCheck',
    badgeText: 'Capital Safety & Predictable Returns',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    definition:
      'Bonds are debt securities issued by governments (G-Secs), state bodies (SDLs), and corporations (NCDs) to raise capital. When you buy a bond, you are lending money to the issuer in exchange for regular interest coupon payments and the return of the face value at maturity.',
    howItWorks: [
      'The issuer floats bonds with a stated face value (e.g., ₹100 or ₹1,000), a fixed coupon rate (e.g., 7.18%), and maturity date (e.g., 2033).',
      'The bondholder receives interest payments on predetermined dates (semi-annually or annually) directly into their bank account.',
      'On maturity date, 100% of the principal face value is redeemed and paid back to the bondholder.',
      'Bonds trade in secondary debt markets where market prices fluctuate inversely with benchmark interest rates.',
    ],
    structureDiagram: {
      sponsor: 'Reserve Bank of India (RBI) / AAA Rated PSUs & Corporations (e.g. REC, PFC, HDFC)',
      trustee: 'SEBI Debenture Trustee / RBI Public Debt Office',
      manager: 'Issuer Treasury & Clearing Corporation of India (CCIL)',
      assets: [
        'Government Sovereign Guarantee (Zero Credit Risk for G-Secs)',
        'AAA-rated balance sheet assets for Corporate NCDs',
      ],
      investorPayout: 'Semi-annual coupon credit + Full principal redemption at maturity',
    },
    incomeMechanism: {
      payoutFrequency: 'Semi-annually (Twice a year) or Annually',
      sources: ['Direct sovereign treasury disbursements', 'Corporate operating cash reserves'],
      typicalRange: '6.8% – 8.5% fixed annualized coupon',
    },
    taxationIndia: {
      dividend: 'N/A (Bonds pay interest, not dividends).',
      interest: 'Taxed at the investor’s applicable marginal income tax slab rate.',
      capitalGains: 'Listed bonds held >12 months: 12.5% LTCG without indexation; <=12 months: Taxed at slab.',
    },
    liquidityConsiderations:
      'Sovereign G-Secs and liquid AAA corporate bonds can be sold in secondary markets via NSE/BSE or RBI Retail Direct. Secondary yields adjust based on prevailing interest rate cycles.',
    keyRisks: [
      'Interest Rate Risk: When RBI hikes interest rates, secondary market bond prices fall (and vice versa).',
      'Credit / Default Risk: Present in corporate debt (mitigated by sticking to AAA/AA+ rated instruments; zero credit risk in G-Secs).',
      'Reinvestment Risk: Risk that proceeds will have to be reinvested at lower interest rates in the future.',
    ],
    comparisonWithEquities:
      'Bonds provide guaranteed contractual cash flows and priority in capital structure over equity shareholders in case of liquidation, making them essential for portfolio risk damping.',
    indianExamples: [
      {
        name: 'Government of India 7.18% GS 2033',
        symbol: '7.18% GS 2033',
        category: 'Sovereign Debt (Zero Default Risk)',
        description: 'Benchmark 10-year Indian government security paying 3.59% every six months.',
      },
      {
        name: 'REC Ltd 7.50% AAA Corporate Bond',
        symbol: 'REC 7.50% 2031',
        category: 'Maharatna PSU Debt',
        description: 'CRISIL AAA-rated government-backed infrastructure financing enterprise bond.',
      },
      {
        name: 'HDFC Ltd 8.05% Secured NCD',
        symbol: 'HDFC NCD 2028',
        category: 'Private Sector AAA Corporate Bond',
        description: 'Secured senior debt debentures backed by prime mortgage loan receivables.',
      },
    ],
  },
];

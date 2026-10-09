# NiveshIQ — Unified Investment Intelligence Platform
> **“Your investments, finally in one place.”**
> *Unify your portfolio. Understand your exposure. Make informed decisions.*

---

## 1. Executive Summary & Core Narrative

**NiveshIQ** is an AI-powered, light-themed FinTech investment intelligence platform built for **Problem Statement 2 (PS2: All Your Investments, In One Place)**.

### The 15-Second Narrative:
$$\text{FRAGMENTED} \longrightarrow \text{UNIFIED} \longrightarrow \text{UNDERSTOOD}$$

Traditional multi-app investing creates critical blind spots: identical stocks bought across multiple brokers, skewed sector concentration perceptions, zero visibility into alternative cash flow assets (REITs/InvITs), and manual spreadsheet tracking. **NiveshIQ** solves this with **Five Core Discoverable Actions**:

$$\mathbf{UNIFY} \quad\cdot\quad \mathbf{X\text{-}RAY} \quad\cdot\quad \mathbf{ASK\ AI} \quad\cdot\quad \mathbf{SIMULATE} \quad\cdot\quad \mathbf{DISCOVER}$$

---

## 2. Key Architecture & Technology Choices

| Layer | Technology | Rationale & Highlights |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript + Vite** | Fast, type-safe reactive state with sub-second HMR. |
| **Styling & Design System** | **Tailwind CSS + Custom FinTech Tokens** | Light-themed, warm ivory/slate surfaces (`#F8FAFC`, `#FFFFFF`), subtle teal accents (`#0D9488`), muted green profit indicators (`#16A34A`), restrained coral alerts (`#E11D48`), 8px spacing system, Inter typography. |
| **Data Normalization Engine** | **TypeScript Portfolio Normalizer** | Aggregates disparate positions by canonical ISIN, calculates weighted buy prices, multi-account allocations, and cross-broker duplication. |
| **Grounded AI Engine** | **Deterministic Tool-Based Assistant** | Controlled execution architecture invoking approved math tools (`tool_get_overlapping_holdings`, `tool_get_sector_exposure`, `tool_explain_reit_vs_invit`) with transparent JSON payload inspection. |
| **Simulation Engine** | **What-If Rebalancer** | Validates 100% asset allocation weights, models capital buy/sell shifts in INR, and estimates distribution yield and volatility impact. |
| **Testing Suite** | **Vitest** | Automated unit tests validating INR formatting, ISIN deduplication, sector denominators, and What-If validation. |

---

## 3. Product Features & Modules Implemented

### A. Landing Page
- High-converting SaaS landing page with product value proposition, live metric counters, 5 interactive capability cards, and a direct "Explore Live Demo" CTA.

### B. Core Experience A — Unified Portfolio
- **INR Formatting**: Correct Indian numbering formatting (`₹12,45,900`, `₹12.46L`).
- **ISIN Consolidation**: Deduplicates 20 raw positions across Zerodha, Groww, and CDSL into 12 unique securities.
- **Expandable Table**: Clicking any row (e.g. *Reliance Industries Ltd*, *TCS*, *Infosys*) reveals underlying account positions, broker avg buy prices, and account weights.
- **Search & Multi-Level Filters**: By name, ticker symbol, ISIN, asset class (`EQUITY`, `REIT`, `INVIT`, `BOND`, `ETF`), and broker source.
- **Export**: One-click CSV export of unified holdings.

### C. Core Experience B — Portfolio X-Ray
- **Dual-Denominator Sector Exposure**: Distinguishes between **% of Equity Holdings** (e.g. Technology = 32.4% of Equities) and **% of Total Portfolio** (15.7% of Total Capital) to prevent skewed risk perception.
- **Concentration Index (HHI)**: Computes Herfindahl-Hirschman Index score with Top-1, Top-3, and Top-5 position concentration gauges.
- **Multi-Broker Overlap Matrix**: Dedicated matrix displaying duplicate securities held across accounts with individual capital allocations.
- **Account-Wise Distribution**: Visualizer showing capital split across Zerodha Kite, Groww, and CDSL Demat.

### D. Core Experience C — AI Portfolio Explainer
- Controlled, tool-backed conversational interface.
- Pre-grounded prompt chips:
  - *"What do I actually own?"*
  - *"Do I have overlapping holdings?"*
  - *"What is my largest sector exposure?"*
  - *"What is a REIT and how is it different from an InvIT?"*
  - *"What is my total portfolio value?"*
  - *"How safe are my bonds?"*
- Tool inspection badge revealing the exact deterministic tool invoked and its JSON parameters.
- Educational disclaimer clarifying non-advisory status.

### E. Core Experience D — What-If Lab
- Interactive sliders and numeric inputs for Equity, Debt/Bonds, REITs, InvITs, and ETFs.
- Real-time total weight validation (enforcing 100%).
- Preset Strategies:
  1. *Shift 10% Equity to Bonds (De-Risk)*
  2. *Add 10% REIT & InvIT Allocation (Cash Flow Boost)*
  3. *Classic 60/40 Institutional Strategy*
  4. *High-Yield Income Maximizer*
  5. *Aggressive Equity Growth*
- Before vs After Recharts comparative chart.
- Rebalancing transaction schedule (Buy/Sell capital in INR).
- Projected annual yield delta and portfolio volatility score delta.

### F. Core Experience E — Investment Discovery & Education
- Comprehensive institutional guides for **REITs**, **InvITs**, and **Government & Corporate Debt**.
- Visual 5-step structuring diagram (Sponsor -> Trustee -> Investment Manager -> SPV Assets -> Unitholders).
- Indian taxation rules under Section 115UA (Dividends, Interest, Capital Gains).
- 4-way Side-by-Side Comparison Matrix Table.
- Indian Listed Real Assets Directory (Embassy REIT, Mindspace REIT, Brookfield India, PowerGrid InvIT, IRB InvIT, GoI 7.18% GS 2033, REC AAA Bond).

### G. Connected Accounts & 5-Step Sync Pipeline
- Connected sources management (Zerodha Kite, Groww, CDSL Demat).
- Animated 5-stage sync workflow:
  1. `CONNECT` — Secure broker adapter handshake
  2. `SYNC` — Pull raw account position records
  3. `NORMALIZE` — Standardize disparate symbols to canonical ISINs
  4. `MERGE` — Consolidate duplicate stock positions
  5. `ANALYZE` — Generate risk, concentration, and allocation models
- Add simulated broker modal (Upstox, ICICI Direct).
- Reliable "Reset to Demo Data" trigger.

---

## 4. 2–3 Minute Presentation Demo Script

1. **Start on Landing Page**: Show the brand tagline and the 3-step narrative ($\text{FRAGMENTED} \to \text{UNIFIED} \to \text{UNDERSTOOD}$). Click **"Explore Live Demo"**.
2. **Overview Dashboard**: Highlight total INR portfolio valuation (`₹12.46L`), returns (`+12.37%`), asset allocation donut chart, and the **Cross-Broker Overlap Alert Banner**.
3. **Pipeline Synchronization**: Click **"Run Pipeline Sync"** in the sidebar. Observe the 5-step progress animation (`CONNECT` $\to$ `SYNC` $\to$ `NORMALIZE` $\to$ `MERGE` $\to$ `ANALYZE` $\to$ `COMPLETE`) with celebratory confetti.
4. **Unified Portfolio**: Navigate to **Portfolio**. Show ISIN-normalized holdings. Click on **Reliance Industries Ltd** to expand the row and reveal that 45 shares are held in Zerodha Kite and 20 shares in Groww with their respective buy prices and valuations.
5. **Portfolio X-Ray**: Navigate to **Portfolio X-Ray**. Point out the **HHI Concentration Score**, the **Dual-Denominator Sector Exposure** toggle (% of Equities vs % of Total Portfolio), and the **Overlap Matrix**.
6. **AI Assistant**: Open **AI Assistant**. Click *"What do I actually own?"* to show the grounded breakdown. Click *"Do I have duplicate holdings?"* and toggle the **Tool Payload** drawer to show deterministic data verification.
7. **What-If Lab**: Navigate to **What-If Lab**. Click the preset *"Shift 10% Equity to Bonds"*. Show how the before/after charts update in real-time, the distribution yield increases by +0.59%, volatility decreases, and a step-by-step rebalancing plan is generated.
8. **Explore Real Assets**: Navigate to **Explore Real Assets**. Walk through REITs vs InvITs, the 5-step trust structure diagram, Indian taxation under Section 115UA, and the comparison matrix.

---

## 5. Setup & Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run unit test suite
npx vitest run

# 3. Build production bundle
npm run build

# 4. Start local development server
npm run dev
# Server runs at http://localhost:5174/ (or http://localhost:5173/)
```

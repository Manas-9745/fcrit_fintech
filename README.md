# NiveshIQ — Unified Investment Intelligence Platform

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)

**“Your investments, finally in one place.”**  
*Unify your portfolio. Understand your exposure. Make informed decisions.*

</div>

---

## 📌 Problem Statement (PS2)
Retail investors in India use multiple brokerages (Zerodha, Groww, AngelOne) and depositories (CDSL/NSDL). This creates fragmented wealth tracking, duplicate positions across accounts, skewed sector concentration perceptions, and zero visibility into income-generating real assets like REITs, InvITs, and Sovereign Debt.

### Core Narrative
```
FRAGMENTED  ──▶  UNIFIED  ──▶  UNDERSTOOD
```

### The 5 Core Pillars
```
  [ UNIFY ]   ──▶  Multi-Broker ISIN Normalization & Deduplication
  [ X-RAY ]   ──▶  Dual-Denominator Sector Exposure & HHI Risk Index
 [ ASK AI ]   ──▶  Controlled Tool-Based Portfolio Intelligence
[ SIMULATE ]  ──▶  What-If Asset Rebalancing & Yield Projection
[ DISCOVER ]  ──▶  Educational Deep-Dive on REITs, InvITs & Bonds
```

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Recharts, Lucide React, Canvas Confetti |
| **Backend & State** | Node.js, React Context API, In-Memory Normalization Engine |
| **APIs & Integration** | REST, JSON Payloads, Mock Multi-Broker Adapters (Zerodha, Groww, CDSL) |
| **AI & Intelligence** | Deterministic Tool-Based Function Calling, Herfindahl-Hirschman (HHI) Index |
| **Build & Test** | Vite 8, Vitest (100% Pass Rate), PostCSS, Autoprefixer |

---

## 🚀 Key Features

### 1. 📊 Unified Portfolio & ISIN Consolidation
- Aggregates multi-broker accounts into a single INR-denominated balance.
- Consolidates holdings across brokers using canonical ISIN identifiers.
- Expandable table rows reveal broker-level allocations (e.g. 45 shares in Zerodha + 20 shares in Groww).
- Filter by asset class (`EQUITY`, `REIT`, `INVIT`, `BOND`, `ETF`), broker source, or search query.

### 2. 🔍 Portfolio X-Ray & Analytics
- **Dual-Denominator Sector Exposure:** Distinguishes between `% of Equities` vs `% of Total Portfolio` to prevent skewed risk perception.
- **Concentration Index (HHI):** Computes Herfindahl-Hirschman risk score and Top-1/3/5 concentration ratios.
- **Multi-Broker Overlap Matrix:** Pinpoints duplicate securities across accounts and total locked capital.

### 3. 🤖 AI Portfolio Assistant
- Plain-English portfolio intelligence backed by deterministic calculation tools.
- Transparent tool execution inspection drawer (zero hallucinated figures).
- Answers: *"What do I actually own?"*, *"Do I have duplicate holdings?"*, *"What is my largest sector exposure?"*, and *"Explain REITs vs InvITs"*.

### 4. 🎛️ What-If Allocation Lab
- Interactive sliders and numeric inputs for hypothetical asset shifts.
- Real-time 100% weight validation and 5 preset strategies (*Shift 10% to Bonds*, *Income Maximizer*, *Classic 60/40*).
- Visualizes before vs after allocation, projected yield delta (+0.59%), and step-by-step rebalancing capital plan.

### 5. 📚 Real Asset Discovery (REITs, InvITs & Bonds)
- Complete guides with visual 5-step trust structure diagrams.
- Income mechanism & cash flow distribution yields (7–12%).
- Indian taxation rules under Section 115UA (Dividends, Interest, Capital Gains).
- 4-way comparison matrix (Equities vs REITs vs InvITs vs Bonds).

### 6. ⚡ Multi-Stage Sync Pipeline
- Animated 5-step synchronization flow:
  `CONNECT` ➔ `SYNC` ➔ `NORMALIZE` ➔ `MERGE` ➔ `ANALYZE` ➔ `COMPLETE`.
- Simulated broker connectors for Upstox, ICICI Direct, and one-click demo data reset.

---

## 📂 Project Structure

```
fcrit_fintech/
├── public/                      # Static assets and icons
├── src/
│   ├── types/                   # TypeScript interfaces & domain types
│   ├── data/                    # Synthetic Indian investment seed data (INR)
│   ├── services/
│   │   ├── portfolioEngine.ts   # Normalization, math calculations & HHI index
│   │   ├── aiEngine.ts          # Tool-based grounded AI query processor
│   │   ├── whatIfEngine.ts      # What-If simulator & validation logic
│   │   ├── discoveryData.ts     # REIT, InvIT & Bond educational datasets
│   │   └── __tests__/           # Vitest unit test suite
│   ├── context/                 # Global state & synchronization pipeline
│   ├── components/
│   │   ├── ui/                  # Badges, Cards, Modals, StatCards
│   │   ├── layout/              # Navbar, Sidebar, LandingPage
│   │   ├── overview/            # Portfolio Overview Dashboard
│   │   ├── portfolio/           # Unified Holdings Table
│   │   ├── xray/                # Portfolio X-Ray & Analytics
│   │   ├── ai/                  # AI Chat Assistant
│   │   ├── whatif/              # What-If Allocation Simulator
│   │   ├── discovery/           # Real Assets Guide & Comparison Matrix
│   │   ├── accounts/            # Connected Sources & Broker Adapters
│   │   └── modals/              # Multi-step Sync Pipeline Modal
│   ├── App.tsx                  # Root application view router
│   ├── main.tsx                 # React DOM mount point
│   └── index.css                # Tailwind base & custom design tokens
├── tailwind.config.js           # Design system tokens & color palette
├── vite.config.ts               # Vite bundler configuration
└── README.md                    # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Manas-9745/fcrit_fintech.git

# Navigate to project directory
cd fcrit_fintech

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** (or `http://localhost:5174/`) in your browser.

### Running Tests
```bash
# Execute Vitest calculation test suite
npx vitest run
```

### Production Build
```bash
# Compile TypeScript and bundle production assets
npm run build
```

---

## 🧪 Test Suite Results
```text
 ✓ src/services/__tests__/portfolioEngine.test.ts (7 tests)
   ✓ formats INR correctly with Indian numbering system
   ✓ formats INR Lakhs and Crores accurately
   ✓ consolidates multi-account holdings by ISIN and calculates weighted buy price
   ✓ accurately calculates portfolio summary totals and P&L
   ✓ properly distinguishes sector percentage of equity vs percentage of total portfolio
   ✓ validates What-If allocations sum to 100%
   ✓ processes grounded AI queries with appropriate tool execution

 Test Files  1 passed (1)
      Tests  7 passed (7)
```

---

## 🔒 Security & Financial Integrity
- **Mock Adapters:** All broker connections use read-only mock integration tokens; zero live credentials stored.
- **Controlled AI:** The AI Assistant cannot access unauthorized databases or provide speculative buy/sell advice.
- **Disclaimer:** All What-If simulation outputs and discovery materials are intended for educational and analytical purposes only.

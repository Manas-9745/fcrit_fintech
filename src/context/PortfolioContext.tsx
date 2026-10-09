import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  BrokerAccount,
  RawPosition,
  ConsolidatedHolding,
  PortfolioSummary,
  AIMessage,
} from '../types';
import { INITIAL_ACCOUNTS, INITIAL_RAW_POSITIONS } from '../data/seedData';
import {
  calculatePortfolioSummary,
  consolidateHoldings,
} from '../services/portfolioEngine';
import confetti from 'canvas-confetti';

export type SyncStep =
  | 'IDLE'
  | 'CONNECT'
  | 'SYNC'
  | 'NORMALIZE'
  | 'MERGE'
  | 'ANALYZE'
  | 'COMPLETE';

export type TabType =
  | 'overview'
  | 'portfolio'
  | 'xray'
  | 'ai'
  | 'whatif'
  | 'discovery'
  | 'accounts';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

interface PortfolioContextType {
  accounts: BrokerAccount[];
  positions: RawPosition[];
  activeAccountIds: string[];
  summary: PortfolioSummary;
  consolidatedHoldings: ConsolidatedHolding[];
  
  // Navigation & View
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Multi-account toggle
  toggleAccountFilter: (accountId: string) => void;
  selectAllAccounts: () => void;

  // Synchronization Pipeline
  isSyncing: boolean;
  syncStep: SyncStep;
  syncProgress: number;
  syncStepMessage: string;
  showSyncModal: boolean;
  setShowSyncModal: (show: boolean) => void;
  startSyncSequence: () => Promise<void>;

  // Account actions
  addAccount: (account: Partial<BrokerAccount>) => void;
  disconnectAccount: (accountId: string) => void;
  resetToDemoData: () => void;

  // AI Chat History
  aiMessages: AIMessage[];
  sendAIMessage: (text: string) => void;
  clearAIChat: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: `Hello! I am **NiveshIQ AI**, your grounded portfolio intelligence assistant.\n\nI have unified your **3 connected accounts** (Zerodha Kite, Groww, and CDSL Demat). You can ask me questions about your asset exposure, cross-broker overlaps, sector risks, or how alternatives like REITs and InvITs work.\n\nTry clicking one of the suggested prompts below or ask any question!`,
    timestamp: new Date().toISOString(),
    suggestedFollowUps: [
      'What do I actually own?',
      'Do I have duplicate or overlapping holdings?',
      'What is my largest sector exposure?',
      'What is a REIT and how is it different from an InvIT?',
    ],
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Cross-Broker Overlap Detected',
    message: 'Reliance Industries, TCS, and Infosys appear in both Zerodha Kite and Groww accounts.',
    timestamp: '10 mins ago',
    type: 'warning',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Multi-Account Normalization Active',
    message: '17 positions successfully mapped and deduplicated into 12 unique ISIN securities.',
    timestamp: '25 mins ago',
    type: 'success',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Q3 REIT Distribution Credited',
    message: 'Embassy Office Parks REIT distribution of ₹5.20/unit credited to registered bank account.',
    timestamp: '1 day ago',
    type: 'info',
    read: true,
  },
];

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [accounts, setAccounts] = useState<BrokerAccount[]>(INITIAL_ACCOUNTS);
  const [positions, setPositions] = useState<RawPosition[]>(INITIAL_RAW_POSITIONS);
  const [activeAccountIds, setActiveAccountIds] = useState<string[]>(
    INITIAL_ACCOUNTS.map((a) => a.id)
  );

  // Synchronization state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStep, setSyncStep] = useState<SyncStep>('IDLE');
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncStepMessage, setSyncStepMessage] = useState<string>('');
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Recalculate summary and holdings whenever positions, accounts, or active filters change
  const consolidatedHoldings = useMemo(() => {
    return consolidateHoldings(positions, activeAccountIds);
  }, [positions, activeAccountIds]);

  const summary = useMemo(() => {
    return calculatePortfolioSummary(positions, accounts, activeAccountIds);
  }, [positions, accounts, activeAccountIds]);

  // Multi-account toggle
  const toggleAccountFilter = (accountId: string) => {
    setActiveAccountIds((prev) => {
      if (prev.includes(accountId)) {
        if (prev.length === 1) return prev; // Keep at least one account active
        return prev.filter((id) => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  };

  const selectAllAccounts = () => {
    setActiveAccountIds(accounts.map((a) => a.id));
  };

  // Sync Pipeline sequence: CONNECT -> SYNC -> NORMALIZE -> MERGE -> ANALYZE -> COMPLETE
  const startSyncSequence = async () => {
    setShowSyncModal(true);
    setIsSyncing(true);
    setSyncStep('CONNECT');
    setSyncProgress(15);
    setSyncStepMessage('Establishing encrypted handshake with simulated brokers & depository...');

    await new Promise((r) => setTimeout(r, 700));
    setSyncStep('SYNC');
    setSyncProgress(38);
    setSyncStepMessage('Pulling 20 raw position records from Zerodha Kite, Groww, and CDSL...');

    await new Promise((r) => setTimeout(r, 800));
    setSyncStep('NORMALIZE');
    setSyncProgress(62);
    setSyncStepMessage('Standardizing disparate security symbols to canonical NSDL/CDSL ISINs...');

    await new Promise((r) => setTimeout(r, 700));
    setSyncStep('MERGE');
    setSyncProgress(84);
    setSyncStepMessage('Consolidating duplicate stock positions across accounts...');

    await new Promise((r) => setTimeout(r, 650));
    setSyncStep('ANALYZE');
    setSyncProgress(96);
    setSyncStepMessage('Generating real-time sector, asset allocation, and concentration models...');

    await new Promise((r) => setTimeout(r, 550));
    setSyncStep('COMPLETE');
    setSyncProgress(100);
    setSyncStepMessage('Unified portfolio successfully synchronized!');
    setIsSyncing(false);

    // Update lastSynced timestamp
    const now = new Date().toISOString();
    setAccounts((prev) =>
      prev.map((a) => ({
        ...a,
        lastSynced: now,
        status: 'CONNECTED',
      }))
    );

    // Trigger subtle celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0D9488', '#0284C7', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      // Ignore if canvas confetti not available in test
    }
  };

  // Add Account
  const addAccount = (accountData: Partial<BrokerAccount>) => {
    const newId = `acc-${Date.now()}`;
    const newAccount: BrokerAccount = {
      id: newId,
      name: accountData.name || 'New Broker Account',
      brokerCode: accountData.brokerCode || 'UPSTOX',
      type: accountData.type || 'BROKER',
      accountNumber: accountData.accountNumber || `UP-${Math.floor(100000 + Math.random() * 900000)}`,
      avatarColor: accountData.avatarColor || '#6366F1',
      status: 'CONNECTED',
      lastSynced: new Date().toISOString(),
      holdingsCount: 0,
      totalValue: 0,
      investedValue: 0,
      unrealizedPnL: 0,
      syncEnabled: true,
      notes: accountData.notes || 'Simulated broker account',
    };

    setAccounts((prev) => [...prev, newAccount]);
    setActiveAccountIds((prev) => [...prev, newId]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${newAccount.name} Connected`,
        message: `Successfully linked simulated account ${newAccount.accountNumber}.`,
        timestamp: 'Just now',
        type: 'success',
        read: false,
      },
      ...prev,
    ]);
  };

  const disconnectAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    setActiveAccountIds((prev) => prev.filter((id) => id !== accountId));
    setPositions((prev) => prev.filter((p) => p.accountId !== accountId));
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setPositions(INITIAL_RAW_POSITIONS);
    setActiveAccountIds(INITIAL_ACCOUNTS.map((a) => a.id));
    setAiMessages(INITIAL_AI_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('overview');
  };

  // AI chat actions
  const sendAIMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setAiMessages((prev) => [...prev, userMsg]);

    // Dynamically import aiEngine to process grounded query
    const { processAIQuery } = await import('../services/aiEngine');
    const result = processAIQuery(text, summary, positions, accounts);

    const assistantMsg: AIMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: result.summaryText,
      timestamp: new Date().toISOString(),
      toolUsed: result.toolName,
      toolData: result.data,
      suggestedFollowUps: result.suggestedFollowUps,
    };

    setAiMessages((prev) => [...prev, assistantMsg]);
  };

  const clearAIChat = () => {
    setAiMessages(INITIAL_AI_MESSAGES);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <PortfolioContext.Provider
      value={{
        accounts,
        positions,
        activeAccountIds,
        summary,
        consolidatedHoldings,
        isLandingPage,
        setIsLandingPage,
        activeTab,
        setActiveTab,
        toggleAccountFilter,
        selectAllAccounts,
        isSyncing,
        syncStep,
        syncProgress,
        syncStepMessage,
        showSyncModal,
        setShowSyncModal,
        startSyncSequence,
        addAccount,
        disconnectAccount,
        resetToDemoData,
        aiMessages,
        sendAIMessage,
        clearAIChat,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

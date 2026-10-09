import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { LandingPage } from './components/layout/LandingPage';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { OverviewTab } from './components/overview/OverviewTab';
import { PortfolioTab } from './components/portfolio/PortfolioTab';
import { PortfolioXRayTab } from './components/xray/PortfolioXRayTab';
import { AIAssistantTab } from './components/ai/AIAssistantTab';
import { WhatIfLabTab } from './components/whatif/WhatIfLabTab';
import { DiscoveryTab } from './components/discovery/DiscoveryTab';
import { ConnectedAccountsTab } from './components/accounts/ConnectedAccountsTab';
import { SyncModal } from './components/modals/SyncModal';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isLandingPage, activeTab } = usePortfolio();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLandingPage) {
    return <LandingPage />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'xray':
        return <PortfolioXRayTab />;
      case 'ai':
        return <AIAssistantTab />;
      case 'whatif':
        return <WhatIfLabTab />;
      case 'discovery':
        return <DiscoveryTab />;
      case 'accounts':
        return <ConnectedAccountsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Persistent Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-900 text-sm">
            Nivesh<span className="text-teal-600">IQ</span>
          </span>
          <div className="w-5" />
        </div>

        {/* Desktop / Global Navbar */}
        <Navbar />

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Modals */}
      <SyncModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

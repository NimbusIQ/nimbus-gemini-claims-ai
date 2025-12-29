
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { Tool } from './types';
import { TOOLS } from './constants';
import CommandCenter from './tools/Chatbot';
import RoofInspector from './tools/ImageStudio';
import AdkWorkbench from './tools/AgentHub';
import SecurityOps from './tools/SecurityOps';
import CompanyProfile from './tools/CompanyProfile';
import XactimateBridge from './tools/XactimateBridge';
import FraudDetection from './tools/FraudDetection';
import KPIDashboard from './tools/KPIDashboard';

// Dynamic Tool Components could be imported here if created as separate files
// For now, we reuse AdkWorkbench for the Vault as they share similar tech logic
const TokenVault: React.FC = () => <AdkWorkbench isVaultMode={true} />;

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(TOOLS[0]);

  const handleNavigate = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (tool) {
      setActiveTool(tool);
    }
  };

  const renderActiveTool = () => {
    switch (activeTool.id) {
      case 'kpi-dashboard':
        return <KPIDashboard />;
      case 'fraud-detection':
        return <FraudDetection />;
      case 'company-profile':
        return <CompanyProfile onNavigate={handleNavigate} />;
      case 'command-center':
        return <CommandCenter />;
      case 'roof-inspector':
        return <RoofInspector />;
      case 'adk-workbench':
        return <AdkWorkbench />;
      case 'xactimate-bridge':
        return <XactimateBridge />;
      case 'security-ops':
        return <SecurityOps />;
      case 'token-vault':
        return <TokenVault />;
      default:
        return <div className="p-8 text-center text-gray-500">Nimbus OS Booting... Select a module.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-4 right-8 text-[10px] font-mono text-indigo-500/20 pointer-events-none select-none">
          NODE: {window.location.hostname} | LATENCY: 24ms | STATUS: AGENT_LINK_ESTABLISHED
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 italic uppercase">
              <activeTool.icon className="w-8 h-8 text-indigo-500" />
              {activeTool.name}
            </h1>
            <p className="text-gray-400 mt-1 max-w-2xl font-bold text-xs uppercase tracking-widest">{activeTool.description}</p>
          </div>
          {renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;

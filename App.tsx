
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { Tool } from './types';
import { TOOLS } from './constants';
import CommandCenter from './tools/Chatbot';
import RoofInspector from './tools/ImageStudio';
import MarketAuthority from './tools/GroundingExplorer';
import ClaimsIntelligence from './tools/TaskMaster';
import CustomerService from './tools/AudioSuite';
import SiteSurveillance from './tools/VideoLab';
import EmergencyResponse from './tools/VoiceAssistant';
import PaperworkScanner from './tools/OpenAIPlayground';
import AdkWorkbench from './tools/AgentHub';
import SecurityOps from './tools/SecurityOps';
import CompanyProfile from './tools/CompanyProfile';
import XactimateBridge from './tools/XactimateBridge';
import SheetifyCRM from './tools/CRM';
import ProductCatalog from './tools/Catalog';
import MobileFieldOps from './tools/MobileFieldOps';
import FraudDetection from './tools/FraudDetection';
import KPIDashboard from './tools/KPIDashboard';

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
      case 'mobile-field-ops':
        return <MobileFieldOps />;
      case 'fraud-detection':
        return <FraudDetection />;
      case 'company-profile':
        return <CompanyProfile onNavigate={handleNavigate} />;
      case 'command-center':
        return <CommandCenter />;
      case 'roof-inspector':
        return <RoofInspector />;
      case 'market-authority':
        return <MarketAuthority />;
      case 'adk-workbench':
        return <AdkWorkbench />;
      case 'xactimate-bridge':
        return <XactimateBridge />;
      case 'crm-suite':
        return <SheetifyCRM />;
      case 'product-catalog':
        return <ProductCatalog />;
      case 'emergency-response':
        return <EmergencyResponse />;
      case 'paperwork-scanner':
        return <PaperworkScanner />;
      case 'security-ops':
        return <SecurityOps />;
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
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <activeTool.icon className="w-8 h-8 text-indigo-500" />
              {activeTool.name}
            </h1>
            <p className="text-gray-400 mt-1 max-w-2xl">{activeTool.description}</p>
          </div>
          {renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;

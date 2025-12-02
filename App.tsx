
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

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(TOOLS[0]);

  const renderActiveTool = () => {
    switch (activeTool.id) {
      case 'command-center':
        return <CommandCenter />;
      case 'roof-inspector':
        return <RoofInspector />;
      case 'market-authority':
        return <MarketAuthority />;
      case 'claims-intelligence':
        return <ClaimsIntelligence />;
      case 'adk-workbench':
        return <AdkWorkbench />;
      case 'customer-service':
        return <CustomerService />;
      case 'site-surveillance':
        return <SiteSurveillance />;
      case 'emergency-response':
        return <EmergencyResponse />;
      case 'paperwork-scanner':
        return <PaperworkScanner />;
      default:
        return <div className="p-8 text-center">Select a module to access the Operating System.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-white mb-2">{activeTool.name}</h1>
          <p className="text-gray-400 mb-6">{activeTool.description}</p>
          {renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;

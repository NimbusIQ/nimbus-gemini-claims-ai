
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { SparklesIcon, ShieldIcon, UsersIcon, CPUIcon } from '../components/Icons';

const KPIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    avgLift: 4850,
    automationRate: 97.4,
    leadVelocity: 14.8,
    activeAgents: 12,
    materialSavings: 2840,
  });

  // Simulation loop for neural activity
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        leadVelocity: Number((prev.leadVelocity + (Math.random() - 0.5) * 0.4).toFixed(1)),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Cards: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-indigo-900/40 to-black border-indigo-500/30">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Claims Lift</div>
          <div className="text-4xl font-black text-white flex items-baseline gap-1">
            <span className="text-xl text-indigo-500">$</span>
            {metrics.avgLift.toLocaleString()}
          </div>
          <div className="mt-2 text-[10px] text-green-400 font-mono">↑ 18.2% vs MANUAL ADJ</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-black border-blue-500/30">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Lead Flow Rate</div>
          <div className="text-4xl font-black text-white">{metrics.leadVelocity} <span className="text-sm font-normal text-gray-500">/hr</span></div>
          <div className="mt-2 text-[10px] text-blue-300 font-mono italic">Syncing with Google Grounding...</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-900/20 to-black border-green-500/30">
          <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Autonomous Accuracy</div>
          <div className="text-4xl font-black text-white">{metrics.automationRate}%</div>
          <div className="mt-2 flex gap-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="bg-green-500" style={{ width: `${metrics.automationRate}%` }}></div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
          <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Supplier Index Sync</div>
          <div className="text-xl font-bold text-white uppercase">Beacon Live</div>
          <div className="mt-2 text-[10px] text-red-300 font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            PRICING VOLATILITY DETECTED
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Neural View */}
        <Card className="lg:col-span-2 p-6 flex flex-col h-96 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CPUIcon className="w-5 h-5 text-indigo-400" />
              Neural Workflow Visualization
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Reasoning</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Execution</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            {/* Simple Animated SVG Brain/Neural Network Placeholder */}
            <div className="w-full h-full opacity-60">
                <svg viewBox="0 0 400 200" className="w-full h-full text-indigo-500">
                    <circle cx="100" cy="100" r="4" fill="currentColor" className="animate-ping" />
                    <circle cx="200" cy="50" r="3" fill="currentColor" />
                    <circle cx="200" cy="150" r="3" fill="currentColor" />
                    <circle cx="300" cy="100" r="4" fill="currentColor" className="animate-ping" style={{animationDelay: '1s'}} />
                    <path d="M100 100 L200 50 M100 100 L200 150 M200 50 L300 100 M200 150 L300 100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className="animate-[dash_20s_linear_infinite]" />
                </svg>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="text-indigo-400 font-mono text-xs uppercase animate-pulse mb-1">Awaiting Site Scan Data...</div>
                 <div className="text-gray-600 text-[10px] font-mono">NODE_CLUSTER_DFW_ACTIVE</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-900/80 rounded-xl border border-gray-800 z-10">
             <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Live Logic stream</div>
             <div className="font-mono text-[9px] text-green-400 h-10 overflow-hidden line-clamp-2">
                &gt; Agent Hunter: Parsing storm coordinates 75070...<br/>
                &gt; Agent Negotiator: Cross-referencing IBC R905.2.8.5 code requirements...
             </div>
          </div>
        </Card>

        {/* Priority Deals */}
        <Card className="p-6 flex flex-col">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-green-400" />
            Priority Deals (AI Curated)
          </h3>
          <div className="space-y-3 flex-1">
            {[
              { addr: '1204 Elm St', value: '$22,400', risk: 'LOW', color: 'green' },
              { addr: '4502 Oak Ln', value: '$18,150', risk: 'HIGH', color: 'red' },
              { addr: '901 Pine Ct', value: '$34,900', risk: 'MED', color: 'yellow' },
              { addr: '221 Beryl Dr', value: '$12,200', risk: 'LOW', color: 'green' }
            ].map((deal, i) => (
              <div key={i} className="p-3 bg-gray-950 rounded-lg border border-gray-800 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-400">{deal.addr}</span>
                  <span className="text-[10px] font-mono text-gray-400">{deal.value}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[9px] text-gray-600 uppercase">Claims Intelligence Ready</span>
                   <span className={`text-[8px] px-1.5 py-0.5 rounded bg-${deal.color}-900/30 text-${deal.color}-400 font-bold border border-${deal.color}-800`}>{deal.risk} RISK</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
             <p className="text-[10px] text-indigo-200 italic leading-relaxed">
               "Nimbus predicts a 94% win rate on Elm St if shingle match is force-documented today."
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KPIDashboard;

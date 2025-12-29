
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { SparklesIcon, ShieldIcon, UsersIcon, CPUIcon, CubeIcon } from '../components/Icons';

const KPIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalAUM: 12450000,
    activeTokens: 142,
    revenueLift: 4820,
    automationHealth: 97.4,
    nodeLatency: 42,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        nodeLatency: Math.floor(40 + Math.random() * 5),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-8 bg-zinc-950 border-white/5 relative overflow-hidden shadow-2xl group hover:border-indigo-500/20 transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all">
             <CubeIcon className="w-32 h-32 text-white" />
          </div>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Assets Tokenized (AUM)</div>
          <div className="text-4xl font-black text-white italic tracking-tighter">
            <span className="text-xl text-indigo-500 mr-1">$</span>
            {(metrics.totalAUM / 1000000).toFixed(1)}M
          </div>
          <div className="mt-4 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Growth: +12.4% MoM</span>
          </div>
        </Card>

        <Card className="p-8 bg-zinc-950 border-white/5 relative overflow-hidden shadow-2xl group hover:border-indigo-500/20 transition-all">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Avg Revenue Lift / File</div>
          <div className="text-4xl font-black text-white italic tracking-tighter">
            <span className="text-xl text-indigo-500 mr-1">$</span>
            {metrics.revenueLift.toLocaleString()}
          </div>
          <div className="mt-4 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
             <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Logic: IBC-2021 Forensic</span>
          </div>
        </Card>

        <Card className="p-8 bg-zinc-950 border-white/5 relative overflow-hidden shadow-2xl group hover:border-indigo-500/20 transition-all">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Automation Health</div>
          <div className="text-4xl font-black text-white italic tracking-tighter">{metrics.automationHealth}%</div>
          <div className="mt-5 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 animate-pulse" style={{ width: `${metrics.automationHealth}%` }}></div>
          </div>
        </Card>

        <Card className="p-8 bg-zinc-950 border-white/5 relative overflow-hidden shadow-2xl group hover:border-indigo-500/20 transition-all">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Regional Node Latency</div>
          <div className="text-4xl font-black text-white italic tracking-tighter">{metrics.nodeLatency}ms</div>
          <div className="mt-4 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Status: us-south1 Active</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logic Density Visualization */}
        <Card className="lg:col-span-2 p-10 bg-zinc-950 border-white/5 flex flex-col h-[500px] relative overflow-hidden shadow-2xl rounded-[3rem]">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <CPUIcon className="w-64 h-64 text-indigo-500" />
          </div>
          <div className="flex justify-between items-center mb-10 z-10">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-widest italic">IQ Swarm Telemetry</h3>
               <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-1">Real-time Logic Density Heatmap</p>
            </div>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-zinc-900 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Reasoning Cycles</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10">
             {/* Visualizing Logic via SVG Grid */}
             <div className="grid grid-cols-10 gap-2 w-full h-full p-4">
                {[...Array(50)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-lg transition-all duration-1000 ${
                      Math.random() > 0.3 ? 'bg-indigo-600/20 border border-indigo-500/20' : 'bg-emerald-500/20 border border-emerald-500/20'
                    } ${Math.random() > 0.8 ? 'animate-pulse' : ''}`}
                    style={{ opacity: 0.2 + Math.random() * 0.8 }}
                  ></div>
                ))}
             </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-4xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">94.8% IQ SYNC</div>
                <div className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-[0.5em] mt-2">All Agents Multi-Threaded</div>
             </div>
          </div>

          <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl z-10 flex justify-between items-center">
             <div className="font-mono text-[10px] text-zinc-500 uppercase leading-none">
                <span className="text-indigo-400 font-black">&gt;</span> AGENT_LINK_ESTABLISHED: mc_kinney_node_75071
             </div>
             <div className="flex gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-zinc-600 uppercase">Throughput</span>
                   <span className="text-[11px] font-mono text-white font-bold">1.2 TB/s</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-zinc-600 uppercase">Cost/Cycle</span>
                   <span className="text-[11px] font-mono text-white font-bold">$0.002</span>
                </div>
             </div>
          </div>
        </Card>

        {/* Sovereign Asset Ledger */}
        <Card className="p-10 bg-zinc-950 border-white/5 flex flex-col shadow-2xl rounded-[3rem]">
          <h3 className="text-xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3">
            <ShieldIcon className="w-6 h-6 text-emerald-500" /> Asset Ledger
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
            {[
              { id: 'TKN-042', status: 'MINTED', val: '$24,500', label: '1204 Elm St Roof' },
              { id: 'TKN-043', status: 'AUDITING', val: '$18,150', label: '4502 Oak Ln Roof' },
              { id: 'TKN-044', status: 'PENDING', val: '$34,900', label: '901 Pine Ct Roof' },
              { id: 'TKN-045', status: 'MINTED', val: '$12,200', label: '221 Beryl Dr Roof' }
            ].map((token, i) => (
              <div key={i} className="p-5 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic">{token.label}</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-tighter border ${
                    token.status === 'MINTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    token.status === 'AUDITING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-400/20 animate-pulse' :
                    'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}>
                    {token.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-mono text-zinc-600">{token.id}</span>
                   <span className="text-[11px] font-mono text-white font-bold">{token.val}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 bg-indigo-600 rounded-[1.5rem] shadow-xl text-center cursor-pointer hover:bg-indigo-500 transition-all active:scale-95 group">
             <div className="text-[11px] font-black text-white uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Download Master Audit Log</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KPIDashboard;

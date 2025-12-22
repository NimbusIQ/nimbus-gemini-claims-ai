
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { CPUIcon, SendIcon, BotIcon, ShieldIcon } from '../components/Icons';

const AdkWorkbench: React.FC = () => {
  const [command, setCommand] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[BOOT] Nimbus IQ OS Swarm Kernel v3.8 loading...',
    '[INIT] McKinney Hub Node-1 active.',
    '[SYSTEM] Awaiting Operator directive...'
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    const userCmd = command.trim().toUpperCase();
    setTerminalLogs(prev => [...prev, `> ${userCmd}`]);
    setCommand('');

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev, 
        `[IQ_ROUTER] Analyzing intent: "${userCmd}"...`,
        `[ADK_ORCHESTRATOR] Routing to micro-agents...`,
        `[SUCCESS] Swarm action dispatched. Tracking in Sheetify.`
      ]);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
      {/* Command Terminal */}
      <Card className="lg:col-span-2 flex flex-col bg-black/80 border-indigo-500/20 font-mono overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
            <div className="flex items-center gap-2">
              <CPUIcon className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">IQ_AGENT_COMMAND_CONSOLE</span>
            </div>
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-1.5 no-scrollbar text-gray-400">
            {terminalLogs.map((log, i) => (
              <div key={i} className={`text-[11px] leading-relaxed ${
                log.startsWith('>') ? 'text-cyan-400 font-bold' : 
                log.includes('[SUCCESS]') ? 'text-green-400' : ''
              }`}>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={handleCommand} className="p-4 bg-gray-900/80 border-t border-gray-800 flex items-center gap-3">
             <span className="text-indigo-500 font-black text-xs select-none">IQ_IN:</span>
             <input 
                type="text"
                value={command}
                onChange={e => setCommand(e.target.value)}
                placeholder="ISSUE SWARM DIRECTIVE..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-white uppercase font-black placeholder:text-gray-700 tracking-wider"
             />
             <button type="submit" className="p-2 hover:bg-indigo-600/20 rounded-lg transition-all">
                <SendIcon className="w-4 h-4 text-indigo-400" />
             </button>
          </form>
      </Card>

      {/* Swarm Intelligence Sidebar */}
      <div className="space-y-6">
        <Card className="p-6 bg-gray-950 border-gray-800">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-900 pb-3 flex items-center gap-2">
            <BotIcon className="w-4 h-4" /> Agent Status Swarm
          </h3>
          <div className="space-y-4">
             {[
               { name: 'Hunter', status: 'Hunting Storms', code: 'A2A_LINK' },
               { name: 'Negotiator', status: 'Auditing Scopes', code: 'SUPP_GEN' },
               { name: 'Paperwork', status: 'Digitizing Policy', code: 'OCR_VER' }
             ].map((agent, i) => (
               <div key={i} className="p-3 bg-gray-900/40 rounded-xl border border-gray-800 hover:border-indigo-500/20 transition-all cursor-default group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-indigo-400 uppercase">{agent.name} Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px] shadow-green-500/50"></span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{agent.status}</p>
                  <div className="mt-2 text-[8px] font-mono text-gray-600 group-hover:text-gray-400 transition-colors tracking-widest">
                    SYNC_TOKEN: {agent.code}_X7
                  </div>
               </div>
             ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-950/30 to-black border-indigo-500/20 text-center">
             <div className="relative inline-block mb-4">
               <ShieldIcon className="w-12 h-12 text-indigo-600 opacity-20 mx-auto" />
               <CPUIcon className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <div className="text-2xl font-black text-white tracking-tighter">AGENT2PAYMENT</div>
             <p className="text-[9px] text-indigo-300 font-black uppercase tracking-[0.2em] mt-1">Autonomous Fund Settlement Ready</p>
             <div className="mt-4 flex gap-1 justify-center">
                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
        </Card>
      </div>
    </div>
  );
};

export default AdkWorkbench;

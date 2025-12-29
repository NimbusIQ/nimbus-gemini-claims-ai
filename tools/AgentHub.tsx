
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { CPUIcon, SendIcon, BotIcon, ShieldIcon, SparklesIcon, CubeIcon, FileCodeIcon } from '../components/Icons';

interface AdkWorkbenchProps {
  isVaultMode?: boolean;
}

const AdkWorkbench: React.FC<AdkWorkbenchProps> = ({ isVaultMode = false }) => {
  const [command, setCommand] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>(
    isVaultMode 
    ? [
        '[BOOT] Nimbus IQ Token Vault v1.0 Initialized.',
        '[INIT] us-south1-a (Dallas) Sovereign Ledger connected.',
        '[SYSTEM] Key Management: Cloud KMS Handshake SECURE.',
        '[SYSTEM] Ready for Asset Tokenization directive...'
      ]
    : [
        '[BOOT] Nimbus IQ OS Swarm Kernel v4.2 (Lab Edition) loaded.',
        '[INIT] McKinney Hub Node-1 active. Cloud Run Instance: Stateless.',
        '[SYSTEM] Identity Verified: Dustin Moore (Accountant Sniper).',
        '[SYSTEM] Swarm standing by for Agent2Agent directives...'
      ]
  );
  const [isDeploying, setIsDeploying] = useState(false);
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

    if (userCmd === 'TOKENIZE' || userCmd === 'MINT' || userCmd === 'DEPLOY') {
        handleTokenizeAction();
    } else {
        setTimeout(() => {
          setTerminalLogs(prev => [
            ...prev, 
            `[IQ_ROUTER] Intent identified: "${userCmd}"`,
            `[ADK_ORCHESTRATOR] Initializing Swarm Protocol 0x88...`,
            `[SUPP_AGENT] Syncing IBC 2021 vector database...`,
            `[SUCCESS] Swarm action dispatched. Deployment: GCP-CLOUD-RUN.`
          ]);
        }, 600);
    }
  };

  const handleTokenizeAction = async () => {
    setIsDeploying(true);
    setTerminalLogs(prev => [...prev, '[CEO_AGENT] Initiating Sovereign Tokenization Protocol...']);
    
    const steps = [
        '[BLOCKCHAIN] Connecting to Google Blockchain Node Engine (Dallas us-south1)...',
        '[TEE] Initializing Confidential Space for Document Decryption...',
        '[SEC_OPS] Fetching SovereignAsset.sol ABI from Vault...',
        '[FORENSICS] Wrapping Validation Hash: 0x88A2-NIMBUS-75071...',
        '[GAS_ORACLE] Estimating priority gas for Polygon Network...',
        '[SIGNING] CEO Agent applying cryptographic seal via KMS...',
        '[SUCCESS] Asset Tokenized! TokenID: #0042 | TX: 0x77d1...9f2'
    ];

    for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setTerminalLogs(prev => [...prev, steps[i]]);
    }
    setIsDeploying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)]">
      {/* Visual Intelligence Mindmap */}
      <Card className="lg:col-span-4 bg-gray-950 border-indigo-500/10 flex flex-col p-8 overflow-hidden relative shadow-2xl rounded-[2.5rem]">
        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10 border-b border-gray-900 pb-4 flex items-center gap-3">
          <CubeIcon className="w-5 h-5 text-indigo-500" /> {isVaultMode ? 'Asset Genealogy' : 'Swarm Logic Mindmap'}
        </h3>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="relative w-full h-full flex flex-col items-center justify-around">
                <div className="p-4 bg-indigo-600 rounded-2xl border border-indigo-400 shadow-[0_0_20px_indigo] text-center z-10 animate-bounce">
                   <div className="text-[10px] font-black text-white uppercase tracking-widest">{isVaultMode ? 'Master Token' : 'Orchestrator'}</div>
                </div>
                
                <div className="flex justify-around w-full relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-indigo-500/20"></div>
                   
                   <div className="p-4 bg-gray-900 border border-indigo-500/30 rounded-2xl text-center shadow-xl">
                      <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Hunter</div>
                      <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">Acquisition</div>
                   </div>
                   <div className="p-4 bg-gray-900 border border-green-500/30 rounded-2xl text-center shadow-xl">
                      <div className="text-[9px] font-black text-green-400 uppercase tracking-widest">Auditor</div>
                      <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">Forensics</div>
                   </div>
                   <div className="p-4 bg-gray-900 border border-red-500/30 rounded-2xl text-center shadow-xl">
                      <div className="text-[9px] font-black text-red-400 uppercase tracking-widest">Pay Agent</div>
                      <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">Monetization</div>
                   </div>
                </div>

                <div 
                    onClick={handleTokenizeAction}
                    className="p-6 bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-[2rem] text-center shadow-2xl cursor-pointer hover:border-indigo-500 group transition-all"
                >
                   <FileCodeIcon className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                   <div className="text-xl font-black text-white italic tracking-tighter">{isVaultMode ? 'MINT ASSET' : 'EXECUTE SWARM'}</div>
                   <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Trigger On-Chain Protocol</p>
                </div>
            </div>
        </div>
      </Card>

      {/* Terminal Command Console */}
      <Card className="lg:col-span-8 flex flex-col bg-black/90 border-indigo-500/10 font-mono overflow-hidden shadow-2xl rounded-[2.5rem]">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <CPUIcon className={`w-5 h-5 text-indigo-500 ${isDeploying ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="text-[11px] font-black text-indigo-100 uppercase tracking-[0.4em]">SOVEREIGN_TERMINAL_V4.2</span>
            </div>
            <div className="flex gap-2">
               <div className="px-3 py-1 bg-gray-800 rounded-full text-[9px] font-black text-gray-500">NET: POLYGON_MAINNET</div>
               <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${isDeploying ? 'bg-indigo-900 text-white animate-pulse border-indigo-400' : 'bg-green-900/20 text-green-400 border-green-900/30'}`}>
                  {isDeploying ? 'EXECUTING...' : 'ONLINE'}
               </div>
            </div>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto space-y-2 no-scrollbar text-indigo-100/60">
            {terminalLogs.map((log, i) => (
              <div key={i} className={`text-[12px] leading-relaxed animate-in slide-in-from-left-4 ${
                log.startsWith('>') ? 'text-cyan-400 font-black italic mt-4' : 
                log.includes('[SUCCESS]') ? 'text-green-400 font-black bg-green-500/5 px-2 py-1 rounded' : 
                log.includes('[INIT]') ? 'text-indigo-400 font-bold' : 
                log.includes('[CEO_AGENT]') ? 'text-white font-black animate-pulse' : ''
              }`} style={{ animationDelay: `${i * 100}ms` }}>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={handleCommand} className="p-8 bg-gray-950 border-t border-gray-900 flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-indigo-500 font-black text-[10px] uppercase tracking-widest mb-1">IQ_IN:</span>
                <span className="w-4 h-0.5 bg-indigo-500"></span>
             </div>
             <input 
                type="text"
                value={command}
                onChange={e => setCommand(e.target.value)}
                placeholder={isVaultMode ? "TYPE 'MINT' TO TOKENIZE..." : "ISSUE SWARM DIRECTIVE..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white uppercase font-black placeholder:text-gray-800 tracking-wider"
                disabled={isDeploying}
             />
             <button type="submit" disabled={isDeploying} className="w-12 h-12 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-30">
                <SendIcon className="w-5 h-5 text-indigo-400 hover:text-white" />
             </button>
          </form>
      </Card>
    </div>
  );
};

export default AdkWorkbench;

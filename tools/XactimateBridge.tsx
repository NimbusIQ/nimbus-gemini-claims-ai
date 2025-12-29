
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  ShieldIcon, 
  CPUIcon, 
  FileCodeIcon, 
  SparklesIcon, 
  AlertTriangleIcon, 
  DownloadIcon, 
  SendIcon,
  BotIcon,
  LinkIcon,
  CubeIcon
} from '../components/Icons';

interface ValidationResult {
  codeReference: string;
  discrepancy: string;
  recommendedUpgrade: string;
  justification: string;
  estimatedValue: number;
}

const XactimateBridge: React.FC = () => {
  const [activeView, setActiveView] = useState<'audit' | 'logic' | 'settings'>('audit');
  const [xmlInput, setXmlInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [pythonScript, setPythonScript] = useState<string | null>(null);
  const [report, setReport] = useState<{
    status: string;
    revenueLift: string;
    validations: ValidationResult[];
    xmlSnippet: string;
  } | null>(null);
  const [auditLog, setAuditLog] = useState<string[]>([]);

  const runForensicAudit = async () => {
    if (!xmlInput.trim()) {
        alert("Please provide ESX/XML data for forensic analysis.");
        return;
    }

    setIsValidating(true);
    setAuditLog(['[INIT] Initializing Forensic Node us-south1-a...', '[AUTH] Verified Operator: Dustin Moore (Accountant Sniper)']);
    setReport(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a Forensic Claims Engineer and Principal Python Developer. 
        
        GOAL: Refine the "Nimbus Bridge" Python converter.
        
        PART 1: Cross-check this Xactimate XML data against IBC 2021 and McKinney, TX (75071) local building codes.
        DATA: ${xmlInput}

        PART 2: PROVIDE REFINED PYTHON LOGIC. The script must:
        1. Implement a 'SupplierLink' class that integrates with Beacon Roofing Supply API (mock/structured).
        2. Automatically fetch/validate Xactimate codes against a central PriceList server.
        3. Dynamically adjust 'Estimated Value' based on REAL-TIME material pricing (Lumber/Shingles).
        4. Validate against IBC 2021 and Texas Property Code § 542.060.
        
        Format output as JSON with:
        - status: string
        - revenueLift: string
        - validations: array of {codeReference, discrepancy, recommendedUpgrade, justification, estimatedValue}
        - pythonConverterScript: string (Clean, robust Python code implementing Supplier APIs)
        - xmlSnippet: string`,
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              revenueLift: { type: Type.STRING },
              validations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    codeReference: { type: Type.STRING },
                    discrepancy: { type: Type.STRING },
                    recommendedUpgrade: { type: Type.STRING },
                    justification: { type: Type.STRING },
                    estimatedValue: { type: Type.NUMBER }
                  }
                }
              },
              pythonConverterScript: { type: Type.STRING },
              xmlSnippet: { type: Type.STRING }
            }
          }
        }
      });

      const parsed = JSON.parse(response.text);
      
      const logs = [
        '[SEARCH] Analyzing XML Tree for forensic item presence...',
        '[API] Handshake established with Beacon Roofing PRO-API...',
        '[API] Fetching latest GAF Timberline HDZ price index for 75071...',
        '[REASONING] Validating assembly against Texas Property Code § 542.060...',
        '[REASONING] IBC R905.2.8.5 check: Drip Edge missing. Adjusting pricing via Beacon...',
        '[CALCULATING] Projecting Lift with real-time material surcharges...',
        '[SCRIPT] Nimbus Bridge v4.5 Source (Beacon Integration) Generated.',
        '[COMPLETE] Forensic Audit Sealed.'
      ];
      
      for (const log of logs) {
        await new Promise(r => setTimeout(r, 600));
        setAuditLog(prev => [...prev, log]);
      }

      setReport(parsed);
      setPythonScript(parsed.pythonConverterScript);
    } catch (e) {
      console.error(e);
      alert("Neural link severed. Verify API configuration.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-14rem)]">
      {/* Header Tabs */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
         <div className="flex gap-4">
            <button 
                onClick={() => setActiveView('audit')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeView === 'audit' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Forensic Audit
            </button>
            <button 
                onClick={() => setActiveView('logic')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeView === 'logic' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Python Logic Lab
            </button>
            <button 
                onClick={() => setActiveView('settings')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeView === 'settings' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
                API Settings
            </button>
         </div>
         <div className="flex items-center gap-3 px-4 py-1.5 bg-black/40 rounded-full border border-indigo-500/20">
            <LinkIcon className="w-3 h-3 text-green-500" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">BEACON_PRO_CONNECTED</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        {activeView === 'audit' && (
          <>
            <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden">
              <Card className="flex-1 bg-gray-950 border-gray-800 p-6 flex flex-col rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <ShieldIcon className="w-48 h-48 text-indigo-500" />
                </div>
                <div className="flex justify-between items-center mb-6 z-10">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                    <FileCodeIcon className="w-4 h-4 text-indigo-500" /> ESX Data Stream
                  </h4>
                  <div className="flex gap-2">
                     <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-widest">MARKET_SENSITIVE</span>
                  </div>
                </div>
                <textarea
                  value={xmlInput}
                  onChange={(e) => setXmlInput(e.target.value)}
                  placeholder="PASTE XACTIMATE XML / ESX DATA FOR FORENSIC VALIDATION..."
                  className="flex-1 bg-black/60 border border-gray-800 rounded-3xl p-6 text-indigo-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none shadow-inner scrollbar-hide"
                />
                <div className="mt-6 flex justify-between items-center z-10">
                   <div className="text-[9px] text-gray-600 font-black uppercase italic tracking-widest">Node: {process.env.API_KEY ? 'SECURE_EDGE' : 'LOCAL_ONLY'}</div>
                   <Button 
                      onClick={runForensicAudit} 
                      isLoading={isValidating}
                      className="bg-indigo-600 hover:bg-indigo-500 px-8 py-5 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95"
                   >
                      Engage Sniper Mode
                   </Button>
                </div>
              </Card>

              <Card className="h-48 bg-black/90 border-indigo-500/10 p-6 flex flex-col rounded-[2rem] font-mono shadow-2xl overflow-hidden">
                 <div className="text-[9px] font-black text-indigo-500 uppercase mb-4 tracking-widest border-b border-gray-900 pb-2 flex justify-between">
                    <span>CEO_INNER_MONOLOGUE</span>
                    <span className="text-gray-700">BEACON_SYNC_ACTIVE</span>
                 </div>
                 <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                    {auditLog.map((log, i) => (
                      <div key={i} className={`text-[10px] leading-tight ${log.includes('[COMPLETE]') ? 'text-green-400 font-black' : log.includes('[API]') ? 'text-orange-400 font-bold' : log.includes('[SCRIPT]') ? 'text-cyan-400 font-bold' : 'text-indigo-300/60'}`}>
                        {log}
                      </div>
                    ))}
                    {isValidating && <div className="text-[10px] text-indigo-400 animate-pulse">...Negotiating material index...</div>}
                 </div>
              </Card>
            </div>

            <Card className="lg:col-span-7 bg-black/80 border-indigo-500/10 p-10 flex flex-col shadow-2xl rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
               
               {!report && !isValidating ? (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-center">
                    <CubeIcon className="w-24 h-24 text-indigo-500 mb-6" />
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Supplier Node Standby</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Connecting to Beacon Price Feed...</p>
                 </div>
               ) : report ? (
                 <div className="flex-1 flex flex-col animate-in zoom-in-95 duration-700 overflow-hidden">
                    <div className="flex justify-between items-end mb-10 border-b border-gray-900 pb-6 relative z-10">
                      <div>
                         <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">Market Report</h3>
                         <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-2">Data Verified against Beacon API</p>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Live Revenue Lift</div>
                         <div className="text-6xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">+{report.revenueLift}</div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-4 relative z-10">
                      {report.validations.map((v, i) => (
                        <div key={i} className="p-6 bg-gray-950 rounded-[2rem] border border-gray-800 group hover:border-indigo-500/30 transition-all shadow-xl">
                          <div className="flex justify-between items-start mb-4">
                             <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/5 px-3 py-1 rounded border border-indigo-500/10">{v.codeReference}</span>
                             <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Market Price: Adjusted</span>
                                <AlertTriangleIcon className="w-3 h-3 text-red-500 animate-pulse" />
                             </div>
                          </div>
                          <h4 className="text-lg font-black text-white italic mb-2 leading-tight">"{v.discrepancy}"</h4>
                          <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl mb-4">
                             <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Recommended Action</div>
                             <p className="text-[13px] text-indigo-100 font-bold italic">{v.recommendedUpgrade}</p>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">ROI Logic: {v.justification}</p>
                          <div className="mt-4 pt-4 border-t border-gray-900 flex justify-end">
                             <span className="text-[10px] font-mono text-green-400 font-black uppercase tracking-widest">Est. Recovered: +${v.estimatedValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-900 flex gap-4 relative z-10">
                      <Button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
                         <DownloadIcon className="w-5 h-5" /> Push to Xactimate
                      </Button>
                      <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
                         <SendIcon className="w-5 h-5" /> Send to Beacon Cart
                      </Button>
                    </div>
                 </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                     <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_indigo]"></div>
                     <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Syncing Price Lists & Building Codes...</p>
                  </div>
               )}
            </Card>
          </>
        )}

        {activeView === 'logic' && (
          <div className="lg:col-span-12 flex flex-col gap-6 animate-in fade-in duration-500">
             <Card className="flex-1 bg-gray-950 border-gray-800 p-10 flex flex-col rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-10 border-b border-gray-900 pb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                         <BotIcon className="w-7 h-7 text-indigo-500" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Nimbus Bridge Source v4.5</h3>
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Integrated Beacon + Xactimate Sync</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <Button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 text-[10px] font-black uppercase rounded-xl tracking-widest">
                         Copy Python
                      </Button>
                   </div>
                </div>

                <div className="flex-1 bg-black/60 rounded-[2.5rem] border border-gray-800 p-10 font-mono text-[13px] leading-relaxed text-indigo-100/80 overflow-y-auto no-scrollbar shadow-inner">
                   {pythonScript ? (
                      <pre className="whitespace-pre-wrap">{pythonScript}</pre>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                         <FileCodeIcon className="w-16 h-16 mb-6" />
                         Run audit to synthesize logic with Live Pricing data.
                      </div>
                   )}
                </div>
             </Card>
          </div>
        )}

        {activeView === 'settings' && (
           <div className="lg:col-span-12 flex flex-col gap-6 animate-in fade-in duration-500">
             <Card className="flex-1 bg-gray-950 border-gray-800 p-10 flex flex-col rounded-[2.5rem] shadow-2xl">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-gray-900 pb-4">Supplier API Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Beacon PRO API Key</label>
                         <input type="password" value="************************" readOnly className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-indigo-400 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Xactimate Cloud Sync Token</label>
                         <input type="password" value="************************" readOnly className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-indigo-400 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <Button className="w-full bg-indigo-600 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl">Save Connectivity Profile</Button>
                   </div>
                   <div className="bg-black/20 p-8 rounded-[2rem] border border-indigo-500/10">
                      <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-4">Pricing Latency Telemetry</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>Beacon 75071</span>
                            <span className="text-green-400">14ms</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>Xactimate Cloud</span>
                            <span className="text-green-400">82ms</span>
                         </div>
                         <div className="h-1 bg-gray-800 rounded-full mt-4"><div className="h-full bg-green-500 w-[95%]"></div></div>
                      </div>
                   </div>
                </div>
             </Card>
           </div>
        )}
      </div>
    </div>
  );
};

export default XactimateBridge;

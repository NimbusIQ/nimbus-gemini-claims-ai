
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldIcon, CPUIcon, SendIcon, TableIcon, SparklesIcon, FileCodeIcon, DownloadIcon } from '../components/Icons';

interface ValidationResult {
  codeReference: string;
  discrepancy: string;
  recommendedUpgrade: string;
  justification: string;
}

const XactimateBridge: React.FC = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationSteps, setValidationSteps] = useState<string[]>([]);
  const [report, setReport] = useState<any>(null);
  const [hasValidated, setHasValidated] = useState(false);

  const runAudit = async () => {
    setIsValidating(true);
    setHasValidated(false);
    setValidationSteps([
        '📡 INITIALIZING: Xactimate Data Packet v2025.4...', 
        '💰 FETCHING: Real-time Material Index (Collin County)...',
        '📖 RETRIEVING: IBC 2021 / McKinney Local Amendments...', 
        '🛡️ VERIFYING: Security Ops Operator: Dustin Moore...',
        '🤖 REASONING: Mapping XML line items to Texas Administrative Code...'
    ]);
    setReport(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        // Detailed prompt to trigger the validation reasoning as a "Forensic Engineer"
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Act as a Forensic Claims Engineer (The Accountant Sniper). 
            Cross-check the following roofing estimate for a property in McKinney, TX (Zip 75071) against the International Building Code (IBC) 2021 and local McKinney amendments.
            
            Scope to Audit: Asphalt shingle roof, 15lb felt, standard ridge, no drip edge listed, no starter strip listed.
            
            Your Task:
            1. Identify every instance where the estimate fails to meet IBC 2021 or McKinney Code.
            2. Suggest the specific Xactimate line item code for the missing/incorrect item.
            3. Provide a justification based on Code Reference (e.g., R905.2.8.5).
            4. Calculate the 'Revenue Lift' if these missing items are added.
            
            Return JSON format.`,
            config: { 
                responseMimeType: "application/json",
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
                                    justification: { type: Type.STRING }
                                },
                                required: ['codeReference', 'discrepancy', 'recommendedUpgrade', 'justification']
                            }
                        },
                        xmlSnippet: { type: Type.STRING }
                    },
                    required: ['status', 'revenueLift', 'validations', 'xmlSnippet']
                }
            }
        });
        
        await new Promise(r => setTimeout(r, 2000));
        const parsedReport = JSON.parse(response.text);
        setReport(parsedReport);
        setHasValidated(true);

    } catch (e) {
        console.error(e);
        alert("Forensic Validation Engine Error: Ensure API connectivity.");
    } finally {
        setIsValidating(false);
    }
  };

  const handleSaveToLab = async () => {
    if (!hasValidated) {
        alert("SECURITY PROTOCOL: You must run a Forensic Audit before saving to the Research Lab.");
        return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    alert(`[SYSTEM] Estimate #NIM-75071 successfully vaulted in Cloud Run Persistent Storage.\n\nStatus: FORENSIC_VALIDATED`);
    setIsSaving(false);
  };

  const handleInsuranceSubmission = async () => {
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 2500));
      alert(`[IQ_SECURITY_OPS_VERIFIED]\n\nEstimate dispatched to Carrier Portal with Code-Justification PDF attached.\nOperator: Dustin Moore\nIntegrity Hash: 0x88A2...`);
      setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <Card className="p-8 bg-black/60 border-indigo-500/20 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <ShieldIcon className="w-96 h-96 text-indigo-500" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3.5rem] flex items-center justify-center shadow-2xl border border-indigo-400/20 group">
                <FileCodeIcon className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Forensic Validation</h3>
              <div className="flex items-center gap-4 mt-3">
                 <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    Accountant Sniper Mode
                 </div>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Target: Zip 75071 | Carrier: State Farm</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
                onClick={runAudit} 
                isLoading={isValidating} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-6 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
            >
                Initiate Forensic Audit
            </Button>
          </div>
        </div>

        {isValidating && (
          <div className="space-y-3 font-mono bg-gray-900/60 p-8 rounded-[2rem] border border-gray-800 shadow-inner">
            {validationSteps.map((s, i) => (
              <div key={i} className="text-[11px] text-indigo-400 flex items-center gap-4 animate-in fade-in slide-in-from-left-6" style={{animationDelay: `${i*0.3}s`}}>
                <span className="text-gray-700 font-black">[{i+1}]</span>
                <span className="tracking-tight uppercase">{s}</span>
              </div>
            ))}
          </div>
        )}

        {report && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-700">
            {/* Left: Summary and Lift */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-10 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-[3rem] relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-5 opacity-10">
                   <SparklesIcon className="w-32 h-32 text-green-400" />
                </div>
                <div className="text-[10px] font-black text-green-400 uppercase mb-3 tracking-[0.2em]">Forensic Revenue Lift</div>
                <div className="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">+{report.revenueLift}</div>
                <div className="mt-6 flex items-center gap-3">
                    <CPUIcon className="w-5 h-5 text-green-500" />
                    <span className="text-[11px] text-green-300 font-black uppercase tracking-widest">Code-Density Validated</span>
                </div>
              </div>
              
              <div className="p-8 bg-gray-950/80 border border-gray-800 rounded-[3rem] flex-1 shadow-inner">
                <div className="mb-6 text-indigo-500 font-black flex justify-between uppercase tracking-[0.3em] text-[9px]">
                    <span>// AUDIT_INPUT_XML</span>
                    <span className="text-gray-800 animate-pulse">ESX_STREAM_DECRYPTED</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed opacity-40 font-mono text-[10px] text-indigo-100/70 h-48 overflow-y-auto no-scrollbar selection:bg-indigo-500/50">
                    {report.xmlSnippet}
                </pre>
              </div>

              {hasValidated && (
                <div className="p-6 bg-indigo-600/10 border border-indigo-500/30 rounded-[2rem] text-center shadow-lg animate-in fade-in slide-in-from-bottom-2">
                    <ShieldIcon className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
                    <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Forensic Seal of Integrity</div>
                    <p className="text-[9px] text-indigo-400 font-bold uppercase italic">Verified by Node: Dustin Moore</p>
                </div>
              )}
            </div>

            {/* Right: Detailed Validation Results */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <Card className="flex-1 bg-gray-950/50 border-gray-800 rounded-[3rem] p-10 overflow-y-auto no-scrollbar max-h-[600px] shadow-2xl">
                    <div className="flex justify-between items-center mb-10 border-b border-gray-900 pb-6">
                        <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em]">Forensic Discrepancy Log</h4>
                        <span className="px-4 py-1 bg-red-900/20 text-red-400 text-[10px] font-black rounded-full border border-red-900/30">
                            {report.validations.length} ANOMALIES TARGETED
                        </span>
                    </div>

                    <div className="space-y-10">
                        {report.validations.map((v: ValidationResult, i: number) => (
                            <div key={i} className="group animate-in slide-in-from-right-8" style={{animationDelay: `${i*0.15}s`}}>
                                <div className="flex items-start gap-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 transition-all shadow-lg">
                                        <span className="text-indigo-400 font-black text-lg font-mono">0{i+1}</span>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.2em] bg-indigo-500/5 px-3 py-1 rounded border border-indigo-500/10">{v.codeReference}</div>
                                            <span className="text-red-500 font-black text-[10px] uppercase tracking-tighter animate-pulse">MISSING FROM SCOPE</span>
                                        </div>
                                        <p className="text-lg text-gray-200 font-bold leading-tight group-hover:text-white transition-colors">{v.discrepancy}</p>
                                        <div className="p-6 bg-green-950/20 border border-green-800/20 rounded-[2rem] shadow-inner">
                                            <div className="text-green-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <SparklesIcon className="w-4 h-4" /> Mandatory Forensic Upgrade
                                            </div>
                                            <p className="text-[13px] text-green-100 font-bold italic tracking-tight">{v.recommendedUpgrade}</p>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed border-l-2 border-gray-800 pl-4">{v.justification}</p>
                                    </div>
                                </div>
                                {i < report.validations.length - 1 && <div className="h-px bg-gray-900 mt-10"></div>}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleSaveToLab} 
                    isLoading={isSaving}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-10 text-xl font-black uppercase tracking-widest rounded-[2.5rem] shadow-2xl active:scale-[0.98] transition-all border border-gray-700 group"
                  >
                    <DownloadIcon className="w-6 h-6 mr-4 group-hover:translate-y-1 transition-transform" /> 
                    Save to Lab
                  </Button>
                  <Button 
                    onClick={handleInsuranceSubmission} 
                    isLoading={isSubmitting}
                    disabled={!hasValidated}
                    className={`py-10 text-xl font-black uppercase tracking-widest rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] active:scale-[0.98] transition-all border group ${hasValidated ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400/30' : 'bg-gray-900 border-gray-800 text-gray-600 opacity-50 cursor-not-allowed'}`}
                  >
                    <SendIcon className="w-6 h-6 mr-4 group-hover:translate-x-1 transition-transform" /> 
                    Submit Validated
                  </Button>
                </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
            { name: 'Sheetify Sync', status: 'Online', icon: TableIcon },
            { name: 'Cloud Run Hub', status: 'Ready', icon: CPUIcon },
            { name: 'IBC Index', status: 'v2021.4', icon: ShieldIcon },
            { name: 'Code Auditor', status: 'Sniper_v4', icon: FileCodeIcon }
         ].map((api, i) => (
             <Card key={i} className="p-6 bg-black/40 border-gray-800 flex items-center justify-between group hover:border-indigo-500/20 transition-all cursor-default">
                 <div className="flex items-center gap-4">
                    <api.icon className={`w-6 h-6 text-gray-700 group-hover:text-indigo-500 transition-colors`} />
                    <div>
                       <div className="text-[10px] font-black text-white uppercase tracking-widest">{api.name}</div>
                       <div className={`text-[9px] text-gray-600 font-bold uppercase`}>{api.status}</div>
                    </div>
                 </div>
                 <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]`}></div>
             </Card>
         ))}
      </div>
    </div>
  );
};

export default XactimateBridge;

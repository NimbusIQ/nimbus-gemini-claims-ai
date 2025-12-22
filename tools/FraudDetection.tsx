
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldIcon, SearchIcon, AlertTriangleIcon, CPUIcon, FileTextIcon, FileCodeIcon } from '../components/Icons';

interface FraudAnalysis {
  integrityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  missingItems: { item: string; code: string; reason: string }[];
  flaggedSentences: {
    sentence: string;
    reason: string;
    category: 'DENIAL_TACTIC' | 'CARRIER_FRAUD' | 'COMPLIANCE_ERROR';
  }[];
  regulatoryContext: string;
}

const FraudDetection: React.FC = () => {
  const [data, setData] = useState('');
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeClaim = async () => {
    if (!data.trim()) return;
    setIsLoading(true);
    setAnalysis(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as the "Accountant Sniper", a forensic roofing engineer. 
        
        Analyze this claim/PDF text for Carrier Fraud and Missing Revenue:
        1. MISSING LINE ITEMS: Check for Drip Edge (RFG DRIP), Ice & Water Shield (RFG ICE), Starter (RFG STRT), etc.
        2. SUSPICIOUS SENTENCES: Flag phrases indicating "partial approval", "closed without full inspection", or attempts to bypass IBC 2021.
        3. KEYWORDS: Flag "unrelated", "wear and tear", "denied", "not covered".

        Input Text: "${data}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              integrityScore: { type: Type.NUMBER },
              riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
              missingItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    code: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['item', 'code', 'reason']
                }
              },
              flaggedSentences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sentence: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['DENIAL_TACTIC', 'CARRIER_FRAUD', 'COMPLIANCE_ERROR'] }
                  },
                  required: ['sentence', 'reason', 'category']
                }
              },
              regulatoryContext: { type: Type.STRING }
            },
            required: ['integrityScore', 'riskLevel', 'missingItems', 'flaggedSentences', 'regulatoryContext']
          }
        }
      });
      
      const result = JSON.parse(response.text);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      alert('Forensic scan failed. Verify API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-8 border-red-500/10 bg-black/60 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldIcon className="w-64 h-64 text-red-500" />
        </div>
        
        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-900/40 border border-red-400/30">
            <ShieldIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Fraud Sentinel</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[11px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Sniper Mode: Active</span>
               <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Op: Dustin Moore</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                <span>// ESTIMATE_DATA_STREAM</span>
                <span className="text-red-500/50">Forensic_Audit_v4.2</span>
            </div>
            <textarea
              rows={8}
              value={data}
              onChange={e => setData(e.target.value)}
              placeholder="PASTE CLAIM NARRATIVE, ADJUSTER EMAILS, OR PDF TEXT FOR NEUTRALIZATION..."
              className="w-full bg-gray-950 border border-gray-800 rounded-[2rem] p-8 text-white font-mono text-sm focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-gray-800 shadow-inner"
            />
            <div className="flex justify-between items-center px-2">
                <div className="text-[10px] text-gray-600 font-mono italic">"Accuracy is the only metric."</div>
                <Button onClick={analyzeClaim} isLoading={isLoading} className="bg-red-600 hover:bg-red-500 px-12 py-7 text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all active:scale-95">
                  Execute Forensic Scan
                </Button>
            </div>
        </div>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-6 duration-700">
            {/* Integrity Meter */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="p-10 flex flex-col items-center justify-center text-center bg-gray-950 border-gray-800 shadow-2xl">
                     <div className="text-[11px] font-black text-gray-500 uppercase mb-4 tracking-[0.4em]">Claim Integrity Metric</div>
                     <div className={`text-8xl font-black italic tracking-tighter ${analysis.integrityScore > 75 ? 'text-green-500' : analysis.integrityScore > 50 ? 'text-yellow-500' : 'text-red-500'} drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]`}>
                        {analysis.integrityScore}%
                     </div>
                     <div className="mt-8 flex flex-col items-center gap-3">
                        <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border-2 ${
                            analysis.riskLevel === 'LOW' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            analysis.riskLevel === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                            'bg-red-500/10 text-red-400 border-red-500/40 animate-pulse'
                        }`}>
                            {analysis.riskLevel} RISK PROFILE
                        </span>
                        <div className="text-[9px] text-gray-700 font-black uppercase tracking-[0.2em]">Verified by Accountant Sniper Hub</div>
                     </div>
                </Card>

                <Card className="p-8 bg-red-950/10 border-red-500/20">
                     <h4 className="text-[11px] font-black text-red-400 uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-red-900/30 pb-3">
                        <FileCodeIcon className="w-5 h-5" /> Missing Revenue Audit
                     </h4>
                     <div className="space-y-4">
                        {analysis.missingItems.map((item, i) => (
                            <div key={i} className="p-4 bg-black/60 rounded-2xl border border-gray-800 group hover:border-red-500/20 transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-black text-white">{item.item}</span>
                                    <span className="text-[9px] font-mono text-red-500 font-black">-{item.code}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium leading-tight">{item.reason}</p>
                            </div>
                        ))}
                     </div>
                </Card>
            </div>

            {/* Flagged Narratives */}
            <div className="lg:col-span-8 space-y-6">
                <Card className="p-10 bg-gray-950 border-gray-800 h-full flex flex-col shadow-2xl">
                    <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-gray-900 pb-4">
                        <AlertTriangleIcon className="w-5 h-5 text-red-500" /> Flagged Sentences (Denial Tactics)
                    </h4>
                    <div className="space-y-8 flex-1">
                        {analysis.flaggedSentences.map((flag, i) => (
                            <div key={i} className="group relative animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="flex gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 font-black text-sm ${
                                        flag.category === 'DENIAL_TACTIC' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                    }`}>
                                        !
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <p className="text-sm text-gray-200 font-bold leading-relaxed bg-black/40 p-5 rounded-3xl border border-gray-800 italic group-hover:text-white transition-colors">
                                            "{flag.sentence}"
                                        </p>
                                        <div className="flex flex-col gap-1 pl-1">
                                            <div className="text-[10px] font-black text-red-400 uppercase tracking-widest"> Sniper Justification:</div>
                                            <p className="text-[12px] text-gray-400 font-medium">{flag.reason}</p>
                                        </div>
                                    </div>
                                </div>
                                {i < analysis.flaggedSentences.length - 1 && <div className="h-px bg-gray-900 mt-8"></div>}
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 p-6 bg-red-950/20 border border-red-500/20 rounded-[2.5rem]">
                        <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <ShieldIcon className="w-4 h-4" /> Regulatory Legal Grounding
                        </div>
                        <p className="text-[11px] text-gray-300 font-bold italic leading-relaxed">
                            "{analysis.regulatoryContext}"
                        </p>
                    </div>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetection;

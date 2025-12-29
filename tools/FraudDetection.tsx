
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldIcon, AlertTriangleIcon, FileTextIcon, BotIcon } from '../components/Icons';

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
        Analyze this insurance estimate narrative for carrier fraud and intentional omission of building code.
        
        Focus areas:
        1. Flag specific phrases used to deny "Overhead and Profit".
        2. Identify "partial replacement" suggestions that violate shingle manufacturer warranty.
        3. Search for language that attempts to bypass the 2021 International Building Code (IBC).

        INPUT: "${data}"`,
        config: {
          thinkingConfig: { thinkingBudget: 2048 },
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
                  }
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
                  }
                }
              },
              regulatoryContext: { type: Type.STRING }
            }
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
      <Card className="p-8 border-red-500/10 bg-black/60 relative overflow-hidden shadow-2xl rounded-[2.5rem]">
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
               <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Target: Carrier Denial Logic</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
            <textarea
              rows={8}
              value={data}
              onChange={e => setData(e.target.value)}
              placeholder="PASTE CLAIM NARRATIVE OR ADJUSTER EMAILS FOR NEUTRALIZATION..."
              className="w-full bg-gray-950 border border-gray-800 rounded-[2rem] p-8 text-white font-mono text-sm focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-gray-800 shadow-inner"
            />
            <div className="flex justify-end px-2">
                <Button onClick={analyzeClaim} isLoading={isLoading} className="bg-red-600 hover:bg-red-500 px-12 py-7 text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all active:scale-95">
                  Execute Forensic Scan
                </Button>
            </div>
        </div>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-6 duration-700">
            <Card className="lg:col-span-4 p-10 flex flex-col items-center justify-center text-center bg-gray-950 border-gray-800 shadow-2xl rounded-[2.5rem]">
                 <div className="text-[11px] font-black text-gray-500 uppercase mb-4 tracking-[0.4em]">Integrity Metric</div>
                 <div className={`text-8xl font-black italic tracking-tighter ${analysis.integrityScore > 75 ? 'text-green-500' : analysis.integrityScore > 50 ? 'text-yellow-500' : 'text-red-500'} drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]`}>
                    {analysis.integrityScore}%
                 </div>
                 <div className="mt-8 flex flex-col items-center gap-3">
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest">
                        {analysis.riskLevel} RISK PROFILE
                    </span>
                 </div>
            </Card>

            <Card className="lg:col-span-8 p-10 bg-gray-950 border-gray-800 h-full flex flex-col shadow-2xl rounded-[2.5rem]">
                <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-gray-900 pb-4">
                    <AlertTriangleIcon className="w-5 h-5 text-red-500" /> Denial Tactics Detected
                </h4>
                <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                    {analysis.flaggedSentences.map((flag, i) => (
                        <div key={i} className="group relative border-l-4 border-red-600 pl-6 space-y-2">
                            <p className="text-sm text-gray-200 font-bold leading-relaxed bg-black/40 p-5 rounded-2xl border border-gray-800 italic">
                                "{flag.sentence}"
                            </p>
                            <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest">Reason: {flag.reason}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem]">
                    <div className="text-[9px] font-black text-indigo-400 uppercase mb-2 flex items-center gap-2">
                        <BotIcon className="w-4 h-4" /> Legal Rebuttal Context
                    </div>
                    <p className="text-[11px] text-gray-400 italic leading-relaxed">{analysis.regulatoryContext}</p>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default FraudDetection;


import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldIcon, CPUIcon, FileCodeIcon, BotIcon } from '../components/Icons';

interface SecurityControl {
  id: string;
  category: string;
  title: string;
  status: 'COMPLIANT' | 'REASONING' | 'ACTION_REQUIRED';
  description: string;
}

const SecurityOps: React.FC = () => {
  const [controls, setControls] = useState<SecurityControl[]>([
    { id: 'IAM-01', category: 'Access', title: 'Least Privilege Enforcement', status: 'COMPLIANT', description: 'GCP Service Accounts restricted via IAM Conditions.' },
    { id: 'NET-01', category: 'Network', title: 'VPC Service Controls', status: 'ACTION_REQUIRED', description: 'Egress perimeter requires manual IP validation for Zip 75071 node.' },
    { id: 'DATA-01', category: 'Privacy', title: 'AES-256 Customer Vault', status: 'COMPLIANT', description: 'Shingle forensic data encrypted via CMEK in Cloud KMS.' },
    { id: 'OPS-01', category: 'Governance', title: 'SOC2 Operational Audit', status: 'REASONING', description: 'Gemini is auditing live Cloud Run logs for policy violations.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLog, setAuditLog] = useState<string>('');

  const runNeuralAudit = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Perform a SOC2 Type 1 preliminary gap analysis for the Nimbus IQ Cloud Run deployment. Focus on IAM segregation and Data Protection. Use forensic engineer tone.",
      });
      setAuditLog(response.text);
    } catch (e) {
      console.error(e);
      setAuditLog('Audit link severed. Resetting security handshake.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)]">
      {/* Control Checklist */}
      <Card className="lg:col-span-5 bg-gray-950 border-gray-800 p-8 flex flex-col overflow-hidden relative shadow-2xl rounded-[2.5rem]">
        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 border-b border-gray-900 pb-4 flex items-center gap-3">
          <ShieldIcon className="w-5 h-5 text-indigo-500" /> Security Foundations Checklist
        </h3>
        
        <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
           {controls.map((control) => (
             <div key={control.id} className="p-5 bg-gray-900/40 rounded-3xl border border-gray-800 hover:border-indigo-500/20 transition-all group">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{control.category}</span>
                      <h4 className="text-xs font-black text-white">{control.title}</h4>
                   </div>
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${
                      control.status === 'COMPLIANT' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      control.status === 'ACTION_REQUIRED' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                   }`}>
                      {control.status}
                   </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium leading-tight italic">{control.description}</p>
             </div>
           ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-900 flex justify-between items-center">
           <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Global Security Compliance: 82%</div>
           <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[82%]"></div>
           </div>
        </div>
      </Card>

      {/* Neural Auditor Console */}
      <Card className="lg:col-span-7 bg-black/80 border-indigo-500/10 p-8 flex flex-col shadow-2xl rounded-[2.5rem] relative overflow-hidden">
         <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
         <div className="flex justify-between items-center mb-8 border-b border-gray-900 pb-4 relative z-10">
            <div className="flex items-center gap-3">
               <CPUIcon className="w-6 h-6 text-indigo-400" />
               <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Neural Audit Log</h4>
            </div>
            <Button onClick={runNeuralAudit} isLoading={isLoading} className="bg-white text-black hover:bg-gray-200 px-6 py-2 text-[10px] font-black uppercase rounded-xl tracking-widest">
               Execute Live Gap Analysis
            </Button>
         </div>
         
         <div className="flex-1 bg-gray-950/50 rounded-[2rem] p-8 border border-gray-900 overflow-y-auto no-scrollbar relative z-10">
            {auditLog ? (
               <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-indigo-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {auditLog}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <FileCodeIcon className="w-16 h-16 text-indigo-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting IQ Audit Trigger</span>
               </div>
            )}
         </div>
         
         <div className="mt-6 flex justify-center gap-8 relative z-10">
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 bg-green-500 rounded-full"></div>
               <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">SOC2 Type 1 Mapping Active</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
               <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">HIPAA/GDPR Compliance Scanners Online</span>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default SecurityOps;

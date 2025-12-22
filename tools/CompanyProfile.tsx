
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SparklesIcon, ShieldIcon, CPUIcon, BotIcon, InfoIcon, FileCodeIcon } from '../components/Icons';

const CompanyProfile: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* SaaS Hero */}
      <section className="text-center py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="inline-flex items-center space-x-3 bg-indigo-950/40 border border-indigo-500/30 rounded-full px-6 py-2.5 mb-10 shadow-2xl">
          <SparklesIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-[11px] font-black text-indigo-100 uppercase tracking-widest">Google Cloud Startups: Production Cluster Active</span>
        </div>

        <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
          Nimbus IQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient-x text-glow">Research Lab</span>
        </h1>
        <p className="text-3xl text-gray-400 font-black max-w-4xl mx-auto leading-tight italic uppercase tracking-tighter">
          "The Accountant Sniper: High-Lethality Forensics for Vertical SaaS."
        </p>
        
        <div className="flex justify-center items-center gap-10 mt-16">
          <Button onClick={() => onNavigate('kpi-dashboard')} className="bg-white text-black hover:bg-gray-200 px-14 py-8 text-2xl font-black rounded-[2.5rem] shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all active:scale-95">
            Initialize OS
          </Button>
          <div className="text-left">
             <div className="flex items-center gap-3 text-[12px] font-black text-gray-500 uppercase tracking-widest mb-1">
                <CPUIcon className="w-4 h-4 text-indigo-500" />
                Status: Google Cloud Run Ready
             </div>
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Stateless Micro-Agent Architecture</p>
          </div>
        </div>
      </section>

      {/* The Persona - Accountant Sniper */}
      <Card className="p-16 bg-gray-950 border-gray-800 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-all duration-700 pointer-events-none">
           <ShieldIcon className="w-80 h-80 text-indigo-500" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-10">
              <div>
                <h2 className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-6">Tactical Field-Forward Lead</h2>
                <h3 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Dustin Moore</h3>
                <p className="text-xl text-gray-500 font-bold mt-4 uppercase tracking-tighter border-l-4 border-indigo-600 pl-6">
                    Forensic Engineer | Accountant Sniper | Lead Architect
                </p>
              </div>
              
              <div className="space-y-8 max-w-2xl">
                 <p className="text-lg text-gray-400 leading-relaxed font-medium">
                    "I build software that audits like an accountant and targets revenue like a sniper." Dustin Moore is the sole operator of the Nimbus IQ Lab. He is a field-forward engineer focused on neutralizing carrier denial tactics through automated spatial vision and forensic XML grounding. 
                 </p>
                 <div className="flex gap-6">
                    <div className="px-6 py-3 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-3xl">
                       <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">TX Adjuster #2820344</span>
                    </div>
                    <div className="px-6 py-3 bg-cyan-600/10 border-2 border-cyan-500/20 rounded-3xl">
                       <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">GCP Architect</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 flex flex-col justify-center gap-8">
              <div className="p-8 bg-black/60 rounded-[3rem] border border-indigo-500/10">
                <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-900 pb-3">Unit Capabilities</h4>
                <ul className="space-y-4">
                    {[
                    "Stateless Cloud Run Swarms",
                    "Forensic Code Auditing (IBC 2021)",
                    "Spatial Triangulation (99.7% Accuracy)",
                    "Lethal Revenue Discovery Protocols"
                    ].map((cap, i) => (
                        <li key={i} className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1 shadow-[0_0_8px_indigo]"></div>
                        <span className="text-[12px] font-black text-gray-300 uppercase tracking-tight leading-none">{cap}</span>
                        </li>
                    ))}
                </ul>
              </div>
           </div>
        </div>
      </Card>

      {/* Architectural Rigor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'Stateless Hub', desc: 'Nimbus is engineered for Cloud Run deployment. Planet-scale scaling for storm-event surge response.', icon: CPUIcon },
            { title: 'Forensic Rigor', desc: 'Trained on 50,000+ Xactimate line items and IBC amendments for mathematical financial dominance.', icon: FileCodeIcon },
            { title: 'Field-Forward', desc: 'Built for engineers in the field. Real-time spatial measurements and Voice AI feedback loop.', icon: BotIcon }
          ].map((feature, i) => (
            <Card key={i} className="p-10 border-indigo-500/10 hover:border-indigo-500/40 transition-all bg-black/40 group shadow-xl">
               <feature.icon className="w-12 h-12 text-indigo-500 mb-8 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">{feature.title}</h3>
               <p className="text-[13px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">{feature.desc}</p>
            </Card>
          ))}
      </div>

      <footer className="text-center py-16 border-t border-gray-900">
        <div className="flex flex-col items-center gap-6">
           <div className="flex gap-2 h-1">
              <div className="w-16 bg-indigo-600 rounded-full"></div>
              <div className="w-4 bg-gray-800 rounded-full"></div>
              <div className="w-4 bg-gray-800 rounded-full"></div>
           </div>
           <p className="text-[11px] text-gray-600 font-black uppercase tracking-[0.5em]">
             Nimbus IQ AI Research Lab © 2025 | Accountant Sniper Protocol v4.0 | CLOUD_RUN_READY
           </p>
        </div>
      </footer>
    </div>
  );
};

export default CompanyProfile;

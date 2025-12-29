
import React from 'react';
import type { Tool } from '../types';
import { TOOLS } from '../constants';
import { CPUIcon, SparklesIcon, BotIcon, ShieldIcon } from './Icons';

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-80 bg-zinc-950 border-r border-white/5 p-6 flex flex-col h-screen overflow-hidden backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="flex flex-col mb-10">
        <div className="flex items-center mb-6 group cursor-pointer">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl flex items-center justify-center mr-4 shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-all duration-500 border border-white/10">
            <BotIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic">Nimbus IQ</h1>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Sovereign OS</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-3 py-2">
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Google Startups Partner</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
            <ShieldIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">SOC 2 Type II Verified</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4 ml-2">Core Modules</div>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool);
              if (navigator.vibrate) navigator.vibrate(5);
            }}
            className={`w-full flex items-center px-4 py-3.5 text-xs font-black rounded-xl transition-all duration-300 group border ${
              activeTool.id === tool.id
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.4)] scale-[1.02]'
                : 'text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-200'
            }`}
          >
            <tool.icon className={`w-5 h-5 mr-3 transition-colors ${activeTool.id === tool.id ? 'text-white' : 'text-zinc-600 group-hover:text-indigo-400'}`} />
            <span className="truncate tracking-widest uppercase">{tool.name}</span>
          </button>
        ))}
      </nav>
      
      {/* System Telemetry Footer */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
               <CPUIcon className="w-3 h-3" /> System Status
             </div>
             <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
             </div>
          </div>
          <div className="space-y-2.5">
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Vertex AI</span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">ONLINE</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Dallas Node</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">us-south1-a</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Confidential TEE</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">ENCRYPTED</span>
             </div>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 w-[92%]"></div>
          </div>
          <div className="text-center">
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">Powered by Google Cloud</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

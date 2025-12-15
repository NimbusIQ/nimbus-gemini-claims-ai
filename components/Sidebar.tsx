
import React from 'react';
import type { Tool } from '../types';
import { TOOLS } from '../constants';
import { CPUIcon, SparklesIcon } from './Icons';

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-64 bg-gray-950/70 backdrop-blur-sm border-r border-gray-700/50 p-4 flex flex-col">
      <div className="flex flex-col mb-6">
        <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            </div>
            <h1 className="text-lg font-bold text-white leading-tight">Nimbus<br/><span className="text-cyan-400">Roofing AI</span></h1>
        </div>
        <div className="inline-flex items-center space-x-1.5 bg-gray-800/80 rounded px-2 py-1 self-start border border-gray-700">
            <SparklesIcon className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] font-medium text-gray-300">Google for Startups</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
                setActiveTool(tool);
                if (navigator.vibrate) navigator.vibrate(5);
            }}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTool.id === tool.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <tool.icon className={`w-5 h-5 mr-3 ${activeTool.id === tool.id ? 'text-white' : 'text-gray-500'}`} />
            <span className="truncate">{tool.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-800 flex items-center space-x-3">
            <CPUIcon className="w-8 h-8 text-green-500/80" />
            <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Active Model</div>
                <div className="text-xs text-green-400 font-mono font-semibold">Gemini 3 Nano</div>
                <div className="text-[10px] text-gray-500">Quantized (Int8)</div>
            </div>
        </div>
      </div>
    </aside>
  );
};

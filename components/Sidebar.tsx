
import React from 'react';
import type { Tool } from '../types';
import { TOOLS } from '../constants';

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-64 bg-gray-950/70 backdrop-blur-sm border-r border-gray-700/50 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">RoofAI Pro</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTool.id === tool.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <tool.icon className="w-5 h-5 mr-3" />
            <span>{tool.name}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>Powered by Nimbus IQ</p>
        <p>ADK Architecture v2.0</p>
      </div>
    </aside>
  );
};

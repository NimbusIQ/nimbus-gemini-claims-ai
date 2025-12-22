
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { TableIcon, SearchIcon, CPUIcon, SparklesIcon } from '../components/Icons';

interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: 'Lead' | 'Inspection' | 'Contract' | 'Paid';
  value: number;
  seoKeyword: string;
  marketRank: number;
}

const SheetifyCRM: React.FC = () => {
  const [leads] = useState<Lead[]>([
    { id: '1', name: 'Dustin Moore', phone: '214-612-6696', address: 'McKinney, TX 75071', status: 'Contract', value: 24500, seoKeyword: 'McKinney Hail Damage', marketRank: 1 },
    { id: '2', name: 'James Wilson', phone: '972-555-0199', address: 'Frisco, TX 75034', status: 'Inspection', value: 18200, seoKeyword: 'Roof Repair Frisco', marketRank: 3 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-indigo-500/20 backdrop-blur-md">
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-indigo-600 text-white shadow-lg">
              <TableIcon className="w-4 h-4" /> CRM Pipeline
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300">
              <SearchIcon className="w-4 h-4" /> Market Grounding
            </button>
        </div>
        <div className="flex items-center gap-4 px-5 bg-indigo-900/10 border border-indigo-500/20 rounded-xl h-10">
             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Global SEO Authority</div>
             <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse" style={{ width: '88%' }}></div>
             </div>
             <span className="text-xs font-mono font-bold text-cyan-400">88.4%</span>
        </div>
      </div>

      <Card className="overflow-hidden border-indigo-500/10 bg-black/20 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-900/80 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] border-b border-gray-800">
                  <th className="px-6 py-5">Customer Intelligence</th>
                  <th className="px-6 py-5">SEO Keyword Match</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Est. P&L</th>
                  <th className="px-6 py-5 text-right">IQ Scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-indigo-600/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{lead.address}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-indigo-300 font-bold italic">#{lead.seoKeyword}</span>
                          <span className="text-[9px] text-gray-600 uppercase">Local Rank: #{lead.marketRank}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-tighter ${
                        lead.status === 'Contract' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-200 font-bold tracking-tight">${lead.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-indigo-600/20 rounded-lg transition-all">
                          <CPUIcon className="w-4 h-4 text-indigo-500" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 bg-indigo-950/20 border-indigo-500/10">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Brain Assist Sync</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Automatic lead ingestion from Google Maps Grounding is active. Currently monitoring storm tracks in Collin County for autonomous keyword injection into the Sheetify Spreadsheet.
          </p>
        </Card>
        <Card className="p-6 bg-cyan-950/20 border-cyan-500/10 flex flex-col justify-center">
          <div className="text-[10px] font-black text-cyan-400 uppercase mb-1">Sheetify Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">Fully Synced</span>
          </div>
          <div className="text-[9px] text-gray-500 font-mono mt-2 uppercase tracking-widest">v4.2 Enterprise Gateway</div>
        </Card>
      </div>
    </div>
  );
};

export default SheetifyCRM;

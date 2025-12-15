
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { TableIcon, SparklesIcon, UsersIcon } from '../components/Icons';

interface Lead {
  id: string;
  name: string;
  address: string;
  status: 'New' | 'Qualified' | 'Inspection' | 'Contract';
  value: number;
  lastContact: string;
}

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Dustin Moore', address: '1308 Caney Creek Lane, McKinney, TX', status: 'Contract', value: 25000, lastContact: '2025-05-12' },
  { id: '2', name: 'John Doe', address: '4502 Elm St, Frisco, TX', status: 'New', value: 18500, lastContact: '2025-05-14' },
];

const SheetifyCRM: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [manualForm, setManualForm] = useState({ name: '', address: '', value: '' });
  const [rawInput, setRawInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleManualSubmit = () => {
    if (!manualForm.name || !manualForm.address) return;
    const newLead: Lead = {
      id: Date.now().toString(),
      name: manualForm.name,
      address: manualForm.address,
      status: 'New',
      value: Number(manualForm.value) || 0,
      lastContact: new Date().toISOString().split('T')[0]
    };
    setLeads([...leads, newLead]);
    setManualForm({ name: '', address: '', value: '' });
  };

  const handleAutoProcess = async () => {
    if (!rawInput.trim()) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `
        Act as a CRM Data Entry Specialist. Parse the following unstructured text into a JSON array of leads.
        Each lead should have: name, address, status (New, Qualified, Inspection, Contract), value (number), and lastContact (YYYY-MM-DD).
        If value is missing, estimate based on context or set to 0. If status missing, set to 'New'.
        
        Input Text: "${rawInput}"
        
        Return ONLY valid JSON.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      const parsedLeads = JSON.parse(response.text);
      // Validate and add IDs
      const formattedLeads = parsedLeads.map((l: any, i: number) => ({
        ...l,
        id: `auto-${Date.now()}-${i}`,
        value: Number(l.value) || 0
      }));
      
      setLeads([...leads, ...formattedLeads]);
      setRawInput('');
    } catch (e) {
      console.error("Failed to parse leads", e);
      alert("Nimbus Brain could not parse that text. Try a clearer format.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Mode Switcher */}
      <Card className="p-4 flex flex-col md:flex-row justify-between items-center bg-gray-800/80 border-gray-700">
         <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode === 'manual' ? 'bg-indigo-600' : 'bg-purple-600'}`}>
                {mode === 'manual' ? <UsersIcon className="w-6 h-6 text-white"/> : <SparklesIcon className="w-6 h-6 text-white"/>}
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Sheetify CRM</h2>
                <p className="text-xs text-gray-400">
                    {mode === 'manual' ? 'Operator: Dustin Moore (Manual Entry)' : 'Operator: Nimbus Brain (AI Auto-Pilot)'}
                </p>
            </div>
         </div>
         
         <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
            <button 
                onClick={() => setMode('manual')}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                Manual Entry
            </button>
            <button 
                onClick={() => setMode('auto')}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'auto' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                Nimbus Brain Assist
            </button>
         </div>
      </Card>

      {/* Input Area */}
      <Card className="p-6 border-gray-700/50">
        {mode === 'manual' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Lead Name</label>
                    <input 
                        type="text" 
                        value={manualForm.name}
                        onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Jane Smith"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Property Address</label>
                    <input 
                        type="text" 
                        value={manualForm.address}
                        onChange={(e) => setManualForm({...manualForm, address: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. 123 Main St, Dallas, TX"
                    />
                </div>
                <div className="md:col-span-1">
                     <label className="block text-xs font-medium text-gray-400 mb-1">Est. Value ($)</label>
                    <div className="flex space-x-2">
                         <input 
                            type="number" 
                            value={manualForm.value}
                            onChange={(e) => setManualForm({...manualForm, value: e.target.value})}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="20000"
                        />
                        <Button onClick={handleManualSubmit} className="bg-indigo-600 hover:bg-indigo-500 px-4">Add</Button>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                 <label className="block text-sm font-medium text-purple-400 mb-2 flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-2"/>
                    Paste Unstructured Data (Emails, SMS, Notes)
                </label>
                <textarea
                    rows={4}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="e.g. 'Met John at 405 Oak St, looks like a 20k job. Also Sarah from 909 Pine needs an inspection asap.'"
                    className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-600"
                />
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleAutoProcess} isLoading={isProcessing} className="bg-purple-600 hover:bg-purple-500">
                        Process with Nimbus Brain
                    </Button>
                </div>
            </div>
        )}
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden border-gray-700">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-4">Lead Name</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Value</th>
                        <th className="px-6 py-4">Last Contact</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                            <td className="px-6 py-4">{lead.address}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                    lead.status === 'Contract' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                    lead.status === 'Inspection' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                    'bg-gray-700 text-gray-300 border-gray-600'
                                }`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-300">${lead.value.toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs">{lead.lastContact}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">Edit</button>
                            </td>
                        </tr>
                    ))}
                    {leads.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No leads found. Add manually or use Nimbus Brain.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default SheetifyCRM;


import React, { useState } from 'react';
import { GoogleGenAI, type GroundingChunk } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { SearchIcon, LinkIcon, ShareIcon } from '../components/Icons';

type Tab = 'content' | 'backlinks' | 'social';

const MarketAuthority: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const presets = {
    content: [
        "Find recent hail reports in Plano, TX and write a 'Zero-Click' optimized landing page intro.",
        "Search for 'emergency tarping services' trends in my area and suggest keywords."
    ],
    backlinks: [
        "Find 5 high-authority roofing or home improvement blogs accepting guest posts.",
        "Draft a link exchange outreach email to a local real estate agency for nimbusroofing.com."
    ],
    social: [
        "Create a week of LinkedIn posts about GAF Master Elite status and its benefits.",
        "Write a Facebook post regarding the recent storm in McKinney, TX with a CTA to schedule inspection."
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a strategy goal.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult('');
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      let systemInstruction = "";
      if (activeTab === 'content') systemInstruction = "Act as a Geo-Local SEO expert. Output must be indexable by Google/OpenAI.";
      if (activeTab === 'backlinks') systemInstruction = "Act as an SEO Link Building Specialist. Focus on high domain authority opportunities for roofing contractors.";
      if (activeTab === 'social') systemInstruction = "Act as a Social Media Manager. Create platform-specific task lists and captions.";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${systemInstruction} Context: nimbusroofing.com McKinney TX. Task: ${prompt}`,
        config: {
             tools: [{ googleSearch: {} }],
        }
      });

      setResult(response.text);
      setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Strategy failure: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="border-b border-gray-800 bg-gray-900/50 rounded-t-xl overflow-hidden">
            <div className="flex overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveTab('content')} 
                  className={`flex items-center gap-2 py-4 px-6 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <SearchIcon className="w-4 h-4"/> Authority Content
                </button>
                <button 
                  onClick={() => setActiveTab('backlinks')} 
                  className={`flex items-center gap-2 py-4 px-6 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'backlinks' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <LinkIcon className="w-4 h-4"/> Link Exchange
                </button>
                <button 
                  onClick={() => setActiveTab('social')} 
                  className={`flex items-center gap-2 py-4 px-6 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'social' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <ShareIcon className="w-4 h-4"/> Social Task Force
                </button>
            </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Strategy Blueprint</label>
            <div className="flex flex-wrap gap-2">
              {presets[activeTab].map((p, i) => (
                  <button key={i} onClick={() => setPrompt(p)} className="text-left text-xs bg-gray-800/80 hover:bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-400 transition-all hover:border-indigo-500/30 max-w-sm">
                      {p}
                  </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Custom Directive</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter strategy objectives..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Execute Global SEO Task
            </Button>
          </div>
        </div>
      </Card>

      {(isLoading || result || error) && (
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white">Strategy Output</h3>
              {isLoading && <Spinner />}
            </div>
            
            {error && <p className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</p>}
            
            {result && (
               <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white leading-relaxed">
                 <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800 whitespace-pre-wrap font-sans">
                   {result}
                 </div>
               </div>
            )}
            
            {sources.length > 0 && (
                <div className="mt-8 p-6 bg-indigo-900/10 rounded-2xl border border-indigo-500/20">
                    <h4 className="font-bold mb-4 text-indigo-400 text-sm uppercase tracking-widest flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Market Grounding Sources
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sources.map((chunk, index) => {
                             const web = chunk.web;
                             const sourceUri = web?.uri;
                             const sourceTitle = web?.title || sourceUri;
 
                             if (!sourceUri) return null;
                             return (
                                 <li key={index} className="truncate">
                                     <a href={sourceUri} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2">
                                       <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                       {sourceTitle}
                                     </a>
                                 </li>
                             );
                        })}
                    </ul>
                </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MarketAuthority;

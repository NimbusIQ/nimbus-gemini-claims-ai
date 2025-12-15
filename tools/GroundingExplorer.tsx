
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
        "Draft a link exchange outreach email to a local real estate agency."
    ],
    social: [
        "Create a week of LinkedIn posts about the benefits of Impact Resistant Shingles.",
        "Write a Facebook post regarding the recent storm in McKinney, TX using urgency."
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult('');
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      let systemInstruction = "";
      if (activeTab === 'content') systemInstruction = "Act as a Geo-Local SEO expert and Content Strategist.";
      if (activeTab === 'backlinks') systemInstruction = "Act as an SEO Off-Page Specialist and Link Building Strategist. Focus on high domain authority opportunities.";
      if (activeTab === 'social') systemInstruction = "Act as a Social Media Manager. Create engaging, platform-specific content.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction} ${prompt}`,
        config: {
             tools: [{ googleSearch: {} }, {googleMaps: {}}],
        }
      });

      setResult(response.text);
      setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate content: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        {/* Tab Navigation */}
        <div className="border-b border-gray-700/50 bg-gray-800/50 rounded-t-xl px-2">
            <div className="flex space-x-2 overflow-x-auto">
                <button onClick={() => setActiveTab('content')} className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                    <SearchIcon className="w-4 h-4 mr-2"/> SEO Content
                </button>
                <button onClick={() => setActiveTab('backlinks')} className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'backlinks' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                    <LinkIcon className="w-4 h-4 mr-2"/> Backlink Exchange
                </button>
                <button onClick={() => setActiveTab('social')} className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'social' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                    <ShareIcon className="w-4 h-4 mr-2"/> Social Task Force
                </button>
            </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white capitalize">{activeTab.replace('-', ' ')} Strategy</h3>
          <p className="text-sm text-gray-400">
            {activeTab === 'content' && "Dominate local search rankings when severe weather hits."}
            {activeTab === 'backlinks' && "Build domain authority through strategic link exchanges and guest posts."}
            {activeTab === 'social' && "Automate your social media calendar with high-engagement posts."}
          </p>
          
           <div className="flex flex-col gap-2">
            {presets[activeTab].map((p, i) => (
                <button key={i} onClick={() => setPrompt(p)} className="text-left text-sm bg-gray-800 hover:bg-gray-700 p-2 rounded border border-gray-600 text-gray-300">
                    {p}
                </button>
            ))}
          </div>

          <div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your goal..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Execute Strategy
            </Button>
          </div>
        </div>
      </Card>

      {(isLoading || result || error) && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Strategy Output</h3>
            {isLoading && <div className="flex justify-center p-8"><Spinner /></div>}
            {error && <p className="text-red-400">{error}</p>}
            {result && <div className="prose prose-invert max-w-none whitespace-pre-wrap">{result}</div>}
            
            {sources.length > 0 && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-300 text-sm uppercase tracking-wider">Verified Sources</h4>
                    <ul className="text-sm space-y-2">
                        {sources.map((chunk, index) => {
                             const web = chunk.web;
                             const maps = chunk.maps;
                             const sourceUri = web?.uri || maps?.uri;
                             const sourceTitle = web?.title || (maps as any)?.title || sourceUri;
 
                             if (!sourceUri) return null;
                             return (
                                 <li key={index}>
                                     <a href={sourceUri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline truncate block">{sourceTitle}</a>
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

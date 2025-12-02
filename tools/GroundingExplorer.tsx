
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, type GroundingChunk } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

const MarketAuthority: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const presets = [
    "Find recent hail reports in Plano, TX and write a 'Zero-Click' optimized landing page intro.",
    "What are the top rated roofing competitors in Dallas according to Google Maps? List their weaknesses based on reviews.",
    "Search for 'emergency tarping services' trends in my area and suggest keywords."
  ];

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
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a Geo-Local SEO expert and Content Strategist for a roofing company. ${prompt}`,
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
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Geo-Triggered Content Engine</h3>
          <p className="text-sm text-gray-400">Dominate local search rankings when severe weather hits.</p>
          
           <div className="flex flex-col gap-2">
            {presets.map((p, i) => (
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
              placeholder="e.g., Identify storm dates for Zip Code 75024 and draft a 'Storm Damage Repair' guide."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Generate Authority Content
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

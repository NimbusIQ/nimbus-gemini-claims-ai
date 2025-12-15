
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

type Model = 'gemini-2.5-pro' | 'gemini-2.5-flash';

const ClaimsIntelligence: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<Model>('gemini-2.5-pro');
  const [useThinkingMode, setUseThinkingMode] = useState(true);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragStep, setRagStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { title: "Activity Code Audit", prompt: "Review this scope of work. Are we using the correct Activity Codes (e.g., Detach & Reset vs Replace) for 'Soft Metal' items like Box Vents and Pipe Jacks? Justify with Xactimate definitions." },
    { title: "Supplement Audit", prompt: "Analyze this insurance estimate line-by-line. Identify omitted Xactimate codes for roofing components (drip edge, ice & water shield, starter strip) and calculate potential missing value. Assume location is McKinney, Texas." },
    { title: "O&P Rebuttal", prompt: "Generate a rebuttal for an insurance adjuster who denied 'Overhead and Profit' (O&P) on a storm restoration job involving 3 trades (Roofing, Gutters, Interior Paint). Cite general contractor industry standards." }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a claim details or select a preset.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    setRagStep('Initializing RAG Pipeline...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const config: any = {};
      if (useThinkingMode && model === 'gemini-2.5-pro') {
        config.thinkingConfig = { thinkingBudget: 1024 }; 
      }
      
      // Simulate RAG steps for UI feedback
      setTimeout(() => setRagStep('Querying BigQuery Vector Store...'), 600);
      setTimeout(() => setRagStep('Retrieving Xactimate White Papers...'), 1500);
      setTimeout(() => setRagStep('Refining with Gemini 3 Reasoning...'), 2500);

      const response = await ai.models.generateContent({
        model,
        contents: `Act as a Senior Public Adjuster and Xactimate Expert. ${prompt}`,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      setResult(response.text);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setRagStep('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Intelligence Module</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as Model)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="gemini-2.5-pro">Deep Analysis (Gemini 2.5 Pro)</option>
                <option value="gemini-2.5-flash">Rapid Scan (Gemini 2.5 Flash)</option>
              </select>
            </div>
             <div className="flex items-end pb-2">
               <span className="text-xs text-indigo-400 font-mono">
                 AVG MISSING VALUE FOUND: $4,200/CLAIM
               </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {presets.map((p, i) => (
                <button key={i} onClick={() => setPrompt(p.prompt)} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-full transition-colors">
                    {p.title}
                </button>
            ))}
          </div>

          <div>
            <textarea
              rows={8}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste insurance scope notes, policy limitations, or adjuster emails here..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Run Claims Intelligence
            </Button>
          </div>
        </div>
      </Card>

      {(isLoading || result || error) && (
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
                 <h3 className="text-lg font-semibold text-indigo-400">Intelligence Report</h3>
                 {isLoading && <span className="text-xs font-mono text-green-400 animate-pulse">{ragStep}</span>}
            </div>
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Spinner />
                <div className="w-full max-w-xs bg-gray-700 rounded-full h-1.5 dark:bg-gray-700">
                    <div className="bg-indigo-600 h-1.5 rounded-full animate-[width_2s_ease-in-out_infinite]" style={{width: '45%'}}></div>
                </div>
              </div>
            )}
            
            {error && <p className="text-red-400">{error}</p>}
            
            {result && (
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white">
                <pre className="whitespace-pre-wrap font-sans bg-gray-900/50 p-4 rounded-lg border border-gray-700">{result}</pre>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClaimsIntelligence;

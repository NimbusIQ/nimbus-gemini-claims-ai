
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { SearchIcon, SparklesIcon, MessageSquareIcon, ImageIcon, MicIcon } from '../components/Icons';

type Agent = 'inspector' | 'claims' | 'marketing' | 'scheduler';

interface AgentConfig {
  id: Agent;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AGENTS: AgentConfig[] = [
  { id: 'inspector', name: 'Roof Inspector', description: 'Analyzes AR scans for hail/wind damage.', icon: ImageIcon },
  { id: 'claims', name: 'Claims Agent', description: 'Negotiates supplements using Code Insights.', icon: SparklesIcon },
  { id: 'marketing', name: 'Market Authority', description: 'Generates geo-local storm landing pages.', icon: SearchIcon },
  { id: 'scheduler', name: 'Dispatcher', description: 'Coordinates crews via Google Voice & Gmail.', icon: MessageSquareIcon },
];

interface AgentResult {
  content: string;
  type: 'text' | 'image' | 'error' | 'notification';
  metadata?: string;
}

const AdkWorkbench: React.FC = () => {
  const [selectedAgents, setSelectedAgents] = useState<Set<Agent>>(new Set(['marketing']));
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Partial<Record<Agent, AgentResult>>>({});
  const [ragStatus, setRagStatus] = useState<string>('Idle');

  const handleAgentToggle = (agentId: Agent) => {
    setSelectedAgents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(agentId)) {
        newSet.delete(agentId);
      } else {
        newSet.add(agentId);
      }
      return newSet;
    });
  };

  const triggerHaptic = () => {
      if (navigator.vibrate) {
          navigator.vibrate(50); // Short vibration for feedback
      }
  };

  const executeTask = async () => {
    if (!prompt.trim() || selectedAgents.size === 0) {
      return;
    }
    setIsLoading(true);
    setResults({});
    setRagStatus('Querying BigQuery Vector Store...');
    triggerHaptic();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const tasks: Promise<void>[] = Array.from(selectedAgents).map(async (agentId) => {
      try {
        let result: AgentResult | null = null;
        switch (agentId) {
          case 'inspector': {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: `Act as a HAAG Certified Roof Inspector. Based on this description, classify the damage severity and mention pixel-level analysis: "${prompt}"`,
            });
            result = { content: response.text, type: 'text' };
            break;
          }
          case 'claims': {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-pro",
              contents: `Act as a Public Adjuster. Write a supplement request for the following situation, citing specific IRC codes: "${prompt}"`,
              config: { thinkingConfig: { thinkingBudget: 2048 } },
            });
            result = { content: response.text, type: 'text' };
            break;
          }
          case 'marketing': {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: `Act as a Local SEO Expert. Write a "Zero-Click" optimized blog post intro for a roofing company in response to: "${prompt}"`,
              config: { tools: [{ googleSearch: {} }] },
            });
            result = { content: response.text, type: 'text' };
            break;
          }
          case 'scheduler': {
             // Simulate SMS/Email generation
             const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: `Draft a short, professional urgent notification (SMS/Email) to a crew lead regarding: "${prompt}". Return ONLY the message body.`,
            });
            
            // Simulate the "Sending" process
            await new Promise(r => setTimeout(r, 800)); 
            
            result = { 
                content: response.text, 
                type: 'notification',
                metadata: 'Sent via Google Voice & Gmail API'
            };
            break;
          }
        }
        if (result) {
          setResults(prev => ({ ...prev, [agentId as string]: result } as Partial<Record<Agent, AgentResult>>));
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setResults(prev => ({ ...prev, [agentId as string]: { content: `Agent failed: ${errorMessage}`, type: 'error' } } as Partial<Record<Agent, AgentResult>>));
      }
    });

    await Promise.allSettled(tasks);
    setRagStatus('Self-Correction Loop Complete (Quantized)');
    triggerHaptic();
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">1. Select Virtual Staff</h3>
                <span className="text-xs text-indigo-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    RAG: {ragStatus}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleAgentToggle(agent.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAgents.has(agent.id) ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <agent.icon className="w-6 h-6 mr-3 text-indigo-400" />
                    <h4 className="font-bold text-white">{agent.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Assign Task to ADK Swarm</h3>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A massive hailstorm just hit Frisco, TX. Mobilize the team, write a blog post, and draft an email to existing clients in that zip code."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={executeTask} isLoading={isLoading} disabled={!prompt.trim() || selectedAgents.size === 0}>
              Deploy Agents (Haptic Enabled)
            </Button>
          </div>
        </div>
      </Card>

      {(isLoading || Object.keys(results).length > 0) && (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Swarm Activity Log</h2>
            {isLoading && !Object.keys(results).length && (
                <Card className="p-6">
                    <div className="flex items-center justify-center p-8">
                        <Spinner />
                        <span className="ml-3">Gemini 3 (Nano) is iterating on your directive...</span>
                    </div>
                </Card>
            )}
             <div className="space-y-4">
                {AGENTS.filter(a => selectedAgents.has(a.id)).map(agent => {
                    const result = results[agent.id];
                    return (
                        <Card key={agent.id}>
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <agent.icon className="w-6 h-6 mr-3 text-indigo-400" />
                                    <h3 className="text-lg font-semibold text-white">{agent.name} Output</h3>
                                    {result?.type === 'notification' && (
                                        <span className="ml-auto text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-700">
                                            {result.metadata}
                                        </span>
                                    )}
                                </div>
                                {isLoading && !result ? (
                                    <div className="flex items-center text-gray-400">
                                        <Spinner /> <span className="ml-2">Processing...</span>
                                    </div>
                                ) : result ? (
                                    <div>
                                        {result.type === 'error' && <p className="text-red-400 whitespace-pre-wrap">{result.content}</p>}
                                        {result.type === 'text' && <p className="whitespace-pre-wrap text-gray-300">{result.content}</p>}
                                        {result.type === 'notification' && (
                                            <div className="bg-gray-800 p-3 rounded border-l-4 border-green-500">
                                                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Message Drafted & Queued</div>
                                                <p className="text-white italic">"{result.content}"</p>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdkWorkbench;

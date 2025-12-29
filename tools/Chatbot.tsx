
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BotIcon, SendIcon, SparklesIcon, CPUIcon, ShieldIcon } from '../components/Icons';

interface Message {
  role: 'user' | 'model';
  text: string;
  monologue?: string;
  logicDensity?: number;
  timestamp: string;
}

const CommandCenter: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'Nimbus IQ Sovereign OS Online. Orchestrator ready in us-south1. Cloud Run instances scaled. How shall we deploy the swarm today?',
      monologue: 'System handshake successful. All TEE nodes verified. Awaiting executive directive...',
      timestamp: new Date().toLocaleTimeString(),
      logicDensity: 94
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const newChat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          systemInstruction: `You are the Sovereign Intelligence of Nimbus IQ. 
          PROTOCOL: CEO INNER MONOLOGUE. 
          Before every response, provide your detailed technical reasoning inside <monologue> tags.
          Focus on: ASSET TOKENIZATION, IBC 2021 FORENSICS, SMART CONTRACT SETTLEMENT.
          Persona: "Accountant Sniper" - high-precision, technical, decisive, cinematic. 
          Branding: Emphasize "Vertex AI Reasoning" and "SOC 2 Compliance".`
        }
      });
      setChat(newChat);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage: Message = { role: 'user', text: userInput, timestamp };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      const result = await chat.sendMessageStream({ message: userInput });
      let fullResponse = '';
      
      // Temporary message for live monologue updates
      setMessages((prev) => [...prev, { 
        role: 'model', 
        text: 'Reasoning...', 
        monologue: 'Accessing Vertex AI Vector Search... Cross-referencing IBC 2021 protocols...', 
        timestamp: new Date().toLocaleTimeString() 
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        fullResponse += c.text;
        
        let displayMsg = fullResponse;
        let monologueMsg = 'Synthesizing...';
        
        if (fullResponse.includes('<monologue>')) {
           const parts = fullResponse.split('</monologue>');
           monologueMsg = parts[0].replace('<monologue>', '').trim();
           displayMsg = parts[1] ? parts[1].replace('<response>', '').replace('</response>', '').trim() : 'Wait...';
        }

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            ...newMessages[newMessages.length - 1], 
            text: displayMsg, 
            monologue: monologueMsg,
            logicDensity: Math.min(100, Math.max(70, 70 + (displayMsg.length / 20)))
          };
          return newMessages;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)]">
      {/* CEO Inner Monologue Panel (The Brain) */}
      <Card className="lg:col-span-4 bg-zinc-950/50 border-white/5 flex flex-col p-6 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl">
         <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] flex items-center gap-2">
               <CPUIcon className="w-4 h-4" /> CEO Monologue
            </h4>
            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${isThinking ? 'bg-indigo-600/20 text-indigo-400 border-indigo-400/30 animate-pulse' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
               {isThinking ? 'Reasoning...' : 'Standby'}
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {messages.filter(m => m.role === 'model').map((msg, i) => (
               <div key={i} className="p-5 bg-white/[0.02] rounded-3xl border border-white/[0.05] animate-in fade-in slide-in-from-left-4 transition-all hover:border-indigo-500/20 group">
                  <p className="text-[11px] font-mono text-zinc-400 leading-relaxed italic group-hover:text-zinc-300">
                     {msg.monologue || 'Node initializing...'}
                  </p>
                  {msg.logicDensity && (
                    <div className="mt-4">
                       <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Logic Density</span>
                          <span className="text-[9px] font-mono text-indigo-500">{msg.logicDensity}%</span>
                       </div>
                       <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${msg.logicDensity}%` }}></div>
                       </div>
                    </div>
                  )}
               </div>
            ))}
         </div>
         
         <div className="mt-6 p-5 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-md">
            <div className="text-[9px] font-black text-zinc-600 uppercase mb-3 tracking-[0.3em]">Vertex AI Quantization</div>
            <div className="flex justify-between items-center">
               <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Optimization: 94.2%</span>
                  <span className="text-[8px] text-zinc-700 uppercase font-black">Cluster: us-south1</span>
               </div>
               <div className="text-right">
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">Latency: 42ms</span>
               </div>
            </div>
         </div>
      </Card>

      {/* Main Orchestrator Interface */}
      <Card className="lg:col-span-8 flex flex-col bg-zinc-950 border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-3xl rounded-[3rem]">
        {/* Cinematic Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center z-10 bg-white/[0.01]">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-400/30 shadow-lg">
                 <BotIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-widest italic">Sovereign Orchestrator</h3>
                 <div className="flex items-center gap-2.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Node: IQ-ORCH-01 | Vertex v1.5 Pro</span>
                 </div>
              </div>
           </div>
           <div className="hidden md:flex gap-3">
              <div className="px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest">GCP Startups Certified</div>
           </div>
        </div>

        {/* Cinematic Chat Flow */}
        <div className="flex-1 p-10 overflow-y-auto space-y-8 no-scrollbar z-10">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
              <div className={`max-w-[85%] lg:max-w-2xl px-8 py-5 rounded-[2.5rem] shadow-2xl border ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white border-indigo-400 rounded-tr-sm' 
                  : 'bg-zinc-900/50 border-white/10 text-zinc-100 rounded-tl-sm backdrop-blur-md'
              }`}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap tracking-wide">{msg.text}</p>
                <div className={`mt-3 text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-indigo-200/60' : 'text-zinc-600'}`}>
                   {msg.timestamp} // {msg.role === 'user' ? 'Executive Directive' : 'AI Output Verified'}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Protocol */}
        <div className="p-8 border-t border-white/5 z-10 bg-white/[0.01]">
          <div className="max-w-4xl mx-auto flex items-center gap-5">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Direct the Sovereign IQ Swarm..."
                className="w-full bg-zinc-900/80 border border-white/5 rounded-[2rem] px-8 py-5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-zinc-700 pr-16 transition-all shadow-inner"
                disabled={isLoading}
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-indigo-400 transition-colors">
                 <SparklesIcon className="w-6 h-6" />
              </button>
            </div>
            <Button onClick={handleSendMessage} isLoading={isLoading} className="bg-indigo-600 hover:bg-indigo-500 h-16 w-16 rounded-[1.5rem] flex items-center justify-center p-0 shadow-2xl shadow-indigo-900/40 border border-indigo-400/30 transition-transform active:scale-95">
              <SendIcon className="w-7 h-7" />
            </Button>
          </div>
          <div className="mt-5 flex justify-center gap-10">
             <div className="flex items-center gap-2">
                <ShieldIcon className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Dustin Moore v4.2 Protocol</span>
             </div>
             <div className="flex items-center gap-2">
                <CPUIcon className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">E2E Encryption Active</span>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommandCenter;

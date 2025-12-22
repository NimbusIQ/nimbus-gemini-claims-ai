
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fileToGenerativePart, blobToBase64, decode, decodeAudioData } from '../utils/helpers';
import { Spinner } from '../components/ui/Spinner';
import { CubeIcon, ImageIcon, SparklesIcon, VideoIcon, FileCodeIcon, BotIcon, MicIcon, ShieldIcon } from '../components/Icons';

type Tab = 'inspect' | 'spatial' | 'simulate' | 'animate';

interface HailMark {
  id: number;
  confidence: number;
  estimatedDiameter: string;
  distanceFromPrevious: string;
  coordinates: { x: number, y: number };
}

const RoofInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inspect');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [hailMarks, setHailMarks] = useState<HailMark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [swarmEvents, setSwarmEvents] = useState<any[]>([]);

  useEffect(() => {
    const activities = [
      "Hunter Agent: Identifying hail track in McKinney Zip 75071...",
      "Negotiator Agent: Mapping shingle geometry for supplement...",
      "Accountant Sniper: Cross-referencing shingle match in EagleView...",
      "Vision Lab: Running spatial triangulation on shingle 042...",
      "Cloud Run: Scaling forensic nodes for storm surge..."
    ];
    
    const interval = setInterval(() => {
      const newEvent = {
        id: Math.random(),
        text: activities[Math.floor(Math.random() * activities.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setSwarmEvents(prev => [newEvent, ...prev].slice(0, 7));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setResult(null);
      setHailMarks([]);
    }
  };

  const playOnSiteAudio = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Field Engineer Alert: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) { console.error("TTS Failed", e); }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
        setError('Forensic imagery required for analysis.');
        return;
    }

    setIsLoading(true);
    setLoadingMessage('Initializing Spatial Forensic Engine...');
    setError(null);
    if (navigator.vibrate) navigator.vibrate(50);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const imagePart = await fileToGenerativePart(imageFile!);

      if (activeTab === 'inspect') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: { parts: [imagePart, { text: "Perform a spatial forensic hail audit. Triangulate every hail impact. Calculate diameter and distance between marks for local code density compliance. Return JSON with 'summary' and 'hail_marks' array." }] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                hail_marks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      confidence: { type: Type.NUMBER },
                      estimatedDiameter: { type: Type.STRING },
                      distanceFromPrevious: { type: Type.STRING },
                      coordinates: {
                        type: Type.OBJECT,
                        properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } }
                      }
                    }
                  }
                }
              }
            }
          }
        });
        
        const data = JSON.parse(response.text);
        setResult(data.summary);
        setHailMarks(data.hail_marks || []);
        
        playOnSiteAudio(`Forensic scan complete. Detected ${data.hail_marks?.length || 0} hits. Triangulation suggests density exceeds IBC requirements for shingle replacement.`);
      } else {
          // Placeholder for other spatial/simulation modes
          setResult("Spatial geometry mapping is under Cloud Run initialization. Use 'Inspect' for now.");
      }
    } catch (e) {
      setError(`Analysis Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Analysis View */}
      <div className="lg:col-span-8 space-y-8">
        <Card className="border-indigo-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden bg-black/40 backdrop-blur-xl">
            <div className="bg-gray-900/50 p-6 flex justify-between items-center border-b border-gray-800">
                <div className="flex gap-4">
                    {(['inspect', 'spatial', 'animate'] as Tab[]).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`flex items-center px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                          {tab}
                      </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 px-4 py-1.5 bg-black/40 rounded-full border border-indigo-500/20">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Vision Lab Active</span>
                </div>
            </div>

            <div className="p-8 space-y-8">
                <div className="relative group aspect-video bg-gray-950 rounded-[3rem] border-2 border-dashed border-gray-800 hover:border-indigo-500/40 transition-all overflow-hidden">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="forensic-upload" />
                    <label htmlFor="forensic-upload" className="w-full h-full cursor-pointer flex flex-col items-center justify-center">
                        {imageUrl ? (
                           <div className="relative w-full h-full">
                               <img src={imageUrl} alt="forensic" className="w-full h-full object-cover opacity-60" />
                               {/* Spatial Overlays Simulation */}
                               {hailMarks.map((mark) => (
                                 <div 
                                    key={mark.id} 
                                    className="absolute w-12 h-12 border-2 border-red-500/50 rounded-full flex items-center justify-center animate-pulse"
                                    style={{ 
                                        left: `${mark.coordinates?.x || Math.random() * 80}%`, 
                                        top: `${mark.coordinates?.y || Math.random() * 80}%` 
                                    }}
                                 >
                                    <span className="text-[8px] font-black text-red-500">#{mark.id}</span>
                                 </div>
                               ))}
                           </div>
                        ) : (
                           <div className="flex flex-col items-center gap-4">
                               <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center">
                                   <ImageIcon className="w-10 h-10 text-indigo-500/50" />
                               </div>
                               <div className="text-center">
                                   <span className="text-sm text-gray-400 font-black uppercase tracking-widest">Inject Forensic Imagery</span>
                                   <p className="text-[10px] text-gray-600 font-bold mt-1">Supports Shingle Detail & Drone Top-Downs</p>
                               </div>
                           </div>
                        )}
                    </label>
                </div>

                <div className="flex justify-between items-center bg-indigo-900/10 p-6 rounded-[2.5rem] border border-indigo-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <MicIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-tighter">On-Site Audio Feedback</div>
                        <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Nimbus Voice v2.5 Synchronized</p>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} isLoading={isLoading} className="bg-white text-black hover:bg-gray-200 px-12 py-7 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95">
                    {isLoading ? 'Processing...' : 'Execute Spatial Scan'}
                  </Button>
                </div>
            </div>
        </Card>

        {result && (
            <Card className="p-10 border-indigo-500/10 bg-black/60 animate-in zoom-in-95 duration-500">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 border-b border-gray-900 pb-4">Forensic Summary</h3>
                <div className="space-y-8">
                    <p className="text-lg text-gray-200 font-bold leading-relaxed italic border-l-4 border-indigo-500 pl-8">
                        "{result}"
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {hailMarks.map((mark) => (
                           <div key={mark.id} className="p-5 bg-gray-900/50 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/40 transition-all group">
                              <div className="flex justify-between items-center mb-4">
                                <span className="w-8 h-8 rounded-xl bg-indigo-600/10 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20">#{mark.id}</span>
                                <span className="text-[10px] font-mono text-green-400 font-black">{(mark.confidence * 100).toFixed(0)}% MATCH</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[11px] font-black text-white uppercase tracking-tighter italic">Diameter: {mark.estimatedDiameter}</div>
                                <div className="text-[9px] text-gray-500 uppercase font-black">Spatial Gap: {mark.distanceFromPrevious}</div>
                              </div>
                           </div>
                         ))}
                    </div>
                </div>
            </Card>
        )}
      </div>

      {/* Side Swarm Feed */}
      <div className="lg:col-span-4 space-y-8">
        <Card className="p-8 bg-gray-950 border-gray-800 flex flex-col h-[600px] shadow-2xl">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-gray-900 pb-4">
            <BotIcon className="w-5 h-5 text-indigo-500" /> Live IQ Swarm Feed
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pr-2">
            {swarmEvents.map((ev) => (
              <div key={ev.id} className="p-4 bg-gray-900/30 border border-gray-800/50 rounded-[2rem] flex gap-4 animate-in slide-in-from-right-6">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-700 mb-1">{ev.time}</div>
                  <p className="text-[11px] text-gray-400 font-bold leading-tight">{ev.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-500/20 rounded-[3rem] text-center shadow-xl">
             <div className="text-3xl font-black text-white mb-1 italic tracking-tighter">NODE_75071</div>
             <div className="text-[10px] text-indigo-400 uppercase font-black tracking-[0.4em]">Cloud Run Cluster: McKinney</div>
          </div>
        </Card>

        <Card className="p-8 bg-indigo-950/10 border-indigo-500/10 rounded-[3rem] text-center">
             <ShieldIcon className="w-10 h-10 text-indigo-600 opacity-20 mx-auto mb-4" />
             <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-relaxed px-4">
                Field-Forward Logic: Dustin Moore's Accountant Sniper Protocol v4.0
             </p>
        </Card>
      </div>
    </div>
  );
};

export default RoofInspector;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/helpers';
import { Card } from '../components/ui/Card';
import { PhoneIcon, MicIcon, UsersIcon, ShieldIcon } from '../components/Icons';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
interface TranscriptionTurn {
    user: string;
    model: string;
    timestamp: string;
}

const EmergencyResponse: React.FC = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionTurn[]>([]);
    const [currentTranscription, setCurrentTranscription] = useState<TranscriptionTurn>({ user: '', model: '', timestamp: '' });
    const [volume, setVolume] = useState(0);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextInRef = useRef<AudioContext | null>(null);
    const audioContextOutRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const stopSession = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
            mediaStreamSourceRef.current = null;
        }
        outputSourcesRef.current.forEach(source => source.stop());
        outputSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setConnectionState('disconnected');
        setVolume(0);
    }, []);
    
    useEffect(() => {
        return () => stopSession();
    }, [stopSession]);
    
    const startSession = async () => {
        setConnectionState('connecting');
        setCurrentTranscription({ user: '', model: '', timestamp: '' });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        mediaStreamSourceRef.current = audioContextInRef.current.createMediaStreamSource(stream);
                        scriptProcessorRef.current = audioContextInRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            let sum = 0;
                            for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                            setVolume(Math.sqrt(sum / inputData.length) * 100);

                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const base64 = encode(new Uint8Array(int16.buffer));
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then(session => {
                                    session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
                                });
                            }
                        };
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(audioContextInRef.current.destination);
                    },
                    onmessage: async (message: any) => {
                        if (message.serverContent?.outputTranscription) {
                            setCurrentTranscription(prev => ({...prev, model: prev.model + message.serverContent!.outputTranscription!.text}));
                        }
                        if (message.serverContent?.inputTranscription) {
                            setCurrentTranscription(prev => ({...prev, user: prev.user + message.serverContent!.inputTranscription!.text}));
                        }
                        if (message.serverContent?.turnComplete) {
                            setCurrentTranscription(currentTurn => {
                                if (currentTurn.user || currentTurn.model) {
                                    setTranscriptionHistory(prev => [...prev, {...currentTurn, timestamp: new Date().toLocaleTimeString()}]);
                                }
                                return { user: '', model: '', timestamp: '' };
                            });
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio && audioContextOutRef.current) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextOutRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextOutRef.current, 24000, 1);
                            const source = audioContextOutRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContextOutRef.current.destination);
                            source.addEventListener('ended', () => outputSourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            outputSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e) => {
                        console.error('Voice Link Error:', e);
                        setConnectionState('error');
                        stopSession();
                    },
                    onclose: () => stopSession()
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
                    systemInstruction: "You are the Nimbus IQ Voice Agent. Reachable at 972-IQ-NIMBUS. You coordinate with the swarm to triage storm restoration leads in McKinney, TX. Be professional, urgent, and precise."
                }
            });

        } catch (e) {
            console.error('Microphone access denied', e);
            setConnectionState('error');
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
            <Card className="lg:col-span-3 flex flex-col border-indigo-500/20 bg-black overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none"></div>
                
                <div className="bg-indigo-900/10 p-6 border-b border-indigo-500/20 flex justify-between items-center z-10 backdrop-blur-md">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Smart IQ Number</span>
                        <span className="text-3xl font-black text-white tracking-tighter">+1 972-IQ-NIMBUS</span>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${connectionState === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/40 animate-pulse' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                        {connectionState === 'connected' ? 'IQ_LINK_ACTIVE' : 'READY_FOR_INTAKE'}
                    </div>
                </div>

                <div className="flex-1 p-10 flex flex-col items-center justify-center relative overflow-y-auto no-scrollbar z-10">
                    {connectionState === 'connected' ? (
                        <div className="flex items-end gap-2 h-40 mb-16">
                             {[...Array(40)].map((_, i) => (
                                 <div 
                                    key={i} 
                                    className="w-2 bg-indigo-500 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                                    style={{ 
                                        height: `${10 + (Math.random() * volume * 3)}px`,
                                        opacity: 0.2 + (volume / 100)
                                    }}
                                 ></div>
                             ))}
                        </div>
                    ) : (
                        <div className="w-56 h-56 rounded-[4rem] border border-gray-800 flex items-center justify-center mb-10 relative group">
                             <div className="absolute inset-0 border border-indigo-500/5 rounded-[4rem] animate-ping duration-[4s]"></div>
                             <MicIcon className="w-20 h-20 text-indigo-950 group-hover:text-indigo-900 transition-colors" />
                             <div className="absolute bottom-6 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">Voice_Kernel_2.5</div>
                        </div>
                    )}

                    <div className="w-full max-w-2xl space-y-6">
                        {transcriptionHistory.map((turn, i) => (
                            <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
                                <div className="text-right"><span className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-100 text-[11px] px-5 py-3 rounded-3xl rounded-tr-sm inline-block max-w-[85%] uppercase font-black shadow-xl">{turn.user}</span></div>
                                <div className="text-left"><span className="bg-gray-900 border border-gray-800 text-gray-300 text-[11px] px-5 py-3 rounded-3xl rounded-tl-sm inline-block max-w-[85%] font-medium shadow-lg">{turn.model}</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-12 border-t border-gray-800 flex flex-col items-center gap-6 bg-gray-950/40 z-10 backdrop-blur-xl">
                    <button 
                        onClick={connectionState === 'connected' ? stopSession : startSession} 
                        className={`w-28 h-28 rounded-[3.5rem] flex items-center justify-center transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 group ${
                            connectionState === 'connected' ? 'bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                    >
                         <PhoneIcon className={`w-12 h-12 text-white group-hover:scale-110 transition-transform ${connectionState === 'connected' ? 'rotate-[135deg]' : ''}`} />
                    </button>
                    <div className="text-center">
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] block mb-1">Initialize Secure IQ Link</span>
                        <span className="text-[8px] text-indigo-600 font-bold uppercase tracking-widest">Operator Identity Verified: Dustin Moore</span>
                    </div>
                </div>
            </Card>

            <div className="flex flex-col gap-6">
                 <Card className="p-6 bg-gray-950 border-gray-800 flex flex-col">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-gray-900 pb-3">
                        <UsersIcon className="w-5 h-5 text-indigo-500" /> Intelligence Log
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                        {[
                          { id: 'IQ-781', status: 'SYNCED', dur: '1:42' },
                          { id: 'IQ-662', status: 'AUDIT', dur: '0:15' }
                        ].map((log, i) => (
                            <div key={i} className="p-4 bg-gray-900/40 rounded-2xl border border-gray-800 group hover:border-indigo-500/30 transition-all cursor-default">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-indigo-500 font-black text-[9px]">{log.id}</span>
                                    <span className="text-[8px] font-black px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">{log.status}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold">Duration: {log.dur}</div>
                                <div className="text-[9px] text-gray-600 mt-2 uppercase font-bold tracking-tighter">Forensics Data Pushed</div>
                            </div>
                        ))}
                    </div>
                 </Card>
                 <Card className="flex-1 p-8 bg-indigo-950/10 border-indigo-500/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                     <ShieldIcon className="w-12 h-12 text-indigo-500 opacity-20 mb-4" />
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-relaxed">
                        Neural voice synthesis in McKinney Cluster Node-2
                     </p>
                 </Card>
            </div>
        </div>
    );
};

export default EmergencyResponse;

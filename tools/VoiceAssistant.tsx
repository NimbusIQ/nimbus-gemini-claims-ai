
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/helpers';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
interface TranscriptionTurn {
    user: string;
    model: string;
}

const EmergencyResponse: React.FC = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionTurn[]>([]);
    const [currentTranscription, setCurrentTranscription] = useState<TranscriptionTurn>({ user: '', model: '' });

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
        if(audioContextInRef.current && audioContextInRef.current.state !== 'closed') {
            audioContextInRef.current.close();
            audioContextInRef.current = null;
        }
        outputSourcesRef.current.forEach(source => source.stop());
        outputSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        if (audioContextOutRef.current && audioContextOutRef.current.state !== 'closed') {
            audioContextOutRef.current.close();
            audioContextOutRef.current = null;
        }
        setConnectionState('disconnected');
    }, []);
    
    useEffect(() => {
        return () => stopSession();
    }, [stopSession]);
    
    const startSession = async () => {
        setConnectionState('connecting');
        setCurrentTranscription({ user: '', model: '' });
        setTranscriptionHistory([]);

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
                                    setTranscriptionHistory(prevHistory => [...prevHistory, currentTurn]);
                                }
                                return { user: '', model: '' };
                            });
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio && audioContextOutRef.current) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextOutRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextOutRef.current, 24000, 1);
                            const source = audioContextOutRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContextOutRef.current.destination);
                            source.addEventListener('ended', () => {
                                outputSourcesRef.current.delete(source);
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            outputSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e) => {
                        console.error('Session error:', e);
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
                    systemInstruction: "You are the Emergency Response Coordinator for a large roofing restoration company. A major storm has just hit. Your job is to coordinate logistics, mobilize crews, and take quick status reports from field managers via voice. Be concise, urgent, and focused on logistics."
                }
            });

        } catch (e) {
            console.error('Failed to start session', e);
            setConnectionState('error');
        }
    };
    
    return (
        <Card className="h-[calc(100vh-10rem)] flex flex-col border-red-900/30">
            <div className="bg-red-900/20 p-2 text-center text-red-300 text-sm font-semibold border-b border-red-900/30">
                STORM MODE: ACTIVE
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {transcriptionHistory.map((turn, index) => (
                    <React.Fragment key={index}>
                        <div className="text-right text-gray-300"><span className="text-xs text-gray-500 block">Field Ops</span>{turn.user}</div>
                        <div className="text-left text-red-400"><span className="text-xs text-red-500/50 block">Coordinator</span>{turn.model}</div>
                    </React.Fragment>
                ))}
                {currentTranscription.user && <div className="text-right text-gray-500">{currentTranscription.user}</div>}
                {currentTranscription.model && <div className="text-left text-red-500/70">{currentTranscription.model}</div>}
            </div>
            <div className="p-4 border-t border-gray-700/50 flex flex-col items-center justify-center space-y-2">
                <Button onClick={connectionState === 'disconnected' || connectionState === 'error' ? startSession : stopSession}
                    className={`${connectionState === 'connected' ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    {connectionState === 'connecting' && 'Establishing Comms...'}
                    {connectionState === 'connected' && 'End Emergency Channel'}
                    {(connectionState === 'disconnected' || connectionState === 'error') && 'Open Emergency Channel'}
                </Button>
            </div>
        </Card>
    );
};

export default EmergencyResponse;

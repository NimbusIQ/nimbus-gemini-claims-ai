
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { decode, decodeAudioData } from '../utils/helpers';
import { MicIcon, MessageSquareIcon, MailIcon, PhoneIcon } from '../components/Icons';
import { Spinner } from '../components/ui/Spinner';

type Channel = 'voice' | 'sms' | 'email';

const CustomerService: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>('voice');
  const [text, setText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const presets = {
    voice: [
        "Thank you for calling Nimbus Roofing AI. Our storm team is currently deployed. Please state your address.",
        "Hi, this is the automated assistant for Nimbus. Are you calling to schedule a free inspection?"
    ],
    sms: [
        "Nimbus Alert: Severe Hail detected at your property. Reply YES for a free drone inspection.",
        "Update: Your claims adjuster is scheduled for Tuesday at 9AM. Reply CONFIRM."
    ],
    email: [
        "Subject: Forensic Roof Inspection Report - 1204 Oak St",
        "Subject: Urgent: Insurance Supplement Required for Code Compliance"
    ]
  };

  const handleAction = async () => {
    if (!text.trim()) {
        setError("Please enter content.");
        return;
    }
    
    // Haptic feedback for touch interactions
    if (navigator.vibrate) navigator.vibrate(20);

    setIsLoading(true);
    setError(null);
    setStatus(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        if (activeChannel === 'voice') {
             const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Audio) throw new Error("No audio data received.");

            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
            setStatus("Audio generated and playing...");
        } else if (activeChannel === 'sms') {
            // Simulate Google Voice API
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus(`SMS Sent via Google Voice to ${recipient || '(512) 555-0123'}`);
        } else if (activeChannel === 'email') {
             // Simulate Gmail API
             await new Promise(resolve => setTimeout(resolve, 1500));
             setStatus(`Email Sent via Gmail API to ${recipient || 'client@example.com'}`);
        }

    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Operation failed: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
        <Card>
            <div className="border-b border-gray-700/50">
                <nav className="-mb-px flex space-x-6 px-6">
                    <button onClick={() => setActiveChannel('voice')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeChannel === 'voice' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <PhoneIcon className="w-4 h-4 mr-2"/> Voice Agent (TTS)
                    </button>
                    <button onClick={() => setActiveChannel('sms')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeChannel === 'sms' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <MessageSquareIcon className="w-4 h-4 mr-2"/> Google Voice SMS
                    </button>
                    <button onClick={() => setActiveChannel('email')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeChannel === 'email' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <MailIcon className="w-4 h-4 mr-2"/> Gmail Integration
                    </button>
                </nav>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                     <h3 className="text-lg font-semibold text-white capitalize">{activeChannel} Configuration</h3>
                     <span className="text-xs bg-green-900/30 text-green-400 border border-green-800 px-2 py-0.5 rounded">
                        API Connected
                     </span>
                </div>
                
                {activeChannel !== 'voice' && (
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Recipient</label>
                        <input 
                            type="text" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder={activeChannel === 'sms' ? '(555) 123-4567' : 'client@email.com'}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="block text-xs font-medium text-gray-400">Quick Templates</label>
                    {presets[activeChannel].map((p, i) => (
                        <button key={i} onClick={() => setText(p)} className="text-left text-xs bg-gray-800 hover:bg-gray-700 p-2 rounded border border-gray-600 text-gray-300 transition-colors">
                            {p}
                        </button>
                    ))}
                </div>

                <div>
                     <label className="block text-xs font-medium text-gray-400 mb-1">Message Content</label>
                     <textarea 
                        rows={5} 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder={`Enter ${activeChannel} content...`} 
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleAction} isLoading={isLoading}>
                        {activeChannel === 'voice' ? 'Generate Audio' : `Send ${activeChannel.toUpperCase()}`}
                    </Button>
                </div>
                
                {status && (
                    <div className="bg-green-900/20 border border-green-800 p-3 rounded-lg flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-green-400 text-sm">{status}</span>
                    </div>
                )}
                
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
        </Card>
    </div>
  );
};

export default CustomerService;


import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { decode, decodeAudioData } from '../utils/helpers';
import { MicIcon } from '../components/Icons';

const CustomerService: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const presets = [
    "Thank you for calling RoofAI. Our storm team is currently deployed in your area. Please state your address to be added to the priority list.",
    "Hi, this is the automated assistant for RoofAI. Are you calling to schedule a free inspection or check on an existing claim?"
  ];

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
        setError("Please enter script.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
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
    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Generation failed: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Customer Service Bot Studio</h3>
        <p className="text-sm text-gray-400">Configure voice scripts for the 24/7 lead qualification line.</p>
        
        <div className="flex flex-col gap-2">
            {presets.map((p, i) => (
                <button key={i} onClick={() => setText(p)} className="text-left text-xs bg-gray-800 hover:bg-gray-700 p-2 rounded border border-gray-600 text-gray-300">
                    {p}
                </button>
            ))}
        </div>

        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter script for the AI agent..." className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
        <div className="flex justify-end">
            <Button onClick={handleGenerateSpeech} isLoading={isLoading}>Test Audio Output</Button>
        </div>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </Card>
  );
};

export default CustomerService;

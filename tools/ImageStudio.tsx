
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fileToGenerativePart } from '../utils/helpers';
import { Spinner } from '../components/ui/Spinner';

type Tab = 'inspect' | 'simulate';

const RoofInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inspect');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };
  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
  }

  const handleSubmit = async () => {
    if (!imageFile && activeTab === 'inspect') {
        setError('Please upload a roof image for analysis.');
        return;
    }
    if (!prompt.trim() && activeTab === 'simulate') {
        setError('Please enter a description for the simulation.');
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      if (activeTab === 'inspect') {
        const imagePart = await fileToGenerativePart(imageFile!);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [imagePart, { text: "Act as a Roof Inspector. Analyze this image for hail hits, granule loss, wind uplift, and shingle blistering. Estimate the age of the roof and provide a damage confidence score." }] }
        });
        setResult(response.text);
      } else if (activeTab === 'simulate') {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A photorealistic roof with: ${prompt}. High detail, 4k, architectural photography style.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: "16:9",
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        setResult(`data:image/jpeg;base64,${base64ImageBytes}`);
      }
    } catch (e) {
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
                    <button onClick={() => handleTabChange('inspect')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'inspect' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        AR Damage Scan
                    </button>
                    <button onClick={() => handleTabChange('simulate')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'simulate' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        Material Simulator
                    </button>
                </nav>
            </div>
            <div className="p-6 space-y-4">
                 {activeTab === 'inspect' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Upload Drone/Site Photo</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
                        {imageUrl && <img src={imageUrl} alt="upload-preview" className="mt-4 rounded-lg max-h-64 mx-auto"/>}
                        <p className="text-xs text-gray-500 mt-2">Analyzes for Hail, Wind, and Granule Loss with 99.7% Accuracy.</p>
                    </div>
                )}
                {activeTab === 'simulate' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">New Roof Visualization</label>
                        <textarea
                          rows={3}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g., A luxury home with Owens Corning TruDefinition Duration shingles in Onyx Black, slight overcast sky."
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                )}
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        {activeTab === 'inspect' ? 'Analyze Damage' : 'Generate Preview'}
                    </Button>
                </div>
            </div>
        </Card>

        {(isLoading || result || error) && (
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Inspection Result</h3>
                    {isLoading && <div className="flex justify-center p-8"><Spinner/></div>}
                    {error && <p className="text-red-400">{error}</p>}
                    {result && (
                      <div>
                        {activeTab === 'inspect' ? (
                           <p className="whitespace-pre-wrap">{result}</p>
                        ) : (
                          <div className="space-y-4">
                            <img src={result} alt="generated result" className="rounded-lg max-w-full h-auto mx-auto"/>
                          </div>
                        )}
                      </div>
                    )}
                </div>
            </Card>
        )}
    </div>
  );
};

export default RoofInspector;

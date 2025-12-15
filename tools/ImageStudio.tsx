
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fileToGenerativePart, blobToBase64 } from '../utils/helpers';
import { Spinner } from '../components/ui/Spinner';
import { CubeIcon, ImageIcon, SparklesIcon, VideoIcon, FileCodeIcon } from '../components/Icons';

type Tab = 'inspect' | 'simulate' | 'spatial' | 'edit' | 'animate';

const RoofInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inspect');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setResult(null);
      setVideoResult(null);
    }
  };
  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setResult(null);
    setVideoResult(null);
    setError(null);
    if (navigator.vibrate) navigator.vibrate(10);
  }

  const handleSubmit = async () => {
    if (!imageFile && (activeTab === 'inspect' || activeTab === 'spatial' || activeTab === 'edit' || activeTab === 'animate')) {
        setError('Please upload a source image.');
        return;
    }
    if (!prompt.trim() && (activeTab === 'simulate' || activeTab === 'edit')) {
        setError('Please enter a description or edit instruction.');
        return;
    }

    setIsLoading(true);
    setLoadingMessage(activeTab === 'animate' ? 'Initializing Veo-3.1...' : 'Processing...');
    setError(null);
    if (navigator.vibrate) navigator.vibrate(30);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      if (activeTab === 'inspect') {
        const imagePart = await fileToGenerativePart(imageFile!);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [imagePart, { text: "Act as a Roof Inspector. Analyze this image for hail hits, granule loss, wind uplift, and shingle blistering. Estimate the age of the roof and provide a damage confidence score." }] }
        });
        setResult(response.text);
      } 
      else if (activeTab === 'spatial') {
          const imagePart = await fileToGenerativePart(imageFile!);
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [imagePart, { text: "Perform a spatial analysis. Extract the roof pitch, surface area polygons, and wireframe geometry coordinates. Return the data as a structured 3D breakdown." }] }
          });
          setResult(response.text);
      }
      else if (activeTab === 'simulate') {
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
      else if (activeTab === 'edit') {
        // Feature: Nano Banana Image Editing
        const imagePart = await fileToGenerativePart(imageFile!);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt }
                ]
            }
        });
        // Extract the edited image from the parts
        let foundImage = false;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    setResult(`data:image/png;base64,${base64EncodeString}`);
                    foundImage = true;
                }
            }
        }
        if (!foundImage) {
            setResult(response.text || "No image generated, but the model responded.");
        }
      }
      else if (activeTab === 'animate') {
        // Feature: Veo Video Animation
        const base64Data = await blobToBase64(imageFile!);
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            image: {
                imageBytes: base64Data,
                mimeType: imageFile!.type
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Poll for completion
        while (!operation.done) {
            setLoadingMessage('Veo is rendering frames...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
             const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
             const videoBlob = await videoResponse.blob();
             setVideoResult(URL.createObjectURL(videoBlob));
        } else {
            throw new Error("Video generation completed but no URI returned.");
        }
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Operation failed: ${errorMessage}`);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <div className="border-b border-gray-700/50">
                <nav className="-mb-px flex flex-wrap gap-4 px-6 overflow-x-auto">
                    <button onClick={() => handleTabChange('inspect')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'inspect' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <ImageIcon className="w-4 h-4 mr-2"/> AR Scan
                    </button>
                    <button onClick={() => handleTabChange('spatial')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'spatial' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <CubeIcon className="w-4 h-4 mr-2"/> Spatial
                    </button>
                    <button onClick={() => handleTabChange('edit')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'edit' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <SparklesIcon className="w-4 h-4 mr-2"/> AI Edit
                    </button>
                    <button onClick={() => handleTabChange('animate')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'animate' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <VideoIcon className="w-4 h-4 mr-2"/> Veo Animate
                    </button>
                    <button onClick={() => handleTabChange('simulate')} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'simulate' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                        <FileCodeIcon className="w-4 h-4 mr-2"/> Simulate
                    </button>
                </nav>
            </div>
            <div className="p-6 space-y-4">
                 {(activeTab !== 'simulate') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Source Imagery</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
                        {imageUrl && <img src={imageUrl} alt="upload-preview" className="mt-4 rounded-lg max-h-64 mx-auto border border-gray-700"/>}
                    </div>
                )}
                
                {(activeTab === 'simulate' || activeTab === 'edit') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            {activeTab === 'simulate' ? 'Generation Prompt' : 'Editing Instruction'}
                        </label>
                        <textarea
                          rows={3}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={activeTab === 'simulate' ? "e.g., A luxury home with slate shingles." : "e.g., Add a retro filter, remove the chimney, or make it look like sunset."}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                )}

                {activeTab === 'animate' && (
                    <p className="text-xs text-indigo-300 bg-indigo-900/20 p-2 rounded border border-indigo-500/30">
                        Veo 3.1 will animate this static image into a 16:9 video. This process typically takes 30-60 seconds.
                    </p>
                )}

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        {activeTab === 'inspect' ? 'Analyze' : activeTab === 'edit' ? 'Apply Edits' : activeTab === 'animate' ? 'Generate Video' : 'Generate'}
                    </Button>
                </div>
            </div>
        </Card>

        {(isLoading || result || videoResult || error) && (
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Output</h3>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 space-y-3">
                            <Spinner/>
                            <div className="text-xs text-indigo-400 animate-pulse font-mono">
                                {loadingMessage || 'PROCESSING...'}
                            </div>
                        </div>
                    )}
                    {error && <p className="text-red-400">{error}</p>}
                    
                    {/* Image Result */}
                    {result && !result.startsWith('data:') && (
                        <div className="prose prose-invert max-w-none text-sm">
                             {activeTab === 'spatial' && (
                                   <div className="bg-gray-900/50 p-3 rounded mb-4 border border-indigo-500/30">
                                       <h4 className="text-indigo-400 text-xs uppercase font-bold mb-1">Spatial Geometry Data</h4>
                                       <div className="h-32 w-full bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-gray-800 rounded opacity-50 flex items-center justify-center border border-gray-700">
                                           <span className="text-xs text-gray-400">[3D Wireframe Data Extracted]</span>
                                       </div>
                                   </div>
                               )}
                            <p className="whitespace-pre-wrap">{result}</p>
                        </div>
                    )}
                    {result && result.startsWith('data:') && (
                        <div className="space-y-4">
                            <img src={result} alt="generated result" className="rounded-lg max-w-full h-auto mx-auto border border-gray-700"/>
                            <div className="flex justify-center">
                                <a href={result} download="generated-image.png" className="text-xs text-indigo-400 hover:text-indigo-300">Download Image</a>
                            </div>
                        </div>
                    )}

                    {/* Video Result */}
                    {videoResult && (
                        <div className="space-y-4">
                            <video src={videoResult} controls autoPlay loop className="rounded-lg w-full aspect-video border border-gray-700 shadow-xl" />
                            <div className="flex justify-center">
                                <a href={videoResult} download="veo-animation.mp4" className="text-xs text-indigo-400 hover:text-indigo-300">Download Video</a>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        )}
    </div>
  );
};

export default RoofInspector;

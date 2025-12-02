
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { fileToGenerativePart } from '../utils/helpers';

const PaperworkScanner: React.FC = () => {
  const [prompt, setPrompt] = useState('Extract all line items, quantities, and unit prices. Identify if "Overhead and Profit" is included.');
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
      setResult('');
    }
  };

  const handleScan = async () => {
    if (!file) {
      setError('Please upload an insurance estimate or policy document (Image/PDF).');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const imagePart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
            parts: [
                imagePart,
                { text: `Act as a Document AI Specialist for Insurance Claims. ${prompt}` }
            ]
        }
      });
      setResult(response.text);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Scanning failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Paperwork Scanner (Document AI)</h3>
          
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
            <input 
                type="file" 
                id="doc-upload"
                accept="image/*,application/pdf" // Note: PDF support depends on frontend handling, using image for simplicity in this demo
                onChange={handleFileChange} 
                className="hidden" 
            />
            <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="text-gray-300 font-medium">Click to upload Estimate or Policy</span>
                <span className="text-gray-500 text-xs mt-1">Supports Scanned Images & Screenshots</span>
            </label>
          </div>
          
          {fileUrl && (
              <div className="bg-gray-800 p-2 rounded flex items-center">
                  <span className="text-sm text-indigo-300 truncate flex-1">{file?.name}</span>
                  <button onClick={() => {setFile(null); setFileUrl(null)}} className="text-gray-500 hover:text-white">&times;</button>
              </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Extraction Goals</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleScan} isLoading={isLoading}>
              Process Document
            </Button>
          </div>
        </div>
      </Card>

      {(isLoading || result || error) && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Extracted Data</h3>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-3">
                  <Spinner />
                  <span>Digitizing and structuring data...</span>
                </div>
              </div>
            )}
            {error && <p className="text-red-400">{error}</p>}
            {result && (
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white">
                <pre className="whitespace-pre-wrap font-sans bg-gray-900/50 p-4 rounded-lg text-sm">{result}</pre>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PaperworkScanner;

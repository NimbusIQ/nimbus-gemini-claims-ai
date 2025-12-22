
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { FileTextIcon, SparklesIcon, ShieldIcon } from '../components/Icons';

type Tab = 'shingles' | 'blog';

const ProductCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('shingles');
  const [isLoading, setIsLoading] = useState(false);
  const [blogPrompt, setBlogPrompt] = useState('');
  const [blogContent, setBlogContent] = useState('');

  const shingleData = [
    { brand: 'GAF', model: 'Timberline HDZ', warranty: 'Lifetime', material: 'Asphalt', impact: 'Class 4', alt: 'GAF Timberline HDZ installed in McKinney, TX' },
    { brand: 'Owens Corning', model: 'Duration', warranty: 'Lifetime', material: 'Asphalt', impact: 'Class 3', alt: 'Owens Corning Duration Shingles' },
    { brand: 'Malarkey', model: 'Legacy', warranty: '50 Years', material: 'Rubberized', impact: 'Class 4', alt: 'Malarkey Legacy SBS Polymer Modified Shingles' }
  ];

  const handleGenerateBlog = async () => {
    if (!blogPrompt.trim()) return;
    setIsLoading(true);
    setBlogContent('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create high-authority SEO content for nimbusroofing.com focusing on: ${blogPrompt}. 
        Include:
        - Indexable title for Google/OpenAI
        - Alt-text suggestions for images
        - Backlink anchor text suggestions
        - Local McKinney/DFW context
        - Mentions of GAF and Owens Corning certification.`
      });
      setBlogContent(response.text);
    } catch (e) {
      console.error(e);
      alert('Content generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('shingles')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'shingles' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Premium Systems
        </button>
        <button 
          onClick={() => setActiveTab('blog')}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'blog' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          SEO Blog Builder
        </button>
      </div>

      {activeTab === 'shingles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shingleData.map((s, i) => (
            <Card key={i} className="overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="h-32 bg-gray-900 flex items-center justify-center border-b border-gray-800 relative">
                <ShieldIcon className="w-12 h-12 text-indigo-500/20" />
                <span className="absolute bottom-2 right-2 text-[8px] font-mono text-gray-600">ALT: {s.alt}</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                   <h4 className="font-extrabold text-white text-lg">{s.brand}</h4>
                   <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-mono uppercase">{s.impact}</span>
                </div>
                <p className="text-sm text-indigo-400 font-medium">{s.model}</p>
                <div className="grid grid-cols-2 text-xs gap-2 pt-2 text-gray-500">
                   <div>Warranty: <span className="text-gray-300">{s.warranty}</span></div>
                   <div>Type: <span className="text-gray-300">{s.material}</span></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="space-y-4">
          <Card className="p-6">
             <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
               <SparklesIcon className="w-5 h-5 text-indigo-400" />
               High-Authority Page Builder
             </h3>
             <p className="text-sm text-gray-400 mb-4">Targeting 2M keywords with Zero-Click optimization.</p>
             <div className="space-y-4">
                <textarea 
                  rows={3}
                  value={blogPrompt}
                  onChange={e => setBlogPrompt(e.target.value)}
                  placeholder="e.g., 'Class 4 Impact Resistant Shingles: Is the upgrade worth it in Collin County?'"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <div className="flex justify-end">
                   <Button onClick={handleGenerateBlog} isLoading={isLoading}>
                      Generate Authority Content
                   </Button>
                </div>
             </div>
          </Card>

          {(blogContent || isLoading) && (
            <Card className="p-8 border-indigo-500/10">
               <div className="prose prose-invert max-w-none">
                 {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <Spinner />
                      <p className="text-indigo-400 animate-pulse font-mono text-xs uppercase">Assembling SEO Architecture...</p>
                    </div>
                 ) : (
                    <div className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                       {blogContent}
                    </div>
                 )}
               </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;

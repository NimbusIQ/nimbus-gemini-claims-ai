
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImageIcon, MicIcon, BotIcon, ShieldIcon, CubeIcon } from '../components/Icons';

const MobileFieldOps: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'SYNCING' | 'COMPLETE'>('IDLE');

  const triggerScan = () => {
    setScanStatus('SCANNING');
    setTimeout(() => {
        setPhotos(prev => [...prev, `https://images.unsplash.com/photo-1632759162353-194967e1d492?w=200&h=200&fit=crop`]);
        setScanStatus('SYNCING');
        setTimeout(() => setScanStatus('COMPLETE'), 2000);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-12rem)] flex flex-col bg-black rounded-[3rem] border-[12px] border-gray-800 shadow-2xl relative overflow-hidden">
      {/* Status Bar */}
      <div className="h-6 bg-transparent flex justify-between items-center px-8 pt-4">
        <span className="text-[10px] font-bold text-white">9:41</span>
        <div className="flex gap-1.5">
           <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
           <div className="w-4 h-4 bg-white/20 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto no-scrollbar pt-10">
        <div className="flex justify-between items-start">
            <div>
               <h3 className="text-xl font-black text-white leading-tight">Field Agent<br/>v2.1 Mobile</h3>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Synced: McKinney Storm Hub</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
               <BotIcon className="w-6 h-6 text-white" />
            </div>
        </div>

        {/* Live Camera View Simulation */}
        <div className="aspect-[4/5] bg-gray-900 rounded-[2.5rem] border border-gray-800 relative overflow-hidden group shadow-inner">
           {scanStatus === 'SCANNING' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950/20 backdrop-blur-sm z-10">
                  <div className="w-full h-0.5 bg-indigo-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                  <CubeIcon className="w-12 h-12 text-indigo-400 animate-pulse mb-2" />
                  <span className="text-[10px] font-mono text-indigo-400">DETECTING HAIL MARKS...</span>
              </div>
           ) : scanStatus === 'SYNCING' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                  <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] mt-4 font-mono text-white">TRIGGERING CLAIMS_AGENT...</span>
              </div>
           ) : (
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1516592648932-a39ca2fa73a1?w=400&h=500&fit=crop')] bg-cover opacity-80 flex items-center justify-center">
                  <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                      <div className="w-40 h-40 border border-white/10 rounded-full"></div>
                  </div>
              </div>
           )}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <button 
                  onClick={triggerScan}
                  disabled={scanStatus !== 'IDLE' && scanStatus !== 'COMPLETE'}
                  className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 active:scale-95 transition-transform flex items-center justify-center disabled:opacity-50"
                >
                   <div className="w-12 h-12 rounded-full border-2 border-black"></div>
                </button>
           </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Forensic Evidence ({photos.length})</span>
                <span className="text-[10px] font-bold text-indigo-400">VIEW ALL</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {photos.length === 0 ? (
                    <div className="w-full p-6 border border-dashed border-gray-800 rounded-2xl flex flex-col items-center text-gray-700">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-[9px] font-bold uppercase">No scans captured yet</span>
                    </div>
                ) : (
                    photos.map((p, i) => (
                        <div key={i} className="min-w-[80px] h-20 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative group">
                            <img src={p} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                <ShieldIcon className="w-4 h-4 text-green-400" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Agent to Agent Logic Alert */}
        {scanStatus === 'COMPLETE' && (
            <div className="p-4 bg-green-950/20 border border-green-800 rounded-2xl animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-1">
                   <BotIcon className="w-4 h-4 text-green-400" />
                   <span className="text-[10px] font-bold text-green-400 uppercase">Agent Flow Triggered</span>
                </div>
                <p className="text-[10px] text-green-200/80 leading-relaxed italic">
                    "SiteScan complete. HunterAgent has updated Sheetify CRM and alerted NegotiatorAgent for Xactimate generation."
                </p>
            </div>
        )}
      </div>

      <div className="h-10 bg-transparent flex items-center justify-center pb-2">
         <div className="w-32 h-1 bg-white/20 rounded-full"></div>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0.2; }
            50% { top: 100%; opacity: 0.8; }
            100% { top: 0; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default MobileFieldOps;

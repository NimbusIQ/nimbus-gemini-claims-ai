
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { DownloadIcon, ShieldIcon, FileCodeIcon, SearchIcon } from '../components/Icons';

// --- Types ---
interface LineItem {
  desc: string;
  qty: number;
  unit: string;
  category: string;
  selector: string;
  note?: string; // The critical "Compliance Citation"
  value?: number; // Simulated dollar value
}

interface DroneData {
  claim_id: string;
  zip_code: string;
  measurements: {
    total_sq_ft: number;
    pitch: string;
  };
  line_items: LineItem[];
}

// --- Mock "Ground Truth" Database ---
const MUNICIPAL_CODES: Record<string, any> = {
  "78701": { 
    jurisdiction: "City of Austin, TX",
    code_year: "2021 IBC",
    requirements: {
      ice_water_shield: false,
      drip_edge: true, // Code R905.2.8.5
      shingle_match: "Reasonable Match (TDI)"
    }
  },
  "80205": { 
    jurisdiction: "City/County of Denver, CO",
    code_year: "2018 IBC",
    requirements: {
      ice_water_shield: true, // REQUIRED: 24" inside exterior wall
      drip_edge: true,
      wind_speed: "115 mph"
    }
  }
};

const DEFAULT_DRAFT: DroneData = {
  claim_id: "NIMBUS-STORM-25",
  zip_code: "80205", // Default to Denver to show the "Ice & Water Shield" add
  measurements: { total_sq_ft: 3000, pitch: "9/12" },
  line_items: [
    { desc: "3-Tab Shingles (Tear Off)", qty: 30, unit: "SQ", category: "RFG", selector: "300", value: 2100 },
    { desc: "3-Tab Shingles (Install)", qty: 30, unit: "SQ", category: "RFG", selector: "300S", value: 4500 },
    { desc: "Ridge Cap", qty: 120, unit: "LF", category: "RFG", selector: "RIDGC", value: 600 }
  ]
};

const XactimateBridge: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(JSON.stringify(DEFAULT_DRAFT, null, 2));
  const [enrichedJson, setEnrichedJson] = useState<DroneData | null>(null);
  const [complianceLog, setComplianceLog] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'draft' | 'audit' | 'xml'>('audit');

  const runComplianceEngine = async () => {
    setIsAuditing(true);
    setComplianceLog([]);
    setEnrichedJson(null);
    setActiveTab('audit');

    try {
      const draft: DroneData = JSON.parse(inputJson);
      const zip = draft.zip_code;
      const codes = MUNICIPAL_CODES[zip] || MUNICIPAL_CODES["78701"]; // Fallback

      // Step 1: Simulate Database Lookup
      setComplianceLog(prev => [...prev, `📍 Locating Jurisdiction: ${zip}...`]);
      await new Promise(r => setTimeout(r, 600));
      setComplianceLog(prev => [...prev, `✅ Found: ${codes.jurisdiction} (${codes.code_year})`]);
      setComplianceLog(prev => [...prev, `📖 Retrieving Ordinances: ${JSON.stringify(codes.requirements)}`]);
      
      // Step 2: Gemini Audit
      await new Promise(r => setTimeout(r, 800));
      setComplianceLog(prev => [...prev, `🤖 Agent "Sentinel-Audit" Initialized (Gemini 3 Reasoning)...`]);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // We prompt the model to "Fix" the JSON
      const prompt = `
      Act as "Sentinel-Audit", a Senior Code Compliance Officer.
      
      LOCAL CODES FOR ZIP ${zip}:
      ${JSON.stringify(codes)}
      
      DRAFT ESTIMATE JSON:
      ${JSON.stringify(draft)}
      
      INSTRUCTIONS:
      1. Analyze the Draft against Local Codes.
      2. If 'Ice & Water Shield' is required but missing, ADD it to 'line_items'.
      3. If 'Drip Edge' is required but missing, ADD it.
      4. Add a 'note' field to added items citing the specific code statute (e.g., "Added per IBC 2018 Sec 1507.2").
      5. Calculate 'value' for added items ($150 per SQ for IWS, $3 per LF for Drip Edge).
      6. Return ONLY the valid JSON of the full enriched estimate object.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
           responseMimeType: "application/json"
        }
      });

      const resultText = response.text;
      const finalData: DroneData = JSON.parse(resultText);
      
      setEnrichedJson(finalData);
      setComplianceLog(prev => [...prev, `✅ Audit Complete. Compliance Enforcement Applied.`]);

    } catch (e) {
      setComplianceLog(prev => [...prev, `❌ Error: ${e instanceof Error ? e.message : 'Unknown'}`]);
    } finally {
      setIsAuditing(false);
    }
  };

  const calculateTotal = (items: LineItem[]) => items.reduce((acc, item) => acc + (item.value || 0), 0);
  
  const generateEsx = () => {
    if(!enrichedJson) return "Run Audit First";
    // Simplified ESX simulation
    return `<?xml version="1.0"?>
<XactimateEstimate>
  <AdminInfo>
    <Claim>${enrichedJson.claim_id}</Claim>
    <Zip>${enrichedJson.zip_code}</Zip>
    <Creator>Nimbus Compliance Engine</Creator>
  </AdminInfo>
  <LineItems>
    ${enrichedJson.line_items.map(item => `
    <Item>
      <Cat>${item.category}</Cat>
      <Sel>${item.selector}</Sel>
      <Desc>${item.desc}</Desc>
      <Qty>${item.qty}</Qty>
      <Note>${item.note || ''}</Note>
    </Item>`).join('')}
  </LineItems>
</XactimateEstimate>`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      
      {/* LEFT: Input / Draft */}
      <Card className="w-full lg:w-1/3 flex flex-col p-4 border-gray-700 bg-gray-800/80">
        <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-lg font-bold text-white flex items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs mr-2">1</div>
                Step 1: Draft Estimate
            </h2>
            <div className="text-xs text-gray-500 font-mono">NIMBUS ROOFING</div>
        </div>
        
        <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-1">Project Location</label>
            <select 
                className="w-full bg-gray-900 text-sm text-white border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => {
                    const newData = {...DEFAULT_DRAFT, zip_code: e.target.value};
                    setInputJson(JSON.stringify(newData, null, 2));
                    setEnrichedJson(null);
                }}
            >
                <option value="80205">Denver, CO (Strict Code)</option>
                <option value="78701">Austin, TX (Moderate Code)</option>
            </select>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">Raw Drone Data (JSON)</label>
            <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                className="flex-1 bg-gray-900/50 font-mono text-xs text-blue-300 p-4 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none"
            />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
             <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Draft Value:</span>
                <span className="text-white font-mono">${calculateTotal(JSON.parse(inputJson).line_items).toLocaleString()}</span>
            </div>
            <Button onClick={runComplianceEngine} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center font-bold">
                    <ShieldIcon className="w-5 h-5 mr-2"/> 
                    Run Step 2: Compliance Loop
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Button>
        </div>
      </Card>

      {/* RIGHT: Engine Output */}
      <Card className="w-full lg:w-2/3 flex flex-col border-indigo-500/30">
        {/* Header Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800/50 rounded-t-xl">
            <button onClick={() => setActiveTab('audit')} className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${activeTab === 'audit' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-900/10' : 'text-gray-400 hover:text-white'}`}>
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] mr-2">2</div>
                Step 2: AI Audit
            </button>
            <button onClick={() => setActiveTab('xml')} disabled={!enrichedJson} className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${activeTab === 'xml' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-900/10' : 'text-gray-400 hover:text-white disabled:opacity-30'}`}>
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] mr-2">3</div>
                Step 3: Revised Estimate (Submission)
            </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-900/30 relative">
            {isAuditing && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Spinner />
                    <p className="mt-4 text-indigo-400 font-mono text-sm animate-pulse">Sentinel-Audit: Cross-referencing 2021 IBC Codes...</p>
                </div>
            )}

            {activeTab === 'audit' && (
                <div className="space-y-6">
                    {/* Log Stream */}
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-xs space-y-2 border border-gray-800">
                        {complianceLog.length === 0 && <span className="text-gray-600">// Waiting for Input...</span>}
                        {complianceLog.map((log, i) => (
                            <div key={i} className="text-green-400 border-l-2 border-green-800 pl-2">{log}</div>
                        ))}
                    </div>

                    {/* Enriched Results */}
                    {enrichedJson && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-white font-bold flex items-center text-lg">
                                <ShieldIcon className="w-6 h-6 mr-2 text-green-500"/>
                                Defensible Estimate Generated
                            </h3>
                            <p className="text-sm text-gray-400">The following items were added to ensure code compliance and maximize claim value.</p>
                            
                            <div className="grid gap-3">
                                {enrichedJson.line_items.map((item, idx) => (
                                    <div key={idx} className={`p-4 rounded-lg border transition-all ${item.note ? 'bg-indigo-900/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-gray-800 border-gray-700 opacity-60'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-white flex items-center">
                                                    {item.desc}
                                                    {item.note && <span className="ml-2 text-[10px] bg-indigo-500 text-white px-1.5 rounded-sm uppercase">Added</span>}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">Cat: {item.category} | Sel: {item.selector} | Qty: {item.qty} {item.unit}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-green-400 font-bold">+${item.value?.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        {item.note && (
                                            <div className="mt-3 text-xs bg-indigo-900/40 text-indigo-200 p-2.5 rounded border border-indigo-500/30 flex items-start">
                                                <SearchIcon className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-indigo-400"/>
                                                <span className="italic">"{item.note}"</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Value Summary */}
                            <div className="bg-gradient-to-r from-green-900/30 to-indigo-900/30 p-5 rounded-xl border border-green-500/40 flex justify-between items-center mt-4">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Revised Value</div>
                                    <div className="text-3xl font-bold text-white">${calculateTotal(enrichedJson.line_items).toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-green-400 uppercase tracking-wider font-semibold">Compliance Lift</div>
                                    <div className="text-2xl font-bold text-green-400">
                                        +${(calculateTotal(enrichedJson.line_items) - calculateTotal(JSON.parse(inputJson).line_items)).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'xml' && (
                <div className="h-full flex flex-col">
                    <h3 className="text-white font-bold mb-2">Ready for Submission</h3>
                    <p className="text-sm text-gray-400 mb-4">Copy this .ESX compatible XML to upload directly to Xactimate or Symbility.</p>
                    <textarea 
                        readOnly 
                        value={generateEsx()} 
                        className="flex-1 bg-gray-900 font-mono text-xs text-yellow-100 p-4 rounded border border-gray-700 resize-none focus:outline-none"
                    />
                     <Button onClick={() => navigator.clipboard.writeText(generateEsx())} className="mt-4">
                        <DownloadIcon className="w-4 h-4 mr-2" /> Copy ESX to Clipboard
                    </Button>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default XactimateBridge;

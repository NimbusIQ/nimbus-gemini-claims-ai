
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SparklesIcon, SearchIcon, ImageIcon, MessageSquareIcon, ShieldIcon, InfoIcon } from '../components/Icons';

interface CompanyProfileProps {
  onNavigate: (toolId: string) => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'investor'>('about');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <button 
            onClick={() => setActiveTab('about')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'about' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
            About Nimbus
        </button>
        <button 
            onClick={() => setActiveTab('investor')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'investor' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
            Investor Summary
        </button>
      </div>

      {activeTab === 'about' && (
      <>
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 py-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
        
        <div className="inline-flex items-center space-x-2 bg-indigo-900/40 border border-indigo-500/50 rounded-full px-4 py-1.5 mb-4">
          <SparklesIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Google for Startups Cloud Program Applicant</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Nimbus General <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Contractors</span>
        </h1>
        <p className="text-2xl text-indigo-200 font-light">
          Field Services P&L & Autonomous Claims Management
        </p>
        <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
           A regional storm-response operator. We don't just calculate claims; we defend them. Our "Compliance Engine" turns estimation software into a Legal Shield against insurance rejection.
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={() => onNavigate('xactimate-bridge')} className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-3 text-lg shadow-xl shadow-indigo-900/20">
            Launch Compliance Engine
          </Button>
          <Button onClick={() => window.open('https://cloud.google.com/startup', '_blank')} className="bg-gray-800 border border-gray-700 hover:bg-gray-700 px-8 py-3 text-lg">
            View Documentation
          </Button>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-red-900/30 bg-gradient-to-br from-gray-800 to-gray-900">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">The Problem</h3>
            <div className="text-4xl font-bold text-white mb-1">Defensibility</div>
            <p className="text-sm text-gray-400">Carriers reject valid line items (Ice & Water Shield, Code Upgrades) because contractors fail to cite the specific municipal ordinance.</p>
        </Card>
        <Card className="p-6 border-indigo-500/30 bg-gradient-to-br from-gray-800 to-indigo-900/20">
            <h3 className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-2">Our Solution</h3>
            <div className="text-4xl font-bold text-white mb-1">Compliance Loop</div>
            <p className="text-sm text-gray-400">Gemini 3 acts as a "Code Officer," cross-referencing every drone estimate against local laws to force-include required items.</p>
        </Card>
        <Card className="p-6 border-green-900/30 bg-gradient-to-br from-gray-800 to-gray-900">
            <h3 className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-2">The Result</h3>
            <div className="text-4xl font-bold text-white mb-1">+$1,200 / File</div>
            <p className="text-sm text-gray-400">Average lift in claim value by enforcing code-mandated upgrades that are often overlooked by manual adjusters.</p>
        </Card>
      </section>

      {/* 3. PRODUCT SHOWCASE (Live Links) */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">The Storm Stack</h2>
            <span className="text-sm bg-indigo-600 px-3 py-1 rounded text-white">Live Beta v2.0</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Module 1 */}
            <Card className="p-0 overflow-hidden border-indigo-500/30 flex flex-col">
                <div className="bg-gray-800/50 p-6 flex-1">
                    <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
                        <ShieldIcon />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Governance: The Compliance Engine</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Replaces manual lookup of "UpCodes". Our Agent retrieves Zip-code specific requirements (IBC 2021) and auto-supplements the claim.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-300">
                        <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Auto-Cites Ordinances</li>
                        <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Enforces Ice & Water Shield</li>
                    </ul>
                </div>
                <div className="p-4 bg-gray-900 border-t border-gray-700 text-right">
                    <Button onClick={() => onNavigate('xactimate-bridge')} className="text-sm">Launch Compliance Engine &rarr;</Button>
                </div>
            </Card>

            {/* Module 2 */}
            <Card className="p-0 overflow-hidden border-indigo-500/30 flex flex-col">
                <div className="bg-gray-800/50 p-6 flex-1">
                    <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                        <SparklesIcon />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Monetization: Activity Codes</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Ensures the correct Xactimate activity codes (Replace vs Detach & Reset) are used based on damage severity and material availability.
                    </p>
                </div>
                <div className="p-4 bg-gray-900 border-t border-gray-700 text-right">
                    <Button onClick={() => onNavigate('claims-intelligence')} className="text-sm">Launch Claims Audit &rarr;</Button>
                </div>
            </Card>

             {/* Module 3 */}
             <Card className="p-0 overflow-hidden border-indigo-500/30 flex flex-col">
                <div className="bg-gray-800/50 p-6 flex-1">
                    <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                        <SearchIcon />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Acquisition: Storm Response</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Geo-triggered campaigns that explicitly target local storm pain points with urgency-driven assets.
                    </p>
                </div>
                <div className="p-4 bg-gray-900 border-t border-gray-700 text-right">
                    <Button onClick={() => onNavigate('market-authority')} className="text-sm">Launch Storm Campaign &rarr;</Button>
                </div>
            </Card>

             {/* Module 4 */}
             <Card className="p-0 overflow-hidden border-indigo-500/30 flex flex-col">
                <div className="bg-gray-800/50 p-6 flex-1">
                    <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center mb-4 text-red-400">
                        <ImageIcon />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Forensics: Sentinel Vision</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Gemini 3 Vision analyzes drone imagery to detect hail hits and wind lift invisible to the naked eye.
                    </p>
                </div>
                <div className="p-4 bg-gray-900 border-t border-gray-700 text-right">
                    <Button onClick={() => onNavigate('roof-inspector')} className="text-sm">Launch Vision Scan &rarr;</Button>
                </div>
            </Card>

        </div>
      </section>

      {/* 4. WHY GOOGLE / TECH STACK */}
      <section className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Built on Vertex AI & Gemini 3 Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Nimbus IQ is a Google Cloud-native startup leveraging the complex developer stack. We use quantized <b>Gemini 3 (Nano Banana)</b> models for edge efficiency and spatial/haptic feedback loops to create a fully immersive OS.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <div className="text-xs text-gray-500 uppercase">Vision & Spatial</div>
                        <div className="font-semibold text-white">Gemini 3 / Nano</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <div className="text-xs text-gray-500 uppercase">Data & RAG</div>
                        <div className="font-semibold text-white">BigQuery / Vector</div>
                    </div>
                     <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <div className="text-xs text-gray-500 uppercase">Communications</div>
                        <div className="font-semibold text-white">Google Voice / Gmail</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <div className="text-xs text-gray-500 uppercase">Security</div>
                        <div className="font-semibold text-white">Chronicle / SCC</div>
                    </div>
                </div>
            </div>
            <div className="relative h-full min-h-[200px] bg-gray-900 rounded-xl border border-gray-700 p-4 flex items-center justify-center">
                 <div className="text-center">
                    <ShieldIcon className="w-16 h-16 text-indigo-600 mx-auto mb-2 opacity-50" />
                    <p className="text-gray-500 text-sm">Enterprise-Grade Architecture</p>
                    <p className="text-xs text-gray-600">Model Quantization & Haptic RAG Loops</p>
                 </div>
            </div>
        </div>
      </section>

      {/* 5. TEAM */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet the Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border-gray-700 bg-gray-800/50 hover:border-indigo-500 transition-colors">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-2 border-indigo-500">DM</div>
                <h3 className="text-xl font-bold text-white">Dustin Moore</h3>
                <p className="text-indigo-400 text-sm font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-400 text-xs">Driving the vision of the Autonomous Construction OS. Expert in Vertical SaaS strategy.</p>
            </Card>
            <Card className="p-6 text-center border-gray-700 bg-gray-800/50 hover:border-purple-500 transition-colors">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-2 border-purple-500">DM</div>
                <h3 className="text-xl font-bold text-white">Dustin Moore</h3>
                <p className="text-purple-400 text-sm font-medium mb-2">Chief Technology Officer</p>
                <p className="text-gray-400 text-xs">Architect of the ADK Swarm, Security Foundations, and BigQuery RAG integrations.</p>
            </Card>
            <Card className="p-6 text-center border-gray-700 bg-gray-800/50 hover:border-cyan-500 transition-colors">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-2 border-cyan-500">DM</div>
                <h3 className="text-xl font-bold text-white">Dustin Moore</h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">Head of AI Research</p>
                <p className="text-gray-400 text-xs">Lead developer of Gemini 3 quantization, spatial computing, and haptic feedback loops.</p>
            </Card>
        </div>
      </section>
      </>
      )}

      {activeTab === 'investor' && (
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Executive Investor Summary</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                      <h3 className="text-indigo-400 uppercase text-xs font-bold tracking-wider mb-2">Operating Thesis</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          Nimbus General Contractors is a regional, storm-response roofing contractor focused on insurance-backed roof claims. We position the business as the on-the-ground claims manager, leveraging our proprietary "Compliance Engine" to ensure claim defensibility.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                          <li><strong>Strategy:</strong> Storm Response & High-Value Residential</li>
                          <li><strong>Value Prop:</strong> Compliance-based Claims Management</li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="text-indigo-400 uppercase text-xs font-bold tracking-wider mb-2">Market Opportunity</h3>
                      <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold text-white">$156B</span>
                          <span className="text-sm text-gray-500 mb-1">Total Addressable Market (US)</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                          The restoration industry loses $3.2 Billion annually due to administrative inefficiencies. We target the top 200 US Restoration Firms with a potential SOM of $150M.
                      </p>
                  </div>
              </div>

              <div className="mb-8">
                  <h3 className="text-white text-xl font-bold mb-4">The Solution: RoofAI Pro</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-bold text-white mb-1">1. Acquisition</h4>
                          <p className="text-sm text-gray-400">"Zero-Click" generative SEO that auto-publishes storm guides to capture traffic.</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-bold text-white mb-1">2. Forensics</h4>
                          <p className="text-sm text-gray-400">Gemini 3 Vision (Nano Banana) identifies hail hits with 99.7% accuracy.</p>
                      </div>
                       <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-bold text-white mb-1">3. Monetization</h4>
                          <p className="text-sm text-gray-400">Claims Intelligence audits scopes against 40,000+ municipal codes using RAG.</p>
                      </div>
                       <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-bold text-white mb-1">4. Governance</h4>
                          <p className="text-sm text-gray-400">Enterprise-grade compliance and security foundations from day one.</p>
                      </div>
                  </div>
              </div>

               <div className="mb-8">
                  <h3 className="text-white text-xl font-bold mb-4">Traction & Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-400">500+</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Beta Users</div>
                      </div>
                      <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-400">$45M+</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Claims Processed</div>
                      </div>
                      <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">$4,200</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Avg Lift / Claim</div>
                      </div>
                      <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400">95%</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Automation Rate</div>
                      </div>
                  </div>
              </div>
          </div>
      )}

       {/* Footer */}
      <Card className="p-8 text-center bg-black border-t border-gray-800">
        <h2 className="text-xl font-bold text-white mb-2">Ready to transform your workflow?</h2>
        <p className="text-gray-400 mb-6">Join the 500+ contractors using RoofAI Pro today.</p>
        <div className="inline-flex space-x-6 text-indigo-400 text-sm">
            <a href="#" className="hover:text-indigo-300 transition-colors">partnerships@nimbusiq.ai</a>
            <span className="text-gray-700">|</span>
            <span className="text-gray-500">San Francisco, CA</span>
            <span className="text-gray-700">|</span>
             <a href="#" className="hover:text-indigo-300 transition-colors">www.nimbusiq.ai</a>
        </div>
      </Card>
    </div>
  );
};

export default CompanyProfile;

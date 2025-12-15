
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SparklesIcon, SearchIcon, ImageIcon, MessageSquareIcon, ShieldIcon, InfoIcon, UsersIcon } from '../components/Icons';

interface CompanyProfileProps {
  onNavigate: (toolId: string) => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 py-12 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800/50 rounded-3xl border border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
        
        <div className="inline-flex items-center space-x-2 bg-indigo-900/40 border border-indigo-500/50 rounded-full px-4 py-1.5 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <SparklesIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-indigo-100 uppercase tracking-wide">Google for Startups Partner</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Nimbus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">IQ</span>
        </h1>
        <p className="text-2xl text-indigo-200 font-light tracking-wide">
          The Autonomous Operating System for Construction
        </p>
        <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
           Moving the restoration industry from "manually managed" to "autonomously executed". Built on Gemini 3, Vertex AI, and a proprietary Vertical SaaS architecture.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button onClick={() => onNavigate('xactimate-bridge')} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-lg shadow-xl shadow-indigo-900/20 rounded-xl">
            Launch Live Platform Demo
          </Button>
          <Button onClick={() => window.open('https://cloud.google.com/startup', '_blank')} className="bg-gray-800 border border-gray-700 hover:bg-gray-700 px-8 py-4 text-lg rounded-xl">
            View API Documentation
          </Button>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">The $3.2B Industry Leak</h2>
            <p className="text-gray-400">Inefficiency is costing restoration firms billions annually.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border-red-900/30 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-bl-full transition-transform group-hover:scale-150 duration-500"></div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Forensic Accuracy</h3>
                <div className="text-4xl font-bold text-white mb-2">30% Missed</div>
                <p className="text-sm text-gray-400">Human inspectors routinely miss hail hits and wind damage, leading to under-scoped claims and lost revenue.</p>
            </Card>
            <Card className="p-8 border-indigo-500/30 bg-gradient-to-br from-gray-900 to-indigo-900/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-bl-full transition-transform group-hover:scale-150 duration-500"></div>
                <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Claims Leakage</h3>
                <div className="text-4xl font-bold text-white mb-2">$3.2 Billion</div>
                <p className="text-sm text-gray-400">Aggregated annual revenue lost by contractors failing to document code-required upgrades.</p>
            </Card>
            <Card className="p-8 border-green-900/30 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/10 rounded-bl-full transition-transform group-hover:scale-150 duration-500"></div>
                <h3 className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2">The Solution</h3>
                <div className="text-4xl font-bold text-white mb-2">95% Auto</div>
                <p className="text-sm text-gray-400">Nimbus automates the entire claim lifecycle: Acquisition, Forensics, Monetization, and Governance.</p>
            </Card>
          </div>
      </section>

      {/* 3. PRODUCT SHOWCASE */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white">The Product Suite</h2>
                <p className="text-gray-400">Four integrated modules creating a defensible value loop.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Module 1 */}
            <Card className="p-0 overflow-hidden border-indigo-500/30 flex flex-col group">
                <div className="bg-gray-800/50 p-8 flex-1 transition-colors group-hover:bg-gray-800">
                    <div className="w-14 h-14 bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 shadow-inner">
                        <ShieldIcon className="w-8 h-8"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">1. Governance</h3>
                    <h4 className="text-indigo-400 font-medium mb-4">The Compliance Engine</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Replaces manual lookup of "UpCodes". Our Agent retrieves Zip-code specific requirements (IBC 2021) and auto-supplements the claim to ensure legal defensibility.
                    </p>
                </div>
                <div className="p-4 bg-gray-950 border-t border-gray-800 text-right">
                    <Button onClick={() => onNavigate('xactimate-bridge')} className="text-sm bg-gray-800 hover:bg-indigo-600 border border-gray-700">Launch Compliance Demo &rarr;</Button>
                </div>
            </Card>

            {/* Module 2 */}
            <Card className="p-0 overflow-hidden border-purple-500/30 flex flex-col group">
                <div className="bg-gray-800/50 p-8 flex-1 transition-colors group-hover:bg-gray-800">
                    <div className="w-14 h-14 bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-400 shadow-inner">
                        <SparklesIcon className="w-8 h-8"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">2. Monetization</h3>
                    <h4 className="text-purple-400 font-medium mb-4">Claims Intelligence</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Ensures the correct Xactimate activity codes are used. Audits estimates against thousands of municipal regulations to find missing revenue.
                    </p>
                </div>
                <div className="p-4 bg-gray-950 border-t border-gray-800 text-right">
                    <Button onClick={() => onNavigate('claims-intelligence')} className="text-sm bg-gray-800 hover:bg-purple-600 border border-gray-700">Launch Claims Audit &rarr;</Button>
                </div>
            </Card>

             {/* Module 3 */}
             <Card className="p-0 overflow-hidden border-blue-500/30 flex flex-col group">
                <div className="bg-gray-800/50 p-8 flex-1 transition-colors group-hover:bg-gray-800">
                    <div className="w-14 h-14 bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-400 shadow-inner">
                        <SearchIcon className="w-8 h-8"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">3. Acquisition</h3>
                    <h4 className="text-blue-400 font-medium mb-4">Market Authority</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Geo-triggered campaigns that explicitly target local storm pain points. "Zero-Click" SEO generates landing pages the moment hail hits.
                    </p>
                </div>
                <div className="p-4 bg-gray-950 border-t border-gray-800 text-right">
                    <Button onClick={() => onNavigate('market-authority')} className="text-sm bg-gray-800 hover:bg-blue-600 border border-gray-700">Launch Marketing Demo &rarr;</Button>
                </div>
            </Card>

             {/* Module 4 */}
             <Card className="p-0 overflow-hidden border-red-500/30 flex flex-col group">
                <div className="bg-gray-800/50 p-8 flex-1 transition-colors group-hover:bg-gray-800">
                    <div className="w-14 h-14 bg-red-900/50 rounded-2xl flex items-center justify-center mb-6 text-red-400 shadow-inner">
                        <ImageIcon className="w-8 h-8"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">4. Forensics</h3>
                    <h4 className="text-red-400 font-medium mb-4">Sentinel Vision</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Gemini 3 Vision analyzes drone imagery to detect hail hits and wind lift invisible to the naked eye, providing pixel-perfect evidence.
                    </p>
                </div>
                <div className="p-4 bg-gray-950 border-t border-gray-800 text-right">
                    <Button onClick={() => onNavigate('roof-inspector')} className="text-sm bg-gray-800 hover:bg-red-600 border border-gray-700">Launch Vision Demo &rarr;</Button>
                </div>
            </Card>

        </div>
      </section>

      {/* 4. MARKET OPPORTUNITY */}
      <section className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                 <h2 className="text-3xl font-bold text-white mb-6">Market Opportunity</h2>
                 <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    We target the top 200 US Restoration Firms, unlocking a serviceable obtainable market (SOM) of $150M within a $156B Total Addressable Market.
                 </p>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                         <span className="text-gray-400">Total Addressable Market (US)</span>
                         <span className="text-2xl font-bold text-white">$156B</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                         <span className="text-gray-400">Software Spend (SAM)</span>
                         <span className="text-2xl font-bold text-indigo-400">$12B</span>
                     </div>
                 </div>
            </div>
            <div className="relative h-64 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border border-gray-700">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="text-center z-10">
                    <div className="text-6xl font-black text-white mb-2">$1,200</div>
                    <div className="text-sm text-green-400 uppercase tracking-widest font-bold">Avg. Lift Per File</div>
                </div>
            </div>
         </div>
      </section>

      {/* 5. TECH STACK */}
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

      {/* 6. TEAM */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet the Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border-gray-700 bg-gray-800/50 hover:border-indigo-500 transition-colors">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-4 border-indigo-500/30">DM</div>
                <h3 className="text-xl font-bold text-white">Dustin Moore</h3>
                <p className="text-indigo-400 text-sm font-bold uppercase tracking-wide mb-2">Founder & CEO</p>
                <p className="text-gray-400 text-xs leading-relaxed">Driving the vision of the Autonomous Construction OS. Expert in Vertical SaaS strategy and restoration workflows.</p>
            </Card>
            <Card className="p-6 text-center border-gray-700 bg-gray-800/50 hover:border-purple-500 transition-colors">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-4 border-purple-500/30">DM</div>
                <h3 className="text-xl font-bold text-white">Dustin Moore</h3>
                <p className="text-purple-400 text-sm font-bold uppercase tracking-wide mb-2">Chief Technology Officer</p>
                <p className="text-gray-400 text-xs leading-relaxed">Architect of the ADK Swarm, Security Foundations, and BigQuery RAG integrations.</p>
            </Card>
            <Card className="p-6 text-center border-gray-700 bg-gray-800/50 hover:border-cyan-500 transition-colors">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-4 border-cyan-500/30">DM</div>
                <h3 className="text-xl font-bold text-white">Dustin Moore</h3>
                <p className="text-cyan-400 text-sm font-bold uppercase tracking-wide mb-2">Head of AI Research</p>
                <p className="text-gray-400 text-xs leading-relaxed">Lead developer of Gemini 3 quantization, spatial computing, and haptic feedback loops.</p>
            </Card>
        </div>
      </section>

       {/* Footer */}
      <Card className="p-12 text-center bg-black border-t border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to transform your workflow?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join the 500+ contractors using RoofAI Pro to automate their business today.</p>
        <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => onNavigate('xactimate-bridge')}>Get Started Now</Button>
            <Button onClick={() => window.location.href = 'mailto:partnerships@nimbusiq.ai'} className="bg-transparent border border-gray-700 hover:bg-gray-800">Contact Sales</Button>
        </div>
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

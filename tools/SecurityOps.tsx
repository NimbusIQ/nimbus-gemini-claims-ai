
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

interface BlueprintSection {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

const SECTIONS: BlueprintSection[] = [
  { 
    id: 'org', 
    title: 'Organization Structure', 
    description: 'Define folder hierarchy for segregation of policies, privileges and access.',
    prompt: 'Acting as a Google Cloud Security Architect, explain how to set up the Organization Structure according to the Security Foundations Blueprint. Include Folder hierarchy (Env/Business Unit) and essential Organization Policies (constraints) to apply. Provide a Terraform snippet for the folder structure.' 
  },
  { 
    id: 'iam', 
    title: 'Authentication & IAM', 
    description: 'Federate identity and configure least-privilege access.',
    prompt: 'Acting as a Google Cloud Security Architect, explain the Identity & Access Management (IAM) strategy in the Security Foundations Blueprint. Cover Identity Federation, Group-based access (vs User-based), and handling Privileged Access. Provide a Terraform snippet for creating a restricted IAM group.' 
  },
  { 
    id: 'network', 
    title: 'Networking & Segmentation', 
    description: 'Shared VPC, Firewalls, and Service Controls.',
    prompt: 'Acting as a Google Cloud Security Architect, explain the Networking strategy in the Security Foundations Blueprint. Cover Shared VPC, VPC Service Controls (Perimeters), and Hierarchical Firewall Policies. Provide a Terraform snippet for a Shared VPC host project setup.' 
  },
  { 
    id: 'data', 
    title: 'Data Protection', 
    description: 'Key Management (KMS) and Secret Manager.',
    prompt: 'Acting as a Google Cloud Security Architect, explain Data Protection in the Security Foundations Blueprint. Detail the use of Cloud KMS (CMEK) and Secret Manager. Provide a Terraform snippet for a CMEK-protected Storage Bucket.' 
  },
  { 
    id: 'detect', 
    title: 'Detective Controls', 
    description: 'Logging, Monitoring, and Security Command Center.',
    prompt: 'Acting as a Google Cloud Security Architect, explain Detective Controls in the Security Foundations Blueprint. Cover Organization-level Log Sinks, BigQuery exports, and Security Command Center (SCC) configuration. Provide a Terraform snippet for an aggregated log sink.' 
  },
  { 
    id: 'deploy', 
    title: 'Secure Deployment', 
    description: 'Infrastructure as Code and CI/CD Pipelines.',
    prompt: 'Acting as a Google Cloud Security Architect, explain the "Secure Application Deployment" phase of the Security Foundations Blueprint. Describe the separation of duties between Infrastructure and Workload pipelines. Provide a Cloud Build YAML example for a secure deployment.' 
  },
];

const SecurityOps: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<BlueprintSection>(SECTIONS[0]);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setContent('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: selectedSection.prompt,
        config: {
            systemInstruction: "You are the Chief Information Security Officer (CISO) for RoofAI Pro. Your goal is to guide the implementation of the Google Cloud Security Foundations Blueprint. Be technical, precise, and provide actionable Terraform code blocks where requested."
        }
      });
      setContent(response.text);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Security Analysis Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Left Sidebar: Blueprint Modules */}
      <Card className="w-full lg:w-1/3 flex flex-col p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Blueprint Modules</h2>
        <div className="space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => { setSelectedSection(section); setContent(''); setError(null); }}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                selectedSection.id === section.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600'
              }`}
            >
              <h3 className={`font-semibold ${selectedSection.id === section.id ? 'text-indigo-400' : 'text-gray-200'}`}>
                {section.title}
              </h3>
              <p className="text-xs mt-1 opacity-80">{section.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Right Content Area: Implementation Details */}
      <Card className="w-full lg:w-2/3 flex flex-col border-indigo-500/30">
        <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gray-800/80 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedSection.title}</h2>
            <p className="text-sm text-gray-400 mt-1">Security Foundations Blueprint Implementation</p>
          </div>
          <Button onClick={handleGenerate} isLoading={isLoading}>
            Generate Plan & Code
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-900/30">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 mb-4">
              {error}
            </div>
          )}

          {!content && !isLoading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Select a module and click "Generate Plan" to retrieve the security blueprint.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Spinner />
              <p className="text-indigo-400 animate-pulse">Consulting Security Architect...</p>
            </div>
          )}

          {content && (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                {content}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SecurityOps;

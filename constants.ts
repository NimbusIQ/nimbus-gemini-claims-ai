
import type { Tool } from './types';
import { SparklesIcon, MessageSquareIcon, ImageIcon, SearchIcon, MicIcon, VideoIcon, BotIcon, OpenAIIcon, UsersIcon } from './components/Icons';

export const TOOLS: Tool[] = [
  {
    id: 'command-center',
    name: 'Command Center',
    description: 'Real-Time Decision Engine updating every 8 seconds for strategic oversight.',
    icon: MessageSquareIcon,
  },
  {
    id: 'claims-intelligence',
    name: 'Claims Intelligence',
    description: 'Find missing supplements ($4,200 avg) and analyze Texas Code.',
    icon: SparklesIcon,
  },
  {
    id: 'adk-workbench',
    name: 'ADK Workbench',
    description: 'Manage your specialized agent swarm (Inspectors, Claims, Support).',
    icon: UsersIcon,
  },
  {
    id: 'roof-inspector',
    name: 'Roof Inspector',
    description: 'AR Roof Scans and 99.7% accurate damage analysis from imagery.',
    icon: ImageIcon,
  },
  {
    id: 'market-authority',
    name: 'Market Authority',
    description: 'Zero-Click Answer Engine & Geo-Triggered Generative SEO.',
    icon: SearchIcon,
  },
  {
    id: 'paperwork-scanner',
    name: 'Paperwork Scanner',
    description: 'Ingest policies and estimates using Document AI technology.',
    icon: OpenAIIcon, // Repurposing icon for Document/Scan
  },
  {
    id: 'emergency-response',
    name: 'Emergency Response',
    description: 'Rapid mobilization coordinator with real-time voice interface.',
    icon: BotIcon,
  },
  {
    id: 'site-surveillance',
    name: 'Site Surveillance',
    description: 'Monitor job sites and analyze footage for safety and progress.',
    icon: VideoIcon,
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Automated 24/7 lead qualification and support bot.',
    icon: MicIcon,
  },
];

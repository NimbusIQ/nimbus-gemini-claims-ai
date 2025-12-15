
import type { Tool } from './types';
import { SparklesIcon, MessageSquareIcon, ImageIcon, SearchIcon, MicIcon, VideoIcon, BotIcon, OpenAIIcon, UsersIcon, ShieldIcon, InfoIcon, FileCodeIcon, TableIcon } from './components/Icons';

export const TOOLS: Tool[] = [
  {
    id: 'xactimate-bridge',
    name: 'Compliance Engine (MVP)',
    description: 'The 1-2-3 Solution: Generate a revised, code-compliant estimate for the carrier.',
    icon: ShieldIcon,
  },
  {
    id: 'crm-suite',
    name: 'Sheetify CRM',
    description: 'Automated Lead & Project Tracker powered by Nimbus Brain.',
    icon: TableIcon,
  },
  {
    id: 'market-authority',
    name: 'Market Authority',
    description: 'SEO Content, Backlink Exchange & Social Media Task Force.',
    icon: SearchIcon,
  },
  {
    id: 'command-center',
    name: 'Command Center',
    description: 'Real-Time Decision Engine updating every 8 seconds for strategic oversight.',
    icon: MessageSquareIcon,
  },
  {
    id: 'claims-intelligence',
    name: 'Claims Intelligence',
    description: 'Find missing supplements ($4,200 avg) and audit Activity Codes.',
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
    id: 'paperwork-scanner',
    name: 'Paperwork Scanner',
    description: 'Ingest policies and estimates using Document AI technology.',
    icon: OpenAIIcon, 
  },
  {
    id: 'security-ops',
    name: 'Security Foundations',
    description: 'Infrastructure Blueprint & Security Operations Center.',
    icon: FileCodeIcon,
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
  {
    id: 'company-profile',
    name: 'About Nimbus',
    description: 'Nimbus General Contractors: Field Services P&L & Operating Model.',
    icon: InfoIcon,
  },
];

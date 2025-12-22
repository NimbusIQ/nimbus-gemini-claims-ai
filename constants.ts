
import type { Tool } from './types';
import { 
  SparklesIcon, MessageSquareIcon, ImageIcon, SearchIcon, MicIcon, VideoIcon, 
  BotIcon, OpenAIIcon, UsersIcon, ShieldIcon, InfoIcon, FileCodeIcon, 
  TableIcon, FileTextIcon, PhoneIcon, CPUIcon 
} from './components/Icons';

export const TOOLS: Tool[] = [
  {
    id: 'kpi-dashboard',
    name: 'Sniper Intelligence',
    description: 'Precision tracking of claim lift and forensic ROI. The Accountant Sniper\'s financial HUD.',
    icon: CPUIcon,
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Sentinel',
    description: 'Forensic analysis of carrier denial tactics. Identifying missing items and suspicious narrative patterns.',
    icon: ShieldIcon,
  },
  {
    id: 'xactimate-bridge',
    name: 'Forensic XML Bridge',
    description: 'Validating Xactimate ESX against IBC 2021 with the precision of a field-forward engineer.',
    icon: FileCodeIcon,
  },
  {
    id: 'roof-inspector',
    name: 'Vision Lab',
    description: 'Spatial forensic analysis and hail triangulation. Integrated with Nimbus Voice AI for on-site feedback.',
    icon: ImageIcon,
  },
  {
    id: 'crm-suite',
    name: 'Sheetify SEO-CRM',
    description: 'Market-grounded operating system for roofing. Dominating the DFW hail track autonomously.',
    icon: TableIcon,
  },
  {
    id: 'adk-workbench',
    name: 'IQ Swarm Hub',
    description: 'Agent-to-Agent terminal. Orchestrating Cloud Run micro-agents for field-forward operations.',
    icon: UsersIcon,
  },
  {
    id: 'emergency-response',
    name: 'Smart IQ Voice',
    description: 'Low-latency intake at +1 972-IQ-NIMBUS. The voice link between customer and lab.',
    icon: PhoneIcon,
  },
  {
    id: 'company-profile',
    name: 'Research Lab',
    description: 'Cloud Run architecture, Accountant Sniper thesis, and Dustin Moore\'s forensic roadmap.',
    icon: InfoIcon,
  },
];

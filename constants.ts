
import type { Tool } from './types';
import { 
  SparklesIcon, MessageSquareIcon, ImageIcon, SearchIcon, MicIcon, VideoIcon, 
  BotIcon, OpenAIIcon, UsersIcon, ShieldIcon, InfoIcon, FileCodeIcon, 
  TableIcon, FileTextIcon, PhoneIcon, CPUIcon, CubeIcon 
} from './components/Icons';

export const TOOLS: Tool[] = [
  {
    id: 'kpi-dashboard',
    name: 'Sovereign HUD',
    description: 'High-fidelity telemetry of the IQ Swarm and tokenized construction assets.',
    icon: CPUIcon,
  },
  {
    id: 'adk-workbench',
    name: 'IQ Swarm Hub',
    description: 'Lethal Agent-to-Agent orchestration for autonomous asset management.',
    icon: UsersIcon,
  },
  {
    id: 'xactimate-bridge',
    name: 'Forensic Lab',
    description: 'Sovereign ESX XML validation against IBC 2021 protocols. Accountant Sniper mode.',
    icon: FileCodeIcon,
  },
  {
    id: 'token-vault',
    name: 'Asset Vault',
    description: 'Secure tokenization of deeds, warranties, and construction liens on Google Blockchain.',
    icon: CubeIcon,
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Sentinel',
    description: 'Forensic scan of carrier denial tactics. Identifying missing revenue and narrative gaps.',
    icon: ShieldIcon,
  },
  {
    id: 'security-ops',
    name: 'SOC Security',
    description: 'Google Cloud Security Foundations and SOC2 operational compliance cockpit.',
    icon: ShieldIcon,
  },
  {
    id: 'company-profile',
    name: 'Research Lab',
    description: 'The Accountant Sniper thesis and Dustin Moore\'s sovereign roadmap.',
    icon: InfoIcon,
  },
];

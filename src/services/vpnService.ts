
// VPN service for CyberGuard AI
import { toast } from "sonner";
import { isPremiumUser } from "./authService";

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  ping: string;
  premium: boolean;
}

export interface VpnStatus {
  connected: boolean;
  connecting: boolean;
  server: VpnServer | null;
  ipAddress: string | null;
  startTime: Date | null;
  dataUsage: {
    sent: number;
    received: number;
  };
}

// Available VPN servers
export const vpnServers: VpnServer[] = [
  { id: 'auto', name: 'Auto (AI Optimized)', country: 'Nearest', ping: '45ms', premium: false },
  { id: 'us', name: 'United States', country: 'US', ping: '120ms', premium: false },
  { id: 'uk', name: 'United Kingdom', country: 'UK', ping: '150ms', premium: false },
  { id: 'de', name: 'Germany', country: 'DE', ping: '90ms', premium: false },
  { id: 'jp', name: 'Japan', country: 'JP', ping: '200ms', premium: true },
  { id: 'au', name: 'Australia', country: 'AU', ping: '250ms', premium: true },
  { id: 'sg', name: 'Singapore', country: 'SG', ping: '180ms', premium: true },
  { id: 'ca', name: 'Canada', country: 'CA', ping: '100ms', premium: true },
  { id: 'fr', name: 'France', country: 'FR', ping: '80ms', premium: true },
];

// Initial VPN status
const initialStatus: VpnStatus = {
  connected: false,
  connecting: false,
  server: null,
  ipAddress: null,
  startTime: null,
  dataUsage: {
    sent: 0,
    received: 0
  }
};

let vpnStatus = { ...initialStatus };

// Simulate a VPN connection
export const connectVpn = async (serverId: string): Promise<VpnStatus> => {
  const server = vpnServers.find(s => s.id === serverId);
  
  if (!server) {
    throw new Error('Server not found');
  }
  
  // Check if server is premium and user doesn't have premium
  if (server.premium && !isPremiumUser()) {
    throw new Error('Premium server requires a premium subscription');
  }
  
  vpnStatus.connecting = true;
  vpnStatus.server = server;
  
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate connection success
  vpnStatus = {
    connected: true,
    connecting: false,
    server: server,
    ipAddress: generateRandomIp(),
    startTime: new Date(),
    dataUsage: {
      sent: 0,
      received: 0
    }
  };
  
  // Start simulating data usage
  startDataUsageSimulation();
  
  return { ...vpnStatus };
};

// Disconnect from VPN
export const disconnectVpn = async (): Promise<VpnStatus> => {
  if (!vpnStatus.connected) {
    return { ...vpnStatus };
  }
  
  // Stop data usage simulation
  stopDataUsageSimulation();
  
  vpnStatus = { ...initialStatus };
  
  return { ...vpnStatus };
};

// Get current VPN status
export const getVpnStatus = (): VpnStatus => {
  return { ...vpnStatus };
};

// Check if a server is available based on user subscription
export const isServerAvailable = (server: VpnServer): boolean => {
  if (!server.premium) {
    return true;
  }
  
  return isPremiumUser();
};

// Get list of available servers based on user subscription
export const getAvailableServers = (): VpnServer[] => {
  const isPremium = isPremiumUser();
  
  if (isPremium) {
    return vpnServers;
  }
  
  return vpnServers.filter(server => !server.premium);
};

// Helper functions
let dataUsageInterval: number | null = null;

const startDataUsageSimulation = () => {
  if (dataUsageInterval) {
    window.clearInterval(dataUsageInterval);
  }
  
  dataUsageInterval = window.setInterval(() => {
    vpnStatus.dataUsage.sent += Math.floor(Math.random() * 50) + 10;
    vpnStatus.dataUsage.received += Math.floor(Math.random() * 100) + 20;
  }, 1000);
};

const stopDataUsageSimulation = () => {
  if (dataUsageInterval) {
    window.clearInterval(dataUsageInterval);
    dataUsageInterval = null;
  }
};

const generateRandomIp = (): string => {
  if (!vpnStatus.server) return '0.0.0.0';
  
  // Generate different IPs based on country
  switch (vpnStatus.server.country) {
    case 'US':
      return `104.${randInt(16, 31)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    case 'UK':
      return `81.${randInt(128, 191)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    case 'DE':
      return `85.${randInt(0, 127)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    case 'JP':
      return `103.${randInt(0, 127)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    case 'AU':
      return `45.${randInt(112, 127)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    default:
      return `192.168.${randInt(0, 255)}.${randInt(1, 254)}`;
  }
};

const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

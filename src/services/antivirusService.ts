
// Antivirus service for CyberGuard AI
import { isPremiumUser } from "./authService";

export type ScanType = 'quick' | 'deep' | 'custom';
export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Threat {
  id: string;
  name: string;
  type: string;
  path: string;
  severity: ThreatSeverity;
  dateDetected: Date;
  status: 'detected' | 'quarantined' | 'removed' | 'allowed';
}

export interface ScanResult {
  id: string;
  type: ScanType;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  status: 'in-progress' | 'completed' | 'cancelled';
  itemsScanned: number;
  threats: Threat[];
}

export interface AntivirusStatus {
  enabled: boolean;
  lastScan: ScanResult | null;
  realTimeProtection: boolean;
  definitions: {
    version: string;
    lastUpdated: Date;
  };
}

// Initialize status
let antivirusStatus: AntivirusStatus = {
  enabled: true,
  lastScan: null,
  realTimeProtection: false,
  definitions: {
    version: '2025.05.21.001',
    lastUpdated: new Date()
  }
};

// Mock threat database for random selection during scans
const potentialThreats: Omit<Threat, 'id' | 'dateDetected' | 'status'>[] = [
  {
    name: 'Trojan.GenericKD.44758923',
    type: 'Trojan',
    path: 'C:\\Windows\\Temp\\launcher.exe',
    severity: 'high',
  },
  {
    name: 'Adware.BrowserModifier.Cookie',
    type: 'Adware',
    path: 'C:\\Users\\User\\AppData\\Local\\Temp\\cookies.dat',
    severity: 'low',
  },
  {
    name: 'Spyware.Keylogger.ZXY',
    type: 'Spyware',
    path: 'C:\\Program Files\\FreeGames\\helper.dll',
    severity: 'critical',
  },
  {
    name: 'PUP.Downloader.Generic',
    type: 'PUP',
    path: 'C:\\Users\\User\\Downloads\\installer.exe',
    severity: 'medium',
  },
  {
    name: 'Ransomware.Cryptolocker.Variant',
    type: 'Ransomware',
    path: 'C:\\Windows\\System32\\drivers\\etc\\suspicious.sys',
    severity: 'critical',
  },
];

// Current scan in progress
let currentScan: ScanResult | null = null;
let scanInterval: number | null = null;

// Start a new antivirus scan
export const startScan = (type: ScanType): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (currentScan && currentScan.status === 'in-progress') {
      reject(new Error('A scan is already in progress'));
      return;
    }
    
    // Create new scan
    const scanId = generateUuid();
    currentScan = {
      id: scanId,
      type,
      startTime: new Date(),
      endTime: null,
      duration: null,
      status: 'in-progress',
      itemsScanned: 0,
      threats: [],
    };
    
    // Maximum items to scan based on type
    const maxItems = type === 'quick' ? 2000 : type === 'deep' ? 10000 : 5000;
    
    // Scan speed (items per interval)
    const scanSpeed = type === 'quick' ? 200 : type === 'deep' ? 100 : 150;
    
    // Update scan progress
    scanInterval = window.setInterval(() => {
      if (!currentScan) return;
      
      currentScan.itemsScanned += scanSpeed;
      
      // Random chance to find threats based on scan type and premium status
      const threatChance = type === 'deep' ? 0.03 : 0.01;
      const findThreat = Math.random() < threatChance;
      
      if (findThreat) {
        // Generate a random threat
        const randomThreat = potentialThreats[Math.floor(Math.random() * potentialThreats.length)];
        currentScan.threats.push({
          ...randomThreat,
          id: generateUuid(),
          dateDetected: new Date(),
          status: 'detected',
        });
      }
      
      // Check if scan is complete
      if (currentScan.itemsScanned >= maxItems) {
        finishScan();
      }
    }, 200);
    
    resolve(scanId);
  });
};

// Cancel ongoing scan
export const cancelScan = (): void => {
  if (currentScan && currentScan.status === 'in-progress') {
    finishScan('cancelled');
  }
};

// Get current scan progress
export const getCurrentScan = (): ScanResult | null => {
  return currentScan ? { ...currentScan } : null;
};

// Get antivirus status
export const getAntivirusStatus = (): AntivirusStatus => {
  return { ...antivirusStatus };
};

// Toggle real-time protection (premium only)
export const toggleRealTimeProtection = (): boolean => {
  if (!isPremiumUser()) {
    throw new Error('Real-time protection is a premium feature');
  }
  
  antivirusStatus.realTimeProtection = !antivirusStatus.realTimeProtection;
  return antivirusStatus.realTimeProtection;
};

// Update virus definitions
export const updateDefinitions = async (): Promise<AntivirusStatus['definitions']> => {
  // Simulate update delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const newVersion = `2025.${String(new Date().getMonth() + 1).padStart(2, '0')}.${
    String(new Date().getDate()).padStart(2, '0')
  }.${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
  
  antivirusStatus.definitions = {
    version: newVersion,
    lastUpdated: new Date()
  };
  
  return { ...antivirusStatus.definitions };
};

// Quarantine or remove a threat
export const handleThreat = (threatId: string, action: 'quarantine' | 'remove' | 'allow'): Threat | null => {
  // Find the threat in the last scan
  if (!antivirusStatus.lastScan) return null;
  
  const threatIndex = antivirusStatus.lastScan.threats.findIndex(t => t.id === threatId);
  if (threatIndex === -1) return null;
  
  // Update threat status
  antivirusStatus.lastScan.threats[threatIndex].status = action === 'allow' ? 'allowed' : 
                                                      action === 'quarantine' ? 'quarantined' : 'removed';
  
  return { ...antivirusStatus.lastScan.threats[threatIndex] };
};

// Private helper functions
const finishScan = (status: 'completed' | 'cancelled' = 'completed'): void => {
  if (!currentScan) return;
  
  // Clear interval
  if (scanInterval !== null) {
    window.clearInterval(scanInterval);
    scanInterval = null;
  }
  
  // Update scan info
  currentScan.endTime = new Date();
  currentScan.duration = (currentScan.endTime.getTime() - currentScan.startTime.getTime()) / 1000;
  currentScan.status = status;
  
  // Update last scan in status
  antivirusStatus.lastScan = { ...currentScan };
  
  // Reset current scan
  currentScan = null;
};

const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

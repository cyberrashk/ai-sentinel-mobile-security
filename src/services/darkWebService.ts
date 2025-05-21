
// Dark web scanning service for CyberGuard AI
import { isPremiumUser } from "./authService";

export interface LeakedCredential {
  id: string;
  email: string;
  source: string;
  dateLeaked: Date;
  dataExposed: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Mock database of known breaches (in a real app, this would connect to HIBP or similar)
const knownBreaches: Record<string, Omit<LeakedCredential, 'id' | 'email'>[]> = {
  'demo@cyberguard.ai': [
    {
      source: 'LinkedIn',
      dateLeaked: new Date('2021-06-22'),
      dataExposed: ['email', 'password', 'name'],
      severity: 'high'
    }
  ],
  'premium@cyberguard.ai': [
    {
      source: 'Adobe',
      dateLeaked: new Date('2020-03-15'),
      dataExposed: ['email', 'password'],
      severity: 'medium'
    },
    {
      source: 'Dropbox',
      dateLeaked: new Date('2022-11-04'),
      dataExposed: ['email', 'password', 'phone'],
      severity: 'high'
    }
  ]
};

// Generic breach patterns for realistic results
const genericBreaches = [
  {
    source: 'Data Aggregator Breach',
    dateLeaked: new Date('2023-09-10'),
    dataExposed: ['email', 'name'],
    severity: 'low' as const
  },
  {
    source: 'E-commerce Platform',
    dateLeaked: new Date('2022-12-01'),
    dataExposed: ['email', 'password', 'address'],
    severity: 'high' as const
  },
  {
    source: 'Social Media Platform',
    dateLeaked: new Date('2023-03-18'),
    dataExposed: ['email', 'password', 'personal info'],
    severity: 'critical' as const
  }
];

/**
 * Scans the dark web for leaked credentials
 */
export const scanDarkWeb = async (email: string): Promise<LeakedCredential[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const results: LeakedCredential[] = [];
  
  // Check if we have known breaches for this email
  if (email in knownBreaches) {
    results.push(...knownBreaches[email].map(breach => ({
      id: generateUuid(),
      email,
      ...breach
    })));
  }
  
  // For premium users, perform a "deeper" scan
  if (isPremiumUser()) {
    // Simulate finding additional breaches for premium users (50% chance)
    if (results.length === 0 || Math.random() > 0.5) {
      // Select a random breach from generic breaches
      const randomBreach = genericBreaches[Math.floor(Math.random() * genericBreaches.length)];
      results.push({
        id: generateUuid(),
        email,
        ...randomBreach
      });
    }
  }
  
  return results;
};

/**
 * Checks if an email is at risk based on common patterns
 */
export const analyzeEmailRisk = (email: string): {
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
} => {
  const reasons: string[] = [];
  let riskPoints = 0;
  
  // Check for common email providers (less secure)
  if (email.endsWith('@gmail.com') || 
      email.endsWith('@yahoo.com') || 
      email.endsWith('@hotmail.com')) {
    reasons.push('Using common email provider');
    riskPoints += 1;
  }
  
  // Check for common/simple username patterns
  const username = email.split('@')[0];
  
  if (username.length < 6) {
    reasons.push('Short username (easier to guess)');
    riskPoints += 2;
  }
  
  if (/\d{4}$/.test(username)) {
    reasons.push('Username ends with 4 digits (likely birth year)');
    riskPoints += 2;
  }
  
  if (/^[a-z]+\d*$/.test(username)) {
    reasons.push('Simple username pattern');
    riskPoints += 1;
  }
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskPoints >= 4) {
    riskLevel = 'high';
  } else if (riskPoints >= 2) {
    riskLevel = 'medium';
  }
  
  // If no reasons found, add a default one
  if (reasons.length === 0) {
    reasons.push('Email follows security best practices');
  }
  
  return { riskLevel, reasons };
};

// Helper function to generate UUID
const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


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

// Mock database of known breaches
const knownBreaches: Record<string, Omit<LeakedCredential, 'id' | 'email'>[]> = {
  'demo@cyberguard.ai': [
    {
      source: 'LinkedIn Data Breach',
      dateLeaked: new Date('2021-06-22'),
      dataExposed: ['email', 'password', 'name', 'professional info'],
      severity: 'high'
    },
    {
      source: 'Facebook Data Leak',
      dateLeaked: new Date('2019-04-03'),
      dataExposed: ['email', 'phone', 'personal info'],
      severity: 'medium'
    }
  ],
  'premium@cyberguard.ai': [
    {
      source: 'Adobe Customer Database',
      dateLeaked: new Date('2020-03-15'),
      dataExposed: ['email', 'password', 'payment info'],
      severity: 'critical'
    },
    {
      source: 'Dropbox Security Incident',
      dateLeaked: new Date('2022-11-04'),
      dataExposed: ['email', 'password', 'file access'],
      severity: 'high'
    },
    {
      source: 'Yahoo Mail Breach',
      dateLeaked: new Date('2016-12-14'),
      dataExposed: ['email', 'password', 'security questions'],
      severity: 'high'
    }
  ]
};

// Enhanced breach database for realistic scanning
const commonBreaches = [
  {
    source: 'Social Media Platform Breach',
    dateLeaked: new Date('2023-09-10'),
    dataExposed: ['email', 'username', 'profile data'],
    severity: 'medium' as const
  },
  {
    source: 'E-commerce Data Leak',
    dateLeaked: new Date('2022-12-01'),
    dataExposed: ['email', 'password', 'purchase history'],
    severity: 'high' as const
  },
  {
    source: 'Healthcare Database Breach',
    dateLeaked: new Date('2023-06-05'),
    dataExposed: ['email', 'name', 'medical records', 'SSN'],
    severity: 'critical' as const
  },
  {
    source: 'Financial Services Leak',
    dateLeaked: new Date('2022-04-22'),
    dataExposed: ['email', 'account numbers', 'transaction data'],
    severity: 'critical' as const
  }
];

/**
 * Scan the dark web for leaked credentials
 */
export const scanDarkWeb = async (email: string): Promise<LeakedCredential[]> => {
  console.log(`Starting dark web scan for ${email}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  const results: LeakedCredential[] = [];
  
  // Check known breaches first
  if (email in knownBreaches) {
    console.log(`Found known breaches for ${email}`);
    results.push(...knownBreaches[email].map(breach => ({
      id: generateUuid(),
      email,
      ...breach
    })));
  }
  
  // For premium users, perform enhanced scanning
  if (isPremiumUser()) {
    console.log('Premium user detected, performing enhanced scan');
    
    // Simulate finding additional breaches based on email patterns
    const emailHash = simpleHash(email);
    const shouldFindBreach = emailHash % 10 > 4; // 50% chance
    
    if (shouldFindBreach && results.length === 0) {
      const breachIndex = emailHash % commonBreaches.length;
      const selectedBreach = commonBreaches[breachIndex];
      
      results.push({
        id: generateUuid(),
        email,
        ...selectedBreach
      });
    }
  }
  
  console.log(`Scan complete. Found ${results.length} breaches.`);
  return results;
};

/**
 * Analyze email risk based on patterns
 */
export const analyzeEmailRisk = (email: string): {
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
} => {
  const reasons: string[] = [];
  let riskPoints = 0;
  
  const username = email.split('@')[0];
  const domain = email.split('@')[1] || '';
  
  // Check for common email providers
  if (['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain)) {
    reasons.push('Using popular email provider (higher breach probability)');
    riskPoints += 1;
  }
  
  // Username pattern analysis
  if (username.length < 6) {
    reasons.push('Short username increases vulnerability');
    riskPoints += 2;
  }
  
  if (/\d{4}$/.test(username)) {
    reasons.push('Username contains year pattern (predictable)');
    riskPoints += 2;
  }
  
  if (/^[a-z]+\d*$/.test(username)) {
    reasons.push('Simple username pattern detected');
    riskPoints += 1;
  }
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskPoints >= 4) {
    riskLevel = 'high';
  } else if (riskPoints >= 2) {
    riskLevel = 'medium';
  }
  
  if (reasons.length === 0) {
    reasons.push('Email follows security best practices');
  }
  
  console.log(`Risk analysis complete for ${email}: ${riskLevel} risk`);
  return { riskLevel, reasons };
};

// Helper functions
const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

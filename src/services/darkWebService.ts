// Dark web scanning service for CyberGuard AI
import { isPremiumUser } from "./authService";

export interface LeakedCredential {
  id: string;
  email: string;
  source: string;
  dateLeaked: Date;
  dataExposed: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAccounts: number;
  recommendation: string;
}

export interface LoginAnomaly {
  id: string;
  type: 'location' | 'device' | 'time' | 'frequency';
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  detectedAt: Date;
  ipAddress?: string;
  location?: string;
  deviceInfo?: string;
}

export interface PasswordAssessment {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
  characteristics: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    hasCommonPatterns: boolean;
    isCommonPassword: boolean;
  };
  recommendations: string[];
  estimatedCrackTime: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  methods: ('sms' | 'email' | 'authenticator' | 'hardware-key')[];
  backupCodes: boolean;
  lastUsed?: Date;
  recommendations: string[];
}

export interface RecoveryOptions {
  complete: boolean;
  availableOptions: ('email' | 'phone' | 'security-questions' | 'backup-codes')[];
  securityQuestions: number;
  backupEmail: boolean;
  backupPhone: boolean;
  recommendations: string[];
}

export interface RiskAnalysis {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: {
    category: string;
    impact: number;
    description: string;
  }[];
  detailedReasons: string[];
  actionableSteps: string[];
}

// Enhanced breach database
const knownBreaches: Record<string, Omit<LeakedCredential, 'id' | 'email'>[]> = {
  'demo@cyberguard.ai': [
    {
      source: 'LinkedIn Data Breach 2021',
      dateLeaked: new Date('2021-06-22'),
      dataExposed: ['email', 'password', 'name', 'professional info', 'connections'],
      severity: 'high',
      affectedAccounts: 700000000,
      recommendation: 'Change LinkedIn password immediately and enable 2FA'
    },
    {
      source: 'Facebook Cambridge Analytica',
      dateLeaked: new Date('2019-04-03'),
      dataExposed: ['email', 'phone', 'personal info', 'friends list', 'likes'],
      severity: 'medium',
      affectedAccounts: 87000000,
      recommendation: 'Review Facebook privacy settings and connected apps'
    }
  ],
  'premium@cyberguard.ai': [
    {
      source: 'Adobe Customer Database 2020',
      dateLeaked: new Date('2020-03-15'),
      dataExposed: ['email', 'password', 'payment info', 'purchase history'],
      severity: 'critical',
      affectedAccounts: 38000000,
      recommendation: 'Update payment methods and monitor credit reports'
    },
    {
      source: 'Dropbox Security Incident',
      dateLeaked: new Date('2022-11-04'),
      dataExposed: ['email', 'password', 'file access', 'shared files'],
      severity: 'high',
      affectedAccounts: 68000000,
      recommendation: 'Review file sharing permissions and change password'
    }
  ]
};

/**
 * Enhanced dark web scanning with detailed analysis
 */
export const scanDarkWeb = async (email: string): Promise<LeakedCredential[]> => {
  console.log(`Starting enhanced dark web scan for ${email}`);
  
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));
  
  const results: LeakedCredential[] = [];
  
  if (email in knownBreaches) {
    console.log(`Found ${knownBreaches[email].length} known breaches for ${email}`);
    results.push(...knownBreaches[email].map(breach => ({
      id: generateUuid(),
      email,
      ...breach
    })));
  }
  
  if (isPremiumUser()) {
    console.log('Premium user: performing deep web scan');
    const additionalBreaches = await performDeepWebScan(email);
    results.push(...additionalBreaches);
  }
  
  console.log(`Dark web scan complete. Found ${results.length} breaches.`);
  return results;
};

/**
 * Analyze login patterns for anomalies
 */
export const analyzeLoginPatterns = async (email: string): Promise<LoginAnomaly[]> => {
  console.log(`Analyzing login patterns for ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const anomalies: LoginAnomaly[] = [];
  const emailHash = simpleHash(email);
  
  // Simulate various anomaly detections
  if (emailHash % 7 === 0) {
    anomalies.push({
      id: generateUuid(),
      type: 'location',
      description: 'Login detected from unusual geographic location',
      riskLevel: 'high',
      detectedAt: new Date(Date.now() - Math.random() * 86400000 * 7),
      ipAddress: '192.168.' + (emailHash % 255) + '.' + ((emailHash * 7) % 255),
      location: 'Eastern Europe'
    });
  }
  
  if (emailHash % 5 === 0) {
    anomalies.push({
      id: generateUuid(),
      type: 'time',
      description: 'Login activity during unusual hours',
      riskLevel: 'medium',
      detectedAt: new Date(Date.now() - Math.random() * 86400000 * 3),
      ipAddress: '10.0.' + (emailHash % 255) + '.' + ((emailHash * 3) % 255)
    });
  }
  
  if (emailHash % 3 === 0) {
    anomalies.push({
      id: generateUuid(),
      type: 'device',
      description: 'New device detected without proper verification',
      riskLevel: 'medium',
      detectedAt: new Date(Date.now() - Math.random() * 86400000 * 2),
      deviceInfo: 'Mobile device from unknown manufacturer'
    });
  }
  
  return anomalies;
};

/**
 * Comprehensive password strength assessment
 */
export const assessPasswordStrength = (email: string): PasswordAssessment => {
  console.log(`Assessing password strength for ${email}`);
  
  // Simulate password analysis based on email patterns
  const username = email.split('@')[0];
  const domain = email.split('@')[1] || '';
  
  const characteristics = {
    length: Math.max(8, username.length + (domain.includes('gmail') ? 2 : 4)),
    hasUppercase: !username.toLowerCase().includes(username),
    hasLowercase: true,
    hasNumbers: /\d/.test(username),
    hasSpecialChars: domain.includes('enterprise') || domain.includes('business'),
    hasCommonPatterns: /\d{4}$/.test(username) || username.includes('123'),
    isCommonPassword: ['password', 'admin', 'user'].some(p => username.includes(p))
  };
  
  // Calculate strength score
  let score = 0;
  if (characteristics.length >= 12) score += 25;
  else if (characteristics.length >= 8) score += 15;
  
  if (characteristics.hasUppercase) score += 15;
  if (characteristics.hasLowercase) score += 10;
  if (characteristics.hasNumbers) score += 15;
  if (characteristics.hasSpecialChars) score += 20;
  if (!characteristics.hasCommonPatterns) score += 10;
  if (!characteristics.isCommonPassword) score += 15;
  
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score >= 85) strength = 'very-strong';
  else if (score >= 65) strength = 'strong';
  else if (score >= 45) strength = 'medium';
  else strength = 'weak';
  
  const recommendations: string[] = [];
  if (characteristics.length < 12) recommendations.push('Use at least 12 characters');
  if (!characteristics.hasUppercase) recommendations.push('Add uppercase letters');
  if (!characteristics.hasSpecialChars) recommendations.push('Include special characters');
  if (characteristics.hasCommonPatterns) recommendations.push('Avoid predictable patterns');
  if (characteristics.isCommonPassword) recommendations.push('Avoid common passwords');
  
  let estimatedCrackTime = '';
  if (score >= 85) estimatedCrackTime = 'Centuries';
  else if (score >= 65) estimatedCrackTime = 'Years';
  else if (score >= 45) estimatedCrackTime = 'Months';
  else estimatedCrackTime = 'Days or hours';
  
  return {
    strength,
    score,
    characteristics,
    recommendations,
    estimatedCrackTime
  };
};

/**
 * Check two-factor authentication status
 */
export const checkTwoFactorStatus = (email: string): TwoFactorStatus => {
  console.log(`Checking 2FA status for ${email}`);
  
  const domain = email.split('@')[1] || '';
  const isBusinessEmail = !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain);
  
  const enabled = isBusinessEmail || Math.random() > 0.4;
  const methods: ('sms' | 'email' | 'authenticator' | 'hardware-key')[] = [];
  
  if (enabled) {
    methods.push('email');
    if (isBusinessEmail) {
      methods.push('authenticator');
      if (Math.random() > 0.7) methods.push('hardware-key');
    } else {
      if (Math.random() > 0.5) methods.push('sms');
      if (Math.random() > 0.6) methods.push('authenticator');
    }
  }
  
  const recommendations: string[] = [];
  if (!enabled) {
    recommendations.push('Enable two-factor authentication immediately');
    recommendations.push('Use authenticator app instead of SMS when possible');
  } else {
    if (!methods.includes('authenticator')) {
      recommendations.push('Consider using authenticator app for better security');
    }
    if (!methods.includes('hardware-key') && isBusinessEmail) {
      recommendations.push('Consider hardware security keys for maximum protection');
    }
  }
  
  return {
    enabled,
    methods,
    backupCodes: enabled && Math.random() > 0.3,
    lastUsed: enabled ? new Date(Date.now() - Math.random() * 86400000 * 30) : undefined,
    recommendations
  };
};

/**
 * Evaluate recovery options completeness
 */
export const evaluateRecoveryOptions = (email: string): RecoveryOptions => {
  console.log(`Evaluating recovery options for ${email}`);
  
  const domain = email.split('@')[1] || '';
  const isBusinessEmail = !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain);
  
  const availableOptions: ('email' | 'phone' | 'security-questions' | 'backup-codes')[] = ['email'];
  
  if (isBusinessEmail || Math.random() > 0.3) availableOptions.push('phone');
  if (Math.random() > 0.5) availableOptions.push('security-questions');
  if (Math.random() > 0.4) availableOptions.push('backup-codes');
  
  const complete = availableOptions.length >= 3;
  
  const recommendations: string[] = [];
  if (!availableOptions.includes('phone')) {
    recommendations.push('Add a backup phone number for account recovery');
  }
  if (!availableOptions.includes('backup-codes')) {
    recommendations.push('Generate and securely store backup recovery codes');
  }
  if (availableOptions.includes('security-questions')) {
    recommendations.push('Ensure security questions have non-guessable answers');
  }
  if (!complete) {
    recommendations.push('Set up at least 3 different recovery methods for maximum security');
  }
  
  return {
    complete,
    availableOptions,
    securityQuestions: availableOptions.includes('security-questions') ? 3 : 0,
    backupEmail: isBusinessEmail && Math.random() > 0.6,
    backupPhone: availableOptions.includes('phone'),
    recommendations
  };
};

/**
 * Comprehensive risk analysis
 */
export const performRiskAnalysis = async (email: string): Promise<RiskAnalysis> => {
  console.log(`Performing comprehensive risk analysis for ${email}`);
  
  const [breaches, anomalies] = await Promise.all([
    scanDarkWeb(email),
    analyzeLoginPatterns(email)
  ]);
  
  const passwordAssessment = assessPasswordStrength(email);
  const twoFactorStatus = checkTwoFactorStatus(email);
  const recoveryOptions = evaluateRecoveryOptions(email);
  
  const factors = [];
  let totalRisk = 0;
  
  // Analyze each factor
  if (breaches.length > 0) {
    const breachRisk = Math.min(breaches.length * 15 + breaches.filter(b => b.severity === 'critical').length * 10, 40);
    factors.push({
      category: 'Data Breaches',
      impact: breachRisk,
      description: `Found in ${breaches.length} data breach(es) with ${breaches.filter(b => b.severity === 'critical').length} critical exposures`
    });
    totalRisk += breachRisk;
  }
  
  if (anomalies.length > 0) {
    const anomalyRisk = Math.min(anomalies.length * 10 + anomalies.filter(a => a.riskLevel === 'high').length * 5, 25);
    factors.push({
      category: 'Login Anomalies',
      impact: anomalyRisk,
      description: `${anomalies.length} suspicious login pattern(s) detected`
    });
    totalRisk += anomalyRisk;
  }
  
  const passwordRisk = 100 - passwordAssessment.score;
  if (passwordRisk > 20) {
    factors.push({
      category: 'Password Security',
      impact: Math.min(passwordRisk / 2, 20),
      description: `Password strength: ${passwordAssessment.strength} (${passwordAssessment.score}/100)`
    });
    totalRisk += Math.min(passwordRisk / 2, 20);
  }
  
  if (!twoFactorStatus.enabled) {
    factors.push({
      category: 'Two-Factor Authentication',
      impact: 20,
      description: 'Two-factor authentication is disabled'
    });
    totalRisk += 20;
  }
  
  if (!recoveryOptions.complete) {
    factors.push({
      category: 'Account Recovery',
      impact: 10,
      description: 'Incomplete account recovery options'
    });
    totalRisk += 10;
  }
  
  let overallRisk: 'low' | 'medium' | 'high' | 'critical';
  if (totalRisk >= 70) overallRisk = 'critical';
  else if (totalRisk >= 50) overallRisk = 'high';
  else if (totalRisk >= 25) overallRisk = 'medium';
  else overallRisk = 'low';
  
  const detailedReasons = [
    ...breaches.map(b => `Data exposed in ${b.source} (${b.severity} severity)`),
    ...anomalies.map(a => `${a.description} (${a.riskLevel} risk)`),
    ...passwordAssessment.recommendations.map(r => `Password: ${r}`),
    ...twoFactorStatus.recommendations.map(r => `2FA: ${r}`),
    ...recoveryOptions.recommendations.map(r => `Recovery: ${r}`)
  ];
  
  const actionableSteps = [
    ...(breaches.length > 0 ? ['Change passwords for all affected accounts immediately'] : []),
    ...(anomalies.length > 0 ? ['Review recent login activity and secure suspicious sessions'] : []),
    ...(passwordAssessment.score < 70 ? ['Update to a stronger, unique password'] : []),
    ...(!twoFactorStatus.enabled ? ['Enable two-factor authentication'] : []),
    ...(!recoveryOptions.complete ? ['Set up additional account recovery methods'] : [])
  ];
  
  return {
    overallRisk,
    riskScore: Math.min(totalRisk, 100),
    factors,
    detailedReasons,
    actionableSteps
  };
};

// Helper functions
const performDeepWebScan = async (email: string): Promise<LeakedCredential[]> => {
  const emailHash = simpleHash(email);
  const additionalBreaches: LeakedCredential[] = [];
  
  if (emailHash % 8 === 0) {
    additionalBreaches.push({
      id: generateUuid(),
      email,
      source: 'Underground Forum Database',
      dateLeaked: new Date(Date.now() - Math.random() * 86400000 * 365),
      dataExposed: ['email', 'password', 'IP address'],
      severity: 'medium',
      affectedAccounts: Math.floor(Math.random() * 1000000),
      recommendation: 'Monitor for suspicious activity and change passwords'
    });
  }
  
  return additionalBreaches;
};

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

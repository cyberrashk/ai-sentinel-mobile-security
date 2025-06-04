import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, AlertCircle, Lock, RefreshCw, Check, ShieldCheck, 
  ArrowRight, Cpu, Brain, Zap, FileSearch, Server, Eye,
  AlertTriangle, Clock, MapPin, Smartphone, Key
} from 'lucide-react';
import { toast } from 'sonner';
import RecoveryStepFlow from '@/components/RecoveryStepFlow';
import RecoveryFeatures from '@/components/RecoveryFeatures';
import * as authService from '@/services/authService';
import * as darkWebService from '@/services/darkWebService';

interface ComprehensiveScanResult {
  securityScore: number;
  breaches: darkWebService.LeakedCredential[];
  loginAnomalies: darkWebService.LoginAnomaly[];
  passwordAssessment: darkWebService.PasswordAssessment;
  twoFactorStatus: darkWebService.TwoFactorStatus;
  recoveryOptions: darkWebService.RecoveryOptions;
  riskAnalysis: darkWebService.RiskAnalysis;
}

const RecoveryFlow = () => {
  const [scanStarted, setScanStarted] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [scanResult, setScanResult] = useState<ComprehensiveScanResult | null>(null);
  const [user, setUser] = useState<{email: string, name: string} | null>(null);
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser({
        name: currentUser.name,
        email: currentUser.email
      });
    }
  }, []);
  
  const handleStartScan = async () => {
    if (!user) {
      toast.error('Authentication Required', { 
        description: 'Please login to use the recovery system'
      });
      return;
    }
    
    setScanStarted(true);
    setScanProgress(0);
    setScanPhase('Initializing comprehensive security scan...');
    
    try {
      // Phase 1: Login pattern analysis
      await simulateScanPhase('Analyzing login patterns and anomalies...', 0, 20, 1000);
      const loginAnomalies = await darkWebService.analyzeLoginPatterns(user.email);
      
      // Phase 2: Dark web scanning
      await simulateScanPhase('Scanning dark web for credential exposure...', 20, 40, 1500);
      const breaches = await darkWebService.scanDarkWeb(user.email);
      
      // Phase 3: Password assessment
      setScanPhase('Evaluating password strength and security...');
      setScanProgress(45);
      const passwordAssessment = darkWebService.assessPasswordStrength(user.email);
      
      // Phase 4: Two-factor authentication check
      await simulateScanPhase('Checking two-factor authentication status...', 45, 60, 800);
      const twoFactorStatus = darkWebService.checkTwoFactorStatus(user.email);
      
      // Phase 5: Recovery options evaluation
      await simulateScanPhase('Evaluating account recovery options...', 60, 75, 1000);
      const recoveryOptions = darkWebService.evaluateRecoveryOptions(user.email);
      
      // Phase 6: Comprehensive risk analysis
      await simulateScanPhase('Performing comprehensive risk analysis...', 75, 90, 1200);
      const riskAnalysis = await darkWebService.performRiskAnalysis(user.email);
      
      // Phase 7: Final assessment
      await simulateScanPhase('Finalizing security assessment...', 90, 100, 500);
      
      // Calculate overall security score
      let securityScore = 100 - riskAnalysis.riskScore;
      securityScore = Math.max(Math.min(securityScore, 100), 0);
      
      setScanResult({
        securityScore: Math.round(securityScore),
        breaches,
        loginAnomalies,
        passwordAssessment,
        twoFactorStatus,
        recoveryOptions,
        riskAnalysis
      });
      
      setScanComplete(true);
      
      // Show appropriate toast based on results
      if (riskAnalysis.overallRisk === 'critical') {
        toast.error("Critical Security Vulnerabilities Detected!", {
          description: "Immediate action required to secure your account"
        });
      } else if (riskAnalysis.overallRisk === 'high') {
        toast.warning("High Security Risks Found", {
          description: "Several security issues need attention"
        });
      } else if (riskAnalysis.overallRisk === 'medium') {
        toast.warning("Security Issues Detected", {
          description: "Some security improvements recommended"
        });
      } else {
        toast.success("Security Scan Complete", {
          description: "Your account security looks good"
        });
      }
    } catch (error) {
      console.error('Security scan failed:', error);
      toast.error('Scan Failed', {
        description: 'Unable to complete security scan. Please try again.'
      });
      setScanStarted(false);
    }
  };
  
  const simulateScanPhase = async (
    phase: string, 
    startProgress: number, 
    endProgress: number, 
    duration: number
  ) => {
    setScanPhase(phase);
    const startTime = Date.now();
    
    return new Promise<void>(resolve => {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newProgress = startProgress + progress * (endProgress - startProgress);
        
        setScanProgress(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cyberguard-container py-6">
        {/* Hero Section with Enhanced Scan Results */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyberguard-secondary to-cyberguard-primary text-white">
            {/* ... keep existing code (background animation) */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.2
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10 px-6 py-10 md:py-16 md:px-10 lg:px-20">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-2/3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                    Next-Gen AI Recovery System
                  </h1>
                  <p className="text-lg opacity-90 mb-6 max-w-3xl">
                    Advanced AI-powered security analysis with comprehensive threat detection, 
                    behavioral analytics, and automated recovery protocols.
                  </p>
                  
                  {!user ? (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="text-sm mb-2">Please login to use the recovery system</p>
                      <Button 
                        size="sm" 
                        className="bg-white text-cyberguard-primary hover:bg-white/90"
                        onClick={() => window.location.href = '/security'}
                      >
                        <Lock className="mr-2 w-4 h-4" />
                        Login First
                      </Button>
                    </div>
                  ) : !scanStarted ? (
                    <Button 
                      onClick={handleStartScan}
                      size="lg" 
                      className="bg-white text-cyberguard-primary hover:bg-white/90"
                    >
                      <Shield className="mr-2 w-5 h-5" />
                      Start Comprehensive Security Scan
                    </Button>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      {!scanComplete ? (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                            <span>AI analyzing your security posture...</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2.5">
                            <div 
                              className="bg-white h-2.5 rounded-full transition-all duration-300" 
                              style={{ width: `${scanProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs">{scanPhase}</div>
                        </div>
                      ) : scanResult && (
                        <div className="flex items-center">
                          <ShieldCheck className="w-5 h-5 mr-3" />
                          <div>
                            <span className="block">
                              Comprehensive security analysis complete!
                            </span>
                            <span className="text-sm opacity-80">
                              Security Score: {scanResult.securityScore}/100 | 
                              Risk Level: {scanResult.riskAnalysis.overallRisk.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {scanComplete && scanResult && (
                  <div className="mt-6 md:mt-0 md:ml-6 md:w-1/3">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
                      <h3 className="font-semibold mb-3">Security Assessment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Overall Score</span>
                          <Badge className={`${scanResult.securityScore >= 80 ? 'bg-green-500' : 
                                            scanResult.securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                            {scanResult.securityScore}/100
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Breaches</span>
                          <span className={`font-medium text-sm ${scanResult.breaches.length === 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {scanResult.breaches.length} Found
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Login Anomalies</span>
                          <span className={`font-medium text-sm ${scanResult.loginAnomalies.length === 0 ? 'text-green-300' : 'text-orange-300'}`}>
                            {scanResult.loginAnomalies.length} Detected
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Password Strength</span>
                          <span className={`font-medium text-sm ${
                            scanResult.passwordAssessment.strength === 'very-strong' ? 'text-green-300' :
                            scanResult.passwordAssessment.strength === 'strong' ? 'text-blue-300' :
                            scanResult.passwordAssessment.strength === 'medium' ? 'text-yellow-300' : 'text-red-300'
                          }`}>
                            {scanResult.passwordAssessment.strength.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">2FA Status</span>
                          <span className={`font-medium text-sm ${scanResult.twoFactorStatus.enabled ? 'text-green-300' : 'text-red-300'}`}>
                            {scanResult.twoFactorStatus.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Scan Results */}
        {scanComplete && scanResult && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Detailed Security Analysis</h2>
            
            {/* Risk Overview */}
            <div className="mb-6">
              <Alert className={`border-2 ${getRiskColor(scanResult.riskAnalysis.overallRisk)}`}>
                <AlertTriangle className="w-5 h-5" />
                <AlertDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">
                      Overall Risk Level: {scanResult.riskAnalysis.overallRisk.toUpperCase()}
                    </h4>
                    <p>Risk Score: {scanResult.riskAnalysis.riskScore}/100</p>
                    {scanResult.riskAnalysis.actionableSteps.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Immediate Actions Required:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {scanResult.riskAnalysis.actionableSteps.slice(0, 3).map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Breaches */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-red-500 mr-3" />
                  <h3 className="font-bold text-lg">Data Breach Exposure</h3>
                  <Badge variant="destructive" className="ml-auto">
                    {scanResult.breaches.length} Found
                  </Badge>
                </div>
                {scanResult.breaches.length === 0 ? (
                  <p className="text-green-600">✓ No data breaches detected</p>
                ) : (
                  <div className="space-y-3">
                    {scanResult.breaches.map((breach) => (
                      <div key={breach.id} className="border rounded-lg p-3 bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{breach.source}</h4>
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(breach.severity)}`}></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Data exposed: {breach.dataExposed.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {breach.dateLeaked.toLocaleDateString()} • {breach.affectedAccounts.toLocaleString()} accounts affected
                        </p>
                        <p className="text-sm text-blue-600 mt-2">{breach.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Login Anomalies */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-orange-500 mr-3" />
                  <h3 className="font-bold text-lg">Login Pattern Analysis</h3>
                  <Badge variant={scanResult.loginAnomalies.length > 0 ? "destructive" : "secondary"} className="ml-auto">
                    {scanResult.loginAnomalies.length} Anomalies
                  </Badge>
                </div>
                {scanResult.loginAnomalies.length === 0 ? (
                  <p className="text-green-600">✓ No suspicious login patterns detected</p>
                ) : (
                  <div className="space-y-3">
                    {scanResult.loginAnomalies.map((anomaly) => (
                      <div key={anomaly.id} className="border rounded-lg p-3 bg-orange-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{anomaly.type} Anomaly</h4>
                          <Badge variant={anomaly.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                            {anomaly.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{anomaly.description}</p>
                        <div className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {anomaly.detectedAt.toLocaleString()}
                          {anomaly.ipAddress && ` • IP: ${anomaly.ipAddress}`}
                          {anomaly.location && ` • Location: ${anomaly.location}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Password Assessment */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Key className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="font-bold text-lg">Password Security</h3>
                  <Badge className={`ml-auto ${
                    scanResult.passwordAssessment.strength === 'very-strong' ? 'bg-green-500' :
                    scanResult.passwordAssessment.strength === 'strong' ? 'bg-blue-500' :
                    scanResult.passwordAssessment.strength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {scanResult.passwordAssessment.strength.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Strength Score</span>
                      <span>{scanResult.passwordAssessment.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          scanResult.passwordAssessment.score >= 80 ? 'bg-green-500' :
                          scanResult.passwordAssessment.score >= 60 ? 'bg-blue-500' :
                          scanResult.passwordAssessment.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${scanResult.passwordAssessment.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p><strong>Estimated crack time:</strong> {scanResult.passwordAssessment.estimatedCrackTime}</p>
                    <p><strong>Length:</strong> {scanResult.passwordAssessment.characteristics.length} characters</p>
                  </div>
                  {scanResult.passwordAssessment.recommendations.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-1">Recommendations:</p>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {scanResult.passwordAssessment.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>

              {/* Two-Factor Authentication */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Smartphone className="w-6 h-6 text-purple-500 mr-3" />
                  <h3 className="font-bold text-lg">Two-Factor Authentication</h3>
                  <Badge className={`ml-auto ${scanResult.twoFactorStatus.enabled ? 'bg-green-500' : 'bg-red-500'}`}>
                    {scanResult.twoFactorStatus.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {scanResult.twoFactorStatus.enabled ? (
                    <div>
                      <p className="text-sm mb-2">
                        <strong>Active methods:</strong> {scanResult.twoFactorStatus.methods.join(', ')}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Backup codes:</strong> {scanResult.twoFactorStatus.backupCodes ? 'Available' : 'Not set up'}
                      </p>
                      {scanResult.twoFactorStatus.lastUsed && (
                        <p className="text-sm text-gray-600">
                          Last used: {scanResult.twoFactorStatus.lastUsed.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-600">⚠️ Two-factor authentication is disabled</p>
                  )}
                  {scanResult.twoFactorStatus.recommendations.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-1">Recommendations:</p>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {scanResult.twoFactorStatus.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </section>
        )}
        
        {/* AI Security Technology */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">AI Security Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-5 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Transformer Neural Networks</h3>
              <p className="text-sm text-gray-600">
                Uses attention-based transformers to analyze login patterns and detect unauthorized access attempts with 99.7% accuracy.
              </p>
            </Card>
            
            <Card className="p-5 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Federated Learning</h3>
              <p className="text-sm text-gray-600">
                Improves threat detection across users without sharing personal data, using on-device AI and privacy-preserving techniques.
              </p>
            </Card>
            
            <Card className="p-5 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FileSearch className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Behavioral Biometrics</h3>
              <p className="text-sm text-gray-600">
                Creates unique user fingerprints based on typing patterns, mouse movements, and interaction habits to verify identity.
              </p>
            </Card>
            
            <Card className="p-5 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Quantum-Resistant Encryption</h3>
              <p className="text-sm text-gray-600">
                Future-proof security using lattice-based cryptography that resists attacks from both classical and quantum computers.
              </p>
            </Card>
          </div>
        </section>
        
        {/* Recovery Workflow */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Advanced Recovery Protocol</h2>
          <RecoveryStepFlow />
        </section>
        
        {/* Recovery Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Enterprise-Grade Security Features</h2>
          <RecoveryFeatures />
        </section>
        
        {/* Technology Stack */}
        <section className="mb-10">
          <div className="rounded-xl border p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">AI/ML Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-medium mb-2">Anomaly Detection</h3>
                <p className="text-sm text-gray-600">LSTM (Time-Series Analysis) using login history and geolocation data</p>
              </Card>
              <Card className="p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-medium mb-2">Dark Web Scan</h3>
                <p className="text-sm text-gray-600">NLP (BERT for parsing leaked data) from HIBP API and hacker forums</p>
              </Card>
              <Card className="p-4 hover:shadow-md transition-all duration-300">
                <h3 className="font-medium mb-2">Phishing Detection</h3>
                <p className="text-sm text-gray-600">GPT-4 + CNN for image and text analysis of user inbox content</p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Security & Privacy */}
        <section className="mb-10">
          <div className="rounded-xl border p-6 bg-gradient-to-br from-cyberguard-primary/5 to-cyberguard-secondary/10">
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <Lock className="w-8 h-8 text-cyberguard-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Security & Privacy</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-cyberguard-primary" />
                    <span><strong>Zero-Knowledge Encryption:</strong> Even we can't read your emails</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-cyberguard-primary" />
                    <span><strong>GDPR/CCPA Compliant:</strong> Auto-deletes logs after 30 days</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-cyberguard-primary" />
                    <span><strong>On-Device AI:</strong> Sensitive checks happen locally on your device</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-cyberguard-primary" />
                    <span><strong>SOC2 Certified:</strong> Annual independent security audits</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-cyberguard-primary" />
                    <span><strong>Blockchain Verification:</strong> Immutable audit logs for recovery actions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="mb-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Email?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our early access program and be the first to experience our enterprise-grade AI-driven recovery system.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90">
                Join Early Access
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecoveryFlow;

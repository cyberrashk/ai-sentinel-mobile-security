
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Shield, AlertCircle, Lock, RefreshCw, Check, ShieldCheck, 
  ArrowRight, Cpu, Brain, Zap, FileSearch, Server
} from 'lucide-react';
import { toast } from 'sonner';
import RecoveryStepFlow from '@/components/RecoveryStepFlow';
import RecoveryFeatures from '@/components/RecoveryFeatures';

const RecoveryFlow = () => {
  const [scanStarted, setScanStarted] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  
  const handleStartScan = () => {
    setScanStarted(true);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prevProgress => {
        const newProgress = prevProgress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setScanComplete(true);
          setSecurityScore(84);
          toast.success("Security scan complete", {
            description: "No compromises detected in your account"
          });
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cyberguard-container py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyberguard-secondary to-cyberguard-primary text-white">
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
                    Our quantum-resistant AI system detects breaches, automates recovery, and prevents future attacks
                    using advanced neural networks and behavioral biometrics.
                  </p>
                  
                  {!scanStarted ? (
                    <Button 
                      onClick={handleStartScan}
                      size="lg" 
                      className="bg-white text-cyberguard-primary hover:bg-white/90"
                    >
                      <Shield className="mr-2 w-5 h-5" />
                      Start Security Scan
                    </Button>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      {!scanComplete ? (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                            <span>AI scanning your account for compromises...</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2.5">
                            <div 
                              className="bg-white h-2.5 rounded-full transition-all duration-300" 
                              style={{ width: `${scanProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs">
                            {scanProgress < 30 && "Analyzing login patterns..."}
                            {scanProgress >= 30 && scanProgress < 60 && "Scanning dark web for credentials..."}
                            {scanProgress >= 60 && scanProgress < 90 && "Checking for unauthorized access..."}
                            {scanProgress >= 90 && scanProgress < 100 && "Finalizing security assessment..."}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ShieldCheck className="w-5 h-5 mr-3" />
                          <div>
                            <span className="block">Account secure!</span> 
                            <span className="text-sm opacity-80">Security score: {securityScore}/100</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {scanComplete && (
                  <div className="mt-6 md:mt-0 md:ml-6 md:w-1/3">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
                      <h3 className="font-semibold mb-2">Security Assessment</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Password Strength</span>
                          <span className="font-medium text-sm">Strong</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">2FA Status</span>
                          <span className="font-medium text-sm">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dark Web Exposure</span>
                          <span className="font-medium text-sm">None Detected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Recovery Options</span>
                          <span className="font-medium text-sm">Incomplete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
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

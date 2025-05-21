
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, AlertCircle, Lock, RefreshCw, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import RecoveryStepFlow from '@/components/RecoveryStepFlow';
import RecoveryFeatures from '@/components/RecoveryFeatures';

const RecoveryFlow = () => {
  const [scanStarted, setScanStarted] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  
  const handleStartScan = () => {
    setScanStarted(true);
    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setScanComplete(true);
    }, 3000);
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
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                AI-Powered Email Recovery System
              </h1>
              <p className="text-lg opacity-90 mb-6 max-w-3xl">
                Our cutting-edge AI system detects breaches, automates recovery, and prevents future attacks.
                Restore hacked accounts in minutes with behavioral AI and smart automation.
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
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg inline-block">
                  {!scanComplete ? (
                    <div className="flex items-center">
                      <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                      <span>AI scanning your account for compromises...</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-white">
                      <ShieldCheck className="w-5 h-5 mr-3" />
                      <span>No compromises detected. Account secure!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Recovery Workflow */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Email Recovery Workflow</h2>
          <RecoveryStepFlow />
        </section>
        
        {/* Recovery Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Core Recovery Features</h2>
          <RecoveryFeatures />
        </section>
        
        {/* Technology Stack */}
        <section className="mb-10">
          <div className="rounded-xl border p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">AI/ML Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="font-medium mb-2">Anomaly Detection</h3>
                <p className="text-sm text-gray-600">LSTM (Time-Series Analysis) using login history and geolocation data</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Dark Web Scan</h3>
                <p className="text-sm text-gray-600">NLP (BERT for parsing leaked data) from HIBP API and hacker forums</p>
              </Card>
              <Card className="p-4">
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
              Join our early access program and be the first to experience our AI-driven recovery system.
            </p>
            <Button size="lg" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90">
              Join Early Access
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecoveryFlow;


import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SecurityStatus from '@/components/SecurityStatus';
import SecurityScanCard from '@/components/SecurityScanCard';
import SecureVault from '@/components/SecureVault';
import AIAssistant from '@/components/AIAssistant';
import FeatureGrid from '@/components/FeatureGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ShieldCheck, Shield } from 'lucide-react';

const Index = () => {
  const [securityStatus, setSecurityStatus] = useState<'protected' | 'warning' | 'danger'>('protected');
  const [statusMessage, setStatusMessage] = useState('Your device is secure and protected by CyberGuard AI');

  const handleScan = () => {
    // In a real app, this would perform an actual scan
    // For demo purposes, randomly change status sometimes
    if (Math.random() > 0.7) {
      setSecurityStatus('warning');
      setStatusMessage('We found some potential vulnerabilities that need attention');
      toast.warning('Security Alert', {
        description: 'Some security issues were detected during the scan',
        action: {
          label: 'View Details',
          onClick: () => console.log('User clicked to view security details')
        }
      });
    } else {
      setSecurityStatus('protected');
      setStatusMessage('Your device is secure and protected by CyberGuard AI');
      toast.success('Scan Complete', {
        description: 'No security threats were found on your device',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cyberguard-container py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyberguard-primary to-cyberguard-secondary text-white">
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
            <div className="relative z-10 px-6 py-16 md:py-20 md:px-10 lg:px-20 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  AI-Powered Protection for Your Digital Life
                </h1>
                <p className="text-lg opacity-90 mb-6">
                  CyberGuard AI uses advanced artificial intelligence to protect you from cyber threats, 
                  malware, phishing, and identity theft.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-cyberguard-primary hover:bg-white/90">
                    <ShieldCheck className="mr-2 w-5 h-5" />
                    Scan Now
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Explore Features
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/30 flex items-center justify-center">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center">
                        <Shield className="w-12 h-12 md:w-16 md:h-16 text-cyberguard-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-20 border-4 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Status */}
        <section className="mb-8">
          <SecurityStatus
            level={securityStatus}
            message={statusMessage}
            className="mb-6"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SecurityScanCard type="malware" onScan={handleScan} />
            <SecurityScanCard type="phishing" onScan={handleScan} />
            <SecurityScanCard type="network" onScan={handleScan} />
            <SecurityScanCard type="identity" onScan={handleScan} />
          </div>
        </section>

        {/* Vault and Assistant Section */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecureVault />
          </div>
          <div>
            <AIAssistant />
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Security Features</h2>
            <Button variant="outline">
              View All
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="protection">Protection</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <FeatureGrid />
            </TabsContent>
            
            <TabsContent value="protection" className="mt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Protection features will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Privacy features will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="identity" className="mt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Identity protection features will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Upgrade Section */}
        <section className="mb-10">
          <div className="rounded-2xl border bg-gradient-to-br from-cyberguard-secondary/5 to-cyberguard-primary/10 p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Upgrade to CyberGuard AI Pro</h2>
              <p className="text-gray-600 mb-6">
                Get advanced AI-powered protection including dark web monitoring, 
                encrypted communications, and family safety features.
              </p>
              <Button size="lg" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 text-white">
                Upgrade Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="cyberguard-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full shield-gradient flex items-center justify-center mr-2">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">CyberGuard AI</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 CyberGuard AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

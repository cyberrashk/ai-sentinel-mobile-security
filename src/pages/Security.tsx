
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import VPNStatus from '@/components/VPNStatus';
import AntivirusStatus from '@/components/AntivirusStatus';
import Login from '@/components/Login';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Security = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  
  const handleLogin = (userData: {name: string, email: string}) => {
    setUser(userData);
    setIsLoggedIn(true);
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
            <div className="relative z-10 px-6 py-10 md:py-16 md:px-10 lg:px-20 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Free VPN & Antivirus for Everyone
                </h1>
                <p className="text-lg opacity-90 mb-6">
                  Unlimited AI-powered protection with no restrictions. Stay safe online with our advanced security features.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/30 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center">
                        <Shield className="w-8 h-8 md:w-12 md:h-12 text-cyberguard-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <Tabs defaultValue="vpn" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vpn">Smart VPN</TabsTrigger>
              <TabsTrigger value="antivirus">AI Antivirus</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vpn" className="mt-6">
              <VPNStatus />
            </TabsContent>
            
            <TabsContent value="antivirus" className="mt-6">
              <AntivirusStatus />
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              {isLoggedIn && user ? (
                <div className="rounded-xl border p-5">
                  <div className="flex flex-col items-center justify-center p-6">
                    <div className="w-20 h-20 rounded-full bg-cyberguard-primary/10 flex items-center justify-center mb-4">
                      <User className="w-10 h-10 text-cyberguard-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{user.name}</h3>
                    <p className="text-gray-500 mb-6">{user.email}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border w-full mb-4">
                      <h4 className="font-medium mb-2">Your Security Status</h4>
                      <div className="flex items-center text-cyberguard-success mb-1">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        <span className="text-sm">Account Protected</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Your account is secured with password protection. 
                        Enable 2FA for enhanced security.
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUser(null);
                        toast.info('Logged Out', {
                          description: 'You have been securely logged out'
                        });
                      }}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              ) : (
                <Login onLogin={handleLogin} />
              )}
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Premium Features Section */}
        <section className="mb-10">
          <div className="rounded-2xl border bg-gradient-to-br from-cyberguard-secondary/5 to-cyberguard-primary/10 p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Upgrade to Premium</h2>
              <p className="text-gray-600 mb-6">
                Get advanced AI-powered protection including 50+ VPN locations, 
                real-time antivirus, zero-day exploit protection, and $50K identity theft insurance.
              </p>
              <div className="inline-flex items-center justify-center bg-white rounded-full px-6 py-2 shadow-sm mb-4">
                <span className="text-2xl font-bold text-cyberguard-primary mr-2">$5.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="flex justify-center">
                <Button size="lg" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 text-white">
                  Upgrade Now
                </Button>
              </div>
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

export default Security;

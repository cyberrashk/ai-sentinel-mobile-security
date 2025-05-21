
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VPNStatus from '@/components/VPNStatus';
import AntivirusStatus from '@/components/AntivirusStatus';
import Login from '@/components/Login';
import UserProfile from '@/components/UserProfile';
import * as authService from '@/services/authService';

interface SecurityTabsProps {
  isLoggedIn: boolean;
  user: {name: string, email: string} | null;
  onLogin: (userData: {name: string, email: string}) => void;
  onLogout: () => void;
}

const SecurityTabs: React.FC<SecurityTabsProps> = ({ 
  isLoggedIn, 
  user, 
  onLogin, 
  onLogout 
}) => {
  // Check if user is already logged in from session
  useEffect(() => {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser && !isLoggedIn) {
      onLogin(sessionUser);
    }
  }, [isLoggedIn, onLogin]);
  
  return (
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
            <UserProfile user={user} onLogout={onLogout} />
          ) : (
            <Login onLogin={onLogin} />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SecurityTabs;

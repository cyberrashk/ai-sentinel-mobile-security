
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecureVault from '@/components/SecureVault';
import AIAssistant from '@/components/AIAssistant';
import EnhancedDarkWebMonitor from '@/components/EnhancedDarkWebMonitor';
import FamilyProtection from '@/components/FamilyProtection';
import FinancialGuard from '@/components/FinancialGuard';
import EncryptedChat from '@/components/EncryptedChat';

const PremiumFeaturesSection: React.FC = () => {
  return (
    <section className="mb-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="darkweb">Dark Web</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="chat">Encrypted Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SecureVault />
            </div>
            <div>
              <AIAssistant />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="darkweb" className="mt-6">
          <EnhancedDarkWebMonitor />
        </TabsContent>
        
        <TabsContent value="family" className="mt-6">
          <FamilyProtection />
        </TabsContent>
        
        <TabsContent value="financial" className="mt-6">
          <FinancialGuard />
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <EncryptedChat />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PremiumFeaturesSection;

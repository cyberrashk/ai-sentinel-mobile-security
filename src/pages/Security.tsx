
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SecurityHero from '@/components/SecurityHero';
import SecurityTabs from '@/components/SecurityTabs';
import PremiumFeatures from '@/components/PremiumFeatures';
import Footer from '@/components/Footer';

const Security = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cyberguard-container py-6">
        <SecurityHero />
        <SecurityTabs />
        <PremiumFeatures />
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;

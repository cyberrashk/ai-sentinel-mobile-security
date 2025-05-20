
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SecurityHero from '@/components/SecurityHero';
import SecurityTabs from '@/components/SecurityTabs';
import PremiumFeatures from '@/components/PremiumFeatures';
import Footer from '@/components/Footer';

const Security = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  
  const handleLogin = (userData: {name: string, email: string}) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cyberguard-container py-6">
        <SecurityHero />
        <SecurityTabs 
          isLoggedIn={isLoggedIn}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <PremiumFeatures />
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;

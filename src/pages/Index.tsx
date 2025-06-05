
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SecurityTabs from '@/components/SecurityTabs';
import PremiumFeatures from '@/components/PremiumFeatures';
import PaymentModal from '@/components/PaymentModal';
import HeroSection from '@/components/HeroSection';
import SecurityStatusSection from '@/components/SecurityStatusSection';
import PremiumFeaturesSection from '@/components/PremiumFeaturesSection';
import AllFeaturesSection from '@/components/AllFeaturesSection';
import UpgradeSection from '@/components/UpgradeSection';
import AppFooter from '@/components/AppFooter';
import { toast } from 'sonner';
import { checkUpgradeStatus } from '@/services/paymentService';
import * as authService from '@/services/authService';

const Index = () => {
  const [securityStatus, setSecurityStatus] = useState<'protected' | 'warning' | 'danger'>('protected');
  const [statusMessage, setStatusMessage] = useState('Your device is secure and protected by CyberGuard AI');
  const [isProPaymentModalOpen, setIsProPaymentModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  
  const upgradeStatus = checkUpgradeStatus();
  const isPremium = authService.isPremiumUser();

  // Check for existing user session on component mount
  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData: {name: string, email: string}) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleScan = () => {
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

  const handleExploreFeatures = () => {
    if (!isLoggedIn) {
      toast.info('Login Required', {
        description: 'Please login to explore security features'
      });
      return;
    }
    
    // Navigate to security section
    document.getElementById('security-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const proFeatures = [
    "100+ VPN Countries",
    "Advanced AI Protection",
    "Dark Web Monitoring",
    "Family Protection Suite",
    "Priority Support",
    "$100K Identity Theft Insurance"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cyberguard-container py-6">
        <HeroSection onScan={handleScan} onExploreFeatures={handleExploreFeatures} />
        
        <SecurityStatusSection
          securityStatus={securityStatus}
          statusMessage={statusMessage}
          showAlerts={showAlerts}
          onToggleAlerts={() => setShowAlerts(!showAlerts)}
          onScan={handleScan}
        />

        <section id="security-section" className="mb-8">
          <SecurityTabs 
            isLoggedIn={isLoggedIn}
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            showAlerts={showAlerts}
          />
        </section>

        <PremiumFeaturesSection />

        {!upgradeStatus.isUpgraded && (
          <PremiumFeatures />
        )}

        <AllFeaturesSection />
        
        <UpgradeSection
          upgradeStatus={upgradeStatus}
          onUpgrade={() => setIsProPaymentModalOpen(true)}
        />
      </main>
      
      <AppFooter />

      <PaymentModal
        isOpen={isProPaymentModalOpen}
        onClose={() => setIsProPaymentModalOpen(false)}
        planType="pro"
        planPrice="$9.99"
        planFeatures={proFeatures}
      />
    </div>
  );
};

export default Index;

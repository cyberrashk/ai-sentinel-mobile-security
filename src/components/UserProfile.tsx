import React, { useState } from 'react';
import { User, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PaymentModal from './PaymentModal';
import * as authService from '@/services/authService';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const isPremium = authService.isPremiumUser();
  
  const handleLogout = () => {
    authService.logout();
    onLogout();
    toast.info('Logged Out', {
      description: 'You have been securely logged out'
    });
  };

  const premiumFeatures = [
    "50+ VPN Countries",
    "Real-time AI Protection",
    "Dark Web Monitoring", 
    "$50K Identity Theft Insurance"
  ];

  return (
    <>
      <div className="rounded-xl border p-5">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-cyberguard-primary/10 flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-cyberguard-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{user.name}</h3>
          <p className="text-gray-500 mb-2">{user.email}</p>
          
          <div className="mb-6 flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isPremium 
                ? 'bg-cyberguard-primary/10 text-cyberguard-primary' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isPremium ? (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Premium
                </>
              ) : (
                'Free Plan'
              )}
            </span>
          </div>
          
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
          
          {!isPremium && (
            <div className="bg-cyberguard-alert/10 rounded-lg p-4 border border-cyberguard-alert/20 w-full mb-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-cyberguard-alert mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Limited Protection</h4>
                  <p className="text-xs text-gray-700">
                    Upgrade to Premium for complete protection including real-time scanning, 
                    advanced VPN features, and more.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full border-cyberguard-alert/50 text-cyberguard-alert hover:bg-cyberguard-alert/5"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planType="premium"
        planPrice="$5.99"
        planFeatures={premiumFeatures}
      />
    </>
  );
};

export default UserProfile;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import PaymentModal from './PaymentModal';

const PremiumFeatures: React.FC = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const premiumFeatures = [
    "50+ VPN Countries",
    "Real-time AI Protection", 
    "Dark Web Monitoring",
    "$50K Identity Theft Insurance"
  ];
  
  return (
    <>
      <section className="mb-10">
        <div className="rounded-2xl border bg-gradient-to-br from-cyberguard-secondary/5 to-cyberguard-primary/10 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Upgrade to Premium</h2>
              <p className="text-gray-600">
                Get advanced AI-powered protection including 50+ VPN locations, 
                real-time antivirus, zero-day exploit protection, and $50K identity theft insurance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <div className="rounded-full bg-cyberguard-primary/10 p-1 mr-3 flex-shrink-0">
                    <Check className="w-4 h-4 text-cyberguard-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{feature}</h4>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center bg-white rounded-full px-6 py-2 shadow-sm mb-4">
                <span className="text-2xl font-bold text-cyberguard-primary mr-2">$5.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 text-white"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default PremiumFeatures;

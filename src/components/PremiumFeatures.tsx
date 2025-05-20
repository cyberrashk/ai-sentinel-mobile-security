
import React from 'react';
import { Button } from '@/components/ui/button';

const PremiumFeatures: React.FC = () => {
  return (
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
  );
};

export default PremiumFeatures;

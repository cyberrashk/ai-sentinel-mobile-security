
import React from 'react';
import { Button } from '@/components/ui/button';

interface UpgradeSectionProps {
  upgradeStatus: {
    isUpgraded: boolean;
    plan: string;
    upgradeDate?: Date;
  };
  onUpgrade: () => void;
}

const UpgradeSection: React.FC<UpgradeSectionProps> = ({ upgradeStatus, onUpgrade }) => {
  return (
    <section className="mb-10">
      <div className="rounded-2xl border bg-gradient-to-br from-cyberguard-secondary/5 to-cyberguard-primary/10 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {upgradeStatus.isUpgraded ? 
              `You're on CyberGuard ${upgradeStatus.plan.charAt(0).toUpperCase() + upgradeStatus.plan.slice(1)}!` :
              'Upgrade to CyberGuard AI Pro'
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {upgradeStatus.isUpgraded ?
              'Enjoy all the advanced features and premium protection.' :
              'Get the ultimate protection with dark web monitoring, encrypted communications, and family safety features.'
            }
          </p>
          {!upgradeStatus.isUpgraded && (
            <Button 
              size="lg" 
              className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 text-white"
              onClick={onUpgrade}
            >
              Upgrade to Pro - $9.99/month
            </Button>
          )}
          {upgradeStatus.isUpgraded && upgradeStatus.upgradeDate && (
            <p className="text-sm text-gray-500">
              Upgraded on {upgradeStatus.upgradeDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpgradeSection;

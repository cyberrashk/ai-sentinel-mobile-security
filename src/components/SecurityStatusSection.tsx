
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import SecurityStatus from '@/components/SecurityStatus';
import SecurityScanCard from '@/components/SecurityScanCard';

interface SecurityStatusSectionProps {
  securityStatus: 'protected' | 'warning' | 'danger';
  statusMessage: string;
  showAlerts: boolean;
  onToggleAlerts: () => void;
  onScan: () => void;
}

const SecurityStatusSection: React.FC<SecurityStatusSectionProps> = ({
  securityStatus,
  statusMessage,
  showAlerts,
  onToggleAlerts,
  onScan
}) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <SecurityStatus
          level={securityStatus}
          message={statusMessage}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={onToggleAlerts}
          className="ml-4"
        >
          <Bell className="w-4 h-4 mr-2" />
          {showAlerts ? 'Hide' : 'Show'} Alerts
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SecurityScanCard type="malware" onScan={onScan} />
        <SecurityScanCard type="phishing" onScan={onScan} />
        <SecurityScanCard type="network" onScan={onScan} />
        <SecurityScanCard type="identity" onScan={onScan} />
      </div>
    </section>
  );
};

export default SecurityStatusSection;


import React, { useState } from 'react';
import { Search, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface AntivirusStatusProps {
  className?: string;
}

export default function AntivirusStatus({ className }: AntivirusStatusProps) {
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'completed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScanDate, setLastScanDate] = useState<string | null>(null);
  const [threatCount, setThreatCount] = useState(0);
  const [scanType, setScanType] = useState<'quick' | 'deep'>('quick');

  const startScan = (type: 'quick' | 'deep') => {
    setScanningStatus('scanning');
    setScanProgress(0);
    setScanType(type);
    
    // Simulate scan progress
    const duration = type === 'quick' ? 5000 : 10000;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanningStatus('completed');
          setLastScanDate(new Date().toLocaleString());
          
          // Random threats found (for demo)
          const threats = Math.floor(Math.random() * 3);
          setThreatCount(threats);
          
          if (threats > 0) {
            toast.warning(`${threats} Threat${threats > 1 ? 's' : ''} Detected`, {
              description: 'CyberGuard AI has found and quarantined potential threats',
              action: {
                label: 'View Details',
                onClick: () => console.log('View threat details')
              }
            });
          } else {
            toast.success('Scan Completed', {
              description: 'No threats found on your device',
            });
          }
          
          return 100;
        }
        
        return prev + Math.random() * 5;
      });
    }, 200);
  };

  const cancelScan = () => {
    setScanningStatus('idle');
    setScanProgress(0);
    toast.info('Scan Cancelled', {
      description: 'Antivirus scan has been cancelled',
    });
  };

  return (
    <div className={`rounded-xl border p-5 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyberguard-secondary/10 flex items-center justify-center mr-3">
          <Shield className="w-5 h-5 text-cyberguard-secondary" />
        </div>
        <div>
          <h3 className="font-medium text-lg">Antivirus Protection</h3>
          <p className="text-sm text-gray-500">AI-Powered Real-Time Security</p>
        </div>
      </div>

      {scanningStatus === 'scanning' ? (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">{scanType === 'quick' ? 'Quick Scan' : 'Deep Scan'} in Progress</h4>
            <span className="text-xs font-medium">{Math.floor(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2 mb-3" />
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">
              {scanType === 'quick' ? 'Scanning critical areas...' : 'Performing deep system scan...'}
            </span>
            <Button variant="outline" size="sm" onClick={cancelScan}>Cancel</Button>
          </div>
        </div>
      ) : scanningStatus === 'completed' ? (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Scan Results</h4>
              <p className="text-xs text-gray-500">{lastScanDate}</p>
            </div>
            <div className={threatCount > 0 ? 'text-cyberguard-alert' : 'text-cyberguard-success'}>
              <span className="text-sm font-medium">
                {threatCount > 0 ? `${threatCount} Threat${threatCount > 1 ? 's' : ''} Found` : 'Protected'}
              </span>
            </div>
          </div>
          
          {threatCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <Button size="sm" className="w-full bg-cyberguard-secondary hover:bg-cyberguard-secondary/90">
                View & Remove Threats
              </Button>
            </div>
          )}
        </div>
      ) : lastScanDate ? (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <span className="text-sm">Last scan: {lastScanDate}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => startScan('quick')}>
              Scan Again
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => startScan('quick')}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Quick Scan</h4>
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Checks memory and critical files (~2 min)
          </p>
        </div>
        <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => startScan('deep')}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Deep Scan</h4>
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Full system security audit (~5 min)
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 mb-4">
        <div>
          <p className="text-sm font-medium">Premium AI Protection</p>
          <p className="text-xs text-gray-500">Real-time scanning, zero-day protection</p>
        </div>
        <Button variant="outline" size="sm" className="text-cyberguard-primary">
          Upgrade
        </Button>
      </div>
      
      <Button 
        className="w-full"
        disabled={scanningStatus === 'scanning'}
        onClick={() => startScan('quick')}
      >
        {scanningStatus === 'scanning' ? 'Scanning...' : 'Start Protection Scan'}
      </Button>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Search, Shield, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import * as antivirusService from '@/services/antivirusService';
import * as authService from '@/services/authService';

interface AntivirusStatusProps {
  className?: string;
}

export default function AntivirusStatus({ className }: AntivirusStatusProps) {
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'completed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScanDate, setLastScanDate] = useState<string | null>(null);
  const [threatCount, setThreatCount] = useState(0);
  const [scanType, setScanType] = useState<'quick' | 'deep'>('quick');
  const [currentScan, setCurrentScan] = useState<antivirusService.ScanResult | null>(null);
  const [antivirusStatus, setAntivirusStatus] = useState(antivirusService.getAntivirusStatus());
  
  const isPremium = authService.isPremiumUser();
  
  // Poll for scan updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Check for active scan
      const scan = antivirusService.getCurrentScan();
      
      if (scan) {
        // Update state with scan progress
        setCurrentScan(scan);
        setScanningStatus('scanning');
        setScanType(scan.type as 'quick' | 'deep');
        
        // Calculate scan progress
        const totalItems = scan.type === 'quick' ? 2000 : scan.type === 'deep' ? 10000 : 5000;
        const progress = Math.min(100, Math.floor((scan.itemsScanned / totalItems) * 100));
        setScanProgress(progress);
        
        setThreatCount(scan.threats.length);
      } else if (scanningStatus === 'scanning') {
        // Scan just completed
        setScanningStatus('completed');
        
        // Update antivirus status to get last scan
        const status = antivirusService.getAntivirusStatus();
        setAntivirusStatus(status);
        
        if (status.lastScan) {
          setLastScanDate(status.lastScan.endTime?.toLocaleString() || null);
          setThreatCount(status.lastScan.threats.length);
          
          // Show scan completed notification
          if (status.lastScan.status === 'completed') {
            if (status.lastScan.threats.length > 0) {
              toast.warning(`${status.lastScan.threats.length} Threat${status.lastScan.threats.length > 1 ? 's' : ''} Detected`, {
                description: 'CyberGuard AI has found potential security threats',
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
          }
        }
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [scanningStatus]);
  
  // Initialize with existing data
  useEffect(() => {
    const status = antivirusService.getAntivirusStatus();
    setAntivirusStatus(status);
    
    if (status.lastScan) {
      setLastScanDate(status.lastScan.endTime?.toLocaleString() || null);
      setThreatCount(status.lastScan.threats.length);
    }
  }, []);

  const startScan = async (type: 'quick' | 'deep') => {
    try {
      setScanningStatus('scanning');
      setScanProgress(0);
      setScanType(type);
      
      await antivirusService.startScan(type);
      
      toast.info(`${type === 'quick' ? 'Quick' : 'Deep'} Scan Started`, {
        description: `Scanning your device for security threats`,
      });
    } catch (error) {
      toast.error('Scan Failed', {
        description: 'Unable to start the security scan',
      });
      setScanningStatus('idle');
    }
  };

  const cancelScan = () => {
    antivirusService.cancelScan();
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
              {threatCount > 0 && ` (${threatCount} threats found)`}
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
      
      {/* Protection status */}
      <div className="mb-4 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Shield className={`w-4 h-4 mr-2 ${isPremium ? 'text-cyberguard-success' : 'text-gray-400'}`} />
            <h4 className="font-medium text-sm">Real-time Protection</h4>
          </div>
          <div>
            {isPremium ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyberguard-success/10 text-cyberguard-success">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                Premium
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {isPremium 
            ? 'Active protection against malware, ransomware, and zero-day threats.' 
            : 'Upgrade to Premium for real-time protection against emerging threats.'}
        </p>
      </div>
      
      {/* Virus definitions */}
      <div className="mb-4 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">Virus Definitions</h4>
            <p className="text-xs text-gray-500">
              Version {antivirusStatus.definitions.version} • Updated {
                new Date(antivirusStatus.definitions.lastUpdated).toLocaleDateString()
              }
            </p>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </div>
      
      {/* Premium features banner */}
      {!isPremium && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 mb-4">
          <div>
            <p className="text-sm font-medium">Premium AI Protection</p>
            <p className="text-xs text-gray-500">Real-time scanning, zero-day protection</p>
          </div>
          <Button variant="outline" size="sm" className="text-cyberguard-primary">
            Upgrade
          </Button>
        </div>
      )}
      
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

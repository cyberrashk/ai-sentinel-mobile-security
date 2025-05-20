
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Search, 
  WifiOff, 
  FileX, 
  Lock,
} from 'lucide-react';

type ScanType = 'malware' | 'phishing' | 'network' | 'identity';

interface SecurityScanCardProps {
  type: ScanType;
  className?: string;
  onScan?: () => void;
}

export default function SecurityScanCard({ type, className, onScan }: SecurityScanCardProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  
  const getScanConfig = () => {
    switch (type) {
      case 'malware':
        return {
          icon: <Shield className="w-6 h-6" />,
          title: 'Malware Scanner',
          description: 'AI-powered scan for viruses and malware',
          color: 'text-cyberguard-secondary',
          bgColor: 'bg-cyberguard-secondary/10',
        };
      case 'phishing':
        return {
          icon: <FileX className="w-6 h-6" />,
          title: 'Phishing Detector',
          description: 'Protect against scam sites and messages',
          color: 'text-cyberguard-accent',
          bgColor: 'bg-cyberguard-accent/10',
        };
      case 'network':
        return {
          icon: <WifiOff className="w-6 h-6" />,
          title: 'Network Security',
          description: 'Check for vulnerable WiFi connections',
          color: 'text-cyberguard-alert',
          bgColor: 'bg-cyberguard-alert/10',
        };
      case 'identity':
        return {
          icon: <Lock className="w-6 h-6" />,
          title: 'Identity Protection',
          description: 'Monitor for data leaks and breaches',
          color: 'text-cyberguard-danger',
          bgColor: 'bg-cyberguard-danger/10',
        };
      default:
        return {
          icon: <Search className="w-6 h-6" />,
          title: 'Security Scan',
          description: 'General security check',
          color: 'text-cyberguard-primary',
          bgColor: 'bg-cyberguard-primary/10',
        };
    }
  };

  const config = getScanConfig();
  
  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanComplete(true);
            setIsScanning(false);
            if (onScan) onScan();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className={cn(
      "rounded-xl border p-5 transition-all duration-300",
      isScanning ? "border-blue-400 shadow-md" : "hover:border-blue-300 hover:shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mr-3", config.bgColor)}>
            <span className={config.color}>{config.icon}</span>
          </div>
          <div>
            <h3 className="font-medium text-lg">{config.title}</h3>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>
        </div>
      </div>
      
      {isScanning ? (
        <div className="space-y-3">
          <div className="relative h-1.5">
            <Progress value={scanProgress} className="h-full" />
            <div className="scanning-line absolute top-0 left-0 right-0 opacity-40"></div>
          </div>
          <p className="text-sm text-center text-gray-600">
            {scanProgress < 100 ? 'AI analyzing your device...' : 'Finalizing results...'}
          </p>
        </div>
      ) : scanComplete ? (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-cyberguard-success">No threats found</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleScan}
          >
            Scan Again
          </Button>
        </div>
      ) : (
        <Button 
          className="w-full bg-white hover:bg-gray-50 text-cyberguard-primary border border-gray-200"
          onClick={handleScan}
        >
          Quick Scan
        </Button>
      )}
    </div>
  );
}

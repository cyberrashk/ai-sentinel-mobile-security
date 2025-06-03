
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Smartphone, 
  Shield, 
  Lock, 
  WifiOff, 
  Eye, 
  AlertTriangle, 
  CheckCircle2,
  Settings,
  Scan
} from 'lucide-react';
import { toast } from 'sonner';

const MobileSecurity = () => {
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [appScanEnabled, setAppScanEnabled] = useState(true);
  const [wifiProtection, setWifiProtection] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleMobileScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast.success('Mobile Scan Complete', {
            description: 'Your mobile device is secure and protected'
          });
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const mobileFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-cyberguard-primary" />,
      title: 'Real-time App Protection',
      description: 'AI monitors apps for malicious behavior and suspicious permissions',
      enabled: appScanEnabled,
      toggle: () => setAppScanEnabled(!appScanEnabled)
    },
    {
      icon: <WifiOff className="w-6 h-6 text-cyberguard-secondary" />,
      title: 'Wi-Fi Security',
      description: 'Protects against unsafe public Wi-Fi networks and man-in-the-middle attacks',
      enabled: wifiProtection,
      toggle: () => setWifiProtection(!wifiProtection)
    },
    {
      icon: <Eye className="w-6 h-6 text-cyberguard-accent" />,
      title: 'Privacy Monitor',
      description: 'Tracks which apps access your camera, microphone, and location',
      enabled: protectionEnabled,
      toggle: () => setProtectionEnabled(!protectionEnabled)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mobile Security Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-cyberguard-primary/10 flex items-center justify-center mr-4">
              <Smartphone className="w-6 h-6 text-cyberguard-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Mobile Security Center</h2>
              <p className="text-gray-600">Comprehensive protection for your mobile device</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-cyberguard-success" />
            <span className="text-sm font-medium text-cyberguard-success">Protected</span>
          </div>
        </div>

        {/* Quick Scan */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Mobile Security Scan</h3>
              <p className="text-sm text-gray-600">Check your device for security threats</p>
            </div>
            <Button 
              onClick={handleMobileScan}
              disabled={isScanning}
              className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
            >
              <Scan className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Quick Scan'}
            </Button>
          </div>
          
          {isScanning && (
            <div className="space-y-2">
              <Progress value={scanProgress} className="h-2" />
              <p className="text-sm text-center text-gray-600">
                {scanProgress < 30 && 'Checking device permissions...'}
                {scanProgress >= 30 && scanProgress < 60 && 'Scanning installed apps...'}
                {scanProgress >= 60 && scanProgress < 90 && 'Analyzing network connections...'}
                {scanProgress >= 90 && 'Finalizing security check...'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mobileFeatures.map((feature, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                {feature.icon}
              </div>
              <Switch 
                checked={feature.enabled}
                onCheckedChange={feature.toggle}
              />
            </div>
            <h3 className="font-medium mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Mobile Security Tips */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-cyberguard-primary" />
          Mobile Security Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle2 className="w-4 h-4 text-cyberguard-success mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Keep apps updated</p>
                <p className="text-xs text-gray-600">Regular updates patch security vulnerabilities</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-4 h-4 text-cyberguard-success mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Use strong screen locks</p>
                <p className="text-xs text-gray-600">PIN, password, or biometric authentication</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-cyberguard-alert mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Avoid public Wi-Fi for sensitive tasks</p>
                <p className="text-xs text-gray-600">Use VPN when connecting to public networks</p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-cyberguard-alert mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Review app permissions</p>
                <p className="text-xs text-gray-600">Only grant necessary permissions to apps</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MobileSecurity;

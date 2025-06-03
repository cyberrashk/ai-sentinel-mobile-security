
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Eye, AlertTriangle, Shield, Clock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import * as darkWebService from '@/services/darkWebService';
import * as authService from '@/services/authService';

export default function DarkWebMonitor() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [breaches, setBreaches] = useState<darkWebService.LeakedCredential[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [emailRisk, setEmailRisk] = useState<any>(null);
  
  const user = authService.getCurrentUser();
  const isPremium = authService.isPremiumUser();

  useEffect(() => {
    // Load previous scan results if any
    const savedBreaches = localStorage.getItem('darkweb_scan_results');
    const savedScanDate = localStorage.getItem('darkweb_last_scan');
    
    if (savedBreaches) {
      setBreaches(JSON.parse(savedBreaches));
    }
    if (savedScanDate) {
      setLastScan(new Date(savedScanDate));
    }
  }, []);

  const startDarkWebScan = async () => {
    if (!user) {
      toast.error('Authentication Required', { description: 'Please login to scan the dark web' });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Perform actual dark web scan
      const results = await darkWebService.scanDarkWeb(user.email);
      const riskAnalysis = darkWebService.analyzeEmailRisk(user.email);
      
      setBreaches(results);
      setEmailRisk(riskAnalysis);
      setLastScan(new Date());
      setScanProgress(100);
      
      // Save results
      localStorage.setItem('darkweb_scan_results', JSON.stringify(results));
      localStorage.setItem('darkweb_last_scan', new Date().toISOString());
      
      if (results.length > 0) {
        toast.warning(`${results.length} Breach${results.length > 1 ? 'es' : ''} Found!`, {
          description: 'Your data was found in data breaches',
        });
      } else {
        toast.success('No Breaches Found', {
          description: 'Your email was not found in any known data breaches',
        });
      }
    } catch (error) {
      toast.error('Scan Failed', { description: 'Unable to complete dark web scan' });
    } finally {
      setIsScanning(false);
      clearInterval(interval);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isPremium) {
    return (
      <div className="rounded-xl border p-6">
        <div className="text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-xl mb-2">Dark Web Monitoring</h3>
          <p className="text-gray-600 mb-4">Monitor the dark web for your personal information</p>
          <Badge variant="outline" className="mb-4">Premium Feature</Badge>
          <p className="text-sm text-gray-500 mb-6">
            Upgrade to Pro to scan for your email, passwords, and personal data on the dark web
          </p>
          <Button className="bg-cyberguard-primary hover:bg-cyberguard-primary/90">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-cyberguard-primary/10 flex items-center justify-center mr-3">
            <Eye className="w-5 h-5 text-cyberguard-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Dark Web Monitoring</h3>
            <p className="text-sm text-gray-500">Scan for breached credentials</p>
          </div>
        </div>
        <Badge className="bg-cyberguard-primary">Pro</Badge>
      </div>

      {isScanning ? (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium mb-2">Scanning Dark Web...</h4>
            <Progress value={scanProgress} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {scanProgress < 30 && 'Connecting to monitoring networks...'}
              {scanProgress >= 30 && scanProgress < 60 && 'Searching breach databases...'}
              {scanProgress >= 60 && scanProgress < 90 && 'Analyzing data patterns...'}
              {scanProgress >= 90 && 'Finalizing results...'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {lastScan && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm">Last scan: {lastScan.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  {breaches.length > 0 ? (
                    <Badge variant="destructive">{breaches.length} Breach{breaches.length > 1 ? 'es' : ''}</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Clean</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {emailRisk && (
            <Alert className={`mb-4 ${getSeverityColor(emailRisk.riskLevel)}`}>
              <Shield className="w-4 h-4" />
              <AlertTitle>Email Risk Assessment: {emailRisk.riskLevel.toUpperCase()}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm mt-2">
                  {emailRisk.reasons.map((reason: string, index: number) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {breaches.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Found Data Breaches ({breaches.length})</h4>
              <div className="space-y-3">
                {breaches.map((breach) => (
                  <Alert key={breach.id} className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertTitle className="text-red-800">{breach.source} Breach</AlertTitle>
                    <AlertDescription>
                      <div className="text-sm text-red-700">
                        <p className="mb-2">Date: {breach.dateLeaked.toLocaleDateString()}</p>
                        <p className="mb-2">Data exposed: {breach.dataExposed.join(', ')}</p>
                        <Badge className={getSeverityColor(breach.severity)}>
                          {breach.severity.toUpperCase()} Risk
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={startDarkWebScan}
              className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
              disabled={!user}
            >
              <Globe className="w-4 h-4 mr-2" />
              {lastScan ? 'Rescan Dark Web' : 'Start Dark Web Scan'}
            </Button>
            {breaches.length > 0 && (
              <Button variant="outline">
                View Breach Details
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

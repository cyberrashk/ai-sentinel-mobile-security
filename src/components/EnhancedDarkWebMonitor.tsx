
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import * as darkWebService from '@/services/darkWebService';
import * as authService from '@/services/authService';
import DarkWebDataScan from '@/components/DarkWebDataScan';
import DarkWebImageDetection from '@/components/DarkWebImageDetection';
import DarkWebUrlScanner from '@/components/DarkWebUrlScanner';
import DarkWebResults from '@/components/DarkWebResults';

export default function EnhancedDarkWebMonitor() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [breaches, setBreaches] = useState<darkWebService.LeakedCredential[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<darkWebService.RiskAnalysis | null>(null);
  const [urlToCheck, setUrlToCheck] = useState('');
  const [urlScanResult, setUrlScanResult] = useState<any>(null);
  const [isUrlScanning, setIsUrlScanning] = useState(false);
  const [detectedImages, setDetectedImages] = useState([
    {
      id: '1',
      type: 'profile',
      source: 'Social Media Breach',
      risk: 'medium',
      description: 'Profile image found in leaked database'
    },
    {
      id: '2',
      type: 'document',
      source: 'Dark Web Marketplace',
      risk: 'high',
      description: 'Personal document scan detected'
    }
  ]);
  
  const user = authService.getCurrentUser();
  const isPremium = authService.isPremiumUser();

  useEffect(() => {
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
      toast.error('Authentication Required', { 
        description: 'Please login to scan the dark web' 
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

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
      const results = await darkWebService.scanDarkWeb(user.email);
      const riskAnalysisResult = await darkWebService.performRiskAnalysis(user.email);
      
      setBreaches(results);
      setRiskAnalysis(riskAnalysisResult);
      setLastScan(new Date());
      setScanProgress(100);
      
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
      console.error('Dark web scan failed:', error);
      toast.error('Scan Failed', { 
        description: 'Unable to complete dark web scan. Please try again.' 
      });
    } finally {
      setIsScanning(false);
      clearInterval(interval);
    }
  };

  const scanUrl = async () => {
    if (!urlToCheck.trim()) {
      toast.error('Please enter a URL to scan');
      return;
    }

    setIsUrlScanning(true);
    
    // Simulate URL scanning
    setTimeout(() => {
      const isMalicious = Math.random() > 0.7;
      const result = {
        url: urlToCheck,
        safe: !isMalicious,
        threats: isMalicious ? ['Malware', 'Phishing', 'Payload'] : [],
        reputation: isMalicious ? 'Poor' : 'Good',
        lastScan: new Date()
      };
      
      setUrlScanResult(result);
      setIsUrlScanning(false);
      
      if (isMalicious) {
        toast.error('Malicious URL Detected!', {
          description: 'This URL contains threats and should be avoided'
        });
      } else {
        toast.success('URL is Safe', {
          description: 'No threats detected in this URL'
        });
      }
    }, 2000);
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
          <h3 className="font-semibold text-xl mb-2">Advanced Dark Web Monitoring</h3>
          <p className="text-gray-600 mb-4">Deep scan for personal data, images, and malicious URLs</p>
          <Badge variant="outline" className="mb-4">Premium Feature</Badge>
          <p className="text-sm text-gray-500 mb-6">
            Upgrade to Pro for comprehensive dark web monitoring, image detection, and URL threat analysis
          </p>
          <Button 
            className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
            onClick={() => {
              authService.upgradeToPremium();
              window.location.reload();
            }}
          >
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
            <h3 className="font-semibold text-lg">Advanced Dark Web Monitoring</h3>
            <p className="text-sm text-gray-500">Deep scan for breaches, images & malicious URLs</p>
          </div>
        </div>
        <Badge className="bg-cyberguard-primary">Pro</Badge>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scan">Data Scan</TabsTrigger>
          <TabsTrigger value="images">Image Detection</TabsTrigger>
          <TabsTrigger value="urls">URL Scanner</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="mt-4">
          <DarkWebDataScan
            isScanning={isScanning}
            scanProgress={scanProgress}
            lastScan={lastScan}
            breaches={breaches}
            onStartScan={startDarkWebScan}
          />
        </TabsContent>
        
        <TabsContent value="images" className="mt-4">
          <DarkWebImageDetection
            detectedImages={detectedImages}
            getSeverityColor={getSeverityColor}
          />
        </TabsContent>
        
        <TabsContent value="urls" className="mt-4">
          <DarkWebUrlScanner
            urlToCheck={urlToCheck}
            setUrlToCheck={setUrlToCheck}
            urlScanResult={urlScanResult}
            isUrlScanning={isUrlScanning}
            onScanUrl={scanUrl}
          />
        </TabsContent>
        
        <TabsContent value="results" className="mt-4">
          <DarkWebResults
            riskAnalysis={riskAnalysis}
            breaches={breaches}
            getSeverityColor={getSeverityColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

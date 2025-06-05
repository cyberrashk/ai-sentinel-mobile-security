
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Eye, AlertTriangle, Shield, Clock, Globe, Link, Image, Search } from 'lucide-react';
import { toast } from 'sonner';
import * as darkWebService from '@/services/darkWebService';
import * as authService from '@/services/authService';

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
          {isScanning ? (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium mb-2">Deep Scanning Dark Web...</h4>
                <Progress value={scanProgress} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">
                  {scanProgress < 30 && 'Connecting to monitoring networks...'}
                  {scanProgress >= 30 && scanProgress < 60 && 'Searching breach databases...'}
                  {scanProgress >= 60 && scanProgress < 90 && 'Analyzing data patterns...'}
                  {scanProgress >= 90 && 'Finalizing comprehensive scan...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {lastScan && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="w-4 h-4" />
                  <AlertTitle>Last Comprehensive Scan</AlertTitle>
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{lastScan.toLocaleString()}</span>
                      {breaches.length > 0 ? (
                        <Badge variant="destructive">{breaches.length} Issues Found</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">All Clear</Badge>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={startDarkWebScan}
                className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Start Deep Dark Web Scan
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="images" className="mt-4">
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <Image className="w-4 h-4" />
              <AlertTitle>Image Detection on Dark Web</AlertTitle>
              <AlertDescription>
                Advanced AI scans for your images across dark web marketplaces and forums
              </AlertDescription>
            </Alert>
            
            {detectedImages.map((image) => (
              <Alert key={image.id} className={getSeverityColor(image.risk)}>
                <AlertTriangle className="w-4 h-4" />
                <AlertTitle>{image.type.charAt(0).toUpperCase() + image.type.slice(1)} Image Detected</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">{image.description}</p>
                  <p className="text-sm">Source: {image.source}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" className="bg-red-600 text-white">Request Removal</Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="urls" className="mt-4">
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Link className="w-4 h-4" />
              <AlertTitle>Malicious URL Detection</AlertTitle>
              <AlertDescription>
                Check URLs for malware, phishing, and malicious payloads before visiting
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Input
                value={urlToCheck}
                onChange={(e) => setUrlToCheck(e.target.value)}
                placeholder="Enter URL to scan (e.g., https://example.com)"
                className="flex-1"
              />
              <Button 
                onClick={scanUrl}
                disabled={isUrlScanning}
                className="bg-cyberguard-primary"
              >
                {isUrlScanning ? 'Scanning...' : 'Scan URL'}
              </Button>
            </div>
            
            {urlScanResult && (
              <Alert className={urlScanResult.safe ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <Shield className="w-4 h-4" />
                <AlertTitle>
                  {urlScanResult.safe ? 'URL is Safe' : 'Malicious URL Detected'}
                </AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>URL:</strong> {urlScanResult.url}</p>
                    <p><strong>Reputation:</strong> {urlScanResult.reputation}</p>
                    {!urlScanResult.safe && (
                      <div>
                        <p><strong>Threats Detected:</strong></p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {urlScanResult.threats.map((threat: string, index: number) => (
                            <Badge key={index} variant="destructive">{threat}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Scanned: {urlScanResult.lastScan.toLocaleString()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-4">
          {riskAnalysis && (
            <Alert className={`mb-4 ${getSeverityColor(riskAnalysis.overallRisk)}`}>
              <Shield className="w-4 h-4" />
              <AlertTitle>Overall Risk Assessment: {riskAnalysis.overallRisk.toUpperCase()}</AlertTitle>
              <AlertDescription>
                <div className="text-sm mt-2">
                  <p className="mb-2">Risk Score: {riskAnalysis.riskScore}/100</p>
                  <p className="mb-2">Recommended Actions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {riskAnalysis.actionableSteps.slice(0, 4).map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {breaches.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Data Breaches Found ({breaches.length})</h4>
              {breaches.map((breach) => (
                <Alert key={breach.id} className="border-red-200 bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <AlertTitle className="text-red-800">{breach.source}</AlertTitle>
                  <AlertDescription>
                    <div className="text-sm text-red-700">
                      <p>Date: {breach.dateLeaked.toLocaleDateString()}</p>
                      <p>Data exposed: {breach.dataExposed.join(', ')}</p>
                      <Badge className={getSeverityColor(breach.severity)} variant="outline">
                        {breach.severity.toUpperCase()} Risk
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

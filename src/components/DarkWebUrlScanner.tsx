
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Link, Shield } from 'lucide-react';

interface UrlScanResult {
  url: string;
  safe: boolean;
  threats: string[];
  reputation: string;
  lastScan: Date;
}

interface DarkWebUrlScannerProps {
  urlToCheck: string;
  setUrlToCheck: (url: string) => void;
  urlScanResult: UrlScanResult | null;
  isUrlScanning: boolean;
  onScanUrl: () => void;
}

const DarkWebUrlScanner: React.FC<DarkWebUrlScannerProps> = ({
  urlToCheck,
  setUrlToCheck,
  urlScanResult,
  isUrlScanning,
  onScanUrl
}) => {
  return (
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
          onClick={onScanUrl}
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
  );
};

export default DarkWebUrlScanner;

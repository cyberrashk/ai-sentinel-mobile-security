
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Clock, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DarkWebDataScanProps {
  isScanning: boolean;
  scanProgress: number;
  lastScan: Date | null;
  breaches: any[];
  onStartScan: () => void;
}

const DarkWebDataScan: React.FC<DarkWebDataScanProps> = ({
  isScanning,
  scanProgress,
  lastScan,
  breaches,
  onStartScan
}) => {
  if (isScanning) {
    return (
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
    );
  }

  return (
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
        onClick={onStartScan}
        className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
        size="lg"
      >
        <Search className="w-4 h-4 mr-2" />
        Start Deep Dark Web Scan
      </Button>
    </div>
  );
};

export default DarkWebDataScan;

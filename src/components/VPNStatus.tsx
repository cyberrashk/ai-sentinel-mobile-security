
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Globe, 
  Zap, 
  MapPin, 
  Clock, 
  Download, 
  Upload,
  Monitor,
  Smartphone,
  Wifi
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import * as vpnService from '@/services/vpnService';
import { toast } from 'sonner';

export default function VPNStatus() {
  const [vpnStatus, setVpnStatus] = useState(vpnService.getVpnStatus());
  const [selectedServer, setSelectedServer] = useState('auto');
  const [availableServers] = useState(vpnService.getAvailableServers());

  useEffect(() => {
    // Update VPN status every second when connected
    let interval: number | null = null;
    
    if (vpnStatus.connected) {
      interval = window.setInterval(() => {
        setVpnStatus(vpnService.getVpnStatus());
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [vpnStatus.connected]);

  const handleConnect = async () => {
    try {
      const newStatus = await vpnService.connectVpn(selectedServer);
      setVpnStatus(newStatus);
      toast.success('VPN Connected Successfully', {
        description: `Connected to ${newStatus.server?.name}`
      });
    } catch (error) {
      toast.error('VPN Connection Failed', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const newStatus = await vpnService.disconnectVpn();
      setVpnStatus(newStatus);
      toast.success('VPN Disconnected Successfully');
    } catch (error) {
      toast.error('VPN Disconnection Failed');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getConnectionTime = () => {
    if (!vpnStatus.startTime) return '00:00:00';
    const now = new Date();
    const diff = now.getTime() - vpnStatus.startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Alert className={vpnStatus.connected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}>
        <Shield className={`w-4 h-4 ${vpnStatus.connected ? 'text-green-600' : 'text-gray-400'}`} />
        <AlertTitle className="flex items-center justify-between">
          <span>Smart VPN Protection</span>
          <Badge variant={vpnStatus.connected ? 'default' : 'secondary'} className={vpnStatus.connected ? 'bg-green-600' : ''}>
            {vpnStatus.connecting ? 'Connecting...' : vpnStatus.connected ? 'Protected' : 'Disconnected'}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          {vpnStatus.connecting && 'Establishing secure connection...'}
          {vpnStatus.connected && vpnStatus.server && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Server</p>
                  <p className="font-medium">{vpnStatus.server.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">IP Address</p>
                  <p className="font-medium">{vpnStatus.ipAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Connected</p>
                  <p className="font-medium">{getConnectionTime()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Ping</p>
                  <p className="font-medium">{vpnStatus.server.ping}</p>
                </div>
              </div>
            </div>
          )}
          {!vpnStatus.connected && !vpnStatus.connecting && (
            <p className="text-gray-600 mt-2">Your internet traffic is not protected. Connect to secure your browsing.</p>
          )}
        </AlertDescription>
      </Alert>

      {/* Data Usage (when connected) */}
      {vpnStatus.connected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Downloaded</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{formatBytes(vpnStatus.dataUsage.received)}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Uploaded</span>
            </div>
            <p className="text-lg font-bold text-green-600">{formatBytes(vpnStatus.dataUsage.sent)}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Total Usage</span>
            </div>
            <p className="text-lg font-bold text-purple-600">
              {formatBytes(vpnStatus.dataUsage.sent + vpnStatus.dataUsage.received)}
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Quick Connect</TabsTrigger>
          <TabsTrigger value="servers">Server Selection</TabsTrigger>
          <TabsTrigger value="devices">Protected Devices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick" className="space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-3">AI-Optimized Connection</h4>
            <p className="text-sm text-gray-600 mb-4">
              Let our AI choose the best server for optimal speed and security
            </p>
            <div className="flex gap-3">
              {!vpnStatus.connected ? (
                <Button 
                  onClick={handleConnect}
                  disabled={vpnStatus.connecting}
                  className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {vpnStatus.connecting ? 'Connecting...' : 'Connect VPN'}
                </Button>
              ) : (
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Disconnect VPN
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="servers" className="space-y-4">
          <div className="grid gap-3">
            {availableServers.map((server) => (
              <div key={server.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{server.name}</p>
                    <p className="text-sm text-gray-500">Ping: {server.ping}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {server.premium && <Badge variant="outline">Pro</Badge>}
                  <Button 
                    size="sm"
                    variant={selectedServer === server.id ? 'default' : 'outline'}
                    onClick={() => setSelectedServer(server.id)}
                    disabled={!vpnService.isServerAvailable(server)}
                  >
                    {selectedServer === server.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Windows PC</p>
                  <p className="text-sm text-gray-500">This device</p>
                </div>
              </div>
              <Badge variant={vpnStatus.connected ? 'default' : 'secondary'} className={vpnStatus.connected ? 'bg-green-600' : ''}>
                {vpnStatus.connected ? 'Protected' : 'Unprotected'}
              </Badge>
            </div>
            <div className="p-3 bg-white rounded-lg border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">iPhone 15</p>
                  <p className="text-sm text-gray-500">Connected via mobile app</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">Protected</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Shield, Globe, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import * as vpnService from '@/services/vpnService';
import * as authService from '@/services/authService';

interface VPNStatusProps {
  className?: string;
}

export default function VPNStatus({ className }: VPNStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState('auto');
  const [availableServers, setAvailableServers] = useState<vpnService.VpnServer[]>([]);
  const [currentServer, setCurrentServer] = useState<vpnService.VpnServer | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [dataUsage, setDataUsage] = useState({ sent: 0, received: 0 });
  const isPremium = authService.isPremiumUser();
  
  useEffect(() => {
    // Get available servers based on user subscription
    const servers = vpnService.getAvailableServers();
    setAvailableServers(servers);
    
    // Check if there's already an active connection
    const status = vpnService.getVpnStatus();
    if (status.connected && status.server) {
      setIsConnected(true);
      setCurrentServer(status.server);
      setSelectedServer(status.server.id);
      setIpAddress(status.ipAddress);
      setDataUsage(status.dataUsage);
      
      // Start updating data usage
      const interval = setInterval(() => {
        const updatedStatus = vpnService.getVpnStatus();
        setDataUsage(updatedStatus.dataUsage);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleConnect = async () => {
    if (isConnected) {
      try {
        await vpnService.disconnectVpn();
        setIsConnected(false);
        setCurrentServer(null);
        setIpAddress(null);
        
        toast.success('VPN Disconnected', {
          description: 'Your connection is no longer secured by CyberGuard VPN',
        });
      } catch (error) {
        toast.error('Disconnect Failed', {
          description: 'Unable to disconnect from VPN',
        });
      }
    } else {
      setConnecting(true);
      
      try {
        const status = await vpnService.connectVpn(selectedServer);
        setIsConnected(true);
        setCurrentServer(status.server);
        setIpAddress(status.ipAddress);
        
        toast.success('VPN Connected', {
          description: `Your connection is now secured through ${status.server?.name}`,
        });
        
        // Start updating data usage
        const interval = setInterval(() => {
          const updatedStatus = vpnService.getVpnStatus();
          setDataUsage(updatedStatus.dataUsage);
        }, 1000);
        
        return () => clearInterval(interval);
      } catch (error) {
        toast.error('Connection Failed', {
          description: error instanceof Error ? error.message : 'Unable to connect to VPN',
        });
      } finally {
        setConnecting(false);
      }
    }
  };

  const handleServerChange = async (serverId: string) => {
    const server = availableServers.find(s => s.id === serverId);
    if (!server) return;
    
    // Check if server is premium and user is not premium
    if (server.premium && !isPremium) {
      toast.error('Premium Server', {
        description: 'This server is only available with a premium subscription',
      });
      return;
    }
    
    setSelectedServer(serverId);
    
    if (isConnected) {
      setConnecting(true);
      
      try {
        // Disconnect from current server
        await vpnService.disconnectVpn();
        
        // Connect to new server
        const status = await vpnService.connectVpn(serverId);
        setCurrentServer(status.server);
        setIpAddress(status.ipAddress);
        
        toast.success('VPN Server Changed', {
          description: `Connected to ${status.server?.name}`,
        });
      } catch (error) {
        toast.error('Server Change Failed', {
          description: error instanceof Error ? error.message : 'Unable to change VPN server',
        });
        
        // Try to reconnect to previous server
        if (currentServer) {
          try {
            await vpnService.connectVpn(currentServer.id);
          } catch {
            // If reconnection fails, mark as disconnected
            setIsConnected(false);
            setCurrentServer(null);
            setIpAddress(null);
          }
        }
      } finally {
        setConnecting(false);
      }
    }
  };

  // Format data usage
  const formatDataUsage = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`rounded-xl border p-5 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isConnected ? 'bg-cyberguard-primary/10' : 'bg-gray-100'}`}>
            <Shield className={`w-5 h-5 ${isConnected ? 'text-cyberguard-primary' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium text-lg">CyberGuard VPN</h3>
            <p className="text-sm text-gray-500">Free Unlimited Protection</p>
          </div>
        </div>
        <Switch checked={isConnected} onCheckedChange={handleConnect} disabled={connecting} />
      </div>

      <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Status</span>
          <span className={`text-sm font-medium ${isConnected ? 'text-cyberguard-success' : 'text-gray-500'}`}>
            {connecting ? 'Connecting...' : isConnected ? 'Protected' : 'Not Protected'}
          </span>
        </div>
        {isConnected && !connecting && (
          <>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">IP Address</span>
              <span className="text-sm">{ipAddress}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Data Usage</span>
              <span className="text-sm">
                ↑ {formatDataUsage(dataUsage.sent)} • ↓ {formatDataUsage(dataUsage.received)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Server Location (Free)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableServers.filter(server => !server.premium).map((server) => (
            <div 
              key={server.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedServer === server.id 
                  ? 'border-cyberguard-primary bg-cyberguard-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServerChange(server.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{server.name}</span>
                </div>
                <span className="text-xs text-gray-500">{server.ping}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show premium servers if premium user */}
      {isPremium && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Premium Servers</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableServers.filter(server => server.premium).map((server) => (
              <div 
                key={server.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedServer === server.id 
                    ? 'border-cyberguard-primary bg-cyberguard-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServerChange(server.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{server.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{server.ping}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium upgrade banner (for free users) */}
      {!isPremium && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 mb-4">
          <div>
            <p className="text-sm font-medium">Premium VPN Features</p>
            <p className="text-xs text-gray-500">50+ Countries, No Speed Limits</p>
          </div>
          <Button variant="outline" size="sm" className="text-cyberguard-primary">
            Upgrade
          </Button>
        </div>
      )}

      <Button 
        className="w-full"
        variant={isConnected ? "outline" : "default"}
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : isConnected ? (
          <span className="flex items-center">
            <Lock className="mr-2 w-4 h-4" />
            Disconnect VPN
          </span>
        ) : (
          <span className="flex items-center">
            <Shield className="mr-2 w-4 h-4" />
            Connect VPN
          </span>
        )}
      </Button>
    </div>
  );
}

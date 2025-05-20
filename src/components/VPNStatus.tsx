
import React, { useState } from 'react';
import { Shield, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface VPNStatusProps {
  className?: string;
}

export default function VPNStatus({ className }: VPNStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState('auto');
  
  const servers = [
    { id: 'auto', name: 'Auto (AI Optimized)', ping: '45ms' },
    { id: 'us', name: 'United States', ping: '120ms' },
    { id: 'uk', name: 'United Kingdom', ping: '150ms' },
    { id: 'de', name: 'Germany', ping: '90ms' },
  ];

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      toast.success('VPN Disconnected', {
        description: 'Your connection is no longer secured by CyberGuard VPN',
      });
    } else {
      setConnecting(true);
      setTimeout(() => {
        setIsConnected(true);
        setConnecting(false);
        toast.success('VPN Connected', {
          description: `Your connection is now secured through ${servers.find(s => s.id === selectedServer)?.name}`,
        });
      }, 1500);
    }
  };

  const handleServerChange = (serverId: string) => {
    setSelectedServer(serverId);
    if (isConnected) {
      setConnecting(true);
      setTimeout(() => {
        setConnecting(false);
        toast.success('VPN Server Changed', {
          description: `Connected to ${servers.find(s => s.id === serverId)?.name}`,
        });
      }, 1000);
    }
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
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium">IP Address</span>
            <span className="text-sm">192.168.●●.●●</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Server Location (Free)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {servers.map((server) => (
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

      <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 mb-4">
        <div>
          <p className="text-sm font-medium">Premium VPN Features</p>
          <p className="text-xs text-gray-500">50+ Countries, No Speed Limits</p>
        </div>
        <Button variant="outline" size="sm" className="text-cyberguard-primary">
          Upgrade
        </Button>
      </div>

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

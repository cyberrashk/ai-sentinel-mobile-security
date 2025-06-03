
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Clock, AlertTriangle, Smartphone, Monitor } from 'lucide-react';
import * as authService from '@/services/authService';

interface FamilyDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'laptop' | 'desktop';
  user: string;
  status: 'online' | 'offline' | 'restricted';
  lastActivity: Date;
  threats: number;
  restrictions: string[];
}

export default function FamilyProtection() {
  const [devices] = useState<FamilyDevice[]>([
    {
      id: '1',
      name: 'Emma\'s iPhone',
      type: 'phone',
      user: 'Emma (12)',
      status: 'online',
      lastActivity: new Date(Date.now() - 1000 * 60 * 15),
      threats: 0,
      restrictions: ['Social Media', 'Gaming', 'Adult Content']
    },
    {
      id: '2',
      name: 'Kids iPad',
      type: 'tablet',
      user: 'Alex (9)',
      status: 'restricted',
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      threats: 2,
      restrictions: ['Adult Content', 'In-App Purchases', 'Inappropriate Apps']
    },
    {
      id: '3',
      name: 'Gaming Laptop',
      type: 'laptop',
      user: 'Jordan (16)',
      status: 'online',
      lastActivity: new Date(Date.now() - 1000 * 60 * 5),
      threats: 1,
      restrictions: ['Adult Content', 'Gambling Sites']
    }
  ]);

  const [recentActivities] = useState([
    {
      id: '1',
      device: 'Emma\'s iPhone',
      activity: 'Attempted to access blocked social media site',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      blocked: true,
      severity: 'medium'
    },
    {
      id: '2',
      device: 'Kids iPad',
      activity: 'Downloaded educational app "Math Explorer"',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      blocked: false,
      severity: 'low'
    },
    {
      id: '3',
      device: 'Gaming Laptop',
      activity: 'Malware detected and quarantined',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      blocked: true,
      severity: 'high'
    }
  ]);

  const isPremium = authService.isPremiumUser();

  const getDeviceIcon = (type: FamilyDevice['type']) => {
    switch (type) {
      case 'phone': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Smartphone className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: FamilyDevice['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isPremium) {
    return (
      <div className="rounded-xl border p-6">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-xl mb-2">Family Protection</h3>
          <p className="text-gray-600 mb-4">Keep your family safe online with comprehensive monitoring</p>
          <Badge variant="outline" className="mb-4">Premium Feature</Badge>
          <p className="text-sm text-gray-500 mb-6">
            Monitor and protect all family devices with parental controls, content filtering, and real-time alerts
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
          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mr-3">
            <Users className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Family Protection</h3>
            <p className="text-sm text-gray-500">Monitor and protect family devices</p>
          </div>
        </div>
        <Badge className="bg-cyberguard-primary">Pro</Badge>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="mt-4">
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-gray-500">{device.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                    {device.threats > 0 && (
                      <Badge variant="destructive">{device.threats} threat{device.threats > 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Last activity: {device.lastActivity.toLocaleString()}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Active Restrictions:</p>
                  <div className="flex flex-wrap gap-1">
                    {device.restrictions.map((restriction, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Manage Settings</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  {device.threats > 0 && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Address Threats
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-4">
          <div className="space-y-4">
            <h4 className="font-medium">Recent Family Activity</h4>
            {recentActivities.map((activity) => (
              <Alert key={activity.id} className={activity.blocked ? 'border-red-200 bg-red-50' : 'border-gray-200'}>
                {activity.severity === 'high' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                ) : (
                  <Shield className="w-4 h-4 text-blue-600" />
                )}
                <AlertTitle>{activity.device}</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">{activity.activity}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp.toLocaleString()}</span>
                    <Badge className={activity.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {activity.blocked ? 'Blocked' : 'Allowed'}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <div className="space-y-4">
            <h4 className="font-medium">Family Protection Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Content Filtering</h5>
                <p className="text-sm text-gray-600 mb-3">Block inappropriate websites and content</p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Time Limits</h5>
                <p className="text-sm text-gray-600 mb-3">Set daily usage limits for devices</p>
                <Button size="sm" variant="outline">Set Limits</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">App Restrictions</h5>
                <p className="text-sm text-gray-600 mb-3">Control which apps can be downloaded</p>
                <Button size="sm" variant="outline">Manage Apps</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Location Tracking</h5>
                <p className="text-sm text-gray-600 mb-3">Monitor device locations for safety</p>
                <Button size="sm" variant="outline">Enable</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

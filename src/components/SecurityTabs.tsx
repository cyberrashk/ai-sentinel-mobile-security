
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Bell, Settings } from 'lucide-react';
import VPNStatus from '@/components/VPNStatus';
import AntivirusStatus from '@/components/AntivirusStatus';
import Login from '@/components/Login';
import UserProfile from '@/components/UserProfile';
import MobileSecurity from '@/components/MobileSecurity';
import * as authService from '@/services/authService';

interface SecurityTabsProps {
  isLoggedIn: boolean;
  user: {name: string, email: string} | null;
  onLogin: (userData: {name: string, email: string}) => void;
  onLogout: () => void;
  showAlerts?: boolean;
}

const SecurityTabs: React.FC<SecurityTabsProps> = ({ 
  isLoggedIn, 
  user, 
  onLogin, 
  onLogout,
  showAlerts = false 
}) => {
  const [alerts] = useState([
    {
      id: '1',
      type: 'vpn',
      severity: 'medium',
      title: 'VPN Connection Issue',
      description: 'Your VPN connection was interrupted. Reconnecting...',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      type: 'antivirus',
      severity: 'high',
      title: 'Malware Detected',
      description: 'Suspicious file detected in Downloads folder',
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '3',
      type: 'mobile',
      severity: 'low',
      title: 'App Permission Request',
      description: 'New app requesting camera access',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]);

  // Check if user is already logged in from session
  useEffect(() => {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser && !isLoggedIn) {
      onLogin(sessionUser);
    }
  }, [isLoggedIn, onLogin]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };
  
  return (
    <section className="mb-8">
      {showAlerts && (
        <div className="mb-6 p-4 bg-white rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Security Alerts
            </h3>
            <Badge variant="destructive">{alerts.length}</Badge>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <AlertTriangle className="w-4 h-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-cyberguard-primary">
                        Resolve
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="vpn" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vpn">Smart VPN</TabsTrigger>
          <TabsTrigger value="antivirus">AI Antivirus</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vpn" className="mt-6">
          <VPNStatus />
        </TabsContent>
        
        <TabsContent value="antivirus" className="mt-6">
          <AntivirusStatus />
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-6">
          <MobileSecurity />
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          {isLoggedIn && user ? (
            <>
              <UserProfile user={user} onLogout={onLogout} />
              
              {/* Security Settings */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Security Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-2">Add an extra layer of security</p>
                    <Button size="sm" variant="outline">Enable 2FA</Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Security Notifications</h4>
                    <p className="text-sm text-gray-600 mb-2">Get alerts for suspicious activity</p>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Password Manager</h4>
                    <p className="text-sm text-gray-600 mb-2">Secure password storage</p>
                    <Button size="sm" variant="outline">Access Vault</Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Privacy Controls</h4>
                    <p className="text-sm text-gray-600 mb-2">Manage your data privacy</p>
                    <Button size="sm" variant="outline">Review Settings</Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyberguard-primary/5 rounded-lg border border-cyberguard-primary/20">
                <h3 className="font-medium mb-2">New Feature: AI Email Recovery</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our new AI-powered system can detect if your email has been compromised and 
                  automatically restore it. Protect your accounts today!
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-cyberguard-primary border-cyberguard-primary/50"
                  asChild
                >
                  <Link to="/recovery">
                    Check Recovery System 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <Login onLogin={onLogin} />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SecurityTabs;


import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Users, 
  CreditCard, 
  MessageSquare,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import * as authService from '@/services/authService';

interface SecurityAlert {
  id: string;
  type: 'threat' | 'scan' | 'breach' | 'family' | 'financial' | 'chat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  actionRequired: boolean;
  details?: any;
}

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isPremium = authService.isPremiumUser();

  useEffect(() => {
    // Initialize with some sample alerts
    const sampleAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'threat',
        severity: 'high',
        title: 'Malware Detected',
        description: 'Trojan.GenericKD.44758923 found in Downloads folder',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        resolved: false,
        actionRequired: true,
        details: { 
          path: 'C:\\Users\\User\\Downloads\\installer.exe', 
          quarantined: false,
          fileSize: '2.5 MB',
          threatType: 'Trojan',
          riskLevel: 'High',
          recommendedAction: 'Quarantine file immediately and run full system scan'
        }
      },
      {
        id: '2',
        type: 'breach',
        severity: 'critical',
        title: 'Data Breach Detected',
        description: 'Your email found in recent LinkedIn data breach',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        resolved: false,
        actionRequired: true,
        details: { 
          email: authService.getCurrentUser()?.email, 
          source: 'LinkedIn', 
          dataExposed: ['email', 'password', 'name'],
          breachDate: '2024-05-15',
          affectedAccounts: 150000000,
          recommendedAction: 'Change your password immediately and enable 2FA'
        }
      },
      {
        id: '3',
        type: 'scan',
        severity: 'low',
        title: 'Security Scan Complete',
        description: 'Full system scan completed - No threats found',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        resolved: true,
        actionRequired: false,
        details: { 
          itemsScanned: 15000, 
          duration: '5m 32s',
          threatsFound: 0,
          lastScan: new Date(Date.now() - 1000 * 60 * 60 * 24),
          scanType: 'Full System Scan'
        }
      }
    ];

    if (isPremium) {
      sampleAlerts.push(
        {
          id: '4',
          type: 'family',
          severity: 'medium',
          title: 'Family Device Alert',
          description: 'Suspicious website access detected on child device',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          resolved: false,
          actionRequired: true,
          details: { 
            device: 'iPad-Kids', 
            website: 'gambling-site.com', 
            blocked: true,
            user: 'Emma (Age 12)',
            attemptTime: new Date(Date.now() - 1000 * 60 * 45),
            category: 'Gambling',
            recommendedAction: 'Review family protection settings and discuss with child'
          }
        },
        {
          id: '5',
          type: 'financial',
          severity: 'high',
          title: 'Financial Account Monitor',
          description: 'Unusual login attempt on bank account detected',
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          resolved: false,
          actionRequired: true,
          details: { 
            bank: 'Chase Bank', 
            location: 'Unknown IP - Russia', 
            blocked: true,
            attemptTime: new Date(Date.now() - 1000 * 60 * 90),
            ipAddress: '185.220.101.42',
            deviceInfo: 'Unknown Windows Device',
            recommendedAction: 'Contact your bank immediately and change account credentials'
          }
        },
        {
          id: '6',
          type: 'chat',
          severity: 'medium',
          title: 'Encrypted Communication',
          description: 'New encrypted chat session established',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          resolved: true,
          actionRequired: false,
          details: { 
            contact: 'john.doe@company.com', 
            encryption: 'AES-256',
            sessionId: 'sess_abc123',
            duration: '45 minutes',
            messagesExchanged: 23,
            securityLevel: 'High'
          }
        }
      );
    }

    setAlerts(sampleAlerts);
  }, [isPremium]);

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'threat': return <Shield className="w-5 h-5" />;
      case 'scan': return <CheckCircle className="w-5 h-5" />;
      case 'breach': return <AlertTriangle className="w-5 h-5" />;
      case 'family': return <Users className="w-5 h-5" />;
      case 'financial': return <CreditCard className="w-5 h-5" />;
      case 'chat': return <MessageSquare className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, actionRequired: false } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const viewDetails = (alert: SecurityAlert) => {
    setSelectedAlert(alert);
    setIsDetailsOpen(true);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unresolved') return !alert.resolved;
    if (activeTab === 'action') return alert.actionRequired;
    return alert.type === activeTab;
  });

  const unresolvedCount = alerts.filter(alert => !alert.resolved).length;
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired).length;

  return (
    <>
      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-xl">Security Alert Center</h3>
            <p className="text-sm text-gray-500">Monitor all security events and threats</p>
          </div>
          <div className="flex gap-2">
            {unresolvedCount > 0 && (
              <Badge variant="destructive">{unresolvedCount} Unresolved</Badge>
            )}
            {actionRequiredCount > 0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {actionRequiredCount} Action Required
              </Badge>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
            <TabsTrigger value="action">Action</TabsTrigger>
            <TabsTrigger value="threat">Threats</TabsTrigger>
            <TabsTrigger value="breach">Breaches</TabsTrigger>
            <TabsTrigger value="scan">Scans</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No alerts found</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <Alert key={alert.id} className={cn("relative", getSeverityColor(alert.severity))}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getTypeIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <AlertTitle className="flex items-center gap-2">
                            {alert.title}
                            <Badge variant={alert.resolved ? "secondary" : "destructive"} className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.actionRequired && !alert.resolved && (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                                Action Required
                              </Badge>
                            )}
                          </AlertTitle>
                          <AlertDescription className="mt-1">
                            {alert.description}
                          </AlertDescription>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp.toLocaleString()}
                            </span>
                            {alert.details && (
                              <span>
                                {alert.type === 'threat' && `Path: ${alert.details.path}`}
                                {alert.type === 'breach' && `Source: ${alert.details.source}`}
                                {alert.type === 'scan' && `${alert.details.itemsScanned} items scanned`}
                                {alert.type === 'family' && `Device: ${alert.details.device}`}
                                {alert.type === 'financial' && `Bank: ${alert.details.bank}`}
                                {alert.type === 'chat' && `Contact: ${alert.details.contact}`}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => viewDetails(alert)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {alert.actionRequired && !alert.resolved && (
                              <Button 
                                size="sm" 
                                onClick={() => resolveAlert(alert.id)}
                                className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Alert>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {!isPremium && (
          <div className="mt-6 p-4 bg-gradient-to-r from-cyberguard-primary/10 to-cyberguard-secondary/10 rounded-lg border border-cyberguard-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-cyberguard-primary">Upgrade to Pro</h4>
                <p className="text-sm text-gray-600">Get advanced alerts for family protection, financial monitoring, and encrypted communications</p>
              </div>
              <Button className="bg-cyberguard-primary hover:bg-cyberguard-primary/90">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Alert Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && getTypeIcon(selectedAlert.type)}
              Alert Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this security alert
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Alert Type</label>
                  <p className="capitalize">{selectedAlert.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Severity</label>
                  <Badge variant={selectedAlert.resolved ? "secondary" : "destructive"} className="ml-0">
                    {selectedAlert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p>{selectedAlert.resolved ? 'Resolved' : 'Active'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Timestamp</label>
                  <p>{selectedAlert.timestamp.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p>{selectedAlert.description}</p>
              </div>
              
              {selectedAlert.details && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Additional Details</label>
                  <div className="bg-gray-50 p-3 rounded-lg mt-2">
                    {Object.entries(selectedAlert.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedAlert.details?.recommendedAction && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Recommended Action</label>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-2">
                    <p className="text-blue-800">{selectedAlert.details.recommendedAction}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                {selectedAlert.actionRequired && !selectedAlert.resolved && (
                  <Button 
                    onClick={() => {
                      resolveAlert(selectedAlert.id);
                      setIsDetailsOpen(false);
                    }}
                    className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve Alert
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

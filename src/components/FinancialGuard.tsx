
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Shield, AlertTriangle, TrendingUp, DollarSign, Lock } from 'lucide-react';
import * as authService from '@/services/authService';

interface FinancialAccount {
  id: string;
  type: 'bank' | 'credit' | 'investment' | 'crypto';
  name: string;
  lastFour: string;
  status: 'secure' | 'suspicious' | 'compromised';
  lastTransaction: Date;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: number;
}

interface FinancialAlert {
  id: string;
  accountId: string;
  type: 'unusual_activity' | 'large_transaction' | 'location_mismatch' | 'new_device';
  title: string;
  description: string;
  amount?: number;
  location?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

export default function FinancialGuard() {
  const [accounts] = useState<FinancialAccount[]>([
    {
      id: '1',
      type: 'bank',
      name: 'Chase Checking',
      lastFour: '4521',
      status: 'secure',
      lastTransaction: new Date(Date.now() - 1000 * 60 * 30),
      riskLevel: 'low',
      alerts: 0
    },
    {
      id: '2',
      type: 'credit',
      name: 'Capital One Credit Card',
      lastFour: '8832',
      status: 'suspicious',
      lastTransaction: new Date(Date.now() - 1000 * 60 * 60 * 2),
      riskLevel: 'medium',
      alerts: 2
    },
    {
      id: '3',
      type: 'investment',
      name: 'Fidelity Investment Account',
      lastFour: '1234',
      status: 'secure',
      lastTransaction: new Date(Date.now() - 1000 * 60 * 60 * 24),
      riskLevel: 'low',
      alerts: 0
    }
  ]);

  const [alerts] = useState<FinancialAlert[]>([
    {
      id: '1',
      accountId: '2',
      type: 'unusual_activity',
      title: 'Unusual Purchase Pattern',
      description: 'Multiple high-value transactions detected in short timeframe',
      amount: 2500,
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      severity: 'high',
      resolved: false
    },
    {
      id: '2',
      accountId: '2',
      type: 'location_mismatch',
      title: 'Transaction from Unusual Location',
      description: 'Credit card used in Russia while you are in United States',
      amount: 150,
      location: 'Moscow, Russia',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      severity: 'high',
      resolved: false
    },
    {
      id: '3',
      accountId: '1',
      type: 'large_transaction',
      title: 'Large Transaction Alert',
      description: 'Transaction above your normal spending pattern',
      amount: 1200,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      severity: 'medium',
      resolved: true
    }
  ]);

  const isPremium = authService.isPremiumUser();

  const getAccountIcon = (type: FinancialAccount['type']) => {
    switch (type) {
      case 'bank': return <CreditCard className="w-5 h-5" />;
      case 'credit': return <CreditCard className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      case 'crypto': return <DollarSign className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: FinancialAccount['status']) => {
    switch (status) {
      case 'secure': return 'bg-green-100 text-green-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'compromised': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: FinancialAccount['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isPremium) {
    return (
      <div className="rounded-xl border p-6">
        <div className="text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-xl mb-2">Financial Guard</h3>
          <p className="text-gray-600 mb-4">Protect your financial accounts from fraud and theft</p>
          <Badge variant="outline" className="mb-4">Premium Feature</Badge>
          <p className="text-sm text-gray-500 mb-6">
            Monitor bank accounts, credit cards, and investments for suspicious activity and unauthorized access
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
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Financial Guard</h3>
            <p className="text-sm text-gray-500">Monitor financial accounts for threats</p>
          </div>
        </div>
        <Badge className="bg-cyberguard-primary">Pro</Badge>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="mt-4">
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-sm text-gray-500">****{account.lastFour}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                    {account.alerts > 0 && (
                      <Badge variant="destructive">{account.alerts} alert{account.alerts > 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Risk Level: </span>
                    <span className={`font-medium ${getRiskColor(account.riskLevel)}`}>
                      {account.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Activity: </span>
                    <span>{account.lastTransaction.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Transactions</Button>
                  <Button size="sm" variant="outline">Security Settings</Button>
                  {account.alerts > 0 && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Review Alerts
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">Add more accounts to monitor</p>
              <Button size="sm" variant="outline">Connect Account</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Financial Security Alerts</h4>
              <Badge variant="destructive">
                {alerts.filter(a => !a.resolved).length} Active
              </Badge>
            </div>
            
            {alerts.map((alert) => (
              <Alert key={alert.id} className={alert.resolved ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}>
                <AlertTriangle className={`w-4 h-4 ${alert.resolved ? 'text-gray-600' : 'text-red-600'}`} />
                <AlertTitle className={alert.resolved ? 'text-gray-800' : 'text-red-800'}>
                  {alert.title}
                  {alert.amount && (
                    <span className="ml-2 font-normal">- ${alert.amount.toLocaleString()}</span>
                  )}
                </AlertTitle>
                <AlertDescription>
                  <p className={`mb-2 ${alert.resolved ? 'text-gray-600' : 'text-red-700'}`}>
                    {alert.description}
                  </p>
                  {alert.location && (
                    <p className="text-sm mb-2">Location: {alert.location}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span>{alert.timestamp.toLocaleString()}</span>
                    <Badge className={alert.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    {alert.resolved && (
                      <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                    )}
                  </div>
                  {!alert.resolved && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Mark Fraudulent
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark Legitimate
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="protection" className="mt-4">
          <div className="space-y-4">
            <h4 className="font-medium">Financial Protection Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <h5 className="font-medium">Transaction Monitoring</h5>
                </div>
                <p className="text-sm text-gray-600 mb-3">Real-time monitoring of all transactions</p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h5 className="font-medium">Fraud Detection</h5>
                </div>
                <p className="text-sm text-gray-600 mb-3">AI-powered fraud pattern recognition</p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Lock className="w-5 h-5 text-blue-600 mr-2" />
                  <h5 className="font-medium">Account Freeze</h5>
                </div>
                <p className="text-sm text-gray-600 mb-3">Instantly freeze accounts if compromised</p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                  <h5 className="font-medium">Identity Protection</h5>
                </div>
                <p className="text-sm text-gray-600 mb-3">$100K identity theft insurance</p>
                <Badge className="bg-green-100 text-green-800">Included</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Eye, Shield } from 'lucide-react';

const RecoveryFeatures = () => {
  const features = [
    {
      id: 1,
      title: 'AI-Powered Compromise Detection',
      icon: <Eye className="h-8 w-8 text-cyberguard-primary" />,
      description: 'Our AI monitors login behavior and scans for leaked credentials.',
      details: [
        {
          subtitle: 'Anomaly Detection',
          text: 'AI monitors login locations, devices, and times. Flags suspicious activity using LSTM neural networks to predict breach likelihood.'
        },
        {
          subtitle: 'Dark Web Scanning',
          text: 'Continuously checks if user credentials appear in leaked databases via Have I Been Pwned API and other dark web sources.'
        }
      ]
    },
    {
      id: 2,
      title: 'Instant Recovery Workflow',
      icon: <RefreshCw className="h-8 w-8 text-cyberguard-primary" />,
      description: 'Automated system to verify, secure, and recover compromised accounts.',
      details: [
        {
          subtitle: 'Automated Forensics',
          text: 'AI checks for unauthorized email forwarding rules, strange sent emails with phishing links, and password changes from unknown IPs.'
        },
        {
          subtitle: 'One-Click Recovery',
          text: 'Revokes suspicious sessions, forces 2FA reset if disabled, and restores deleted emails from backups when available.'
        }
      ]
    },
    {
      id: 3,
      title: 'Post-Recovery Protection',
      icon: <Shield className="h-8 w-8 text-cyberguard-primary" />,
      description: 'Enhanced security measures to prevent future compromises.',
      details: [
        {
          subtitle: 'AI Recommendations',
          text: 'Enable YubiKey / Passkeys for passwordless login, set up backup email/phone verification methods, and secure account recovery options.'
        },
        {
          subtitle: 'Continuous Monitoring',
          text: 'Ongoing protection with real-time alerts for suspicious activities and periodic security assessments.'
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map(feature => (
        <Card key={feature.id} className="p-6">
          <div className="mb-4">
            <div className="h-12 w-12 rounded-full bg-cyberguard-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
          </div>
          
          <div className="space-y-4">
            {feature.details.map((detail, i) => (
              <div key={i}>
                <h4 className="font-medium text-sm text-cyberguard-primary mb-1">{detail.subtitle}</h4>
                <p className="text-sm text-gray-600">{detail.text}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecoveryFeatures;

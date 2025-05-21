
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, RefreshCw, Lock, Check } from 'lucide-react';

const RecoveryStepFlow = () => {
  const steps = [
    {
      id: 1,
      title: 'AI Confirms the Hack',
      icon: <Shield className="h-6 w-6 text-cyberguard-primary" />,
      description: 'AI performs automated forensics to check for unauthorized email forwarding rules, strange sent emails, and password changes from unknown IPs.',
      subPoints: [
        'Detects anomalies in login behavior',
        'Scans dark web for leaked credentials',
        'Verifies with smart security questions'
      ]
    },
    {
      id: 2,
      title: 'One-Click Recovery',
      icon: <RefreshCw className="h-6 w-6 text-cyberguard-primary" />,
      description: 'Our AI system automatically revokes suspicious sessions, forces 2FA reset if disabled by hackers, and restores deleted emails from backups when available.',
      subPoints: [
        'Logs out all devices immediately',
        'Resets compromised credentials',
        'Recovers deleted or hidden data'
      ]
    },
    {
      id: 3,
      title: 'Post-Recovery Protection',
      icon: <Lock className="h-6 w-6 text-cyberguard-primary" />,
      description: 'After recovery, our AI recommends personalized security improvements like enabling passwordless login, setting up backup methods, and removing malicious emails.',
      subPoints: [
        'Enables advanced security features',
        'Sets up continuous monitoring',
        'Provides ongoing threat protection'
      ]
    }
  ];

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-[2.25rem] top-12 bottom-12 w-0.5 bg-gradient-to-b from-cyberguard-primary to-cyberguard-secondary md:left-1/2 md:-ml-0.5" />
      
      {/* Steps */}
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex flex-col md:flex-row items-center">
              {/* Step number and icon */}
              <div className="flex-shrink-0 relative z-10">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-cyberguard-primary to-cyberguard-secondary text-white">
                  {step.icon}
                </div>
              </div>
              
              {/* Content */}
              <Card className={`w-full md:w-[calc(100%-3rem)] p-5 md:ml-6 mt-4 md:mt-0 ${
                index % 2 !== 0 ? 'md:mr-6 md:ml-0' : ''
              }`}>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-cyberguard-primary mr-2">Step {step.id}:</span> {step.title}
                </h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.subPoints.map((point, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-cyberguard-primary" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        ))}
      </div>
      
      {/* Final step */}
      <div className="relative mt-12 text-center">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-green-500 text-white z-10 relative">
          <Check className="h-6 w-6" />
        </div>
        <div className="mt-2 font-medium">Recovery Complete</div>
      </div>
    </div>
  );
};

export default RecoveryStepFlow;

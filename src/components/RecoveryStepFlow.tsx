
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, RefreshCw, Lock, Check, Zap, FileSearch, AlertCircle } from 'lucide-react';

const RecoveryStepFlow = () => {
  const steps = [
    {
      id: 1,
      title: 'AI Confirms the Hack',
      icon: <Shield className="h-6 w-6 text-cyberguard-primary" />,
      description: 'AI performs automated forensics to check for unauthorized email forwarding rules, strange sent emails, and password changes from unknown IPs.',
      subPoints: [
        'Multi-factor anomaly detection in login behavior',
        'Dark web monitoring with real-time credential scanning',
        'Behavioral biometrics validation for identity verification'
      ]
    },
    {
      id: 2,
      title: 'Threat Assessment',
      icon: <AlertCircle className="h-6 w-6 text-cyberguard-primary" />,
      description: 'Our AI system evaluates the severity and nature of the breach using advanced machine learning algorithms and threat intelligence.',
      subPoints: [
        'Classifies attack type and potential data exposure',
        'Performs impact analysis on connected accounts',
        'Establishes timeline of compromise with AI forensics'
      ]
    },
    {
      id: 3,
      title: 'Intelligent Recovery Planning',
      icon: <FileSearch className="h-6 w-6 text-cyberguard-primary" />,
      description: 'The system creates a personalized recovery strategy based on breach specifics and your security priorities.',
      subPoints: [
        'Generates step-by-step remediation plan',
        'Prioritizes critical accounts and sensitive data',
        'Optimizes recovery sequence to minimize disruption'
      ]
    },
    {
      id: 4,
      title: 'One-Click Recovery Execution',
      icon: <RefreshCw className="h-6 w-6 text-cyberguard-primary" />,
      description: 'Our AI system automatically executes the recovery plan, revoking suspicious sessions, resetting compromised credentials, and restoring altered settings.',
      subPoints: [
        'Terminates all unauthorized access points instantly',
        'Resets and rotates compromised credentials',
        'Recovers deleted or hidden data from secure backups'
      ]
    },
    {
      id: 5,
      title: 'Post-Recovery Protection',
      icon: <Lock className="h-6 w-6 text-cyberguard-primary" />,
      description: 'After recovery, our AI recommends personalized security improvements and implements advanced protection measures against future attacks.',
      subPoints: [
        'Enables adaptive authentication based on risk scoring',
        'Sets up continuous monitoring with anomaly alerts',
        'Implements zero-trust security framework'
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
              } hover:shadow-md transition-all duration-300`}>
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
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white z-10 relative">
          <Zap className="h-6 w-6" />
        </div>
        <div className="mt-3">
          <h4 className="font-medium text-lg">Recovery Complete</h4>
          <p className="text-sm text-gray-600">Your account is now secured with enhanced protection</p>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStepFlow;

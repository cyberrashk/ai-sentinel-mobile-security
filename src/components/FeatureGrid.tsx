
import React from 'react';
import { 
  Shield, 
  FileSearch, 
  WifiOff,
  CloudOff,
  Lock,
  Users,
  Smartphone,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  isPremium?: boolean;
}

function Feature({ icon, title, description, className, isPremium = false }: FeatureProps) {
  return (
    <div className={cn(
      "group flex flex-col p-4 rounded-xl border transition-all duration-300",
      "hover:shadow-md hover:border-cyberguard-secondary/30",
      isPremium ? "bg-gradient-to-br from-cyberguard-secondary/10 to-cyberguard-primary/5" : "",
      className
    )}>
      <div className="mb-3">
        <div className="w-10 h-10 rounded-lg bg-cyberguard-primary/10 flex items-center justify-center group-hover:bg-cyberguard-primary/20">
          <div className="text-cyberguard-primary">{icon}</div>
        </div>
      </div>
      <h3 className="font-medium mb-1 flex items-center">
        {title}
        {isPremium && (
          <span className="ml-2 text-xs bg-cyberguard-secondary/20 text-cyberguard-secondary px-2 py-0.5 rounded-full">
            PRO
          </span>
        )}
      </h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default function FeatureGrid() {
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Malware Scanner",
      description: "AI-powered detection of viruses & malicious code",
      isPremium: false
    },
    {
      icon: <FileSearch className="w-5 h-5" />,
      title: "Phishing Protection",
      description: "Block fake websites & scam attempts",
      isPremium: false
    },
    {
      icon: <WifiOff className="w-5 h-5" />,
      title: "WiFi Security",
      description: "Detect unsafe networks & MITM attacks",
      isPremium: false
    },
    {
      icon: <CloudOff className="w-5 h-5" />,
      title: "Privacy Guard",
      description: "Block trackers & prevent data leaks",
      isPremium: false
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Dark Web Monitor",
      description: "Alerts if your data appears in leaks",
      isPremium: true
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Family Protection",
      description: "Keep your loved ones safe online",
      isPremium: true
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Financial Guard",
      description: "Prevent banking fraud & identity theft",
      isPremium: true
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Encrypted Chat",
      description: "Secure messages with E2E encryption",
      isPremium: true
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "App Security",
      description: "Verify app permissions & security",
      isPremium: false
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <Feature
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          isPremium={feature.isPremium}
        />
      ))}
    </div>
  );
}

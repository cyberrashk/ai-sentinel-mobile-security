
import React from 'react';
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

type SecurityLevel = 'protected' | 'warning' | 'danger';

interface SecurityStatusProps {
  level: SecurityLevel;
  message: string;
  className?: string;
}

export default function SecurityStatus({ level, message, className }: SecurityStatusProps) {
  const getStatusConfig = () => {
    switch (level) {
      case 'protected':
        return {
          icon: <ShieldCheck className="w-8 h-8 text-cyberguard-success" />,
          title: 'Protected',
          bg: 'bg-gradient-to-r from-cyberguard-success/10 to-cyberguard-success/5',
          border: 'border-cyberguard-success/20',
          ring: 'ring-cyberguard-success/20',
        };
      case 'warning':
        return {
          icon: <ShieldAlert className="w-8 h-8 text-cyberguard-alert" />,
          title: 'Attention Needed',
          bg: 'bg-gradient-to-r from-cyberguard-alert/10 to-cyberguard-alert/5',
          border: 'border-cyberguard-alert/20',
          ring: 'ring-cyberguard-alert/20',
        };
      case 'danger':
        return {
          icon: <Shield className="w-8 h-8 text-cyberguard-danger" />,
          title: 'At Risk',
          bg: 'bg-gradient-to-r from-cyberguard-danger/10 to-cyberguard-danger/5',
          border: 'border-cyberguard-danger/20',
          ring: 'ring-cyberguard-danger/20',
        };
      default:
        return {
          icon: <ShieldCheck className="w-8 h-8 text-cyberguard-success" />,
          title: 'Protected',
          bg: 'bg-gradient-to-r from-cyberguard-success/10 to-cyberguard-success/5',
          border: 'border-cyberguard-success/20',
          ring: 'ring-cyberguard-success/20',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className={cn(
        "relative rounded-2xl p-6 border", 
        config.bg, 
        config.border,
        className
      )}
    >
      <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 rounded-2xl pointer-events-none">
        <div className={cn("absolute inset-0 rounded-2xl", config.ring, "animate-pulse-ring")}></div>
      </div>

      <div className="flex items-center">
        <div className="mr-4">
          {config.icon}
        </div>
        <div>
          <h3 className="font-semibold text-xl">{config.title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

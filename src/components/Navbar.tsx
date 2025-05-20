
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="cyberguard-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full shield-gradient">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-cyberguard-primary">CyberGuard AI</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyberguard-alert rounded-full"></span>
            </Button>
            <Button size="sm" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 text-white">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

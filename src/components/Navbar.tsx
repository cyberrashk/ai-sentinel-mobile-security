
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Shield, MoreVertical, Home, Lock, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const location = useLocation();
  
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
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium ${location.pathname === '/' ? 'text-cyberguard-primary' : 'hover:text-cyberguard-primary'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/security" 
              className={`text-sm font-medium ${location.pathname === '/security' ? 'text-cyberguard-primary' : 'hover:text-cyberguard-primary'}`}
            >
              Security
            </Link>
            <Link 
              to="/recovery" 
              className={`text-sm font-medium ${location.pathname === '/recovery' ? 'text-cyberguard-primary' : 'hover:text-cyberguard-primary'}`}
            >
              Recovery
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyberguard-alert rounded-full"></span>
            </Button>
            
            {/* Three Dots Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/security" className="flex items-center w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Security
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recovery" className="flex items-center w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recovery
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-cyberguard-primary font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 text-white">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

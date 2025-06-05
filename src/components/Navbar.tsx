import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Shield, MoreVertical, Home, Lock, RefreshCw, User, LogOut, Mail, Chrome } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as authService from '@/services/authService';
import AlertCenter from '@/components/AlertCenter';

export default function Navbar() {
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | null>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  
  const currentUser = authService.getCurrentUser();
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.googleLogin();
      toast.success('Google Login Successful', {
        description: `Welcome ${user.name}!`
      });
      setIsLoginOpen(false);
      resetLoginState();
    } catch (error) {
      toast.error('Google Login Failed', {
        description: 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetLoginState = () => {
    setLoginMethod(null);
    setOtpSent(false);
    setOtp('');
    setEmail('');
    setGeneratedOTP('');
  };

  const handleEmailSubmit = async () => {
    if (!otpSent) {
      // Send OTP
      if (!email.trim()) {
        toast.error('Please enter your email address');
        return;
      }
      
      setIsLoading(true);
      try {
        const result = await authService.sendOTP(email);
        if (result.success) {
          setOtpSent(true);
          setGeneratedOTP(result.otp || '');
          toast.success('OTP Sent Successfully', {
            description: `Verification code: ${result.otp} (for demo)`
          });
        }
      } catch (error) {
        toast.error('Failed to send OTP', {
          description: error instanceof Error ? error.message : 'Please check your email and try again'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Verify OTP and login
      if (!otp.trim()) {
        toast.error('Please enter the OTP');
        return;
      }
      
      setIsLoading(true);
      try {
        const user = await authService.verifyOTPAndLogin(email, otp);
        toast.success('Login Successful', {
          description: `Welcome ${user.name}!`
        });
        setIsLoginOpen(false);
        resetLoginState();
      } catch (error) {
        toast.error('Login Failed', {
          description: error instanceof Error ? error.message : 'Invalid OTP'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
  };

  const toggleAlerts = () => {
    setIsAlertsOpen(!isAlertsOpen);
  };
  
  return (
    <>
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
              <Button variant="ghost" size="icon" className="relative" onClick={toggleAlerts}>
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
                <DropdownMenuContent align="end" className="w-48 bg-white">
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
                  
                  {currentUser ? (
                    <>
                      <DropdownMenuItem className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {currentUser.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => setIsLoginOpen(true)} className="flex items-center text-cyberguard-primary">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </DropdownMenuItem>
                  )}
                  
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

      {/* Alerts Dialog */}
      <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Security Alerts
            </DialogTitle>
            <DialogDescription>
              Monitor all security events and threats in real-time
            </DialogDescription>
          </DialogHeader>
          
          <AlertCenter />
        </DialogContent>
      </Dialog>

      {/* Enhanced Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyberguard-primary" />
              Login to CyberGuard AI
            </DialogTitle>
            <DialogDescription>
              Choose your preferred login method to access your secure dashboard
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!loginMethod ? (
              <>
                <Button 
                  onClick={() => {
                    setLoginMethod('google');
                    handleGoogleLogin();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4" />
                  Continue with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setLoginMethod('email')}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Continue with Email
                </Button>
              </>
            ) : loginMethod === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={otpSent || isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Any valid email address will work for demo
                  </p>
                </div>
                
                {otpSent && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Verification Code</label>
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit verification code"
                      maxLength={6}
                    />
                    {generatedOTP && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        Demo OTP: {generatedOTP}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Check the demo OTP above or your email
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={handleEmailSubmit}
                  className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                  disabled={isLoading || (!otpSent && !email.trim()) || (otpSent && !otp.trim())}
                >
                  {isLoading ? 'Processing...' : otpSent ? 'Verify & Login' : 'Send OTP'}
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={resetLoginState}
                  className="w-full"
                  disabled={isLoading}
                >
                  Back to login options
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

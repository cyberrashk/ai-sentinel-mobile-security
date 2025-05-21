
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import * as authService from '@/services/authService';

interface LoginProps {
  className?: string;
  onLogin?: (user: {name: string, email: string}) => void;
}

export default function Login({ className, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let user;
      
      if (view === 'login') {
        user = await authService.login(email, password);
        toast.success('Login Successful', {
          description: 'Welcome back to CyberGuard AI'
        });
      } else {
        // Use email username as name if registering
        const name = email.split('@')[0];
        user = await authService.register(email, password, name);
        toast.success('Account Created', {
          description: 'Your secure account has been created'
        });
      }
      
      if (onLogin) {
        onLogin(user);
      }
    } catch (error) {
      toast.error('Authentication Failed', {
        description: error instanceof Error ? error.message : 'Please check your credentials and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-xl border p-5 ${className}`}>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyberguard-primary to-cyberguard-secondary flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center mb-6">
        {view === 'login' ? 'Login to CyberGuard AI' : 'Create Secure Account'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        {view === 'login' ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <Button type="button" variant="link" className="text-sm p-0">
              Forgot password?
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <label htmlFor="terms" className="text-sm">
              I agree to the <Button type="button" variant="link" className="text-sm p-0">Terms of Service</Button>
            </label>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {view === 'login' ? 'Logging in...' : 'Creating account...'}
            </span>
          ) : (
            view === 'login' ? 'Login' : 'Create Account'
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {view === 'login' ? "Don't have an account?" : "Already have an account?"}
          <Button 
            type="button" 
            variant="link" 
            className="pl-1"
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
          >
            {view === 'login' ? 'Sign up' : 'Log in'}
          </Button>
        </p>
      </div>
    </div>
  );
}

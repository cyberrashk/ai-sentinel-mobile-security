
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function SecureVault() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUnlock = () => {
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    
    // In a real app, this would validate against a stored password
    toast.success("Vault unlocked successfully");
    setIsUnlocked(true);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
    toast("Vault locked", {
      description: "Your secure vault has been locked"
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-cyberguard-primary to-cyberguard-secondary p-4">
        <div className="flex items-center text-white">
          <Lock className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Secure Vault</h3>
        </div>
      </div>
      
      <div className="p-5">
        {isUnlocked ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your encrypted vault is now unlocked. Safely store your sensitive files, passwords, 
              and documents protected with military-grade encryption.
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {['Photos', 'Documents', 'Passwords'].map((category) => (
                <Button 
                  key={category}
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <div className="text-cyberguard-primary">{category}</div>
                  <div className="text-xs text-gray-500">0 items</div>
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={handleLock} 
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Lock Vault
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Secure your sensitive data with end-to-end encryption. 
              Enter your password to unlock the vault.
            </p>
            
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter vault password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button 
                onClick={handleUnlock} 
                className="w-full bg-cyberguard-secondary hover:bg-cyberguard-secondary/90"
              >
                <Key className="w-4 h-4 mr-2" />
                Unlock Vault
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

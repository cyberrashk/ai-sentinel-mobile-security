
import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    toast.info('Logged Out', {
      description: 'You have been securely logged out'
    });
  };

  return (
    <div className="rounded-xl border p-5">
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-cyberguard-primary/10 flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-cyberguard-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{user.name}</h3>
        <p className="text-gray-500 mb-6">{user.email}</p>
        
        <div className="bg-gray-50 rounded-lg p-4 border w-full mb-4">
          <h4 className="font-medium mb-2">Your Security Status</h4>
          <div className="flex items-center text-cyberguard-success mb-1">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span className="text-sm">Account Protected</span>
          </div>
          <p className="text-xs text-gray-500">
            Your account is secured with password protection. 
            Enable 2FA for enhanced security.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;


import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="cyberguard-container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full shield-gradient flex items-center justify-center mr-2">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">CyberGuard AI</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 CyberGuard AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

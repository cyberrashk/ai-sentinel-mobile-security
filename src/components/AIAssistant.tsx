
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AIAssistant() {
  const handleAIHelp = () => {
    toast.info("AI Assistant", {
      description: "How can I help protect your device today?",
      action: {
        label: "Ask a question",
        onClick: () => console.log("User clicked to ask a question")
      }
    });
  };
  
  const securityTips = [
    "Use unique passwords for every account",
    "Enable two-factor authentication where available",
    "Be cautious of unexpected links in emails",
    "Keep your operating system and apps updated"
  ];
  
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyberguard-primary/5 to-cyberguard-secondary/10 p-5">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-cyberguard-primary flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="ml-3">
          <h3 className="font-medium">CyberGuard AI Assistant</h3>
          <p className="text-sm text-gray-500">Your personal security advisor</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <p className="text-sm">
            <span className="font-medium">Security Tip:</span>{" "}
            {securityTips[Math.floor(Math.random() * securityTips.length)]}
          </p>
        </div>
        
        <Button 
          onClick={handleAIHelp}
          className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
        >
          Ask AI Assistant
        </Button>
      </div>
    </div>
  );
}

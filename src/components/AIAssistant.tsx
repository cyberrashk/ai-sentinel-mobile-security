
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const securityTips = [
    "Use unique passwords for every account",
    "Enable two-factor authentication where available", 
    "Be cautious of unexpected links in emails",
    "Keep your operating system and apps updated",
    "Regularly backup your important data",
    "Use a reputable antivirus software",
    "Be careful with public WiFi networks",
    "Monitor your credit reports regularly"
  ];

  const aiResponses = {
    password: "I recommend using a password manager to generate and store unique, strong passwords for each account. Enable 2FA wherever possible for extra security.",
    phishing: "Be cautious of emails asking for personal information. Legitimate companies won't ask for passwords via email. Always verify the sender's identity.",
    malware: "Keep your antivirus updated and run regular scans. Avoid downloading software from untrusted sources and be careful with email attachments.",
    vpn: "Using a VPN encrypts your internet connection and protects your privacy, especially on public networks. CyberGuard AI includes a smart VPN feature.",
    backup: "Regular backups are crucial for data protection. Use the 3-2-1 rule: 3 copies of data, 2 different storage types, 1 offsite backup.",
    default: "I'm here to help with any cybersecurity questions. You can ask me about passwords, phishing, malware protection, VPNs, or any other security concerns."
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('password') || message.includes('login')) {
      return aiResponses.password;
    } else if (message.includes('phishing') || message.includes('email') || message.includes('scam')) {
      return aiResponses.phishing;
    } else if (message.includes('virus') || message.includes('malware') || message.includes('infection')) {
      return aiResponses.malware;
    } else if (message.includes('vpn') || message.includes('network') || message.includes('wifi')) {
      return aiResponses.vpn;
    } else if (message.includes('backup') || message.includes('data')) {
      return aiResponses.backup;
    } else {
      return aiResponses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: getAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setIsExpanded(true);
  };

  if (isExpanded) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-cyberguard-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">CyberGuard AI Assistant</h3>
                <p className="text-sm text-green-500">● Online</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Hi! I'm your AI security assistant. Ask me anything about cybersecurity!</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.type === 'user' ? 'bg-blue-500 ml-2' : 'bg-cyberguard-primary mr-2'
                }`}>
                  {msg.type === 'user' ? 
                    <User className="w-4 h-4 text-white" /> : 
                    <Bot className="w-4 h-4 text-white" />
                  }
                </div>
                <div className={`rounded-lg p-3 ${
                  msg.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-cyberguard-primary flex items-center justify-center mr-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me about cybersecurity..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isThinking}
              className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction("How do I create strong passwords?")}
            className="text-xs"
          >
            Password Help
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction("How to avoid phishing emails?")}
            className="text-xs"
          >
            Phishing Guide
          </Button>
        </div>
        
        <Button 
          onClick={() => setIsExpanded(true)}
          className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
        >
          Chat with AI Assistant
        </Button>
      </div>
    </div>
  );
}

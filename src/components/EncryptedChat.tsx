import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Lock, 
  Send, 
  Shield, 
  Plus, 
  FileText, 
  Image, 
  Mic, 
  Video,
  Phone,
  MoreHorizontal,
  Search,
  Settings,
  UserPlus,
  Archive,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import * as authService from '@/services/authService';
import ChatMessage from './ChatMessage';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  type: 'text' | 'file' | 'image' | 'voice';
  status: 'sent' | 'delivered' | 'read';
  starred?: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  lastMessage: string;
  unread: number;
  encrypted: boolean;
  avatar?: string;
  lastSeen?: Date;
}

export default function EncryptedChat() {
  const [contacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      status: 'online',
      lastMessage: 'The contract details look good',
      unread: 2,
      encrypted: true,
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@startup.io',
      status: 'away',
      lastMessage: 'Can we schedule a secure call?',
      unread: 0,
      encrypted: true,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@tech.com',
      status: 'offline',
      lastMessage: 'Thanks for the encrypted files',
      unread: 1,
      encrypted: true,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '4',
      name: 'Emma Johnson',
      email: 'emma@finance.com',
      status: 'online',
      lastMessage: 'Voice message received',
      unread: 0,
      encrypted: true,
      lastSeen: new Date()
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hey, can you review the sensitive documents I sent?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      encrypted: true,
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      sender: 'You',
      content: 'Sure, I\'ll take a look at them now. Thanks for using encrypted chat.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      encrypted: true,
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      sender: 'John Doe',
      content: 'The contract details look good. All information is end-to-end encrypted.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      encrypted: true,
      type: 'text',
      status: 'delivered',
      starred: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const currentUser = authService.getCurrentUser();

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  const sendMessage = (type: 'text' | 'file' | 'image' | 'voice' = 'text', content?: string) => {
    if (type === 'text' && !newMessage.trim() && !content) return;
    if (!selectedContact) return;

    const messageContent = content || (type === 'text' ? newMessage : `${type.charAt(0).toUpperCase() + type.slice(1)} message`);
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: messageContent,
      timestamp: new Date(),
      encrypted: true,
      type,
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    if (type === 'text') setNewMessage('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
    
    // Simulate message read
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent`, {
      description: 'End-to-end encrypted',
      icon: <CheckCircle className="w-4 h-4" />
    });
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        sendMessage('file', `📎 ${file.name}`);
      }
    };
    input.click();
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        sendMessage('image', `🖼️ ${file.name}`);
      }
    };
    input.click();
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Recording started', {
        description: 'Voice message will be encrypted'
      });
      setTimeout(() => {
        setIsRecording(false);
        sendMessage('voice', '🎤 Voice message (3s)');
      }, 3000);
    }
  };

  const toggleStarMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const handleReplyMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setNewMessage(`@${message.sender} `);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const getStatusColor = (status: ChatContact['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="rounded-xl border overflow-hidden bg-white">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Login Required</h3>
            <p className="text-gray-500 mb-4">Please login to access encrypted chat</p>
            <Badge className="bg-green-100 text-green-800">
              Free Access • No Premium Required
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden bg-white">
      <div className="flex h-[600px]">
        {/* Enhanced Contacts Sidebar */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Encrypted Chats
              </h3>
              <Badge className="bg-green-500 text-white">Free Access</Badge>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1" 
                variant="outline"
                onClick={() => toast.success('New chat feature coming soon!')}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Chat
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toast.success('Add contact feature coming soon!')}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 border-b cursor-pointer hover:bg-white transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-white border-l-4 border-l-cyberguard-primary' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center flex-1">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        <div className="flex items-center gap-1">
                          {contact.encrypted && (
                            <Lock className="w-3 h-3 text-green-600" />
                          )}
                          {contact.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full">
                              {contact.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                      <p className="text-xs text-gray-400">
                        {contact.status === 'online' ? 'Online' : 
                         contact.lastSeen ? `Last seen ${contact.lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Enhanced Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{selectedContact.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status)}`}></div>
                        {selectedContact.status === 'online' ? 'Online' : selectedContact.status}
                        {isTyping && selectedContact.status === 'online' && (
                          <span className="text-green-600 animate-pulse">• typing...</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Lock className="w-3 h-3 mr-1" />
                      E2E Encrypted
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.success('Voice call feature coming soon!')}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.success('Video call feature coming soon!')}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Search className="w-4 h-4 mr-2" />
                          Search in chat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive chat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Chat settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Enhanced Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isOwnMessage={message.sender === 'You'}
                    onToggleStar={toggleStarMessage}
                    onReply={handleReplyMessage}
                    onCopy={handleCopyMessage}
                  />
                ))}
              </div>

              {/* Enhanced Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-end gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleFileUpload}
                    className="h-8"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleImageUpload}
                    className="h-8"
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleVoiceRecord}
                    className={`h-8 ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
                  >
                    <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type an encrypted message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="pr-12"
                    />
                    <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                  </div>
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-cyberguard-primary hover:bg-cyberguard-primary/90 h-8"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    End-to-end encrypted with AES-256 • Free tier includes all features
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    ✓ All Premium Features Unlocked
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to Encrypted Chat</h3>
                <p className="text-gray-500 mb-4">Select a contact to start secure messaging</p>
                <Badge className="bg-green-100 text-green-800">
                  All features available for free
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

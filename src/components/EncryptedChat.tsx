
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Lock, Send, Shield, Plus } from 'lucide-react';
import * as authService from '@/services/authService';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  lastMessage: string;
  unread: number;
  encrypted: boolean;
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
      encrypted: true
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@startup.io',
      status: 'away',
      lastMessage: 'Can we schedule a secure call?',
      unread: 0,
      encrypted: true
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@tech.com',
      status: 'offline',
      lastMessage: 'Thanks for the encrypted files',
      unread: 1,
      encrypted: true
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hey, can you review the sensitive documents I sent?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      encrypted: true
    },
    {
      id: '2',
      sender: 'You',
      content: 'Sure, I\'ll take a look at them now. Thanks for using encrypted chat.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      encrypted: true
    },
    {
      id: '3',
      sender: 'John Doe',
      content: 'The contract details look good. All information is end-to-end encrypted.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      encrypted: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const isPremium = authService.isPremiumUser();

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
      encrypted: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getStatusColor = (status: ChatContact['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  if (!isPremium) {
    return (
      <div className="rounded-xl border p-6">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-xl mb-2">Encrypted Chat</h3>
          <p className="text-gray-600 mb-4">Secure, end-to-end encrypted communications</p>
          <Badge variant="outline" className="mb-4">Premium Feature</Badge>
          <p className="text-sm text-gray-500 mb-6">
            Communicate securely with military-grade encryption, perfect for sensitive business conversations
          </p>
          <Button className="bg-cyberguard-primary hover:bg-cyberguard-primary/90">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="flex h-96">
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Encrypted Chats</h3>
              <Badge className="bg-cyberguard-primary">Pro</Badge>
            </div>
            <Button size="sm" className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          <div className="overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 border-b cursor-pointer hover:bg-white transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-white border-l-4 border-l-cyberguard-primary' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                    </div>
                    <div className="ml-2">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {contact.encrypted && (
                      <Lock className="w-3 h-3 text-green-600 mb-1" />
                    )}
                    {contact.unread > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-8 h-8 mr-3">
                      <AvatarFallback>
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{selectedContact.name}</h4>
                      <p className="text-sm text-gray-500">{selectedContact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Lock className="w-3 h-3 mr-1" />
                      Encrypted
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status)}`}></div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'You'
                          ? 'bg-cyberguard-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${message.sender === 'You' ? 'text-white/70' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.encrypted && (
                          <Lock className={`w-3 h-3 ${message.sender === 'You' ? 'text-white/70' : 'text-green-600'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type an encrypted message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="pr-10"
                    />
                    <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  End-to-end encrypted with AES-256
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

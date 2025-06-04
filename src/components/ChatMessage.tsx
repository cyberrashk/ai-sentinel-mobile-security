
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Image, 
  Mic, 
  Star, 
  Lock,
  Download,
  Reply,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface ChatMessageProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  onToggleStar: (messageId: string) => void;
  onReply: (messageId: string) => void;
  onCopy: (content: string) => void;
}

export default function ChatMessage({ 
  message, 
  isOwnMessage, 
  onToggleStar, 
  onReply, 
  onCopy 
}: ChatMessageProps) {
  const getMessageStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case 'file': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-xs lg:max-w-md group">
        <div
          className={`px-4 py-2 rounded-lg relative ${
            isOwnMessage
              ? 'bg-cyberguard-primary text-white'
              : 'bg-white text-gray-800 border shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {message.type === 'text' ? (
                <p className="text-sm break-words">{message.content}</p>
              ) : (
                <div className="flex items-center gap-2">
                  {getMessageIcon()}
                  <span className="text-sm">{message.content}</span>
                  {message.type !== 'text' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-6 w-6 p-0 ${
                        isOwnMessage ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Message Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0 ${
                    isOwnMessage ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs">⋯</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReply(message.id)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(message.content)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStar(message.id)}>
                  <Star className={`w-4 h-4 mr-2 ${message.starred ? 'fill-current' : ''}`} />
                  {message.starred ? 'Remove Star' : 'Add Star'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className={`text-xs ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-1">
              {message.encrypted && (
                <Lock className={`w-3 h-3 ${isOwnMessage ? 'text-white/70' : 'text-green-600'}`} />
              )}
              {isOwnMessage && (
                <span className={`text-xs ${message.status === 'read' ? 'text-blue-400' : 'text-white/70'}`}>
                  {getMessageStatusIcon(message.status)}
                </span>
              )}
              {message.starred && (
                <Star className={`w-3 h-3 fill-current ${isOwnMessage ? 'text-yellow-300' : 'text-yellow-500'}`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

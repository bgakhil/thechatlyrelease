import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, UserX, RotateCcw, Users } from 'lucide-react';
import chatlyLogo from '@/assets/chatly-logo.png';
import type { Message, ChatSession } from '@/hooks/useRealTimeChat';

interface ChatInterfaceProps {
  interests: string[];
  onDisconnect: () => void;
  onNewChat: () => void;
  onlineCount: number;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  session: ChatSession | null;
  userId: string;
}

const ChatInterface = ({ interests, onDisconnect, onNewChat, onlineCount, messages, onSendMessage, session, userId }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isConnected = session?.status === 'active';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected) return;

    await onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  const handleNewChat = () => {
    onNewChat();
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src={chatlyLogo} alt="Chatly" className="w-8 h-8" />
                <h1 className="text-2xl font-bold flex items-center">
                  <span className="text-blue-500">C</span>
                  <span className="text-purple-500">h</span>
                  <span className="text-pink-500">a</span>
                  <span className="text-orange-500">t</span>
                  <span className="text-green-500">l</span>
                  <span className="text-cyan-500">y</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="font-medium">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              
              {interests.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Interests:</span>
                  <div className="flex flex-wrap gap-1">
                    {interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {interests.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{onlineCount.toLocaleString()}</span>
              </div>
              <Button
                onClick={handleNewChat}
                variant="outline"
                size="sm"
                disabled={!isConnected}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                New
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
              >
                <UserX className="w-4 h-4 mr-1" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6">
        <Card className="h-[calc(100vh-160px)] bg-card/80 backdrop-blur-sm border-0 shadow-lg flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {message.message_type === 'system' && (
                  <div className="flex justify-center">
                    <div className="bg-chat-system text-chat-system-foreground px-3 py-1 rounded-full text-sm">
                      {message.content}
                    </div>
                  </div>
                )}

                {message.message_type === 'user' && message.sender_id === userId && (
                  <div className="flex justify-end">
                    <div className="bg-chat-user text-chat-user-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs lg:max-w-md">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.message_type === 'user' && message.sender_id !== userId && (
                  <div className="flex justify-start">
                    <div className="bg-chat-stranger text-chat-stranger-foreground px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs lg:max-w-md border">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-chat-stranger text-chat-stranger-foreground px-4 py-2 rounded-2xl rounded-tl-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <Separator />

          {/* Input */}
          <div className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isConnected}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isConnected && (
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send • Be respectful and kind
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
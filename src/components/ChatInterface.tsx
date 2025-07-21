import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, UserX, RotateCcw, Users } from 'lucide-react';
import chatlyLogo from '@/assets/chatly-logo.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'stranger' | 'system';
  timestamp: Date;
}

interface ChatInterfaceProps {
  interests: string[];
  onDisconnect: () => void;
  onNewChat: () => void;
  onlineCount: number;
}

const ChatInterface = ({ interests, onDisconnect, onNewChat, onlineCount }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      addSystemMessage('You are now connected with a stranger. Say hello!');
      
      // Simulate stranger's first message
      setTimeout(() => {
        addStrangerMessage('Hello! How are you doing today?');
      }, 2000);
    }, Math.random() * 3000 + 1000); // 1-4 seconds

    addSystemMessage('Looking for someone to chat with...');

    return () => clearTimeout(connectTimer);
  }, []);

  const addSystemMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addStrangerMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'stranger',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !isConnected) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setInputValue('');

    // Simulate stranger typing and responding
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        // Simple response simulation
        const responses = [
          "That's interesting!",
          "I see, tell me more about that",
          "Wow, really?",
          "I totally agree with you",
          "That's a great point",
          "I never thought about it that way",
          "What do you think about that?",
          "That sounds amazing!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addStrangerMessage(randomResponse);
      }, Math.random() * 2000 + 1000); // 1-3 seconds
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDisconnect = () => {
    addSystemMessage('You have disconnected from the chat.');
    setIsConnected(false);
    setTimeout(() => {
      onDisconnect();
    }, 1000);
  };

  const handleNewChat = () => {
    addSystemMessage('Starting a new chat...');
    setIsConnected(false);
    setTimeout(() => {
      onNewChat();
    }, 1000);
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
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Chatly
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
                {message.sender === 'system' && (
                  <div className="flex justify-center">
                    <div className="bg-chat-system text-chat-system-foreground px-3 py-1 rounded-full text-sm">
                      {message.text}
                    </div>
                  </div>
                )}

                {message.sender === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-chat-user text-chat-user-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs lg:max-w-md">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                )}

                {message.sender === 'stranger' && (
                  <div className="flex justify-start">
                    <div className="bg-chat-stranger text-chat-stranger-foreground px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs lg:max-w-md border">
                      <p className="text-sm">{message.text}</p>
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
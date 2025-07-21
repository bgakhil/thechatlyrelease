import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Users, MessageCircle, Globe, X } from 'lucide-react';

interface ChatLandingProps {
  onStartChat: (interests: string[]) => void;
  onlineCount: number;
}

const ChatLanding = ({ onStartChat, onlineCount }: ChatLandingProps) => {
  const [interests, setInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const popularInterests = [
    'Music', 'Gaming', 'Movies', 'Sports', 'Art', 'Technology', 'Books', 'Travel',
    'Cooking', 'Fitness', 'Photography', 'Science', 'Politics', 'Fashion'
  ];

  const addInterest = (interest: string) => {
    if (!interests.includes(interest) && interests.length < 5) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleAddCustomInterest = () => {
    if (inputValue.trim() && !interests.includes(inputValue.trim()) && interests.length < 5) {
      setInterests([...interests, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomInterest();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl bg-card/80 backdrop-blur-sm border-0">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-primary p-4 rounded-full shadow-lg">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                RandomChat
              </h1>
              <p className="text-muted-foreground mt-2">
                Connect with strangers around the world
              </p>
            </div>
          </div>

          {/* Online Counter */}
          <div className="flex items-center justify-center space-x-2 bg-accent/50 rounded-full px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {onlineCount.toLocaleString()} online now
              </span>
            </div>
          </div>

          {/* Interests Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Add your interests (optional)
              </h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type an interest..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddCustomInterest}
                  variant="outline" 
                  size="sm"
                  disabled={!inputValue.trim() || interests.length >= 5}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected Interests */}
            {interests.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Your interests:</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge 
                      key={interest} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/20 transition-colors"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Interests */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Popular interests:</p>
              <div className="flex flex-wrap gap-2">
                {popularInterests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Start Chat Button */}
          <div className="space-y-3">
            <Button 
              onClick={() => onStartChat(interests)}
              size="lg"
              className="w-full bg-gradient-primary hover:scale-105 transition-transform"
            >
              <Globe className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
            
            <p className="text-xs text-muted-foreground">
              By clicking start, you agree to our community guidelines
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatLanding;
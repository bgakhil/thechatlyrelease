import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, ArrowLeft } from 'lucide-react';

interface ConnectingScreenProps {
  interests: string[];
  onBack: () => void;
  onConnected: () => void;
  onlineCount: number;
}

const ConnectingScreen = ({ interests, onBack, onConnected, onlineCount }: ConnectingScreenProps) => {
  const [dots, setDots] = useState('');
  const [searchText, setSearchText] = useState('Looking for someone to chat with');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    const searchTexts = [
      'Looking for someone to chat with',
      'Finding the perfect chat partner',
      'Connecting you with someone interesting',
      'Searching for common interests',
      'Almost ready to chat'
    ];

    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % searchTexts.length;
      setSearchText(searchTexts[textIndex]);
    }, 2000);

    // Simulate connection after random delay
    const connectionTimer = setTimeout(() => {
      onConnected();
    }, Math.random() * 4000 + 2000); // 2-6 seconds

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
      clearTimeout(connectionTimer);
    };
  }, [onConnected]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl bg-card/80 backdrop-blur-sm border-0">
        <div className="text-center space-y-6">
          {/* Loading Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-gradient-connect p-6 rounded-full shadow-lg animate-connect">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute -inset-4 bg-gradient-connect/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {searchText}{dots}
            </h2>
            <p className="text-muted-foreground">
              Please wait while we find someone for you
            </p>
          </div>

          {/* Online Counter */}
          <div className="flex items-center justify-center space-x-2 bg-accent/50 rounded-full px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {onlineCount.toLocaleString()} online
              </span>
            </div>
          </div>

          {/* Interests */}
          {interests.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Matching based on your interests:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {interests.map((interest, index) => (
                  <Badge 
                    key={interest} 
                    variant="secondary"
                    className="animate-bounce-slow"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-accent/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-1">💡 Chat Tips:</p>
            <ul className="text-xs space-y-1 text-left">
              <li>• Be respectful and kind to others</li>
              <li>• Share your interests to find common ground</li>
              <li>• Keep conversations appropriate</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConnectingScreen;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Users, MessageCircle, Globe, X, Sparkles } from 'lucide-react';
import chatlyLogo from '@/assets/chatly-logo.png';
interface ChatLandingProps {
  onStartChat: (interests: string[]) => void;
  onlineCount: number;
}
const ChatLanding = ({
  onStartChat,
  onlineCount
}: ChatLandingProps) => {
  const [interests, setInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const popularInterests = ['Music', 'Gaming', 'Movies', 'Sports', 'Art', 'Technology', 'Books', 'Travel', 'Cooking', 'Fitness', 'Photography', 'Science', 'Politics', 'Fashion', 'Anime', 'Programming', 'Nature', 'History', 'Philosophy', 'Language Learning'];
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
  return <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={chatlyLogo} alt="Chatly" className="w-10 h-10" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Chatly
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-accent/50 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {onlineCount.toLocaleString()} online now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Column - Hero */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <Badge variant="secondary" className="px-3 py-1">
                  Anonymous & Safe
                </Badge>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Connect with{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  strangers
                </span>{' '}
                worldwide
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of people in anonymous text conversations. 
                Share interests, make friends, and discover new perspectives 
                from around the globe.
              </p>
            </div>

            {/* Stats */}
            

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">No registration required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Interest-based matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Completely anonymous</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Safe & moderated</span>
              </div>
            </div>
          </div>

          {/* Right Column - Chat Setup */}
          <div className="lg:pl-8">
            <Card className="p-8 shadow-xl bg-card/90 backdrop-blur-sm border-0">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
                  <p className="text-muted-foreground">
                    Add interests to find like-minded people (optional)
                  </p>
                </div>

                {/* Interest Input */}
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input placeholder="Type an interest..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} className="flex-1" />
                    <Button onClick={handleAddCustomInterest} variant="outline" size="sm" disabled={!inputValue.trim() || interests.length >= 5}>
                      Add
                    </Button>
                  </div>

                  {/* Selected Interests */}
                  {interests.length > 0 && <div className="space-y-3">
                      <p className="text-sm font-medium">Your interests:</p>
                      <div className="flex flex-wrap gap-2">
                        {interests.map(interest => <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors" onClick={() => removeInterest(interest)}>
                            {interest}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>)}
                      </div>
                    </div>}

                  {/* Popular Interests */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Popular interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularInterests.slice(0, 12).map(interest => <Badge key={interest} variant="outline" className="cursor-pointer hover:bg-accent transition-colors text-xs" onClick={() => addInterest(interest)}>
                          {interest}
                        </Badge>)}
                    </div>
                  </div>
                </div>

                {/* Start Chat Button */}
                <div className="space-y-4 pt-2">
                  <Button onClick={() => onStartChat(interests)} size="lg" className="w-full bg-gradient-primary hover:scale-[1.02] transition-all duration-200 shadow-lg">
                    <Globe className="w-5 h-5 mr-2" />
                    Start Chatting Now
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Anonymous • Safe • No registration required
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default ChatLanding;
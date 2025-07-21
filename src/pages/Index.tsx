import React, { useState, useEffect } from 'react';
import ChatLanding from '@/components/ChatLanding';
import ConnectingScreen from '@/components/ConnectingScreen';
import ChatInterface from '@/components/ChatInterface';

type AppState = 'landing' | 'connecting' | 'chatting';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(2847); // Simulated online count

  // Simulate changing online count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newCount = Math.max(1000, Math.min(5000, prev + change));
        return newCount;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartChat = (interests: string[]) => {
    setUserInterests(interests);
    setAppState('connecting');
  };

  const handleConnected = () => {
    setAppState('chatting');
  };

  const handleDisconnect = () => {
    setAppState('landing');
    setUserInterests([]);
  };

  const handleNewChat = () => {
    setAppState('connecting');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setUserInterests([]);
  };

  return (
    <div className="min-h-screen">
      {appState === 'landing' && (
        <ChatLanding 
          onStartChat={handleStartChat}
          onlineCount={onlineCount}
        />
      )}

      {appState === 'connecting' && (
        <ConnectingScreen
          interests={userInterests}
          onBack={handleBackToLanding}
          onConnected={handleConnected}
          onlineCount={onlineCount}
        />
      )}

      {appState === 'chatting' && (
        <ChatInterface
          interests={userInterests}
          onDisconnect={handleDisconnect}
          onNewChat={handleNewChat}
          onlineCount={onlineCount}
        />
      )}
    </div>
  );
};

export default Index;

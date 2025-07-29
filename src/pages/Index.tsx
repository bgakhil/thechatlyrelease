import React, { useState, useEffect } from 'react';
import ChatLanding from '@/components/ChatLanding';
import ConnectingScreen from '@/components/ConnectingScreen';
import ChatInterface from '@/components/ChatInterface';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { supabase } from '@/integrations/supabase/client';

type AppState = 'landing' | 'connecting' | 'chatting';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  
  const {
    messages,
    session,
    isConnecting,
    userId,
    sendMessage,
    disconnectChat,
    startNewChat,
    findOrCreateSession
  } = useRealTimeChat(userInterests);

  // Real-time user presence tracking
  useEffect(() => {
    const channel = supabase.channel('online_users');
    
    // Track this user as online
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    // Listen for presence changes
    channel.on('presence', { event: 'sync' }, () => {
      const newState = channel.presenceState();
      const count = Object.keys(newState).length;
      setOnlineCount(count);
      console.log('Online users count:', count);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleStartChat = (interests: string[]) => {
    setUserInterests(interests);
    setAppState('connecting');
    findOrCreateSession();
  };

  const handleConnected = () => {
    setAppState('chatting');
  };

  const handleDisconnect = async () => {
    await disconnectChat();
    setAppState('landing');
    setUserInterests([]);
  };

  const handleNewChat = async () => {
    await startNewChat();
    setAppState('connecting');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setUserInterests([]);
  };

  // Handle session state changes
  useEffect(() => {
    if (session) {
      if (session.status === 'active' && appState === 'connecting') {
        setAppState('chatting');
      }
    }
  }, [session, appState]);

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
          isConnecting={isConnecting}
        />
      )}

      {appState === 'chatting' && (
        <ChatInterface
          interests={userInterests}
          onDisconnect={handleDisconnect}
          onNewChat={handleNewChat}
          onlineCount={onlineCount}
          messages={messages}
          onSendMessage={sendMessage}
          session={session}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Index;

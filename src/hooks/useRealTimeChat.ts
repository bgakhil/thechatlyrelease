import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  message_type: 'user' | 'system';
  created_at: string;
}

export interface ChatSession {
  id: string;
  status: 'waiting' | 'active' | 'ended';
  user1_id?: string;
  user2_id?: string;
  interests: string[];
}

export const useRealTimeChat = (interests: string[]) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const findOrCreateSession = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      // First try to find a waiting session with similar interests
      const { data: waitingSessions } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'waiting')
        .neq('user1_id', userId)
        .limit(10);

      let targetSession = null;

      if (waitingSessions && waitingSessions.length > 0) {
        // Find a session with matching interests or use the first available
        targetSession = waitingSessions.find(s => 
          s.interests?.some(interest => interests.includes(interest))
        ) || waitingSessions[0];

        // Join the existing session
        const { data: updatedSession } = await supabase
          .from('chat_sessions')
          .update({
            user2_id: userId,
            status: 'active'
          })
          .eq('id', targetSession.id)
          .select()
          .single();

        if (updatedSession) {
          setSession(updatedSession as ChatSession);
          
          // Add system message about connection
          await supabase.from('messages').insert({
            session_id: updatedSession.id,
            sender_id: 'system',
            content: 'You are now connected to a stranger! Say hello!',
            message_type: 'system'
          });
        }
      } else {
        // Create a new session
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({
            user1_id: userId,
            status: 'waiting',
            interests
          })
          .select()
          .single();

        if (newSession) {
          setSession(newSession as ChatSession);
          
          // Add system message about waiting
          await supabase.from('messages').insert({
            session_id: newSession.id,
            sender_id: 'system',
            content: 'Looking for someone to chat with...',
            message_type: 'system'
          });
        }
      }
    } catch (error) {
      console.error('Error finding/creating session:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [userId, interests]);

  const sendMessage = useCallback(async (content: string) => {
    if (!session || !content.trim()) return;

    try {
      await supabase.from('messages').insert({
        session_id: session.id,
        sender_id: userId,
        content: content.trim(),
        message_type: 'user'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [session, userId]);

  const disconnectChat = useCallback(async () => {
    if (!session) return;

    try {
      // Update session status to ended
      await supabase
        .from('chat_sessions')
        .update({ status: 'ended' })
        .eq('id', session.id);

      // Add system message about disconnection
      await supabase.from('messages').insert({
        session_id: session.id,
        sender_id: 'system',
        content: 'Stranger has disconnected.',
        message_type: 'system'
      });

      // Clean up
      if (channel) {
        supabase.removeChannel(channel);
        setChannel(null);
      }
      setSession(null);
      setMessages([]);
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, [session, channel]);

  const startNewChat = useCallback(async () => {
    if (session) {
      await disconnectChat();
    }
    
    // Small delay to ensure cleanup is complete
    setTimeout(() => {
      findOrCreateSession();
    }, 500);
  }, [session, disconnectChat, findOrCreateSession]);

  // Set up real-time subscriptions when session is created
  useEffect(() => {
    if (!session) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      
      if (data) {
        setMessages(data as Message[]);
      }
    };

    loadMessages();

    // Set up real-time subscription for messages and session updates in one channel
    const realtimeChannel = supabase
      .channel(`room:${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          console.log('New message received:', payload.new);
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `id=eq.${session.id}`
        },
        (payload) => {
          console.log('Session updated:', payload.new);
          const updatedSession = payload.new as ChatSession;
          setSession(updatedSession);
          
          // If session became active and we were waiting
          if (updatedSession.status === 'active' && session.status === 'waiting') {
            console.log('Session became active, adding connection message');
            supabase.from('messages').insert({
              session_id: session.id,
              sender_id: 'system',
              content: 'Stranger connected! Start chatting!',
              message_type: 'system'
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status, 'for session:', session.id);
      });

    setChannel(realtimeChannel);

    return () => {
      console.log('Cleaning up realtime subscription for session:', session.id);
      supabase.removeChannel(realtimeChannel);
    };
  }, [session]);

  return {
    messages,
    session,
    isConnecting,
    userId,
    sendMessage,
    disconnectChat,
    startNewChat,
    findOrCreateSession
  };
};
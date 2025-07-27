-- Create chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
  user1_id TEXT,
  user2_id TEXT,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'user' CHECK (message_type IN ('user', 'system')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_sessions
CREATE POLICY "Users can view sessions they are part of" 
ON public.chat_sessions 
FOR SELECT 
USING (user1_id = current_setting('request.jwt.claims', true)::json->>'sub' OR 
       user2_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
       user1_id IS NULL OR user2_id IS NULL);

CREATE POLICY "Users can create sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (user1_id = current_setting('request.jwt.claims', true)::json->>'sub' OR 
       user2_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
       user1_id IS NULL OR user2_id IS NULL);

-- RLS policies for messages
CREATE POLICY "Users can view messages in their sessions" 
ON public.messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.chat_sessions 
  WHERE id = session_id 
  AND (user1_id = current_setting('request.jwt.claims', true)::json->>'sub' OR 
       user2_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
       user1_id IS NULL OR user2_id IS NULL)
));

CREATE POLICY "Users can create messages in their sessions" 
ON public.messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.chat_sessions 
  WHERE id = session_id 
  AND (user1_id = current_setting('request.jwt.claims', true)::json->>'sub' OR 
       user2_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
       user1_id IS NULL OR user2_id IS NULL)
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER TABLE public.chat_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
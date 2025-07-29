-- Update RLS policies to allow anonymous chatting
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view sessions they are part of" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can create sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can update their sessions" ON public.chat_sessions;

DROP POLICY IF EXISTS "Users can view messages in their sessions" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages in their sessions" ON public.messages;

-- Create new policies for anonymous chatting
CREATE POLICY "Anyone can view chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view messages" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
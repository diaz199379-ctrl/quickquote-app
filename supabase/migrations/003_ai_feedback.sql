-- AI Feedback Table
-- Stores user feedback on AI assistant responses for continuous improvement

CREATE TABLE IF NOT EXISTS public.ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('up', 'down')),
  comment TEXT,
  message_content TEXT,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ai_feedback_user_id ON public.ai_feedback(user_id);
CREATE INDEX idx_ai_feedback_rating ON public.ai_feedback(rating);
CREATE INDEX idx_ai_feedback_created_at ON public.ai_feedback(created_at DESC);

-- RLS Policies
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback"
  ON public.ai_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.ai_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all feedback (for analysis)
CREATE POLICY "Admins can view all feedback"
  ON public.ai_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_ai_feedback_updated_at_trigger
  BEFORE UPDATE ON public.ai_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_feedback_updated_at();

-- View for feedback analytics (admins only)
CREATE OR REPLACE VIEW public.ai_feedback_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  rating,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY DATE_TRUNC('day', created_at)) as percentage
FROM public.ai_feedback
GROUP BY DATE_TRUNC('day', created_at), rating
ORDER BY date DESC, rating;

COMMENT ON TABLE public.ai_feedback IS 'Stores user feedback on AI assistant responses';
COMMENT ON VIEW public.ai_feedback_analytics IS 'Analytics view for AI feedback (admins only)';


-- QuickQuote AI Row Level Security Policies
-- Migration: 002_rls_policies
-- Created: 2025-10-11

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_material_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- Users can view and update their own profile
-- =============================================

-- View own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Insert own profile (handled by trigger, but allow for manual cases)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Delete own profile
CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- =============================================
-- PROJECTS POLICIES
-- Users can manage their own projects
-- =============================================

-- View own projects
CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create own projects
CREATE POLICY "Users can create own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own projects
CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete own projects
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ESTIMATES POLICIES
-- Users can manage estimates for their projects
-- =============================================

-- View estimates for own projects
CREATE POLICY "Users can view estimates for own projects"
  ON estimates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = estimates.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Create estimates for own projects
CREATE POLICY "Users can create estimates for own projects"
  ON estimates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Update estimates for own projects
CREATE POLICY "Users can update estimates for own projects"
  ON estimates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = estimates.project_id
        AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = estimates.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Delete estimates for own projects
CREATE POLICY "Users can delete estimates for own projects"
  ON estimates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = estimates.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- =============================================
-- MATERIAL PRICES POLICIES
-- All authenticated users can read material prices
-- Only system/admin can write (for now, we'll allow authenticated users)
-- =============================================

-- All authenticated users can view material prices
CREATE POLICY "Authenticated users can view material prices"
  ON material_prices
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert material prices (for caching)
CREATE POLICY "Authenticated users can cache material prices"
  ON material_prices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update material prices they created
CREATE POLICY "Users can update material price cache"
  ON material_prices
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- USER MATERIAL OVERRIDES POLICIES
-- Users can manage their own price overrides
-- =============================================

-- View own overrides
CREATE POLICY "Users can view own material overrides"
  ON user_material_overrides
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create own overrides
CREATE POLICY "Users can create own material overrides"
  ON user_material_overrides
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own overrides
CREATE POLICY "Users can update own material overrides"
  ON user_material_overrides
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete own overrides
CREATE POLICY "Users can delete own material overrides"
  ON user_material_overrides
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ESTIMATE HISTORY POLICIES
-- Users can view history for their own estimates
-- =============================================

-- View history for own estimates
CREATE POLICY "Users can view history for own estimates"
  ON estimate_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM estimates
      JOIN projects ON projects.id = estimates.project_id
      WHERE estimates.id = estimate_history.estimate_id
        AND projects.user_id = auth.uid()
    )
  );

-- System can insert history (all authenticated users for now)
CREATE POLICY "System can insert estimate history"
  ON estimate_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if user owns a project
CREATE OR REPLACE FUNCTION user_owns_project(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects
    WHERE id = project_uuid
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns an estimate
CREATE OR REPLACE FUNCTION user_owns_estimate(estimate_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM estimates e
    JOIN projects p ON p.id = e.project_id
    WHERE e.id = estimate_uuid
      AND p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON POLICY "Users can view own profile" ON profiles IS
  'Users can only view their own profile data';

COMMENT ON POLICY "Users can view own projects" ON projects IS
  'Users can only view projects they created';

COMMENT ON POLICY "Users can view estimates for own projects" ON estimates IS
  'Users can view estimates for projects they own';

COMMENT ON POLICY "Authenticated users can view material prices" ON material_prices IS
  'All authenticated users can view cached material prices';

COMMENT ON POLICY "Users can view own material overrides" ON user_material_overrides IS
  'Users can view their custom material price overrides';


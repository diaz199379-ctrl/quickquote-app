-- Price Comparison Feature Tables
-- Migration: 005_price_comparison_tables

-- Table: material_prices
-- Stores cached material prices from various sources
CREATE TABLE IF NOT EXISTS material_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  zip_code TEXT,
  source_type TEXT NOT NULL, -- 'ai_estimate', 'cached', 'supplier_api', etc.
  supplier_name TEXT,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_material_prices_lookup 
ON material_prices(material_name, zip_code, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_material_prices_category 
ON material_prices(material_category, created_at DESC);

-- Table: user_material_overrides
-- User's custom material prices
CREATE TABLE IF NOT EXISTS user_material_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL,
  unit TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  zip_code TEXT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one custom price per material per user per zip
  UNIQUE(user_id, material_name, zip_code)
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_overrides_lookup 
ON user_material_overrides(user_id, material_name);

-- Table: price_alerts
-- User alerts for price changes
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  threshold_percentage DECIMAL(5, 2) NOT NULL DEFAULT 10.0, -- Alert if price changes by this %
  last_known_price DECIMAL(10, 2),
  alert_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, material_name)
);

-- RLS Policies for user_material_overrides
ALTER TABLE user_material_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own material overrides"
  ON user_material_overrides FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own material overrides"
  ON user_material_overrides FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own material overrides"
  ON user_material_overrides FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own material overrides"
  ON user_material_overrides FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for price_alerts
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own price alerts"
  ON price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price alerts"
  ON price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts"
  ON price_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts"
  ON price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for material_prices (public read for caching, service role write)
ALTER TABLE material_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to material prices"
  ON material_prices FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_material_prices_updated_at BEFORE UPDATE
  ON material_prices FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_overrides_updated_at BEFORE UPDATE
  ON user_material_overrides FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE
  ON price_alerts FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Comments
COMMENT ON TABLE material_prices IS 'Cached material prices from various sources for price comparison';
COMMENT ON TABLE user_material_overrides IS 'User-defined custom material prices';
COMMENT ON TABLE price_alerts IS 'User alerts for material price changes';


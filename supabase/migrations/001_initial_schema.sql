-- QuickQuote AI Database Schema
-- Migration: 001_initial_schema
-- Created: 2025-10-11

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

-- Project types
CREATE TYPE project_type AS ENUM (
  'deck',
  'kitchen',
  'bathroom',
  'flooring',
  'painting',
  'roofing',
  'siding',
  'windows',
  'doors',
  'plumbing',
  'electrical',
  'hvac',
  'custom'
);

-- Project status
CREATE TYPE project_status AS ENUM (
  'draft',
  'active',
  'completed',
  'archived'
);

-- Material confidence levels
CREATE TYPE confidence_level AS ENUM (
  'high',
  'medium',
  'low'
);

-- Price source
CREATE TYPE price_source AS ENUM (
  'openai',
  'user',
  'supplier',
  'manual'
);

-- =============================================
-- TABLE: profiles
-- Extends Supabase auth.users with app-specific data
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  default_markup DECIMAL(5,2) DEFAULT 0.20 CHECK (default_markup >= 0 AND default_markup <= 1),
  default_labor_rate DECIMAL(8,2) DEFAULT 65.00 CHECK (default_labor_rate >= 0),
  zip_code TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE profiles IS 'User profiles with construction business settings';

-- =============================================
-- TABLE: projects
-- Construction projects for users
-- =============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_type project_type NOT NULL DEFAULT 'custom',
  status project_status NOT NULL DEFAULT 'draft',
  
  -- Client information
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  
  -- Project location
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT NOT NULL,
  
  -- Project details
  description TEXT,
  start_date DATE,
  end_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_project_name CHECK (LENGTH(project_name) >= 3),
  CONSTRAINT valid_zip_code CHECK (zip_code ~ '^\d{5}(-\d{4})?$')
);

-- Add comments
COMMENT ON TABLE projects IS 'Construction projects for tracking estimates and work';
COMMENT ON COLUMN projects.project_type IS 'Type of construction project';
COMMENT ON COLUMN projects.status IS 'Current project status';

-- =============================================
-- TABLE: estimates
-- Cost estimates for projects
-- =============================================

CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Estimate details
  estimate_name TEXT NOT NULL DEFAULT 'Estimate',
  version INTEGER DEFAULT 1,
  
  -- Dimensions (project-specific measurements)
  dimensions JSONB DEFAULT '{}'::jsonb,
  
  -- Materials breakdown
  materials JSONB DEFAULT '[]'::jsonb,
  
  -- Labor calculations
  labor_hours DECIMAL(10,2),
  labor_rate DECIMAL(8,2) NOT NULL,
  labor_total DECIMAL(12,2) GENERATED ALWAYS AS (labor_hours * labor_rate) STORED,
  
  -- Pricing
  markup_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.20,
  materials_subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) GENERATED ALWAYS AS (materials_subtotal + COALESCE(labor_hours * labor_rate, 0)) STORED,
  markup_amount DECIMAL(12,2) GENERATED ALWAYS AS ((materials_subtotal + COALESCE(labor_hours * labor_rate, 0)) * markup_percentage) STORED,
  total DECIMAL(12,2) GENERATED ALWAYS AS ((materials_subtotal + COALESCE(labor_hours * labor_rate, 0)) * (1 + markup_percentage)) STORED,
  
  -- Additional details
  notes TEXT,
  internal_notes TEXT,
  
  -- Price tracking
  price_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_labor_hours CHECK (labor_hours >= 0),
  CONSTRAINT valid_labor_rate CHECK (labor_rate >= 0),
  CONSTRAINT valid_markup CHECK (markup_percentage >= 0 AND markup_percentage <= 2),
  CONSTRAINT valid_materials_subtotal CHECK (materials_subtotal >= 0)
);

-- Add comments
COMMENT ON TABLE estimates IS 'Cost estimates for construction projects';
COMMENT ON COLUMN estimates.dimensions IS 'Project-specific measurements in JSON format';
COMMENT ON COLUMN estimates.materials IS 'Array of materials with quantities and prices';
COMMENT ON COLUMN estimates.labor_total IS 'Calculated: labor_hours * labor_rate';
COMMENT ON COLUMN estimates.subtotal IS 'Calculated: materials + labor';
COMMENT ON COLUMN estimates.total IS 'Calculated: subtotal * (1 + markup)';

-- =============================================
-- TABLE: material_prices
-- Cached material prices by location
-- =============================================

CREATE TABLE material_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Material identification
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL,
  material_sku TEXT,
  
  -- Pricing
  unit TEXT NOT NULL, -- 'each', 'sqft', 'lnft', 'sheet', 'gallon', etc.
  price DECIMAL(12,2) NOT NULL,
  
  -- Location
  zip_code TEXT NOT NULL,
  
  -- Source and confidence
  source price_source NOT NULL DEFAULT 'openai',
  confidence confidence_level NOT NULL DEFAULT 'medium',
  supplier_name TEXT,
  
  -- Validity
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_zip_code_format CHECK (zip_code ~ '^\d{5}(-\d{4})?$'),
  CONSTRAINT valid_expiry CHECK (expires_at > fetched_at)
);

-- Add comments
COMMENT ON TABLE material_prices IS 'Cached material prices by location and source';
COMMENT ON COLUMN material_prices.unit IS 'Unit of measurement (each, sqft, lnft, etc.)';
COMMENT ON COLUMN material_prices.confidence IS 'Confidence level of price accuracy';

-- =============================================
-- TABLE: user_material_overrides
-- User-specific material price overrides
-- =============================================

CREATE TABLE user_material_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Material identification
  material_name TEXT NOT NULL,
  material_category TEXT,
  
  -- Custom pricing
  custom_price DECIMAL(12,2) NOT NULL,
  unit TEXT NOT NULL,
  
  -- Details
  notes TEXT,
  supplier_name TEXT,
  
  -- Validity
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_custom_price CHECK (custom_price >= 0),
  CONSTRAINT unique_user_material UNIQUE (user_id, material_name)
);

-- Add comments
COMMENT ON TABLE user_material_overrides IS 'User-specific material price overrides';
COMMENT ON COLUMN user_material_overrides.custom_price IS 'User-defined price override';

-- =============================================
-- TABLE: estimate_history
-- Track changes to estimates (audit log)
-- =============================================

CREATE TABLE estimate_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Change tracking
  action TEXT NOT NULL, -- 'created', 'updated', 'approved', etc.
  changes JSONB DEFAULT '{}'::jsonb,
  
  -- Snapshot
  total_before DECIMAL(12,2),
  total_after DECIMAL(12,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE estimate_history IS 'Audit log for estimate changes';

-- =============================================
-- INDEXES
-- For query performance optimization
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_company ON profiles(company_name);
CREATE INDEX idx_profiles_zip_code ON profiles(zip_code);

-- Projects indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_zip_code ON projects(zip_code);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);

-- Estimates indexes
CREATE INDEX idx_estimates_project_id ON estimates(project_id);
CREATE INDEX idx_estimates_created_at ON estimates(created_at DESC);
CREATE INDEX idx_estimates_approved ON estimates(is_approved);
CREATE INDEX idx_estimates_project_created ON estimates(project_id, created_at DESC);

-- Material prices indexes
CREATE INDEX idx_material_prices_name ON material_prices(material_name);
CREATE INDEX idx_material_prices_category ON material_prices(material_category);
CREATE INDEX idx_material_prices_zip ON material_prices(zip_code);
CREATE INDEX idx_material_prices_active ON material_prices(is_active) WHERE is_active = true;
CREATE INDEX idx_material_prices_expires ON material_prices(expires_at) WHERE is_active = true;
CREATE INDEX idx_material_prices_lookup ON material_prices(material_name, zip_code, is_active);

-- User overrides indexes
CREATE INDEX idx_user_overrides_user_id ON user_material_overrides(user_id);
CREATE INDEX idx_user_overrides_active ON user_material_overrides(is_active) WHERE is_active = true;

-- History indexes
CREATE INDEX idx_estimate_history_estimate_id ON estimate_history(estimate_id, created_at DESC);
CREATE INDEX idx_estimate_history_user_id ON estimate_history(user_id);

-- =============================================
-- FUNCTIONS
-- Automatic updated_at timestamp
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- Automatic timestamp updates
-- =============================================

-- Profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Projects
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Estimates
CREATE TRIGGER set_estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Material prices
CREATE TRIGGER set_material_prices_updated_at
  BEFORE UPDATE ON material_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- User overrides
CREATE TRIGGER set_user_overrides_updated_at
  BEFORE UPDATE ON user_material_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGER: Auto-create profile on user signup
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;


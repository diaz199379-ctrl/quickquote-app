-- QuickQuote AI - Common SQL Queries
-- Helpful queries for development and debugging

-- =============================================
-- USER & PROFILE QUERIES
-- =============================================

-- Get user profile with stats
SELECT 
  p.*,
  COUNT(DISTINCT pr.id) as total_projects,
  COUNT(DISTINCT e.id) as total_estimates,
  SUM(e.total) as total_revenue
FROM profiles p
LEFT JOIN projects pr ON pr.user_id = p.id
LEFT JOIN estimates e ON e.project_id = pr.id
WHERE p.id = auth.uid()
GROUP BY p.id;

-- Update user settings
UPDATE profiles
SET 
  default_markup = 0.25,
  default_labor_rate = 75.00
WHERE id = auth.uid();

-- =============================================
-- PROJECT QUERIES
-- =============================================

-- Get all projects for current user
SELECT *
FROM projects
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Get projects by status
SELECT *
FROM projects
WHERE user_id = auth.uid()
  AND status = 'active'
ORDER BY project_name;

-- Get project with estimates
SELECT 
  p.*,
  json_agg(
    json_build_object(
      'id', e.id,
      'estimate_name', e.estimate_name,
      'total', e.total,
      'is_approved', e.is_approved,
      'created_at', e.created_at
    )
  ) as estimates
FROM projects p
LEFT JOIN estimates e ON e.project_id = p.id
WHERE p.id = 'project-uuid-here'
GROUP BY p.id;

-- Project statistics
SELECT 
  project_type,
  COUNT(*) as count,
  AVG(
    CASE WHEN status = 'completed' THEN 1 ELSE 0 END
  ) * 100 as completion_rate
FROM projects
WHERE user_id = auth.uid()
GROUP BY project_type;

-- =============================================
-- ESTIMATE QUERIES
-- =============================================

-- Get estimate with project details
SELECT 
  e.*,
  p.project_name,
  p.client_name,
  p.zip_code
FROM estimates e
JOIN projects p ON p.id = e.project_id
WHERE e.id = 'estimate-uuid-here';

-- Get all estimates for a project
SELECT *
FROM estimates
WHERE project_id = 'project-uuid-here'
ORDER BY version DESC, created_at DESC;

-- Calculate estimate totals (verify computed columns)
SELECT 
  id,
  labor_hours,
  labor_rate,
  labor_hours * labor_rate as calculated_labor,
  labor_total,
  materials_subtotal,
  subtotal,
  markup_percentage,
  total
FROM estimates
WHERE id = 'estimate-uuid-here';

-- Get top estimates by value
SELECT 
  e.id,
  e.estimate_name,
  e.total,
  p.project_name,
  p.client_name
FROM estimates e
JOIN projects p ON p.id = e.project_id
WHERE p.user_id = auth.uid()
ORDER BY e.total DESC
LIMIT 10;

-- =============================================
-- MATERIAL PRICE QUERIES
-- =============================================

-- Search for material prices
SELECT *
FROM material_prices
WHERE material_name ILIKE '%lumber%'
  AND zip_code = '90210'
  AND is_active = true
  AND expires_at > NOW()
ORDER BY confidence DESC, fetched_at DESC;

-- Get materials by category
SELECT 
  material_category,
  material_name,
  unit,
  price,
  confidence
FROM material_prices
WHERE zip_code = '90210'
  AND material_category = 'lumber'
  AND is_active = true
ORDER BY material_name;

-- Find expired prices (need refresh)
SELECT *
FROM material_prices
WHERE expires_at < NOW()
  OR is_active = false
ORDER BY expires_at;

-- Average prices by material
SELECT 
  material_name,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price,
  COUNT(*) as price_count
FROM material_prices
WHERE is_active = true
  AND expires_at > NOW()
GROUP BY material_name
ORDER BY material_name;

-- =============================================
-- USER MATERIAL OVERRIDE QUERIES
-- =============================================

-- Get user's custom prices
SELECT *
FROM user_material_overrides
WHERE user_id = auth.uid()
  AND is_active = true
ORDER BY material_name;

-- Get effective price (custom or cached)
SELECT 
  COALESCE(umo.custom_price, mp.price) as effective_price,
  CASE 
    WHEN umo.custom_price IS NOT NULL THEN 'custom'
    ELSE mp.source
  END as price_source
FROM material_prices mp
LEFT JOIN user_material_overrides umo 
  ON umo.material_name = mp.material_name 
  AND umo.user_id = auth.uid()
  AND umo.is_active = true
WHERE mp.material_name = 'Material Name'
  AND mp.zip_code = '90210'
  AND mp.is_active = true
ORDER BY mp.fetched_at DESC
LIMIT 1;

-- =============================================
-- ESTIMATE HISTORY QUERIES
-- =============================================

-- Get estimate change history
SELECT 
  eh.*,
  p.full_name as changed_by
FROM estimate_history eh
JOIN profiles p ON p.id = eh.user_id
WHERE eh.estimate_id = 'estimate-uuid-here'
ORDER BY eh.created_at DESC;

-- Track price changes over time
SELECT 
  created_at,
  action,
  total_before,
  total_after,
  total_after - total_before as change_amount
FROM estimate_history
WHERE estimate_id = 'estimate-uuid-here'
  AND action = 'updated'
ORDER BY created_at;

-- =============================================
-- ANALYTICS QUERIES
-- =============================================

-- Monthly revenue report
SELECT 
  DATE_TRUNC('month', e.created_at) as month,
  COUNT(DISTINCT p.id) as projects,
  COUNT(e.id) as estimates,
  SUM(e.total) as total_revenue,
  AVG(e.total) as avg_estimate
FROM projects p
JOIN estimates e ON e.project_id = p.id
WHERE p.user_id = auth.uid()
  AND e.is_approved = true
GROUP BY DATE_TRUNC('month', e.created_at)
ORDER BY month DESC;

-- Win rate by project type
SELECT 
  p.project_type,
  COUNT(e.id) as total_estimates,
  SUM(CASE WHEN e.is_approved THEN 1 ELSE 0 END) as approved,
  ROUND(
    SUM(CASE WHEN e.is_approved THEN 1 ELSE 0 END)::numeric 
    / COUNT(e.id) * 100, 
    2
  ) as win_rate_percent
FROM projects p
JOIN estimates e ON e.project_id = p.id
WHERE p.user_id = auth.uid()
GROUP BY p.project_type
ORDER BY win_rate_percent DESC;

-- Average markup by project type
SELECT 
  p.project_type,
  AVG(e.markup_percentage) * 100 as avg_markup_percent,
  AVG(e.total) as avg_total
FROM projects p
JOIN estimates e ON e.project_id = p.id
WHERE p.user_id = auth.uid()
GROUP BY p.project_type;

-- =============================================
-- MAINTENANCE QUERIES
-- =============================================

-- Delete expired material prices
DELETE FROM material_prices
WHERE expires_at < NOW() - INTERVAL '90 days';

-- Deactivate old prices instead of deleting
UPDATE material_prices
SET is_active = false
WHERE expires_at < NOW()
  AND is_active = true;

-- Archive old completed projects
UPDATE projects
SET status = 'archived'
WHERE status = 'completed'
  AND updated_at < NOW() - INTERVAL '1 year';

-- Clean up draft projects older than 30 days
DELETE FROM projects
WHERE status = 'draft'
  AND created_at < NOW() - INTERVAL '30 days'
  AND NOT EXISTS (
    SELECT 1 FROM estimates WHERE estimates.project_id = projects.id
  );

-- =============================================
-- DEBUGGING QUERIES
-- =============================================

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check table sizes
SELECT 
  schemaname as schema,
  tablename as table,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Count rows in all tables
SELECT 
  'profiles' as table_name, 
  COUNT(*) as row_count 
FROM profiles
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'estimates', COUNT(*) FROM estimates
UNION ALL
SELECT 'material_prices', COUNT(*) FROM material_prices
UNION ALL
SELECT 'user_material_overrides', COUNT(*) FROM user_material_overrides
UNION ALL
SELECT 'estimate_history', COUNT(*) FROM estimate_history;

-- =============================================
-- PERFORMANCE TESTING
-- =============================================

-- Explain query plan
EXPLAIN ANALYZE
SELECT *
FROM projects
WHERE user_id = auth.uid()
  AND status = 'active';

-- Find slow queries (requires pg_stat_statements extension)
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;


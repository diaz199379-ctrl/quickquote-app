# 🗄️ QuickQuote AI - Database Setup Guide

Complete guide for setting up your Supabase database with migrations, RLS policies, and TypeScript types.

---

## 📋 Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [Quick Setup](#quick-setup)
3. [Table Descriptions](#table-descriptions)
4. [Row Level Security](#row-level-security)
5. [Migrations](#migrations)
6. [TypeScript Types](#typescript-types)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Database Schema Overview

### Tables Created

```
┌─────────────────────┐
│     auth.users      │ (Supabase managed)
└──────────┬──────────┘
           │
           │ 1:1
           ▼
┌─────────────────────┐
│      profiles       │ (User settings & preferences)
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐
│      projects       │ (Construction projects)
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐
│     estimates       │ (Cost estimates)
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐
│  estimate_history   │ (Audit log)
└─────────────────────┘

Supporting Tables:
┌─────────────────────┐     ┌──────────────────────────┐
│  material_prices    │     │ user_material_overrides  │
│  (Price cache)      │     │ (Custom prices)          │
└─────────────────────┘     └──────────────────────────┘
```

---

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: `quickquote-ai`
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait 2 minutes for project creation

### Step 2: Run Migrations

**Option A: Using Supabase Dashboard (Easiest)**

1. Open your Supabase project
2. Go to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click **"Run"**
6. Repeat for `002_rls_policies.sql`

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 3: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see 6 tables:
   - ✅ profiles
   - ✅ projects
   - ✅ estimates
   - ✅ material_prices
   - ✅ user_material_overrides
   - ✅ estimate_history

---

## 📊 Table Descriptions

### 1. profiles

**Purpose**: Extends Supabase auth.users with construction business settings

**Key Fields**:
- `id` - References auth.users(id)
- `company_name` - User's construction company
- `default_markup` - Default profit markup (e.g., 0.20 = 20%)
- `default_labor_rate` - Default hourly labor rate ($65/hr)
- `zip_code` - For location-based material pricing

**Automatic Creation**: A profile is automatically created when a user signs up (via trigger)

---

### 2. projects

**Purpose**: Construction projects for estimating

**Key Fields**:
- `project_name` - Name of the project
- `project_type` - Type: deck, kitchen, bathroom, flooring, painting, etc.
- `status` - draft, active, completed, archived
- `client_name`, `client_email` - Client information
- `zip_code` - Required for material price lookup

**Example**:
```typescript
{
  project_name: "Johnson Kitchen Remodel",
  project_type: "kitchen",
  status: "active",
  client_name: "John Johnson",
  zip_code: "90210"
}
```

---

### 3. estimates

**Purpose**: Cost estimates for projects

**Key Fields**:
- `dimensions` - JSONB field storing project measurements
- `materials` - JSONB array of materials with quantities and prices
- `labor_hours` - Estimated labor hours
- `labor_rate` - Hourly rate for this estimate
- `markup_percentage` - Profit markup
- `total` - **COMPUTED** final price (auto-calculated)

**Computed Fields**:
- `labor_total` = labor_hours × labor_rate
- `subtotal` = materials_subtotal + labor_total
- `markup_amount` = subtotal × markup_percentage
- `total` = subtotal × (1 + markup_percentage)

**Example**:
```typescript
{
  project_id: "uuid",
  dimensions: {
    length: 12,
    width: 15,
    area: 180
  },
  materials: [
    {
      name: "2x6 Pressure Treated Lumber",
      quantity: 20,
      unit: "each",
      unit_price: 12.50,
      total_price: 250.00
    }
  ],
  labor_hours: 40,
  labor_rate: 65,
  markup_percentage: 0.20
}
```

---

### 4. material_prices

**Purpose**: Cache material prices by location

**Key Fields**:
- `material_name` - Name of the material
- `unit` - Unit of measurement (each, sqft, lnft, etc.)
- `price` - Current price
- `zip_code` - Location for price
- `source` - openai, user, supplier, manual
- `confidence` - high, medium, low
- `expires_at` - When price becomes stale (default: 30 days)

**Usage**: Reduces API calls by caching prices locally

---

### 5. user_material_overrides

**Purpose**: User-specific material price overrides

**Key Fields**:
- `user_id` - Which user set this override
- `material_name` - Material to override
- `custom_price` - User's preferred price
- `supplier_name` - Optional supplier info

**Example**: User has a bulk discount on lumber from their local supplier

---

### 6. estimate_history

**Purpose**: Audit log for estimate changes

**Key Fields**:
- `estimate_id` - Which estimate changed
- `user_id` - Who made the change
- `action` - created, updated, approved, etc.
- `changes` - JSONB of what changed
- `total_before`, `total_after` - Price tracking

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Security Principles

1. **Users can only access their own data**
2. **Material prices are shared (read-only)**
3. **History is read-only**
4. **No cross-user access**

### Policy Examples

**profiles**: Users can view/update only their own profile
```sql
USING (auth.uid() = id)
```

**projects**: Users can manage only their own projects
```sql
USING (auth.uid() = user_id)
```

**estimates**: Users can manage estimates for their projects
```sql
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = estimates.project_id
      AND projects.user_id = auth.uid()
  )
)
```

**material_prices**: All authenticated users can read, anyone can cache
```sql
TO authenticated USING (true)
```

---

## 📁 Migrations

### Migration Files

Located in `/supabase/migrations/`:

1. **001_initial_schema.sql** (Main schema)
   - Creates all tables
   - Defines enums
   - Adds indexes
   - Sets up triggers
   - Creates auto-profile function

2. **002_rls_policies.sql** (Security)
   - Enables RLS on all tables
   - Creates policies for each table
   - Adds helper functions

### Running Migrations

**Via Supabase Dashboard**:
1. SQL Editor → New Query
2. Copy/paste migration file
3. Run

**Via CLI**:
```bash
supabase db push
```

---

## 📝 TypeScript Types

### Generated Types

All database types are in `/types/database.types.ts`:

```typescript
import type { Database } from '@/types/database.types'

// Table row types
type Profile = Database['public']['Tables']['profiles']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Estimate = Database['public']['Tables']['estimates']['Row']

// Insert types
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

// Update types
type ProjectUpdate = Database['public']['Tables']['projects']['Update']
```

### Usage in Components

```typescript
import { Project, Estimate, MaterialItem } from '@/types/database.types'

function ProjectCard({ project }: { project: Project }) {
  return <div>{project.project_name}</div>
}
```

---

## 💻 Usage Examples

### Creating a Profile

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const { data, error } = await supabase
  .from('profiles')
  .update({
    company_name: 'ABC Construction',
    default_markup: 0.25,
    default_labor_rate: 75
  })
  .eq('id', user.id)
```

### Creating a Project

```typescript
const { data: project, error } = await supabase
  .from('projects')
  .insert({
    user_id: user.id,
    project_name: 'Kitchen Remodel',
    project_type: 'kitchen',
    client_name: 'John Doe',
    zip_code: '90210'
  })
  .select()
  .single()
```

### Creating an Estimate

```typescript
const { data: estimate, error } = await supabase
  .from('estimates')
  .insert({
    project_id: project.id,
    dimensions: {
      length: 12,
      width: 15,
      area: 180
    },
    materials: [
      {
        id: 'mat-1',
        name: 'Lumber 2x6',
        quantity: 20,
        unit: 'each',
        unit_price: 12.50,
        total_price: 250.00
      }
    ],
    labor_hours: 40,
    labor_rate: 65,
    markup_percentage: 0.20,
    materials_subtotal: 1500
  })
  .select()
  .single()
```

### Querying with Relationships

```typescript
// Get project with all estimates
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    estimates (*)
  `)
  .eq('id', projectId)
  .single()

// Get estimate with project info
const { data } = await supabase
  .from('estimates')
  .select(`
    *,
    project:projects (
      project_name,
      client_name
    )
  `)
  .eq('id', estimateId)
  .single()
```

### Caching Material Prices

```typescript
const { data, error } = await supabase
  .from('material_prices')
  .insert({
    material_name: '2x6 Pressure Treated Lumber',
    material_category: 'lumber',
    unit: 'each',
    price: 12.50,
    zip_code: '90210',
    source: 'openai',
    confidence: 'high',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  })
```

---

## 🐛 Troubleshooting

### Common Issues

**"permission denied for table projects"**
- **Cause**: RLS policies not applied
- **Fix**: Run `002_rls_policies.sql` migration

**"null value in column user_id violates not-null constraint"**
- **Cause**: User not authenticated
- **Fix**: Ensure `auth.uid()` returns a value (user must be logged in)

**"foreign key violation"**
- **Cause**: Referenced record doesn't exist
- **Fix**: Create parent record first (e.g., project before estimate)

**"duplicate key value violates unique constraint"**
- **Cause**: Trying to insert a record with an existing ID
- **Fix**: Let the database generate UUIDs (don't provide `id` field)

### Checking RLS Policies

```sql
-- View all policies for a table
SELECT * FROM pg_policies WHERE tablename = 'projects';
```

### Testing Queries

Use Supabase SQL Editor with this helper:

```sql
-- Simulate authenticated user
SELECT auth.uid(); -- Should return your user ID

-- Test query
SELECT * FROM projects WHERE user_id = auth.uid();
```

---

## 🔄 Updating the Schema

### Adding a New Column

```sql
-- Add column
ALTER TABLE projects
ADD COLUMN budget DECIMAL(12,2);

-- Add default value
ALTER TABLE projects
ALTER COLUMN budget SET DEFAULT 0;

-- Add constraint
ALTER TABLE projects
ADD CONSTRAINT valid_budget CHECK (budget >= 0);
```

### Creating a New Index

```sql
CREATE INDEX idx_projects_budget 
ON projects(budget) 
WHERE budget IS NOT NULL;
```

---

## 📊 Database Statistics

**Expected Storage Per User** (1 year):
- Projects: ~100 projects × 1KB = 100KB
- Estimates: ~300 estimates × 5KB = 1.5MB
- Material Prices: Shared cache = ~10MB (all users)
- History: ~1,000 changes × 500B = 500KB
- **Total**: ~2.1MB per user per year

**Performance**:
- All queries use indexes
- RLS policies are optimized
- Material price cache reduces API calls

---

## ✅ Verification Checklist

After setup, verify:
- [ ] All 6 tables exist
- [ ] RLS is enabled on all tables
- [ ] Policies are created (check pg_policies)
- [ ] Indexes are created
- [ ] Triggers are working (check pg_trigger)
- [ ] Profile auto-creates on signup
- [ ] Can insert/query as authenticated user
- [ ] Cannot access other users' data

---

## 🆘 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **SQL Reference**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **RLS Guide**: [supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your database is now production-ready!** 🎉

*QuickQuote AI - Where data meets precision*


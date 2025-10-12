# QuickQuote AI - Next.js 14 App

> Professional construction estimating powered by AI with DEWALT-inspired design system

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd quickquote-app
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env.local` and fill in your credentials:

```bash
# In the quickquote-app directory
cp .env.example .env.local
```

Then edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app!

## 📁 Project Structure

```
quickquote-app/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── login/                 # Login page
│   │   ├── signup/                # Signup page
│   │   └── reset-password/        # Password reset page
│   ├── (dashboard)/               # Dashboard route group
│   │   ├── dashboard/             # Main dashboard
│   │   ├── projects/              # Projects management
│   │   ├── estimates/             # Estimates list
│   │   └── settings/              # User settings
│   ├── api/
│   │   └── auth/                  # Auth API routes
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles (DEWALT design system)
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card components
│   │   ├── input.tsx             # Input component
│   │   ├── label.tsx             # Label component
│   │   └── loading-spinner.tsx   # Loading spinner
│   ├── auth/                      # Auth-specific components
│   ├── dashboard/                 # Dashboard components
│   │   └── dashboard-nav.tsx     # Dashboard navigation
│   └── estimator/                 # Estimator components
├── lib/
│   ├── supabase/                  # Supabase configuration
│   │   ├── client.ts             # Client-side Supabase
│   │   ├── server.ts             # Server-side Supabase
│   │   └── middleware.ts         # Auth middleware
│   └── utils/
│       └── cn.ts                  # Class name utility
├── types/
│   ├── database.types.ts          # Supabase database types
│   └── index.ts                   # Common types
├── middleware.ts                   # Next.js middleware for auth
├── tailwind.config.ts             # DEWALT design system config
└── package.json
```

## 🎨 Design System

The app uses the **DEWALT-inspired design system** with:

- **Primary Color**: DEWALT Yellow (#FFCD00)
- **Secondary Color**: DEWALT Black (#000000)
- **Accent**: Safety Orange (#FF6B00)
- **Dark Theme**: Professional charcoal backgrounds
- **Custom Components**: Tailwind components with DEWALT styling

### Using Design System Classes

```tsx
// Buttons
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-accent">Destructive Action</button>

// Cards
<div className="card">Card content</div>

// Text Gradients
<h1 className="text-gradient-yellow">QuickQuote AI</h1>

// Special Effects
<div className="glow-yellow">Glowing element</div>
<div className="industrial-border">Industrial accent</div>
```

## 🔐 Authentication Setup

### Supabase Configuration

1. **Create a Supabase Project** at [supabase.com](https://supabase.com)

2. **Create the `profiles` table**:

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

3. **Create the `projects` table**:

```sql
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  status text not null default 'draft',
  type text not null,
  location text,
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table projects enable row level security;

-- Create policies
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);
```

4. **Create the `estimates` table**:

```sql
create table estimates (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  total_amount numeric not null,
  status text not null default 'draft',
  line_items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table estimates enable row level security;

-- Create policies
create policy "Users can view own estimates"
  on estimates for select
  using (auth.uid() = user_id);

create policy "Users can create own estimates"
  on estimates for insert
  with check (auth.uid() = user_id);

create policy "Users can update own estimates"
  on estimates for update
  using (auth.uid() = user_id);
```

5. **Get your credentials**:
   - Go to Project Settings → API
   - Copy `Project URL` and `anon public` key to `.env.local`

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom DEWALT design system
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Components**: Custom components with shadcn/ui patterns
- **State Management**: React Server Components + Client Components

## 🎯 Features

### Authentication
- ✅ Login with email/password
- ✅ Sign up with profile creation
- ✅ Password reset
- ✅ Protected routes with middleware
- ✅ Session management

### Dashboard
- ✅ Overview with stats
- ✅ Recent projects
- ✅ Quick actions
- ✅ Responsive navigation

### Projects
- ✅ Project listing
- ✅ Project filtering
- ✅ Status badges
- ✅ Project details

### Estimates
- ✅ Estimate listing
- ✅ Status tracking (draft, pending, approved, rejected)
- ✅ Total value calculations
- ✅ Line items support

### Settings
- ✅ Profile management
- ✅ Company information
- ✅ Notification preferences
- ✅ Security settings
- ✅ Password change

## 🎨 Component Library

### Buttons
```tsx
import { Button } from '@/components/ui/button'

<Button variant="primary" size="md" glow>Click Me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Delete</Button>
```

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card interactive>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Inputs
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<Label htmlFor="email" required>Email</Label>
<Input id="email" type="email" placeholder="you@example.com" />
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables for Production

Make sure to add these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## 📖 Documentation

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

This is a starting template. Feel free to customize and extend it for your needs!

## 📝 License

MIT License - Use freely for your projects

---

**Built with ⚡ and 🛠️ for construction professionals**

*QuickQuote AI - Where precision meets speed*

# 🔐 Security Best Practices

This document outlines the security measures implemented in QuickQuote AI and best practices for maintaining a secure application.

---

## 🎯 Overview

QuickQuote AI implements **defense-in-depth** security:
1. **Environment Variable Protection** - API keys never exposed to client
2. **Row Level Security (RLS)** - Database-level access control
3. **Route Protection** - Middleware-based authentication
4. **Server-Side API Calls** - Sensitive operations on server only
5. **Input Validation** - Client and server-side validation

---

## 🔑 Environment Variables

### ✅ Safe for Client-Side (`NEXT_PUBLIC_*`)

These variables are **embedded in the browser bundle** and are **safe to expose**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=https://your-app.com
```

**Why safe?**
- Supabase Anon Key respects Row Level Security (RLS) policies
- URL is publicly accessible anyway
- App URL is needed for redirects

### ❌ NEVER Client-Side (No `NEXT_PUBLIC_` prefix)

These must **ONLY** be used server-side:

```env
OPENAI_API_KEY=sk-...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
STRIPE_SECRET_KEY=sk_live_...
```

**Why dangerous?**
- OpenAI key = Unlimited API usage on your account
- Service Role Key = Bypasses ALL database security
- Stripe Secret = Can process payments without authorization

---

## 🗂️ File Structure & Security

### Client-Side Files (Browser-Safe)
```
✅ app/(dashboard)/**/*.tsx        - React components
✅ components/**/*.tsx              - UI components
✅ lib/supabase/client.ts          - Browser Supabase client
✅ lib/i18n/context.tsx             - i18n provider
```

### Server-Side Only (⚠️  NEVER import in client code)
```
❌ lib/supabase/admin.ts           - Admin client (Service Role Key)
❌ lib/openai/server.ts            - OpenAI wrapper
❌ app/api/**/*.ts                 - API routes
❌ lib/supabase/server.ts          - Server Supabase client
```

### How to Verify Server-Side Usage

Both `admin.ts` and `openai/server.ts` include runtime checks:

```typescript
function assertServerSide(functionName: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(`${functionName} can only be called server-side.`)
  }
}
```

**If you accidentally import these in client code, the app will crash with a clear error.**

---

## 🔒 Supabase Security Architecture

### 1. Row Level Security (RLS)

All database tables have RLS enabled:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
```

### 2. RLS Policies

Users can only access their own data:

```sql
-- Example: Users can only see their own projects
CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Three Supabase Clients

| Client | File | Key Used | Use Case |
|--------|------|----------|----------|
| **Browser Client** | `lib/supabase/client.ts` | Anon Key | Client-side auth, queries (respects RLS) |
| **Server Client** | `lib/supabase/server.ts` | Anon Key | Server components (respects RLS) |
| **Admin Client** | `lib/supabase/admin.ts` | Service Role Key | Admin operations (bypasses RLS) ⚠️ |

### When to Use Each:

```typescript
// ✅ Client-side (browser): Use browser client
import { createClient } from '@/lib/supabase/client'

// ✅ Server components: Use server client
import { createClient } from '@/lib/supabase/server'

// ⚠️  Admin operations only: Use admin client
import { supabaseAdmin } from '@/lib/supabase/admin'
```

---

## 🚨 Common Security Mistakes (DON'T DO THESE!)

### ❌ 1. Exposing Secret Keys

**WRONG:**
```typescript
// ❌ BAD: Putting API keys in client-side code
const openai = new OpenAI({
  apiKey: 'sk-abc123...' // ← NEVER DO THIS
})
```

**RIGHT:**
```typescript
// ✅ GOOD: Call API route instead
const response = await fetch('/api/pricing/ai-estimate', {
  method: 'POST',
  body: JSON.stringify({ material: 'lumber' })
})
```

### ❌ 2. Using Service Role Key Directly

**WRONG:**
```typescript
// ❌ BAD: Using service role key in client
const supabase = createClient(url, SERVICE_ROLE_KEY) // ← DANGER!
```

**RIGHT:**
```typescript
// ✅ GOOD: Use anon key (respects RLS)
const supabase = createClient(url, ANON_KEY)
```

### ❌ 3. Disabling RLS

**WRONG:**
```sql
-- ❌ BAD: Disabling security
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**RIGHT:**
```sql
-- ✅ GOOD: Keep RLS enabled and add policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "name" ON profiles FOR SELECT USING (auth.uid() = id);
```

### ❌ 4. Trusting Client Input

**WRONG:**
```typescript
// ❌ BAD: Trusting client-provided user ID
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId) // ← userId from client, could be manipulated
```

**RIGHT:**
```typescript
// ✅ GOOD: Use auth.uid() from JWT
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', auth.uid()) // ← Verified by Supabase
```

---

## 🛡️ Route Protection (Middleware)

### Protected Routes

These routes require authentication:
```
/dashboard
/estimator/*
/estimates/*
/projects/*
/settings/*
```

### How It Works

1. **Middleware runs on every request** (`middleware.ts`)
2. **Checks for valid session** (Supabase `auth.getUser()`)
3. **Redirects if unauthorized**:
   - Unauthenticated → `/login`
   - Authenticated trying to access `/login` → `/dashboard`

### Example Flow:

```
User visits /dashboard
  ↓
Middleware checks session
  ↓
No session found
  ↓
Redirect to /login?redirectedFrom=/dashboard
  ↓
After login, redirect back to /dashboard
```

---

## 🔐 API Route Security

### Template for Secure API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { estimateMaterialPrice } from '@/lib/openai/server'

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Validate input
    const body = await req.json()
    const { materialName } = body
    
    if (!materialName || typeof materialName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    // 3. Perform secure operation (server-side only)
    const result = await estimateMaterialPrice(
      materialName,
      'construction',
      'each',
      '90210'
    )

    // 4. Return result
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 🧪 Security Testing Checklist

### Before Deployment

- [ ] **No API keys in client-side code**
  ```bash
  # Search for exposed keys
  grep -r "sk-" app/
  grep -r "OPENAI_API_KEY" app/ --exclude-dir=api
  ```

- [ ] **RLS enabled on all tables**
  ```sql
  SELECT schemaname, tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';
  ```

- [ ] **Test unauthorized access**
  - Try accessing `/dashboard` without login
  - Try querying other users' data via browser console
  - Verify RLS blocks cross-user queries

- [ ] **Environment variables configured**
  - Development: `.env.local` present
  - Production: Vercel dashboard has all variables

- [ ] **Build succeeds**
  ```bash
  npm run build
  ```

### After Deployment

- [ ] **Test authentication flows**
  - Signup
  - Login
  - Logout
  - Password reset

- [ ] **Verify API security**
  - API routes require authentication
  - Unauthorized requests return 401
  - Server logs don't expose secrets

- [ ] **Monitor for anomalies**
  - Supabase Dashboard → Auth logs
  - OpenAI Dashboard → Usage metrics
  - Vercel Dashboard → Function logs

---

## 🚨 Incident Response

### If an API Key is Compromised:

1. **Immediately rotate the key**
   - OpenAI: https://platform.openai.com/api-keys
   - Supabase: Dashboard → Settings → API

2. **Update environment variables**
   - Local: `.env.local`
   - Production: Vercel dashboard → Environment Variables

3. **Redeploy**
   ```bash
   git push # Triggers Vercel deployment
   ```

4. **Monitor usage**
   - Check for unusual API calls
   - Review recent database changes

5. **Notify users if data breach** (if applicable)

---

## 📚 Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## ✅ Security Checklist Summary

**Environment:**
- [ ] `.env.local` created (not committed)
- [ ] All required keys configured
- [ ] No `NEXT_PUBLIC_` prefix on secrets

**Database:**
- [ ] RLS enabled on all tables
- [ ] Policies created for each table
- [ ] Service role key protected

**Code:**
- [ ] Admin client only in server code
- [ ] OpenAI client only in API routes
- [ ] Input validation on all endpoints

**Deployment:**
- [ ] Environment variables in Vercel
- [ ] Build passes
- [ ] Routes protected by middleware

**Monitoring:**
- [ ] Auth logs reviewed
- [ ] API usage tracked
- [ ] Error logs monitored

---

## 🎉 You're Secure!

By following these practices, your QuickQuote AI app is production-ready and secure. 🚀


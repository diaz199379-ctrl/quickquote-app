# ⚡ Supabase Quick Start - QuickQuote AI

**Get your database running in 5 minutes!**

---

## 🎯 Step 1: Create Supabase Project (2 min)

1. Go to: **https://supabase.com**
2. Click **"New Project"**
3. Fill in:
   ```
   Name: quickquote-ai
   Database Password: [create a strong password - SAVE THIS!]
   Region: [choose closest to you]
   Plan: Free
   ```
4. Click **"Create new project"**
5. ⏳ **Wait 2 minutes** (project is being set up)

---

## 🗄️ Step 2: Run Database Migrations (2 min)

### Option A: Via Dashboard (Recommended)

1. In your Supabase project, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (bottom right)
7. ✅ You should see "Success" message

8. Click **"New query"** again
9. Open `supabase/migrations/002_rls_policies.sql`
10. Copy and paste contents
11. Click **"Run"**
12. ✅ Success!

### Option B: Via Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

---

## 🔑 Step 3: Get Your API Keys (30 seconds)

1. In Supabase dashboard, click **"Settings"** (gear icon, bottom left)
2. Click **"API"** in settings menu
3. You'll see two keys:

**Copy these:**
- ✅ **Project URL** (starts with `https://`)
- ✅ **anon public key** (long string starting with `eyJ...`)

---

## ⚙️ Step 4: Update Your `.env.local` (30 seconds)

1. Open your project folder: `C:\Users\diaz1\quickquote-app`
2. Find file: `.env.local`
3. Update with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=your-openai-key-optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Save** the file

---

## 🚀 Step 5: Restart Your App (30 seconds)

1. Go to your **PowerShell window** (where `npm run dev` is running)
2. Press **Ctrl + C** to stop
3. Type **`npm run dev`** and press Enter
4. Wait for "Ready" message

---

## ✅ Step 6: Test It! (30 seconds)

1. Go to: **http://localhost:3000/signup**
2. Create a test account
3. If signup works → **Database is connected!** 🎉

---

## 📊 Verify Database Setup

Go to Supabase **"Table Editor"** and check you have these 6 tables:

- ✅ **profiles** - User settings
- ✅ **projects** - Construction projects
- ✅ **estimates** - Cost estimates
- ✅ **material_prices** - Price cache
- ✅ **user_material_overrides** - Custom prices
- ✅ **estimate_history** - Audit log

---

## 🐛 Troubleshooting

### "Invalid Supabase URL"
- **Check**: Did you copy the FULL URL including `https://`?
- **Check**: Did you save `.env.local`?
- **Check**: Did you restart the server?

### "permission denied for table"
- **Cause**: RLS policies not applied
- **Fix**: Run migration `002_rls_policies.sql`

### "relation does not exist"
- **Cause**: Tables not created
- **Fix**: Run migration `001_initial_schema.sql`

### "Can't find .env.local"
- **Fix**: Create it by copying `.env.example`
- Or create new file with the env variables

---

## 🎉 Success!

If you can sign up and login, your database is **fully configured**!

**Next steps:**
- Read `DATABASE_SETUP.md` for detailed schema info
- Check `supabase/queries.sql` for common queries
- Start building your app!

---

## 📚 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Table Editor**: [Your Project] → Table Editor
- **SQL Editor**: [Your Project] → SQL Editor
- **API Docs**: [Your Project] → Settings → API
- **Database Docs**: Full details in `DATABASE_SETUP.md`

---

**Total Time**: ~5 minutes
**Difficulty**: Beginner-friendly ✅

Your database is production-ready! 🚀


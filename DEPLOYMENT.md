# 🚀 Production Deployment Guide

This guide will help you deploy QuickQuote AI to production using Vercel.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Ready
- [ ] Supabase Project URL
- [ ] Supabase Anon Key
- [ ] Supabase Service Role Key (optional but recommended)
- [ ] OpenAI API Key

### 2. Code Quality
- [ ] All files committed to Git
- [ ] No console errors in development
- [ ] Build passes locally (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)

### 3. Database Setup
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] RLS policies enabled and tested

---

## 📝 Step-by-Step Deployment

### Step 1: Create .env.local (Local Development)

1. Copy the template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-actual-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your-service-role-key
   OPENAI_API_KEY=sk-...your-actual-openai-key
   ```

3. Test locally:
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000

---

### Step 2: Run Database Migrations (Supabase)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor** → **New Query**
3. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_auth_schema.sql`
   - `supabase/migrations/004_estimates_tables.sql`
   - `supabase/migrations/005_price_comparison_tables.sql`

4. Verify tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

---

### Step 3: Test Production Build Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Test all features:
   - [ ] Login/Signup works
   - [ ] Deck estimator generates estimates
   - [ ] Kitchen estimator works
   - [ ] Bathroom estimator works
   - [ ] PDF export works
   - [ ] Price comparison loads

---

### Step 4: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Create Vercel Account**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub

2. **Import Your Repository**
   - Click: **Add New** → **Project**
   - Import your GitHub repository: `quickquote-ai`
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave default)

3. **Configure Environment Variables**
   Click **Environment Variables** and add each one:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Production, Preview, Development |
   | `OPENAI_API_KEY` | `sk-...` | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |
   | `NODE_ENV` | `production` | Production |

4. **Deploy**
   - Click **Deploy**
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-app.vercel.app`

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd C:\Users\diaz1\quickquote-app
   vercel
   ```

4. Add environment variables via CLI:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add OPENAI_API_KEY
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🔄 Continuous Deployment (Auto-Deploy on Push)

Once connected to Vercel:

1. **Make changes locally**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Added new feature"
   git push
   ```
3. **Vercel automatically deploys** (takes ~2 minutes)
4. **Check deployment:** https://vercel.com/dashboard

---

## 🛠️ Post-Deployment Tasks

### 1. Update Supabase Auth Settings
- Go to: Supabase → **Authentication** → **URL Configuration**
- Add your Vercel URL to **Site URL**: `https://your-app.vercel.app`
- Add to **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

### 2. Test Production App
- [ ] Login works
- [ ] Create estimates
- [ ] Export PDFs
- [ ] AI suggestions load
- [ ] Price comparison works
- [ ] Mobile responsive

### 3. Set Up Custom Domain (Optional)
1. Go to: Vercel → **Settings** → **Domains**
2. Add your domain: `quickquote-ai.com`
3. Configure DNS (Vercel provides instructions)
4. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

### 4. Enable Analytics (Optional)
- Vercel Analytics: **Settings** → **Analytics** → Enable
- Vercel Speed Insights: **Settings** → **Speed Insights** → Enable

---

## 🐛 Troubleshooting

### Build Fails on Vercel
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Fix TypeScript errors: `npm run type-check`
4. Check for missing dependencies

### Environment Variables Not Working
1. Verify they're set in Vercel dashboard
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)

### Database Connection Issues
1. Verify Supabase URL and keys are correct
2. Check RLS policies are enabled
3. Test connection locally first

### OpenAI API Errors
1. Verify API key is valid
2. Check OpenAI account has credits
3. Verify key has correct permissions

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments:** View all deployments and logs
- **Functions:** Monitor serverless function execution
- **Analytics:** Track page views and performance
- **Logs:** Real-time error tracking

### Supabase Dashboard
- **Database:** Monitor query performance
- **Auth:** Track user signups and logins
- **Storage:** Monitor file uploads (if used)
- **Logs:** Database and API logs

---

## 🔐 Security Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Enable RLS on all Supabase tables
- Validate user input on server-side
- Use HTTPS (Vercel provides this automatically)
- Rotate API keys periodically

❌ **DON'T:**
- Commit `.env.local` to Git
- Use `NEXT_PUBLIC_` prefix for secret keys
- Disable RLS policies in production
- Expose service role keys to client
- Hard-code API keys in source code

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** Create an issue in your repository

---

## 🎉 Success!

Your app is now live! Share it with your friends:
```
https://your-app.vercel.app
```

To update:
```bash
git add .
git commit -m "Update description"
git push
```

Vercel will automatically deploy your changes! 🚀


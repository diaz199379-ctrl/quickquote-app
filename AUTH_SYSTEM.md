# 🔐 QuickQuote AI - Authentication System Documentation

Complete Supabase authentication system with DEWALT-themed UI components.

---

## 📁 File Structure

```
quickquote-app/
├── types/
│   └── auth.ts                           # TypeScript interfaces for auth
├── lib/
│   └── supabase/
│       ├── client.ts                     # Supabase client (browser)
│       ├── server.ts                     # Supabase server client
│       ├── middleware.ts                 # Session management
│       └── auth-helpers.ts               # Auth utility functions
├── components/
│   └── auth/
│       ├── LoginForm.tsx                 # Reusable login form
│       ├── SignupForm.tsx                # Reusable signup form
│       └── ResetPasswordForm.tsx         # Password reset form
├── app/
│   └── (auth)/
│       ├── login/page.tsx                # Login page
│       ├── signup/page.tsx               # Signup page
│       └── reset-password/page.tsx       # Password reset page
└── middleware.ts                          # Route protection
```

---

## 🎨 Features

### ✅ Authentication Features
- **Email/Password Login** with remember me
- **User Registration** with profile data
- **Password Reset** via email
- **Protected Routes** with middleware
- **Session Management** with Supabase
- **Form Validation** client-side and server-side
- **Error Handling** with clear user messages
- **Loading States** for all async operations

### ✅ DEWALT Design System
- **Dark theme** with construction aesthetic
- **Yellow CTAs** with hover effects and glow
- **Orange error messages** for visibility
- **Professional input fields** with focus rings
- **Animated transitions** for smooth UX
- **Responsive design** mobile-first approach

---

## 🚀 Components Usage

### LoginForm Component

```tsx
import { LoginForm } from '@/components/auth/LoginForm'

// In your page
<LoginForm />
```

**Features:**
- Email and password validation
- Remember me checkbox
- Forgot password link
- Error handling with visual feedback
- Loading spinner during authentication
- Auto-redirect to dashboard on success

---

### SignupForm Component

```tsx
import { SignupForm } from '@/components/auth/SignupForm'

// In your page
<SignupForm />
```

**Features:**
- Full name (required)
- Email (required with validation)
- Password (required with strength validation)
- Confirm password (must match)
- Company name (optional)
- Phone number (optional)
- Terms of service checkbox
- Success animation
- Auto-redirect to login after success

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### ResetPasswordForm Component

```tsx
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

// In your page
<ResetPasswordForm />
```

**Features:**
- Email validation
- Success confirmation with email display
- Helpful troubleshooting tips
- Try again functionality
- Back to login link

---

## 🔧 Helper Functions

### Authentication Functions

```typescript
import { 
  signIn, 
  signUp, 
  signOut,
  requestPasswordReset,
  getCurrentUser 
} from '@/lib/supabase/auth-helpers'

// Sign in
const { data, error } = await signIn({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
})

// Sign up
const { data, error } = await signUp({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe',
  companyName: 'ABC Construction',
  phone: '+1 555-0000'
})

// Sign out
const { error } = await signOut()

// Request password reset
const { error } = await requestPasswordReset({
  email: 'user@example.com'
})

// Get current user
const { data: user, error } = await getCurrentUser()
```

---

### Validation Functions

```typescript
import { validateEmail, validatePassword } from '@/lib/supabase/auth-helpers'

// Validate email
const emailCheck = validateEmail('user@example.com')
if (!emailCheck.valid) {
  console.log(emailCheck.message) // Error message
}

// Validate password strength
const passwordCheck = validatePassword('MyPassword123')
if (!passwordCheck.valid) {
  console.log(passwordCheck.message) // Error message
}
```

---

## 🛡️ Route Protection

The middleware automatically protects routes and redirects users:

### Protected Routes (Requires Authentication)
- `/dashboard`
- `/projects`
- `/estimates`
- `/settings`

### Public Routes (Redirects if Authenticated)
- `/login` → redirects to `/dashboard`
- `/signup` → redirects to `/dashboard`
- `/reset-password` → redirects to `/dashboard`

---

## 📝 TypeScript Types

### User Type
```typescript
interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    company_name?: string
    phone?: string
    avatar_url?: string
  }
}
```

### Login Credentials
```typescript
interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}
```

### Signup Credentials
```typescript
interface SignupCredentials {
  email: string
  password: string
  confirmPassword?: string
  fullName?: string
  companyName?: string
  phone?: string
}
```

### Auth Response
```typescript
interface AuthResponse<T = any> {
  data: T | null
  error: AuthError | null
}
```

---

## 🎨 Styling Customization

### Button Variants
```tsx
<Button variant="primary">Primary CTA</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>
```

### Input with Error
```tsx
<Input
  error="This field is required"
  placeholder="Enter value"
/>
```

### Loading States
```tsx
<Button disabled={loading}>
  {loading ? (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span>Loading...</span>
    </div>
  ) : (
    'Submit'
  )}
</Button>
```

---

## 🔐 Security Features

### Password Security
- Minimum length enforcement (8 characters)
- Complexity requirements (uppercase, lowercase, numbers)
- Confirmation matching
- Hashed storage (Supabase handles this)

### Session Security
- HTTP-only cookies
- Automatic session refresh
- Secure cookie transmission
- Server-side session validation

### CSRF Protection
- Supabase handles CSRF tokens
- State parameter validation
- Secure redirects

---

## 🐛 Error Handling

### Common Errors

**"Invalid login credentials"**
- User entered wrong email/password
- Account doesn't exist

**"User already registered"**
- Email is already in use
- Prompt to login instead

**"Password is too weak"**
- Doesn't meet requirements
- Show specific requirement that failed

**"Email confirmation required"**
- User needs to confirm email
- Check Supabase email settings

---

## ⚙️ Configuration

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase Dashboard Settings

1. **Authentication → Providers**
   - Enable Email provider
   - Configure email templates (optional)

2. **Authentication → Email Templates**
   - Customize confirmation email
   - Customize reset password email
   - Use DEWALT branding colors

3. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

---

## 📧 Email Templates

### Customize in Supabase

**Confirmation Email:**
- Subject: "Welcome to QuickQuote AI - Confirm Your Email"
- Use DEWALT yellow (#FFCD00) for CTAs
- Include construction-themed imagery

**Password Reset:**
- Subject: "Reset Your QuickQuote AI Password"
- Clear instructions
- Expiry time mention (1 hour)

---

## 🧪 Testing

### Manual Testing Checklist

**Login:**
- [ ] Valid credentials → Success
- [ ] Invalid email → Error
- [ ] Wrong password → Error
- [ ] Empty fields → Validation
- [ ] Remember me → Persists session

**Signup:**
- [ ] All required fields → Success
- [ ] Duplicate email → Error
- [ ] Weak password → Validation
- [ ] Password mismatch → Error
- [ ] Terms not accepted → Blocked

**Reset Password:**
- [ ] Valid email → Email sent
- [ ] Invalid email format → Validation
- [ ] Non-existent email → Still shows success (security)

**Protected Routes:**
- [ ] Access without login → Redirect to login
- [ ] Access with login → Show page
- [ ] Logout → Clear session

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] Set production environment variables
- [ ] Update Supabase redirect URLs
- [ ] Test email delivery in production
- [ ] Configure SMTP settings (if custom domain)
- [ ] Enable RLS policies in Supabase
- [ ] Test password reset flow
- [ ] Verify session persistence
- [ ] Check error logging

---

## 💡 Best Practices

### Security
1. Never store passwords in plain text
2. Always validate on both client and server
3. Use HTTPS in production
4. Implement rate limiting
5. Monitor for suspicious activity

### UX
1. Show clear error messages
2. Provide loading states
3. Auto-focus first input field
4. Remember user email (if they want)
5. Smooth transitions between states

### Accessibility
1. Proper label associations
2. Keyboard navigation support
3. Screen reader friendly
4. High contrast error messages
5. Focus indicators

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js 14 Auth](https://nextjs.org/docs/app/building-your-application/authentication)
- [DEWALT Brand Guidelines](https://www.dewalt.com/)

---

## 🆘 Troubleshooting

### "Supabase client not initialized"
**Fix:** Check environment variables are set correctly

### "Invalid JWT"
**Fix:** Clear browser cookies and re-login

### "Email not sent"
**Fix:** Check Supabase email settings and SMTP configuration

### "Redirect loop"
**Fix:** Check middleware configuration and route protection logic

---

**Built with 🔒 and ⚡ for secure, professional authentication**

*QuickQuote AI - Where security meets speed*


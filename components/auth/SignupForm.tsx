'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, validateEmail, validatePassword } from '@/lib/supabase/auth-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { SignupCredentials, FormErrors } from '@/types/auth'
import { useI18n } from '@/lib/i18n/context'

export function SignupForm() {
  const { t } = useI18n()
  const router = useRouter()
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    phone: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate full name
    if (!credentials.fullName || credentials.fullName.trim().length < 2) {
      newErrors.fullName = t('validation.fullNameRequired', { fallback: 'Please enter your full name' })
    }

    // Validate email
    const emailValidation = validateEmail(credentials.email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message
    }

    // Validate password
    const passwordValidation = validatePassword(credentials.password)
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message
    }

    // Validate password confirmation
    if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsDontMatch', { fallback: 'Passwords do not match' })
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      newErrors.general = t('validation.mustAcceptTerms', { fallback: 'You must accept the Terms of Service and Privacy Policy' })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    const { data, error } = await signUp(credentials)

    if (error) {
      setErrors({ general: error.message })
      setLoading(false)
    } else {
      // Success
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  // Success State
  if (success) {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="w-20 h-20 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-status-success" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">
          Account Created Successfully!
        </h3>
        <p className="text-text-secondary mb-2">
          Welcome to QuickQuote AI, {credentials.fullName}!
        </p>
        <p className="text-sm text-text-tertiary">
          Redirecting you to login...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* General Error Message */}
      {errors.general && (
        <div className="p-4 rounded-lg bg-status-error/10 border border-status-error">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0" />
            <p className="text-sm text-status-error">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <Label htmlFor="fullName" required>
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={credentials.fullName}
          onChange={(e) =>
            setCredentials({ ...credentials, fullName: e.target.value })
          }
          error={errors.fullName}
          disabled={loading}
          autoComplete="name"
          autoFocus
        />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          error={errors.email}
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {/* Company Name (Optional) */}
      <div>
        <Label htmlFor="companyName">
          Company Name
          <span className="text-text-tertiary text-xs ml-1">(Optional)</span>
        </Label>
        <Input
          id="companyName"
          type="text"
          placeholder="ABC Construction"
          value={credentials.companyName}
          onChange={(e) =>
            setCredentials({ ...credentials, companyName: e.target.value })
          }
          error={errors.companyName}
          disabled={loading}
          autoComplete="organization"
        />
      </div>

      {/* Phone (Optional) */}
      <div>
        <Label htmlFor="phone">
          Phone Number
          <span className="text-text-tertiary text-xs ml-1">(Optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={credentials.phone}
          onChange={(e) =>
            setCredentials({ ...credentials, phone: e.target.value })
          }
          error={errors.phone}
          disabled={loading}
          autoComplete="tel"
        />
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          error={errors.password}
          disabled={loading}
          autoComplete="new-password"
        />
        <p className="text-xs text-text-tertiary mt-1">
          Minimum 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <Label htmlFor="confirmPassword" required>
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={credentials.confirmPassword}
          onChange={(e) =>
            setCredentials({ ...credentials, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      {/* Terms of Service */}
      <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
        acceptedTerms 
          ? 'border-dewalt-yellow bg-dewalt-yellow/5' 
          : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
      }`}>
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          disabled={loading}
          className="w-6 h-6 mt-0.5 rounded border-2 border-border-light bg-background-tertiary checked:bg-dewalt-yellow checked:border-dewalt-yellow focus:ring-3 focus:ring-dewalt-yellow/30 transition-all cursor-pointer hover:border-dewalt-yellow hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
        />
        <label htmlFor="terms" className="text-sm text-text-secondary cursor-pointer hover:text-text-primary transition select-none">
          I agree to the{' '}
          <a href="#" className="text-dewalt-yellow hover:underline font-semibold">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-dewalt-yellow hover:underline font-semibold">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading || !acceptedTerms}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Creating account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Sign In Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-dewalt-yellow hover:text-dewalt-yellow-light font-semibold transition cursor-pointer hover:underline"
            tabIndex={loading ? -1 : 0}
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}


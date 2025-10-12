'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, validateEmail } from '@/lib/supabase/auth-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle } from 'lucide-react'
import type { LoginCredentials, FormErrors } from '@/types/auth'
import { useI18n } from '@/lib/i18n/context'
import { handleAuthError } from '@/lib/utils/errorHandling'

export function LoginForm() {
  const { t } = useI18n()
  const router = useRouter()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate email
    const emailValidation = validateEmail(credentials.email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message
    }

    // Validate password
    if (!credentials.password) {
      newErrors.password = t('validation.required')
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

    const { data, error } = await signIn(credentials)

    if (error) {
      const friendlyError = handleAuthError(error)
      setErrors({ 
        general: `${friendlyError.message}${friendlyError.suggestion ? ' ' + friendlyError.suggestion : ''}` 
      })
      setLoading(false)
    } else {
      // Success - redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {errors.general && (
        <div className="p-4 rounded-lg bg-status-error/10 border border-status-error">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0" />
            <p className="text-sm text-status-error">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <Label htmlFor="email" required>
          {t('auth.emailAddress')}
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
          autoFocus
        />
      </div>

      {/* Password Field */}
      <div>
        <Label htmlFor="password" required>
          {t('auth.password')}
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
          autoComplete="current-password"
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={credentials.rememberMe}
            onChange={(e) =>
              setCredentials({ ...credentials, rememberMe: e.target.checked })
            }
            disabled={loading}
            className="w-5 h-5 rounded border-2 border-border-light bg-background-tertiary checked:bg-dewalt-yellow checked:border-dewalt-yellow focus:ring-3 focus:ring-dewalt-yellow/30 transition-all cursor-pointer hover:border-dewalt-yellow hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
          />
          <span className="text-sm text-text-secondary group-hover:text-dewalt-yellow transition font-medium">
            {t('auth.rememberMe')}
          </span>
        </label>

        <Link
          href="/reset-password"
          className="text-sm text-dewalt-yellow hover:text-dewalt-yellow-light transition font-semibold cursor-pointer hover:underline"
          tabIndex={loading ? -1 : 0}
        >
          {t('auth.forgotPassword')}
        </Link>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <span>{t('auth.signingIn', { fallback: 'Signing in...' })}</span>
          </div>
        ) : (
          t('auth.signIn', { fallback: 'Sign In' })
        )}
      </Button>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          {t('auth.dontHaveAccount')}{' '}
          <Link
            href="/signup"
            className="text-dewalt-yellow hover:text-dewalt-yellow-light font-semibold transition cursor-pointer hover:underline"
            tabIndex={loading ? -1 : 0}
          >
            {t('auth.signUpLink', { fallback: 'Sign up' })}
          </Link>
        </p>
      </div>

      {/* Terms Notice */}
      <p className="text-xs text-text-muted text-center">
        {t('auth.bySigningIn', { fallback: 'By signing in, you agree to our' })}{' '}
        <a href="#" className="text-dewalt-yellow hover:underline cursor-pointer">
          {t('auth.termsOfService', { fallback: 'Terms of Service' })}
        </a>{' '}
        {t('common.and', { fallback: 'and' })}{' '}
        <a href="#" className="text-dewalt-yellow hover:underline cursor-pointer">
          {t('auth.privacyPolicy', { fallback: 'Privacy Policy' })}
        </a>
      </p>
    </form>
  )
}


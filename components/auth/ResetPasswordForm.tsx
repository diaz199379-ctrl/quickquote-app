'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset, validateEmail } from '@/lib/supabase/auth-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle, Mail } from 'lucide-react'
import type { PasswordResetRequest, FormErrors } from '@/types/auth'
import { useI18n } from '@/lib/i18n/context'

export function ResetPasswordForm() {
  const { t } = useI18n()
  const [request, setRequest] = useState<PasswordResetRequest>({
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate email
    const emailValidation = validateEmail(request.email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message
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

    const { error } = await requestPasswordReset(request)

    if (error) {
      setErrors({ general: error.message })
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const handleTryAgain = () => {
    setSuccess(false)
    setRequest({ email: '' })
    setErrors({})
  }

  // Success State
  if (success) {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="w-20 h-20 bg-dewalt-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-dewalt-yellow" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">
          Check Your Email
        </h3>
        <p className="text-text-secondary mb-4 max-w-md mx-auto">
          We've sent a password reset link to{' '}
          <strong className="text-dewalt-yellow">{request.email}</strong>
        </p>
        <p className="text-sm text-text-tertiary mb-6">
          Click the link in the email to reset your password. The link will expire in 1 hour.
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-background-tertiary border border-border-light">
            <p className="text-xs text-text-tertiary mb-2">Didn't receive the email?</p>
            <ul className="text-xs text-text-secondary space-y-1 text-left">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <Button
            onClick={handleTryAgain}
            variant="secondary"
            className="w-full"
          >
            Try Another Email
          </Button>

          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
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

      {/* Info Message */}
      <div className="p-4 rounded-lg bg-dewalt-yellow/10 border border-dewalt-yellow/30">
        <p className="text-sm text-text-primary">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Email Field */}
      <div>
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={request.email}
          onChange={(e) =>
            setRequest({ email: e.target.value })
          }
          error={errors.email}
          disabled={loading}
          autoComplete="email"
          autoFocus
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Sending reset link...</span>
          </div>
        ) : (
          'Send Reset Link'
        )}
      </Button>

      {/* Back to Login */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-dewalt-yellow hover:text-dewalt-yellow-light font-semibold transition cursor-pointer hover:underline"
            tabIndex={loading ? -1 : 0}
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Support Notice */}
      <div className="pt-4 border-t border-border-light">
        <p className="text-xs text-text-tertiary text-center">
          Need help?{' '}
          <a href="#" className="text-dewalt-yellow hover:underline cursor-pointer">
            Contact Support
          </a>
        </p>
      </div>
    </form>
  )
}


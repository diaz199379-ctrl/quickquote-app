'use client'

import { Card } from '@/components/ui/card'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export default function ResetPasswordPage() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 group mb-2">
            <div className="w-10 h-10 bg-dewalt-yellow rounded-lg flex items-center justify-center group-hover:bg-dewalt-yellow-dark transition-colors">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">QuickQuote AI</span>
          </Link>
          <p className="text-sm text-text-secondary mt-2">
            {t('auth.resetYourPassword', { fallback: 'Reset your password' })}
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">{t('auth.forgotPassword')}</h1>
          <ResetPasswordForm />
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-text-tertiary mt-6">
          {t('auth.copyright', { fallback: '© 2025 QuickQuote AI. All rights reserved.' })}
        </p>
      </div>
    </div>
  )
}

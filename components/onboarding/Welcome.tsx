'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Zap, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'

interface WelcomeProps {
  onGetStarted: () => void
  onSkip: () => void
  isOpen: boolean
}

export default function Welcome({ onGetStarted, onSkip, isOpen }: WelcomeProps) {
  const { t } = useI18n()

  if (!isOpen) return null

  const features = [
    {
      icon: Zap,
      title: t('onboarding.welcome.feature1Title', { fallback: 'AI-Powered Estimates' }),
      description: t('onboarding.welcome.feature1Desc', { fallback: 'Generate accurate estimates in minutes, not hours' }),
    },
    {
      icon: TrendingUp,
      title: t('onboarding.welcome.feature2Title', { fallback: 'Real-Time Pricing' }),
      description: t('onboarding.welcome.feature2Desc', { fallback: 'Current market prices for materials automatically' }),
    },
    {
      icon: Clock,
      title: t('onboarding.welcome.feature3Title', { fallback: 'Save Time' }),
      description: t('onboarding.welcome.feature3Desc', { fallback: 'Spend less time on paperwork, more time building' }),
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
        {/* Modal */}
        <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 hover:bg-background-secondary rounded-lg transition-colors z-10"
            aria-label={t('common.close', { fallback: 'Close' })}
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>

          {/* Content */}
          <div className="p-4 sm:p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo/Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-dewalt-yellow rounded-2xl mb-6 shadow-lg">
                <Zap className="w-10 h-10 text-dewalt-black" />
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">
                {t('onboarding.welcome.title', { fallback: 'Welcome to QuickQuote AI!' })}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-text-secondary max-w-md mx-auto">
                {t('onboarding.welcome.subtitle', { fallback: 'Lightning-fast construction estimates powered by AI. Let\'s get you set up in under 2 minutes.' })}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-dewalt-yellow/10 rounded-xl mb-3">
                    <feature.icon className="w-6 h-6 text-dewalt-yellow" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* What you'll do */}
            <div className="bg-background-secondary rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-status-success" />
                {t('onboarding.welcome.setupTitle', { fallback: 'Quick Setup (2 minutes)' })}
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-dewalt-yellow mt-0.5">1.</span>
                  <span>{t('onboarding.welcome.step1', { fallback: 'Tell us about your business' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dewalt-yellow mt-0.5">2.</span>
                  <span>{t('onboarding.welcome.step2', { fallback: 'Set your defaults (markup, labor rate)' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dewalt-yellow mt-0.5">3.</span>
                  <span>{t('onboarding.welcome.step3', { fallback: 'Try a sample estimate' })}</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onGetStarted}
                className="flex-1 h-12 text-base"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                {t('onboarding.welcome.getStarted', { fallback: 'Let\'s Get Started!' })}
              </Button>
              <Button 
                onClick={onSkip}
                variant="ghost"
                className="sm:w-auto"
              >
                {t('onboarding.welcome.skip', { fallback: 'Skip for now' })}
              </Button>
            </div>

            {/* Fine print */}
            <p className="text-xs text-text-tertiary text-center mt-6">
              {t('onboarding.welcome.help', { fallback: 'You can access this setup anytime from Settings → Help' })}
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}


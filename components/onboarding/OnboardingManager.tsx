'use client'

import { useState, useEffect } from 'react'
import Welcome from './Welcome'
import QuickSetup, { OnboardingData } from './QuickSetup'
import Tour from './Tour'
import {
  shouldShowOnboarding,
  completeWelcome,
  completeSetup,
  completeTour,
  skipOnboarding,
  shouldShowTour,
} from '@/lib/utils/onboarding'

interface OnboardingManagerProps {
  isFirstLogin?: boolean
}

export default function OnboardingManager({ isFirstLogin = false }: OnboardingManagerProps) {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    // Check if we should show onboarding on mount
    if (isFirstLogin || shouldShowOnboarding()) {
      setShowWelcome(true)
    } else if (shouldShowTour()) {
      setShowTour(true)
    }
  }, [isFirstLogin])

  const handleWelcomeStart = () => {
    completeWelcome()
    setShowWelcome(false)
    setShowSetup(true)
  }

  const handleWelcomeSkip = () => {
    skipOnboarding()
    setShowWelcome(false)
  }

  const handleSetupBack = () => {
    setShowSetup(false)
    setShowWelcome(true)
  }

  const handleSetupComplete = (data: OnboardingData) => {
    completeSetup({
      companyName: data.companyName,
      zipCode: data.zipCode,
      projectType: data.projectType,
      markup: data.markup,
      laborRate: data.laborRate,
    })
    setShowSetup(false)
    setShowTour(true)
  }

  const handleSetupSkip = () => {
    skipOnboarding()
    setShowSetup(false)
  }

  const handleTourComplete = () => {
    completeTour()
    setShowTour(false)
  }

  const handleTourSkip = () => {
    completeTour() // Mark as completed even if skipped
    setShowTour(false)
  }

  return (
    <>
      <Welcome
        isOpen={showWelcome}
        onGetStarted={handleWelcomeStart}
        onSkip={handleWelcomeSkip}
      />
      
      <QuickSetup
        isOpen={showSetup}
        onComplete={handleSetupComplete}
        onBack={handleSetupBack}
        onSkip={handleSetupSkip}
      />
      
      <Tour
        isOpen={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </>
  )
}


/**
 * Onboarding utility functions
 * Tracks user onboarding progress and manages onboarding state
 */

export interface OnboardingState {
  hasCompletedWelcome: boolean
  hasCompletedSetup: boolean
  hasCompletedTour: boolean
  hasCreatedFirstEstimate: boolean
  setupData?: {
    companyName: string
    zipCode: string
    projectType: string
    markup: number
    laborRate: number
  }
  completedAt?: string
  skippedAt?: string
}

const STORAGE_KEY = 'quickquote_onboarding'

/**
 * Get current onboarding state from localStorage
 */
export function getOnboardingState(): OnboardingState {
  if (typeof window === 'undefined') {
    return getDefaultState()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to read onboarding state:', error)
  }

  return getDefaultState()
}

/**
 * Save onboarding state to localStorage
 */
export function saveOnboardingState(state: Partial<OnboardingState>): void {
  if (typeof window === 'undefined') return

  try {
    const current = getOnboardingState()
    const updated = { ...current, ...state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save onboarding state:', error)
  }
}

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  const state = getOnboardingState()
  return state.hasCompletedWelcome && state.hasCompletedSetup
}

/**
 * Check if user should see onboarding
 */
export function shouldShowOnboarding(): boolean {
  const state = getOnboardingState()
  
  // Don't show if completed or skipped
  if (state.completedAt || state.skippedAt) {
    return false
  }

  // Show if not completed welcome
  if (!state.hasCompletedWelcome) {
    return true
  }

  return false
}

/**
 * Mark welcome as completed
 */
export function completeWelcome(): void {
  saveOnboardingState({
    hasCompletedWelcome: true,
  })
}

/**
 * Mark setup as completed
 */
export function completeSetup(setupData: OnboardingState['setupData']): void {
  saveOnboardingState({
    hasCompletedSetup: true,
    setupData,
  })
}

/**
 * Mark tour as completed
 */
export function completeTour(): void {
  saveOnboardingState({
    hasCompletedTour: true,
    completedAt: new Date().toISOString(),
  })
}

/**
 * Mark onboarding as skipped
 */
export function skipOnboarding(): void {
  saveOnboardingState({
    skippedAt: new Date().toISOString(),
  })
}

/**
 * Reset onboarding state (for testing or re-triggering)
 */
export function resetOnboarding(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to reset onboarding:', error)
  }
}

/**
 * Re-trigger onboarding flow
 */
export function restartOnboarding(): void {
  saveOnboardingState({
    hasCompletedWelcome: false,
    hasCompletedSetup: false,
    hasCompletedTour: false,
    completedAt: undefined,
    skippedAt: undefined,
  })
}

/**
 * Get default onboarding state
 */
function getDefaultState(): OnboardingState {
  return {
    hasCompletedWelcome: false,
    hasCompletedSetup: false,
    hasCompletedTour: false,
    hasCreatedFirstEstimate: false,
  }
}

/**
 * Track when user creates their first estimate
 */
export function markFirstEstimateCreated(): void {
  saveOnboardingState({
    hasCreatedFirstEstimate: true,
  })
}

/**
 * Get onboarding progress percentage
 */
export function getOnboardingProgress(): number {
  const state = getOnboardingState()
  let completed = 0
  const total = 4 // welcome, setup, tour, first estimate

  if (state.hasCompletedWelcome) completed++
  if (state.hasCompletedSetup) completed++
  if (state.hasCompletedTour) completed++
  if (state.hasCreatedFirstEstimate) completed++

  return Math.round((completed / total) * 100)
}

/**
 * Check if user should see the tour
 */
export function shouldShowTour(): boolean {
  const state = getOnboardingState()
  return (
    state.hasCompletedSetup &&
    !state.hasCompletedTour &&
    !state.skippedAt
  )
}


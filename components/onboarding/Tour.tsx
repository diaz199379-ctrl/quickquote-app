'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'

interface TourStep {
  target: string
  title: string
  description: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface TourProps {
  onComplete: () => void
  onSkip: () => void
  isOpen: boolean
}

export default function Tour({ onComplete, onSkip, isOpen }: TourProps) {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [availableSteps, setAvailableSteps] = useState<TourStep[]>([])

  const allSteps: TourStep[] = [
    {
      target: '[data-tour="new-estimate"]',
      title: t('onboarding.tour.step1Title', { fallback: 'Start a New Estimate' }),
      description: t('onboarding.tour.step1Desc', { fallback: 'Click here anytime to create a new estimate. We have templates for decks, kitchens, and more!' }),
      placement: 'right',
    },
    {
      target: '[data-tour="ai-assistant"]',
      title: t('onboarding.tour.step2Title', { fallback: 'AI Assistant' }),
      description: t('onboarding.tour.step2Desc', { fallback: 'Get instant help with pricing, code requirements, and suggestions as you build estimates.' }),
      placement: 'bottom',
    },
    {
      target: '[data-tour="projects"]',
      title: t('onboarding.tour.step3Title', { fallback: 'Your Projects' }),
      description: t('onboarding.tour.step3Desc', { fallback: 'All your projects and estimates organized in one place. Search, filter, and track everything.' }),
      placement: 'right',
    },
    {
      target: '[data-tour="settings"]',
      title: t('onboarding.tour.step5Title', { fallback: 'Settings' }),
      description: t('onboarding.tour.step5Desc', { fallback: 'Customize your defaults, pricing, and preferences anytime from here.' }),
      placement: 'right',
    },
  ]

  const steps = availableSteps.length > 0 ? availableSteps : allSteps

  // Filter steps to only include elements that exist on the page
  useEffect(() => {
    if (!isOpen) return

    const foundSteps = allSteps.filter(step => {
      const element = document.querySelector(step.target)
      return element !== null
    })

    setAvailableSteps(foundSteps)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || steps.length === 0) return

    // Prevent body scroll when tour is active
    document.body.style.overflow = 'hidden'

    const element = document.querySelector(steps[currentStep].target) as HTMLElement
    if (element) {
      setTargetElement(element)
      
      // Don't scroll - keep page stable
      const updatePosition = () => {
        const rect = element.getBoundingClientRect()
        let placement = steps[currentStep].placement || 'bottom'
        
        const tooltipWidth = window.innerWidth < 640 ? window.innerWidth - 32 : 320
        const tooltipHeight = 250
        const padding = 16
        const isMobile = window.innerWidth < 640
        
        let top = 0
        let left = 0
        
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        // On mobile, always use bottom placement and center
        if (isMobile) {
          placement = 'bottom'
          top = rect.bottom + padding
          left = viewportWidth / 2
          
          // If tooltip would go off bottom, place it at top
          if (top + tooltipHeight > viewportHeight - padding) {
            top = rect.top - tooltipHeight - padding
            if (top < padding) {
              // If still doesn't fit, center it vertically
              top = viewportHeight / 2 - tooltipHeight / 2
            }
          }
        } else {
          // Desktop positioning
          switch (placement) {
            case 'bottom':
              top = rect.bottom + padding
              left = rect.left + rect.width / 2
              break
            case 'top':
              top = rect.top - padding
              left = rect.left + rect.width / 2
              break
            case 'left':
              top = rect.top + rect.height / 2
              left = rect.left - padding
              break
            case 'right':
              top = rect.top + rect.height / 2
              left = rect.right + padding
              break
          }
          
          // Check if tooltip fits in chosen placement
          if (placement === 'right' && left + tooltipWidth > viewportWidth - padding) {
            // Switch to left
            left = rect.left - padding
            placement = 'left'
          } else if (placement === 'left' && left - tooltipWidth < padding) {
            // Switch to right
            left = rect.right + padding
            placement = 'right'
          }
          
          if (placement === 'bottom' && top + tooltipHeight > viewportHeight - padding) {
            // Switch to top
            top = rect.top - padding
            placement = 'top'
          } else if (placement === 'top' && top - tooltipHeight < padding) {
            // Switch to bottom
            top = rect.bottom + padding
            placement = 'bottom'
          }
          
          // Final bounds check for horizontal centering
          if (placement === 'bottom' || placement === 'top') {
            const halfWidth = tooltipWidth / 2
            if (left - halfWidth < padding) {
              left = halfWidth + padding
            } else if (left + halfWidth > viewportWidth - padding) {
              left = viewportWidth - halfWidth - padding
            }
          }
          
          // Final bounds check for vertical centering
          if (placement === 'left' || placement === 'right') {
            const halfHeight = tooltipHeight / 2
            if (top - halfHeight < padding) {
              top = halfHeight + padding
            } else if (top + halfHeight > viewportHeight - padding) {
              top = viewportHeight - halfHeight - padding
            }
          }
        }
        
        setTooltipPosition({ top, left })
      }
      
      updatePosition()
      
      // Update position on resize
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
      }
    } else {
      // Element not found, skip to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete()
      }
    }

    return () => {
      // Re-enable body scroll when tour closes
      document.body.style.overflow = ''
    }
  }, [currentStep, isOpen])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen || steps.length === 0) return null

  const currentStepData = steps[currentStep]
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const placement = isMobile ? 'bottom' : (currentStepData.placement || 'bottom')

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <div className="fixed inset-0 z-[100]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" onClick={onSkip} />
        
        {/* Spotlight on target element */}
        {targetElement && (
          <div
            className="absolute rounded-lg ring-4 ring-dewalt-yellow shadow-2xl pointer-events-none transition-all duration-300"
            style={{
              top: targetElement.getBoundingClientRect().top - 4,
              left: targetElement.getBoundingClientRect().left - 4,
              width: targetElement.getBoundingClientRect().width + 8,
              height: targetElement.getBoundingClientRect().height + 8,
              backgroundColor: 'transparent',
            }}
          />
        )}

        {/* Tooltip */}
        <div
          className={cn(
            'absolute max-w-[calc(100vw-2rem)] transition-all duration-300 pointer-events-auto',
            isMobile ? 'w-[calc(100vw-2rem)]' : 'w-80',
            isMobile && '-translate-x-1/2',
            !isMobile && placement === 'bottom' && '-translate-x-1/2',
            !isMobile && placement === 'top' && '-translate-x-1/2 -translate-y-full',
            !isMobile && placement === 'left' && '-translate-x-full -translate-y-1/2',
            !isMobile && placement === 'right' && '-translate-y-1/2'
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 relative">
            {/* Close button */}
            <button
              onClick={onSkip}
              className="absolute top-2 right-2 p-1 hover:bg-background-secondary rounded transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-4 h-4 text-text-tertiary" />
            </button>

            {/* Progress */}
            <div className="flex items-center gap-1 mb-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    index <= currentStep ? 'bg-dewalt-yellow' : 'bg-background-tertiary'
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-dewalt-yellow" />
                <h3 className="font-bold text-text-primary">{currentStepData.title}</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-text-tertiary">
                {t('onboarding.tour.progress', { current: currentStep + 1, total: steps.length, fallback: `${currentStep + 1} of ${steps.length}` })}
              </div>
              
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="ghost"
                    size="sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {t('common.back')}
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  size="sm"
                >
                  {currentStep === steps.length - 1 ? (
                    t('onboarding.tour.finish', { fallback: 'Finish' })
                  ) : (
                    <>
                      {t('onboarding.tour.next', { fallback: 'Next' })}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Skip option */}
            <button
              onClick={onSkip}
              className="block w-full text-center text-xs text-text-tertiary hover:text-text-secondary transition-colors mt-3"
            >
              {t('onboarding.tour.skip', { fallback: 'Skip tour' })}
            </button>

            {/* Arrow pointer */}
            <div
              className={cn(
                'absolute w-3 h-3 bg-white rotate-45',
                placement === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                placement === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                placement === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
                placement === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
              )}
            />
          </div>
        </div>
      </div>
    </>
  )
}


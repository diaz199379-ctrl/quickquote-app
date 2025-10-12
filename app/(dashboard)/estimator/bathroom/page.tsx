'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'
import BathroomDimensionsForm from '@/components/estimator/BathroomDimensionsForm'
import BathroomOptionsForm from '@/components/estimator/BathroomOptionsForm'
import EstimateReview from '@/components/estimator/EstimateReview'
import { 
  BathroomDimensions, 
  BathroomOptions, 
  BathroomMaterialCalculator 
} from '@/lib/estimator/BathroomMaterialCalculator'
import { PriceFetcher, PricingResult } from '@/lib/estimator/PriceFetcher'

export default function BathroomEstimatorPage() {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [dimensions, setDimensions] = useState<BathroomDimensions>({
    length: 8,
    width: 6,
    ceilingHeight: 8,
    scope: 'standard-remodel',
    hasVentilation: false,
    ventilationUpgrade: false,
    hasWindow: false,
    windowReplacement: false
  })
  
  const [options, setOptions] = useState<BathroomOptions>({
    vanitySize: 36,
    vanitySinkType: 'single',
    toiletType: 'comfort-height',
    showerTubConfig: 'tub-surround',
    wallFinish: 'tile',
    tileHeight: 8,
    floorFinish: 'porcelain-tile',
    buildQuality: 'standard',
    lighting: {
      vanityLights: 1,
      ceilingLight: true,
      exhaustFan: false
    },
    gfciOutlets: 2
  })
  
  const [pricing, setPricing] = useState<PricingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const STEPS = [
    {
      id: 1,
      name: t('bathroomEstimator.dimensions', { fallback: 'Dimensions' }),
      description: t('bathroomEstimator.dimensionsDesc', { fallback: 'Size & Scope' })
    },
    {
      id: 2,
      name: t('bathroomEstimator.options', { fallback: 'Fixtures & Finishes' }),
      description: t('bathroomEstimator.optionsDesc', { fallback: 'Materials' })
    },
    {
      id: 3,
      name: t('bathroomEstimator.review', { fallback: 'Review' }),
      description: t('bathroomEstimator.reviewDesc', { fallback: 'Summary & Export' })
    }
  ]

  const validateDimensions = (): boolean => {
    if (!dimensions.length || dimensions.length < 4) return false
    if (!dimensions.width || dimensions.width < 4) return false
    if (!dimensions.scope) return false
    return true
  }

  const validateOptions = (): boolean => {
    if (!options.vanitySize) return false
    if (!options.toiletType) return false
    if (!options.showerTubConfig) return false
    if (!options.wallFinish) return false
    if (!options.floorFinish) return false
    if (options.gfciOutlets < 1) return false
    return true
  }

  const handleNext = async () => {
    if (currentStep === 1 && !validateDimensions()) {
      alert(t('bathroomEstimator.validateDimensions', { fallback: 'Please fill in all required dimensions' }))
      return
    }

    if (currentStep === 2 && !validateOptions()) {
      alert(t('bathroomEstimator.validateOptions', { fallback: 'Please complete all required options' }))
      return
    }

    if (currentStep === 2) {
      // Calculate materials and fetch pricing before moving to review
      await calculateEstimate()
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateEstimate = async () => {
    setIsCalculating(true)
    try {
      // Calculate materials
      const calculator = new BathroomMaterialCalculator(dimensions, options)
      const materialsList = calculator.calculate()

      // Fetch pricing
      const priceFetcher = new PriceFetcher('90210') // TODO: Get from user profile
      const pricingResult = await priceFetcher.fetchPricing(materialsList.items)

      // Add labor
      const laborRate = 65 // TODO: Get from user settings
      const laborHours = materialsList.estimatedLaborHours
      const estimatedLabor = laborHours * laborRate

      setPricing({
        ...pricingResult,
        estimatedLabor,
        laborHours,
        total: pricingResult.subtotal + estimatedLabor
      })
    } catch (error) {
      console.error('Error calculating estimate:', error)
      alert(t('common.error', { fallback: 'Error calculating estimate. Please try again.' }))
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSave = () => {
    console.log('Saving bathroom estimate...', { dimensions, options, pricing })
    // TODO: Implement save to Supabase
    alert(t('common.saveSuccess', { fallback: 'Estimate saved successfully!' }))
  }

  const handleExportPDF = () => {
    console.log('Exporting bathroom estimate to PDF...')
    // TODO: Implement PDF export
    alert(t('common.exportSuccess', { fallback: 'PDF export coming soon!' }))
  }

  return (
    <div className="min-h-screen bg-background-light p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-dewalt-yellow flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-dewalt-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                {t('bathroomEstimator.title', { fallback: 'Bathroom Remodel Estimator' })}
              </h1>
              <p className="text-text-secondary">
                {t('bathroomEstimator.subtitle', { 
                  fallback: 'AI-powered bathroom remodel estimation with code-compliant calculations' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="p-6">
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step */}
                <div className="flex flex-col items-center min-w-[120px]">
                  <button
                    onClick={() => {
                      if (step.id < currentStep) {
                        setCurrentStep(step.id)
                      }
                    }}
                    disabled={step.id > currentStep}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all',
                      step.id < currentStep
                        ? 'bg-dewalt-yellow text-dewalt-black cursor-pointer hover:scale-105'
                        : step.id === currentStep
                        ? 'bg-dewalt-yellow text-dewalt-black ring-4 ring-dewalt-yellow/20'
                        : 'bg-background-tertiary text-text-tertiary cursor-not-allowed'
                    )}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </button>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium whitespace-nowrap',
                      step.id === currentStep ? 'text-text-primary' : 'text-text-tertiary'
                    )}>
                      {step.name}
                    </p>
                    <p className="text-xs text-text-tertiary hidden sm:block">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className={cn(
                    'w-16 sm:w-24 h-1 rounded-full transition-colors mt-[-32px]',
                    step.id < currentStep ? 'bg-dewalt-yellow' : 'bg-background-tertiary'
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <BathroomDimensionsForm
              dimensions={dimensions}
              onChange={setDimensions}
            />
          )}

          {currentStep === 2 && (
            <BathroomOptionsForm
              options={options}
              onChange={setOptions}
            />
          )}

          {currentStep === 3 && (
            <EstimateReview
              dimensions={dimensions}
              options={options}
              pricing={pricing}
              isLoading={isCalculating}
              onEdit={(step) => setCurrentStep(step)}
              onSave={handleSave}
              onExportPDF={handleExportPDF}
              projectType="bathroom"
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <Card className="mt-8 p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.previous')}
            </Button>

            <div className="text-sm text-text-tertiary">
              {t('common.step')} {currentStep} {t('common.of')} {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={isCalculating}
                className="flex items-center gap-2"
              >
                {currentStep === 2 && isCalculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dewalt-black border-t-transparent rounded-full animate-spin" />
                    {t('common.calculating', { fallback: 'Calculating...' })}
                  </>
                ) : (
                  <>
                    {t('common.next')}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {t('common.save')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}


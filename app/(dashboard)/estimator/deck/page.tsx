'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import DeckDimensionsForm from '@/components/estimator/DeckDimensionsForm'
import DeckOptionsForm from '@/components/estimator/DeckOptionsForm'
import EstimateReview from '@/components/estimator/EstimateReview'
import EstimateControls from '@/components/estimator/EstimateControls'
import AISuggestions from '@/components/estimator/AISuggestions'
import { DeckDimensions, DeckOptions, DeckMaterialCalculator } from '@/lib/estimator/MaterialCalculator'
import { PriceFetcher, PricingResult } from '@/lib/estimator/PriceFetcher'
import { AIContext } from '@/types/ai'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'

export default function DeckEstimatorPage() {
  const { t } = useI18n()
  const router = useRouter()
  
  const STEPS = [
    { id: 1, name: t('deckEstimator.dimensions', { fallback: 'Dimensions' }), description: t('deckEstimator.dimensionsDescription', { fallback: 'Size & layout' }) },
    { id: 2, name: t('deckEstimator.options', { fallback: 'Options' }), description: t('deckEstimator.optionsDescription', { fallback: 'Materials & style' }) },
    { id: 3, name: t('deckEstimator.review', { fallback: 'Review' }), description: t('deckEstimator.reviewDescription', { fallback: 'Estimate & pricing' }) },
  ]
  const [currentStep, setCurrentStep] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)
  
  // Form state
  const [dimensions, setDimensions] = useState<DeckDimensions>({
    length: 16,
    width: 12,
    height: 2,
    hasStairs: false,
    stairs: [], // Initialize with empty array for multi-stair support
    hasRailing: true,
    railingSides: ['front', 'left', 'right']
  })

  const [options, setOptions] = useState<DeckOptions>({
    deckingMaterial: 'pressure-treated',
    framingMaterial: 'pressure-treated',
    joistSpacing: 16,
    railingStyle: 'wood',
    buildQuality: 'standard'
  })

  const [pricing, setPricing] = useState<PricingResult | null>(null)

  // Validation
  const validateDimensions = (): boolean => {
    // Basic dimensions
    if (!dimensions.length || dimensions.length < 4) return false
    if (!dimensions.width || dimensions.width < 4) return false
    if (dimensions.height === undefined || dimensions.height < 0) return false
    
    // Stairs validation (support both new array and legacy format)
    if (dimensions.hasStairs) {
      const stairs = dimensions.stairs || []
      if (stairs.length === 0 && (!dimensions.stairSteps || !dimensions.stairWidth)) {
        return false
      }
      // Validate each stair set
      for (const stair of stairs) {
        if (!stair.steps || stair.steps < 1) return false
        if (!stair.width || stair.width < 2) return false
      }
    }
    
    // Railing validation (only if railing is enabled)
    if (dimensions.hasRailing) {
      if (!dimensions.railingSides || dimensions.railingSides.length === 0) return false
    }
    
    return true
  }

  const validateOptions = (): boolean => {
    if (!options.deckingMaterial || !options.framingMaterial) return false
    if (!options.joistSpacing) return false
    if (dimensions.hasRailing && !options.railingStyle) return false
    if (!options.buildQuality) return false
    return true
  }

  const canProceed = (): boolean => {
    if (currentStep === 1) return validateDimensions()
    if (currentStep === 2) return validateOptions()
    return true
  }

  // Navigation
  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      
      // If moving to review step, calculate materials and fetch pricing
      if (currentStep === 2) {
        await calculateEstimate()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEdit = (step: number) => {
    setCurrentStep(step)
  }

  // Calculate materials and fetch pricing
  const calculateEstimate = async () => {
    setIsCalculating(true)
    try {
      // Calculate materials
      const calculator = new DeckMaterialCalculator(dimensions, options)
      const materialList = calculator.calculate()
      
      // Fetch pricing
      const priceFetcher = new PriceFetcher('90210') // In a real app, get from user profile
      const pricingResult = await priceFetcher.fetchPricing(materialList.items)
      
      setPricing(pricingResult)
    } catch (error) {
      console.error('Error calculating estimate:', error)
      // Set a null pricing to show error state
      setPricing(null)
    } finally {
      setIsCalculating(false)
    }
  }

  // Actions
  const handleSaveDraft = () => {
    // In a real app, save to Supabase
    console.log('Saving draft...', { dimensions, options, pricing })
    alert('Draft saved! (This is a demo - not actually saved)')
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setDimensions({
        length: 0,
        width: 0,
        height: 0,
        hasStairs: false,
        hasRailing: false,
      })
      setOptions({
        deckingMaterial: 'pressure-treated',
        framingMaterial: 'pressure-treated',
        joistSpacing: 16,
        buildQuality: 'standard'
      })
      setPricing(null)
      setCurrentStep(1)
    }
  }

  const handleSaveEstimate = () => {
    // In a real app, save to Supabase estimates table
    console.log('Saving estimate...', { dimensions, options, pricing })
    alert('Estimate saved successfully! (This is a demo)')
    router.push('/estimates')
  }

  const handleExportPDF = () => {
    // In a real app, generate PDF
    alert('PDF export coming soon!')
  }

  const handleShare = () => {
    // In a real app, generate share link
    alert('Share functionality coming soon!')
  }

  // Build AI context from current form data
  const aiContext: AIContext = {
    projectType: 'Deck',
    zipCode: '90210', // In a real app, get from user profile
    dimensions: {
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      sqft: dimensions.length * dimensions.width
    },
    materials: {
      deckingMaterial: options.deckingMaterial,
      framingMaterial: options.framingMaterial,
      railingStyle: options.railingStyle
    },
    budget: pricing?.total
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Deck Estimator</h1>
        <p className="text-sm text-text-secondary mt-1">
          AI-powered deck estimation with code-compliant material calculations
        </p>
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
                    if (step.id < currentStep || (step.id === currentStep && canProceed())) {
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

      {/* AI Suggestions */}
      {(currentStep === 1 || currentStep === 2) && (
        <AISuggestions context={aiContext} />
      )}

      {/* Form Content */}
      <Card className="p-6">
        {currentStep === 1 && (
          <DeckDimensionsForm
            dimensions={dimensions}
            onChange={setDimensions}
          />
        )}

        {currentStep === 2 && (
          <DeckOptionsForm
            options={options}
            onChange={setOptions}
            hasRailing={dimensions.hasRailing}
          />
        )}

        {currentStep === 3 && (
          <EstimateReview
            dimensions={dimensions}
            options={options}
            pricing={pricing}
            isLoading={isCalculating}
            onEdit={handleEdit}
            onSave={handleSaveEstimate}
            onExportPDF={handleExportPDF}
            onShare={handleShare}
          />
        )}

        {/* Controls */}
        {currentStep < 3 && (
          <EstimateControls
            currentStep={currentStep}
            totalSteps={3}
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            onClear={handleClear}
            canGoNext={canProceed()}
            isLastStep={currentStep === 2}
          />
        )}
      </Card>

      {/* Help Card */}
      <Card className="p-4 bg-status-info/10 border-status-info/30">
        <p className="text-sm text-text-secondary">
          <strong className="text-text-primary">💡 Pro Tip:</strong> All calculations are code-compliant 
          and based on IRC (International Residential Code) standards. Pricing is updated in real-time 
          using AI-powered market data. Click the yellow wrench button for AI assistance!
        </p>
      </Card>
    </div>
  )
}


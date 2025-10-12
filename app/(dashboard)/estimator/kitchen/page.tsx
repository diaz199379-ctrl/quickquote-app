'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import KitchenDimensionsForm from '@/components/estimator/KitchenDimensionsForm'
import KitchenOptionsForm from '@/components/estimator/KitchenOptionsForm'
import EstimateReview from '@/components/estimator/EstimateReview'
import EstimateControls from '@/components/estimator/EstimateControls'
import AISuggestions from '@/components/estimator/AISuggestions'
import { KitchenDimensions, KitchenOptions, KitchenMaterialCalculator } from '@/lib/estimator/KitchenMaterialCalculator'
import { PriceFetcher, PricingResult } from '@/lib/estimator/PriceFetcher'
import { AIContext } from '@/types/ai'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'

export default function KitchenEstimatorPage() {
  const { t } = useI18n()
  const router = useRouter()
  
  const STEPS = [
    { id: 1, name: t('kitchenEstimator.dimensions', { fallback: 'Dimensions' }), description: t('kitchenEstimator.dimensionsDescription', { fallback: 'Size & layout' }) },
    { id: 2, name: t('kitchenEstimator.options', { fallback: 'Options' }), description: t('kitchenEstimator.optionsDescription', { fallback: 'Materials & finishes' }) },
    { id: 3, name: t('kitchenEstimator.review', { fallback: 'Review' }), description: t('kitchenEstimator.reviewDescription', { fallback: 'Estimate & pricing' }) },
  ]
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)
  
  // Form state
  const [dimensions, setDimensions] = useState<KitchenDimensions>({
    length: 12,
    width: 12,
    ceilingHeight: 8,
    upperCabinetLinearFeet: 12,
    lowerCabinetLinearFeet: 12,
    countertopSquareFeet: 30,
    countertopOverhang: 1,
    hasBacksplash: true,
    backsplashSquareFeet: 20,
    includeFlooring: false
  })

  const [options, setOptions] = useState<KitchenOptions>({
    cabinetStyle: 'semi-custom',
    cabinetMaterial: 'plywood',
    cabinetFinish: 'paint',
    countertopMaterial: 'quartz',
    countertopEdge: 'standard',
    backsplashMaterial: 'subway-tile',
    flooringMaterial: 'lvp',
    appliances: {
      refrigerator: true,
      range: true,
      microwave: true,
      dishwasher: true,
      rangeHood: true
    },
    sink: 'double-bowl',
    faucet: 'pulldown',
    lighting: {
      recessed: 6,
      pendant: 3,
      underCabinet: true
    },
    gfciOutlets: 4,
    standardOutlets: 2,
    paintWalls: true,
    paintCeiling: false,
    includeDemolition: false,
    buildQuality: 'standard'
  })

  const [pricing, setPricing] = useState<PricingResult | null>(null)

  // Validation
  const validateDimensions = (): boolean => {
    if (!dimensions.length || dimensions.length < 6) return false
    if (!dimensions.width || dimensions.width < 6) return false
    if (!dimensions.upperCabinetLinearFeet || dimensions.upperCabinetLinearFeet < 0) return false
    if (!dimensions.lowerCabinetLinearFeet || dimensions.lowerCabinetLinearFeet < 0) return false
    if (!dimensions.countertopSquareFeet || dimensions.countertopSquareFeet < 0) return false
    
    if (dimensions.hasBacksplash) {
      if (!dimensions.backsplashSquareFeet || dimensions.backsplashSquareFeet < 0) return false
    }
    
    return true
  }

  const validateOptions = (): boolean => {
    if (!options.cabinetStyle || !options.cabinetMaterial || !options.cabinetFinish) return false
    if (!options.countertopMaterial) return false
    if (dimensions.hasBacksplash && !options.backsplashMaterial) return false
    if (dimensions.includeFlooring && !options.flooringMaterial) return false
    if (!options.buildQuality) return false
    if (options.gfciOutlets < 2) return false // Code requirement
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
      const calculator = new KitchenMaterialCalculator(dimensions, options)
      const materialList = calculator.calculate()
      
      // Fetch pricing
      const priceFetcher = new PriceFetcher('90210') // In a real app, get from user profile
      const pricingResult = await priceFetcher.fetchPricing(materialList.items)
      
      setPricing(pricingResult)
    } catch (error) {
      console.error('Error calculating estimate:', error)
      setPricing(null)
    } finally {
      setIsCalculating(false)
    }
  }

  // Actions
  const handleSaveDraft = () => {
    console.log('Saving draft...', { dimensions, options, pricing })
    alert('Draft saved! (This is a demo - not actually saved)')
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setDimensions({
        length: 0,
        width: 0,
        ceilingHeight: 8,
        upperCabinetLinearFeet: 0,
        lowerCabinetLinearFeet: 0,
        countertopSquareFeet: 0,
        countertopOverhang: 1,
        hasBacksplash: false,
        backsplashSquareFeet: 0,
        includeFlooring: false
      })
      setOptions({
        cabinetStyle: 'stock',
        cabinetMaterial: 'particle-board',
        cabinetFinish: 'laminate',
        countertopMaterial: 'laminate',
        countertopEdge: 'standard',
        backsplashMaterial: 'ceramic',
        flooringMaterial: 'vinyl',
        appliances: {
          refrigerator: false,
          range: false,
          microwave: false,
          dishwasher: false,
          rangeHood: false
        },
        sink: 'none',
        faucet: 'none',
        lighting: {
          recessed: 0,
          pendant: 0,
          underCabinet: false
        },
        gfciOutlets: 0,
        standardOutlets: 0,
        paintWalls: false,
        paintCeiling: false,
        includeDemolition: false,
        buildQuality: 'standard'
      })
      setPricing(null)
      setCurrentStep(1)
    }
  }

  const handleSaveEstimate = () => {
    console.log('Saving estimate...', { dimensions, options, pricing })
    alert('Estimate saved successfully! (This is a demo)')
    router.push('/estimates')
  }

  const handleExportPDF = () => {
    alert('PDF export coming soon!')
  }

  const handleShare = () => {
    alert('Share functionality coming soon!')
  }

  // Build AI context from current form data
  const aiContext: AIContext = {
    projectType: 'Kitchen',
    zipCode: '90210',
    dimensions: {
      length: dimensions.length,
      width: dimensions.width,
      sqft: dimensions.length * dimensions.width
    },
    materials: {
      cabinetStyle: options.cabinetStyle,
      countertopMaterial: options.countertopMaterial,
      flooringMaterial: options.flooringMaterial
    },
    budget: pricing?.total
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {t('kitchenEstimator.title', { fallback: 'Kitchen Estimator' })}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {t('kitchenEstimator.subtitle', { fallback: 'AI-powered kitchen remodel estimation with code-compliant calculations' })}
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
          <KitchenDimensionsForm
            dimensions={dimensions}
            onChange={setDimensions}
          />
        )}

        {currentStep === 2 && (
          <KitchenOptionsForm
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
            onEdit={handleEdit}
            onSave={handleSaveEstimate}
            onExportPDF={handleExportPDF}
            onShare={handleShare}
            projectType="kitchen"
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
          <strong className="text-text-primary">💡 Pro Tip:</strong> Kitchen remodels require GFCI outlets within 6 feet of water sources 
          and proper ventilation (range hood). All estimates include code-compliant materials and labor. 
          Click the yellow wrench button for AI assistance!
        </p>
      </Card>
    </div>
  )
}


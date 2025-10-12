'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Settings, 
  Zap,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'
import { ProjectType } from '@/types/project'

interface QuickSetupProps {
  onComplete: (data: OnboardingData) => void
  onBack: () => void
  onSkip: () => void
  isOpen: boolean
}

export interface OnboardingData {
  companyName: string
  zipCode: string
  projectType: ProjectType
  markup: number
  laborRate: number
  useNationalAverages: boolean
}

export default function QuickSetup({ onComplete, onBack, onSkip, isOpen }: QuickSetupProps) {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    zipCode: '',
    projectType: 'deck',
    markup: 20,
    laborRate: 65,
    useNationalAverages: false,
  })

  const projectTypes: { value: ProjectType; label: string }[] = [
    { value: 'deck', label: t('projects.types.deck') },
    { value: 'kitchen', label: t('projects.types.kitchen') },
    { value: 'bathroom', label: t('projects.types.bathroom') },
    { value: 'addition', label: t('projects.types.addition') },
    { value: 'remodel', label: t('projects.types.remodel') },
    { value: 'custom', label: t('projects.types.custom') },
  ]

  const handleChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleDemoEstimate()
    }
  }

  const handleDemoEstimate = async () => {
    setIsGenerating(true)
    
    // Simulate AI generating estimate
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsGenerating(false)
    onComplete(formData)
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.companyName && formData.zipCode.length >= 5
    }
    if (step === 2) {
      return formData.markup > 0 && formData.laborRate > 0
    }
    return true
  }

  if (!isOpen) return null

  const steps = [
    { number: 1, title: t('onboarding.setup.step1Title', { fallback: 'Your Business' }), icon: Building2 },
    { number: 2, title: t('onboarding.setup.step2Title', { fallback: 'Defaults' }), icon: Settings },
    { number: 3, title: t('onboarding.setup.step3Title', { fallback: 'Try It!' }), icon: Zap },
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
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>

          {/* Content */}
          <div className="p-4 sm:p-8 md:p-12">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((s, index) => (
                  <div key={s.number} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                        step >= s.number 
                          ? 'bg-dewalt-yellow text-dewalt-black' 
                          : 'bg-background-tertiary text-text-tertiary'
                      )}>
                        {step > s.number ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <s.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={cn(
                        'ml-2 text-sm font-medium hidden sm:inline',
                        step >= s.number ? 'text-text-primary' : 'text-text-tertiary'
                      )}>
                        {s.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        'flex-1 h-0.5 mx-4 transition-all',
                        step > s.number ? 'bg-dewalt-yellow' : 'bg-background-tertiary'
                      )} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-tertiary text-center sm:hidden">
                {t('onboarding.setup.stepProgress', { current: step, total: 3, fallback: `Step ${step} of 3` })}
              </p>
            </div>

            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {t('onboarding.setup.step1Heading', { fallback: 'Tell us about your business' })}
                  </h2>
                  <p className="text-text-secondary">
                    {t('onboarding.setup.step1Desc', { fallback: 'This helps us personalize your experience' })}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">
                      {t('settings.companyName')} <span className="text-status-error">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder={t('onboarding.setup.companyPlaceholder', { fallback: 'e.g., ABC Construction' })}
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">
                      {t('settings.zipCode')} <span className="text-status-error">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="90210"
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      maxLength={5}
                      className="text-lg h-12"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      {t('settings.zipCodeHelp')}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="projectType">
                      {t('onboarding.setup.primaryType', { fallback: 'Primary project type' })}
                    </Label>
                    <select
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => handleChange('projectType', e.target.value as ProjectType)}
                      className="w-full h-12 px-4 rounded-lg border border-border bg-white text-lg text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
                    >
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Defaults */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {t('onboarding.setup.step2Heading', { fallback: 'Set your defaults' })}
                  </h2>
                  <p className="text-text-secondary">
                    {t('onboarding.setup.step2Desc', { fallback: 'These will be your starting values for new estimates' })}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="markup">
                      {t('settings.defaultMarkup')}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="markup"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.markup}
                        onChange={(e) => handleChange('markup', parseFloat(e.target.value) || 0)}
                        className="text-lg h-12"
                      />
                      <span className="text-2xl font-bold text-text-primary">%</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="laborRate">
                      {t('settings.defaultLaborRate')}
                    </Label>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-text-primary">$</span>
                      <Input
                        id="laborRate"
                        type="number"
                        min="0"
                        value={formData.laborRate}
                        onChange={(e) => handleChange('laborRate', parseFloat(e.target.value) || 0)}
                        className="text-lg h-12"
                      />
                      <span className="text-text-secondary">/hr</span>
                    </div>
                  </div>

                  <div className="bg-background-secondary rounded-lg p-4">
                    <button
                      type="button"
                      onClick={() => handleChange('useNationalAverages', !formData.useNationalAverages)}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <div className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        formData.useNationalAverages 
                          ? 'bg-dewalt-yellow border-dewalt-yellow' 
                          : 'border-border'
                      )}>
                        {formData.useNationalAverages && (
                          <CheckCircle2 className="w-4 h-4 text-dewalt-black" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">
                          {t('onboarding.setup.useAverages', { fallback: 'Use national averages' })}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {t('onboarding.setup.useAveragesDesc', { fallback: 'We\'ll set typical values for your ZIP code' })}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Demo */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {t('onboarding.setup.step3Heading', { fallback: 'Try a sample estimate' })}
                  </h2>
                  <p className="text-text-secondary">
                    {t('onboarding.setup.step3Desc', { fallback: 'See QuickQuote AI in action with a pre-filled demo' })}
                  </p>
                </div>

                {!isGenerating ? (
                  <div className="bg-gradient-to-br from-dewalt-yellow/10 to-transparent border-2 border-dewalt-yellow/30 rounded-xl p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-dewalt-yellow rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-dewalt-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">
                          {t('onboarding.setup.demoTitle', { fallback: '12\' × 16\' Pressure-Treated Deck' })}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {t('onboarding.setup.demoDesc', { fallback: 'Complete with stairs, railing, and all materials calculated' })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-text-tertiary text-xs">{t('deckEstimator.review.areaLabel')}</p>
                        <p className="font-semibold text-text-primary">192 sqft</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-text-tertiary text-xs">{t('deckEstimator.materials.pressureTreated')}</p>
                        <p className="font-semibold text-text-primary">{t('deckEstimator.quality.standard')}</p>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary text-center">
                      {t('onboarding.setup.demoAction', { fallback: 'Click Generate to see your estimate in ~10 seconds' })}
                    </p>
                  </div>
                ) : (
                  <div className="bg-background-secondary rounded-xl p-12 text-center">
                    <Loader2 className="w-16 h-16 text-dewalt-yellow animate-spin mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {t('deckEstimator.review.calculatingTitle')}
                    </h3>
                    <p className="text-text-secondary mb-6">
                      {t('deckEstimator.review.calculatingDesc')}
                    </p>
                    <div className="space-y-2 text-sm text-text-tertiary">
                      <p>✓ {t('onboarding.setup.calculating1', { fallback: 'Analyzing project dimensions...' })}</p>
                      <p>✓ {t('onboarding.setup.calculating2', { fallback: 'Fetching current material prices...' })}</p>
                      <p className="text-dewalt-yellow">⟳ {t('onboarding.setup.calculating3', { fallback: 'Calculating labor hours...' })}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button 
                onClick={step === 1 ? onBack : () => setStep(step - 1)}
                variant="ghost"
                disabled={isGenerating}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? t('common.back') : t('onboarding.setup.previous', { fallback: 'Previous' })}
              </Button>

              <Button 
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('deckEstimator.calculating')}
                  </>
                ) : step === 3 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('onboarding.setup.generate', { fallback: 'Generate!' })}
                  </>
                ) : (
                  <>
                    {t('onboarding.setup.next', { fallback: 'Next' })}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}


'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Save, Trash2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface EstimateControlsProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSaveDraft: () => void
  onClear: () => void
  canGoNext: boolean
  isLastStep: boolean
}

export default function EstimateControls({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSaveDraft,
  onClear,
  canGoNext,
  isLastStep
}: EstimateControlsProps) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      {/* Left: Back + Clear */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onClear}
          className="text-status-error hover:text-status-error hover:bg-status-error/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('deckEstimator.controls.clear', { fallback: 'Clear' })}
        </Button>
      </div>

      {/* Right: Save Draft + Next */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="secondary"
          onClick={onSaveDraft}
          className="flex-1 sm:flex-none"
        >
          <Save className="w-4 h-4 mr-2" />
          {t('estimates.saveDraft')}
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1 sm:flex-none"
        >
          {isLastStep ? t('deckEstimator.controls.reviewEstimate', { fallback: 'Review Estimate' }) : t('deckEstimator.controls.nextStep', { fallback: 'Next Step' })}
          {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}


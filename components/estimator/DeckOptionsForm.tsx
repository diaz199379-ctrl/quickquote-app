'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { DeckOptions } from '@/lib/estimator/MaterialCalculator'
import { CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface DeckOptionsFormProps {
  options: DeckOptions
  onChange: (options: DeckOptions) => void
  hasRailing: boolean
}

export default function DeckOptionsForm({ options, onChange, hasRailing }: DeckOptionsFormProps) {
  const { t } = useI18n()
  
  const handleChange = (field: keyof DeckOptions, value: any) => {
    onChange({ ...options, [field]: value })
  }

  const deckingMaterials = [
    { 
      value: 'pressure-treated', 
      name: t('deckEstimator.materials.pressureTreatedPine', { fallback: 'Pressure-Treated Pine' }), 
      description: t('deckEstimator.materials.pressureTreatedDesc', { fallback: 'Most economical, requires maintenance' }),
      priceRange: '$$'
    },
    { 
      value: 'cedar', 
      name: t('deckEstimator.materials.cedar', { fallback: 'Cedar' }), 
      description: t('deckEstimator.materials.cedarDesc', { fallback: 'Natural beauty, rot-resistant' }),
      priceRange: '$$$'
    },
    { 
      value: 'composite', 
      name: t('deckEstimator.materials.composite', { fallback: 'Composite (Trex-style)' }), 
      description: t('deckEstimator.materials.compositeDesc', { fallback: 'Low maintenance, long-lasting' }),
      priceRange: '$$$$'
    },
    { 
      value: 'pvc', 
      name: t('deckEstimator.materials.pvc', { fallback: 'PVC' }), 
      description: t('deckEstimator.materials.pvcDesc', { fallback: 'Premium, waterproof, no splinters' }),
      priceRange: '$$$$$'
    },
  ]

  const framingMaterials = [
    { 
      value: 'pressure-treated', 
      name: t('deckEstimator.materials.pressureTreated', { fallback: 'Pressure-Treated' }), 
      description: t('deckEstimator.materials.pressureTreatedFraming', { fallback: 'Industry standard, code-compliant' })
    },
    { 
      value: 'cedar', 
      name: t('deckEstimator.materials.cedar', { fallback: 'Cedar' }), 
      description: t('deckEstimator.materials.cedarFraming', { fallback: 'Premium choice, naturally rot-resistant' })
    },
  ]

  const joistSpacings = [
    { value: 12, name: '12"', description: t('deckEstimator.spacing.spacing12', { fallback: 'Maximum strength, premium feel' }) },
    { value: 16, name: '16"', description: t('deckEstimator.spacing.spacing16', { fallback: 'Standard spacing, recommended' }) },
    { value: 24, name: '24"', description: t('deckEstimator.spacing.spacing24', { fallback: 'Economical, may feel bouncy' }) },
  ]

  const railingStyles = [
    { value: 'wood', name: t('deckEstimator.railingStyles.wood', { fallback: 'Wood' }), description: t('deckEstimator.railingStyles.woodDesc', { fallback: 'Classic look, matches deck' }) },
    { value: 'metal', name: t('deckEstimator.railingStyles.aluminum', { fallback: 'Aluminum' }), description: t('deckEstimator.railingStyles.aluminumDesc', { fallback: 'Modern, low maintenance' }) },
    { value: 'composite', name: t('deckEstimator.railingStyles.composite', { fallback: 'Composite' }), description: t('deckEstimator.railingStyles.compositeDesc', { fallback: 'Matches composite decking' }) },
    { value: 'cable', name: t('deckEstimator.railingStyles.cable', { fallback: 'Cable' }), description: t('deckEstimator.railingStyles.cableDesc', { fallback: 'Sleek, unobstructed views' }) },
  ]

  return (
    <div className="space-y-6">
      {/* Decking Material */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('deckEstimator.deckingMaterial')} <span className="text-status-error">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deckingMaterials.map((material) => (
            <button
              key={material.value}
              onClick={() => handleChange('deckingMaterial', material.value)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all hover:border-dewalt-yellow/50',
                options.deckingMaterial === material.value
                  ? 'border-dewalt-yellow bg-dewalt-yellow/5'
                  : 'border-border hover:bg-background-secondary'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary">{material.name}</span>
                    {options.deckingMaterial === material.value && (
                      <CheckCircle className="w-4 h-4 text-dewalt-yellow" />
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary">{material.description}</p>
                </div>
                <span className="text-sm font-bold text-dewalt-yellow ml-2">{material.priceRange}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-start gap-2 p-3 bg-status-info/10 rounded-lg mt-4">
          <Info className="w-4 h-4 text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            {t('deckEstimator.deckingTip', { fallback: 'Composite and PVC decking typically come with 25-year warranties and require minimal maintenance' })}
          </p>
        </div>
      </Card>

      {/* Framing Material */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('deckEstimator.framingMaterial')} <span className="text-status-error">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {framingMaterials.map((material) => (
            <button
              key={material.value}
              onClick={() => handleChange('framingMaterial', material.value)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all hover:border-dewalt-yellow/50',
                options.framingMaterial === material.value
                  ? 'border-dewalt-yellow bg-dewalt-yellow/5'
                  : 'border-border hover:bg-background-secondary'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-text-primary">{material.name}</span>
                {options.framingMaterial === material.value && (
                  <CheckCircle className="w-4 h-4 text-dewalt-yellow" />
                )}
              </div>
              <p className="text-xs text-text-tertiary">{material.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Joist Spacing */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('deckEstimator.joistSpacing')} <span className="text-status-error">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {joistSpacings.map((spacing) => (
            <button
              key={spacing.value}
              onClick={() => handleChange('joistSpacing', spacing.value)}
              className={cn(
                'p-4 rounded-lg border-2 text-center transition-all hover:border-dewalt-yellow/50',
                options.joistSpacing === spacing.value
                  ? 'border-dewalt-yellow bg-dewalt-yellow/5'
                  : 'border-border hover:bg-background-secondary'
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl font-bold text-text-primary">{spacing.name}</span>
                {options.joistSpacing === spacing.value && (
                  <CheckCircle className="w-5 h-5 text-dewalt-yellow" />
                )}
              </div>
              <p className="text-xs text-text-tertiary">{spacing.description}</p>
            </button>
          ))}
        </div>
        <div className="flex items-start gap-2 p-3 bg-status-warning/10 rounded-lg mt-4">
          <Info className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            {t('deckEstimator.spacingTip', { fallback: 'Check your decking manufacturer\'s specifications - composite may require 12" or 16" spacing' })}
          </p>
        </div>
      </Card>

      {/* Railing Style */}
      {hasRailing && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            {t('deckEstimator.railingStyle')} <span className="text-status-error">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {railingStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handleChange('railingStyle', style.value)}
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-all hover:border-dewalt-yellow/50',
                  options.railingStyle === style.value
                    ? 'border-dewalt-yellow bg-dewalt-yellow/5'
                    : 'border-border hover:bg-background-secondary'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-primary">{style.name}</span>
                  {options.railingStyle === style.value && (
                    <CheckCircle className="w-4 h-4 text-dewalt-yellow" />
                  )}
                </div>
                <p className="text-xs text-text-tertiary">{style.description}</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Build Quality */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('deckEstimator.buildQuality')} <span className="text-status-error">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => handleChange('buildQuality', 'standard')}
            className={cn(
              'p-4 rounded-lg border-2 text-left transition-all hover:border-dewalt-yellow/50',
              options.buildQuality === 'standard'
                ? 'border-dewalt-yellow bg-dewalt-yellow/5'
                : 'border-border hover:bg-background-secondary'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-text-primary">{t('deckEstimator.quality.standard', { fallback: 'Standard' })}</span>
              {options.buildQuality === 'standard' && (
                <CheckCircle className="w-4 h-4 text-dewalt-yellow" />
              )}
            </div>
            <p className="text-xs text-text-tertiary mb-2">
              {t('deckEstimator.quality.standardDesc', { fallback: 'Code-compliant construction with quality materials' })}
            </p>
            <ul className="text-xs text-text-tertiary space-y-1">
              <li>• {t('deckEstimator.quality.standardFeat1', { fallback: 'Standard fasteners and hardware' })}</li>
              <li>• {t('deckEstimator.quality.standardFeat2', { fallback: 'Open stair risers (if stairs selected)' })}</li>
              <li>• {t('deckEstimator.quality.standardFeat3', { fallback: 'Basic finishing' })}</li>
            </ul>
          </button>

          <button
            onClick={() => handleChange('buildQuality', 'premium')}
            className={cn(
              'p-4 rounded-lg border-2 text-left transition-all hover:border-dewalt-yellow/50',
              options.buildQuality === 'premium'
                ? 'border-dewalt-yellow bg-dewalt-yellow/5'
                : 'border-border hover:bg-background-secondary'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-text-primary">{t('deckEstimator.quality.premium', { fallback: 'Premium' })}</span>
              {options.buildQuality === 'premium' && (
                <CheckCircle className="w-4 h-4 text-dewalt-yellow" />
              )}
            </div>
            <p className="text-xs text-text-tertiary mb-2">
              {t('deckEstimator.quality.premiumDesc', { fallback: 'Enhanced details and upgraded components' })}
            </p>
            <ul className="text-xs text-text-tertiary space-y-1">
              <li>• {t('deckEstimator.quality.premiumFeat1', { fallback: 'Hidden fasteners (if compatible)' })}</li>
              <li>• {t('deckEstimator.quality.premiumFeat2', { fallback: 'Closed stair risers' })}</li>
              <li>• {t('deckEstimator.quality.premiumFeat3', { fallback: 'Professional finishing touches' })}</li>
            </ul>
          </button>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-background-secondary border-dewalt-yellow/20">
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
          {t('deckEstimator.selectionSummary', { fallback: 'Selection Summary' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-tertiary">{t('deckEstimator.summaryDecking', { fallback: 'Decking:' })}</span>
            <span className="ml-2 font-medium text-text-primary">
              {deckingMaterials.find(m => m.value === options.deckingMaterial)?.name}
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">{t('deckEstimator.summaryFraming', { fallback: 'Framing:' })}</span>
            <span className="ml-2 font-medium text-text-primary">
              {framingMaterials.find(m => m.value === options.framingMaterial)?.name}
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">{t('deckEstimator.summarySpacing', { fallback: 'Joist Spacing:' })}</span>
            <span className="ml-2 font-medium text-text-primary">
              {joistSpacings.find(s => s.value === options.joistSpacing)?.name}
            </span>
          </div>
          {hasRailing && options.railingStyle && (
            <div>
              <span className="text-text-tertiary">{t('deckEstimator.railing')}:</span>
              <span className="ml-2 font-medium text-text-primary">
                {railingStyles.find(r => r.value === options.railingStyle)?.name}
              </span>
            </div>
          )}
          <div>
            <span className="text-text-tertiary">{t('deckEstimator.summaryQuality', { fallback: 'Quality:' })}</span>
            <span className="ml-2 font-medium text-text-primary capitalize">
              {t(`deckEstimator.quality.${options.buildQuality}`, { fallback: options.buildQuality })}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}


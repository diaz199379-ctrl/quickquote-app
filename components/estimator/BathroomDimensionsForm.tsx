'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ToggleCheckbox } from '@/components/ui/toggle-checkbox'
import { BathroomDimensions } from '@/lib/estimator/BathroomMaterialCalculator'
import { Info, Ruler, Wind, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface BathroomDimensionsFormProps {
  dimensions: BathroomDimensions
  onChange: (dimensions: BathroomDimensions) => void
}

export default function BathroomDimensionsForm({ dimensions, onChange }: BathroomDimensionsFormProps) {
  const { t } = useI18n()
  const sqft = dimensions.length * dimensions.width

  const handleChange = (field: keyof BathroomDimensions, value: any) => {
    onChange({ ...dimensions, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Room Dimensions Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.roomDimensions', { fallback: 'Room Dimensions' })}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">
              {t('common.length')} (ft) <span className="text-status-error">*</span>
            </Label>
            <Input
              id="length"
              type="number"
              min="4"
              max="20"
              step="0.5"
              value={dimensions.length}
              onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
              placeholder="8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">
              {t('common.width')} (ft) <span className="text-status-error">*</span>
            </Label>
            <Input
              id="width"
              type="number"
              min="4"
              max="20"
              step="0.5"
              value={dimensions.width}
              onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
              placeholder="6"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ceilingHeight">
              {t('bathroomEstimator.ceilingHeight', { fallback: 'Ceiling Height' })} (ft)
            </Label>
            <Input
              id="ceilingHeight"
              type="number"
              min="7"
              max="12"
              step="0.5"
              value={dimensions.ceilingHeight || 8}
              onChange={(e) => handleChange('ceilingHeight', parseFloat(e.target.value) || 8)}
              placeholder="8"
            />
          </div>
        </div>

        {/* Visual Indicator */}
        <div className="mt-4 p-3 bg-dewalt-yellow/10 rounded-lg border border-dewalt-yellow/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-dewalt-yellow" />
              <span className="text-sm font-medium text-text-primary">
                {t('bathroomEstimator.totalArea', { fallback: 'Total Floor Area' })}:
              </span>
            </div>
            <span className="text-lg font-bold text-dewalt-yellow">
              {sqft.toFixed(1)} {t('common.sqft', { fallback: 'sq ft' })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-status-info/10 rounded-lg">
          <Info className="w-4 h-4 text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            {t('bathroomEstimator.dimensionsTip', { 
              fallback: 'Tip: Measure from wall to wall, including any alcoves or closets within the bathroom space.' 
            })}
          </p>
        </div>
      </Card>

      {/* Scope of Work Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.scopeOfWork', { fallback: 'Scope of Work' })}
          </h3>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-text-secondary">
            {t('bathroomEstimator.selectScope', { fallback: 'Select renovation scope' })} <span className="text-status-error">*</span>
          </Label>

          {/* Scope Radio Buttons */}
          <div className="space-y-2">
            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                dimensions.scope === 'full-gut'
                  ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                  : 'border-border bg-background-tertiary hover:border-border-medium'
              )}
            >
              <input
                type="radio"
                name="scope"
                value="full-gut"
                checked={dimensions.scope === 'full-gut'}
                onChange={(e) => handleChange('scope', e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-text-primary">
                  {t('bathroomEstimator.fullGut', { fallback: 'Full Gut Renovation' })}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {t('bathroomEstimator.fullGutDesc', { 
                    fallback: 'Complete demo to studs, new layout, all new plumbing/electrical rough-in' 
                  })}
                </div>
              </div>
            </label>

            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                dimensions.scope === 'standard-remodel'
                  ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                  : 'border-border bg-background-tertiary hover:border-border-medium'
              )}
            >
              <input
                type="radio"
                name="scope"
                value="standard-remodel"
                checked={dimensions.scope === 'standard-remodel'}
                onChange={(e) => handleChange('scope', e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-text-primary">
                  {t('bathroomEstimator.standardRemodel', { fallback: 'Standard Remodel' })}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {t('bathroomEstimator.standardRemodelDesc', { 
                    fallback: 'Keep existing layout, replace fixtures and finishes, minor plumbing updates' 
                  })}
                </div>
              </div>
            </label>

            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                dimensions.scope === 'surface-update'
                  ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                  : 'border-border bg-background-tertiary hover:border-border-medium'
              )}
            >
              <input
                type="radio"
                name="scope"
                value="surface-update"
                checked={dimensions.scope === 'surface-update'}
                onChange={(e) => handleChange('scope', e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-text-primary">
                  {t('bathroomEstimator.surfaceUpdate', { fallback: 'Surface Update' })}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {t('bathroomEstimator.surfaceUpdateDesc', { 
                    fallback: 'Paint, fixtures, and accessories only - no demo or tile work' 
                  })}
                </div>
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Ventilation Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wind className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.ventilation', { fallback: 'Ventilation' })}
          </h3>
        </div>

        <div className="space-y-3">
          <ToggleCheckbox
            checked={dimensions.hasVentilation}
            onChange={(checked) => {
              handleChange('hasVentilation', checked)
              if (!checked) {
                handleChange('ventilationUpgrade', false)
              }
            }}
            label={t('bathroomEstimator.installVentFan', { fallback: 'Install/Upgrade Exhaust Fan' })}
            description={t('bathroomEstimator.ventRequirement', { 
              fallback: 'Code requires ventilation - either exhaust fan or operable window' 
            })}
          />

          {dimensions.hasVentilation && (
            <div className="ml-9 mt-2">
              <ToggleCheckbox
                checked={dimensions.ventilationUpgrade || false}
                onChange={(checked) => handleChange('ventilationUpgrade', checked)}
                label={t('bathroomEstimator.upgradeExisting', { fallback: 'Upgrade existing fan (not new installation)' })}
              />
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-status-info/10 rounded-lg">
          <Info className="w-4 h-4 text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            {t('bathroomEstimator.ventTip', { 
              fallback: 'Code Tip: Exhaust fans must be rated for at least 50 CFM or 1 CFM per sq ft, whichever is greater. Must vent to exterior.' 
            })}
          </p>
        </div>
      </Card>

      {/* Window Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('bathroomEstimator.window', { fallback: 'Window' })}
        </h3>

        <div className="space-y-3">
          <ToggleCheckbox
            checked={dimensions.hasWindow}
            onChange={(checked) => {
              handleChange('hasWindow', checked)
              if (!checked) {
                handleChange('windowReplacement', false)
              }
            }}
            label={t('bathroomEstimator.hasWindow', { fallback: 'Bathroom has a window' })}
          />

          {dimensions.hasWindow && (
            <div className="ml-9 mt-2">
              <ToggleCheckbox
                checked={dimensions.windowReplacement || false}
                onChange={(checked) => handleChange('windowReplacement', checked)}
                label={t('bathroomEstimator.replaceWindow', { fallback: 'Replace window' })}
                description={t('bathroomEstimator.windowNote', { 
                  fallback: 'Includes obscured glass for privacy' 
                })}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}


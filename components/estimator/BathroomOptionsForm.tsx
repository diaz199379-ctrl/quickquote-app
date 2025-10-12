'use client'

import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ToggleCheckbox } from '@/components/ui/toggle-checkbox'
import { BathroomOptions } from '@/lib/estimator/BathroomMaterialCalculator'
import { Sparkles, Droplets, Paintbrush, Lightbulb, Zap, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface BathroomOptionsFormProps {
  options: BathroomOptions
  onChange: (options: BathroomOptions) => void
}

export default function BathroomOptionsForm({ options, onChange }: BathroomOptionsFormProps) {
  const { t } = useI18n()

  const handleChange = (field: keyof BathroomOptions, value: any) => {
    onChange({ ...options, [field]: value })
  }

  const handleNestedChange = (parent: keyof BathroomOptions, field: string, value: any) => {
    onChange({
      ...options,
      [parent]: {
        ...(options[parent] as any),
        [field]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Build Quality Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.buildQuality', { fallback: 'Build Quality' })}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
              options.buildQuality === 'standard'
                ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                : 'border-border bg-background-tertiary hover:border-border-medium'
            )}
          >
            <input
              type="radio"
              name="buildQuality"
              value="standard"
              checked={options.buildQuality === 'standard'}
              onChange={(e) => handleChange('buildQuality', e.target.value as any)}
              className="text-dewalt-yellow"
            />
            <div>
              <div className="font-semibold text-text-primary">
                {t('common.standard', { fallback: 'Standard' })}
              </div>
              <div className="text-xs text-text-tertiary">
                {t('bathroomEstimator.standardQualityDesc', { fallback: 'Quality materials, good value' })}
              </div>
            </div>
          </label>

          <label
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
              options.buildQuality === 'premium'
                ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                : 'border-border bg-background-tertiary hover:border-border-medium'
            )}
          >
            <input
              type="radio"
              name="buildQuality"
              value="premium"
              checked={options.buildQuality === 'premium'}
              onChange={(e) => handleChange('buildQuality', e.target.value as any)}
              className="text-dewalt-yellow"
            />
            <div>
              <div className="font-semibold text-text-primary">
                {t('common.premium', { fallback: 'Premium' })}
              </div>
              <div className="text-xs text-text-tertiary">
                {t('bathroomEstimator.premiumQualityDesc', { fallback: 'High-end finishes' })}
              </div>
            </div>
          </label>
        </div>
      </Card>

      {/* Vanity Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('bathroomEstimator.vanity', { fallback: 'Vanity' })}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vanitySize">
              {t('bathroomEstimator.vanitySize', { fallback: 'Vanity Width' })} <span className="text-status-error">*</span>
            </Label>
            <select
              id="vanitySize"
              value={options.vanitySize}
              onChange={(e) => handleChange('vanitySize', parseInt(e.target.value) as any)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
            >
              <option value={30}>30" (Small)</option>
              <option value={36}>36" (Standard)</option>
              <option value={48}>48" (Large)</option>
              <option value={60}>60" (Double Sink)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vanitySinkType">
              {t('bathroomEstimator.sinkConfiguration', { fallback: 'Sink Configuration' })}
            </Label>
            <select
              id="vanitySinkType"
              value={options.vanitySinkType}
              onChange={(e) => handleChange('vanitySinkType', e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
            >
              <option value="single">{t('bathroomEstimator.singleSink', { fallback: 'Single Sink' })}</option>
              <option value="double">{t('bathroomEstimator.doubleSink', { fallback: 'Double Sink' })}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Toilet Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('bathroomEstimator.toilet', { fallback: 'Toilet' })}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="toiletType">
            {t('bathroomEstimator.toiletType', { fallback: 'Toilet Type' })} <span className="text-status-error">*</span>
          </Label>
          <select
            id="toiletType"
            value={options.toiletType}
            onChange={(e) => handleChange('toiletType', e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
          >
            <option value="standard">{t('bathroomEstimator.standardHeight', { fallback: 'Standard Height' })}</option>
            <option value="comfort-height">{t('bathroomEstimator.comfortHeight', { fallback: 'Comfort Height (ADA)' })}</option>
            <option value="wall-mounted">{t('bathroomEstimator.wallMounted', { fallback: 'Wall-Mounted' })}</option>
          </select>
          <p className="text-xs text-text-tertiary">
            {t('bathroomEstimator.toiletNote', { fallback: 'Comfort height is 17-19" tall (vs standard 15"). Wall-mounted requires in-wall carrier.' })}
          </p>
        </div>
      </Card>

      {/* Shower/Tub Configuration Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.showerTubConfig', { fallback: 'Shower/Tub Configuration' })}
          </h3>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-text-secondary">
            {t('bathroomEstimator.selectConfig', { fallback: 'Select configuration' })} <span className="text-status-error">*</span>
          </Label>

          <div className="space-y-2">
            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                options.showerTubConfig === 'tub-surround'
                  ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                  : 'border-border bg-background-tertiary hover:border-border-medium'
              )}
            >
              <input
                type="radio"
                name="showerTubConfig"
                value="tub-surround"
                checked={options.showerTubConfig === 'tub-surround'}
                onChange={(e) => handleChange('showerTubConfig', e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-text-primary">
                  {t('bathroomEstimator.tubSurround', { fallback: 'Bathtub with Surround' })}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {t('bathroomEstimator.tubSurroundDesc', { fallback: 'Standard 60" tub with tile or acrylic surround' })}
                </div>
              </div>
            </label>

            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                options.showerTubConfig === 'walk-in-shower'
                  ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                  : 'border-border bg-background-tertiary hover:border-border-medium'
              )}
            >
              <input
                type="radio"
                name="showerTubConfig"
                value="walk-in-shower"
                checked={options.showerTubConfig === 'walk-in-shower'}
                onChange={(e) => handleChange('showerTubConfig', e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-text-primary">
                  {t('bathroomEstimator.walkInShower', { fallback: 'Walk-In Shower' })}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {t('bathroomEstimator.walkInShowerDesc', { fallback: 'No tub, frameless glass door, tile surround' })}
                </div>
              </div>
            </label>

            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                options.showerTubConfig === 'tub-and-shower'
                  ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                  : 'border-border bg-background-tertiary hover:border-border-medium'
              )}
            >
              <input
                type="radio"
                name="showerTubConfig"
                value="tub-and-shower"
                checked={options.showerTubConfig === 'tub-and-shower'}
                onChange={(e) => handleChange('showerTubConfig', e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-text-primary">
                  {t('bathroomEstimator.tubAndShower', { fallback: 'Tub + Separate Shower' })}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {t('bathroomEstimator.tubAndShowerDesc', { fallback: 'Both fixtures (larger bathrooms only)' })}
                </div>
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Wall Finish Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Paintbrush className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.wallFinish', { fallback: 'Wall Finish' })}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallFinish">
              {t('bathroomEstimator.wallFinishType', { fallback: 'Wall Finish Type' })} <span className="text-status-error">*</span>
            </Label>
            <select
              id="wallFinish"
              value={options.wallFinish}
              onChange={(e) => handleChange('wallFinish', e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
            >
              <option value="tile">{t('bathroomEstimator.tile', { fallback: 'Tile' })}</option>
              <option value="paint-only">{t('bathroomEstimator.paintOnly', { fallback: 'Paint Only' })}</option>
              <option value="panel-wainscoting">{t('bathroomEstimator.panelWainscoting', { fallback: 'Panel/Wainscoting' })}</option>
            </select>
          </div>

          {options.wallFinish === 'tile' && (
            <div className="space-y-2 ml-4 p-3 bg-background-secondary rounded-lg">
              <Label htmlFor="tileHeight">
                {t('bathroomEstimator.tileHeight', { fallback: 'Tile Height (feet)' })}
              </Label>
              <Input
                id="tileHeight"
                type="number"
                min="3"
                max="8"
                step="0.5"
                value={options.tileHeight || 8}
                onChange={(e) => handleChange('tileHeight', parseFloat(e.target.value) || undefined)}
                placeholder="8"
              />
              <p className="text-xs text-text-tertiary">
                {t('bathroomEstimator.tileHeightNote', { fallback: 'Leave at ceiling height (8\') for full tile, or set to 4-5\' for partial wainscot-style tile' })}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Floor Finish Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('bathroomEstimator.floorFinish', { fallback: 'Floor Finish' })}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="floorFinish">
            {t('bathroomEstimator.floorMaterial', { fallback: 'Floor Material' })} <span className="text-status-error">*</span>
          </Label>
          <select
            id="floorFinish"
            value={options.floorFinish}
            onChange={(e) => handleChange('floorFinish', e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
          >
            <option value="ceramic-tile">{t('bathroomEstimator.ceramicTile', { fallback: 'Ceramic Tile' })}</option>
            <option value="porcelain-tile">{t('bathroomEstimator.porcelainTile', { fallback: 'Porcelain Tile' })}</option>
            <option value="vinyl-plank">{t('bathroomEstimator.vinylPlank', { fallback: 'Luxury Vinyl Plank (LVP)' })}</option>
            <option value="natural-stone">{t('bathroomEstimator.naturalStone', { fallback: 'Natural Stone' })}</option>
          </select>
          <p className="text-xs text-text-tertiary">
            {t('bathroomEstimator.floorNote', { fallback: 'Porcelain is more water-resistant than ceramic. LVP is waterproof and budget-friendly.' })}
          </p>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-status-info/10 rounded-lg">
          <Info className="w-4 h-4 text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            {t('bathroomEstimator.peiRatingTip', { 
              fallback: 'Code Tip: Use tile with PEI rating 3+ for bathroom floors. Ensure slip resistance (COF ≥ 0.6).' 
            })}
          </p>
        </div>
      </Card>

      {/* Lighting Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.lighting', { fallback: 'Lighting' })}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vanityLights">
              {t('bathroomEstimator.vanityLights', { fallback: 'Vanity Light Fixtures' })}
            </Label>
            <Input
              id="vanityLights"
              type="number"
              min="0"
              max="4"
              value={options.lighting.vanityLights}
              onChange={(e) => handleNestedChange('lighting', 'vanityLights', parseInt(e.target.value) || 0)}
              placeholder="1"
            />
            <p className="text-xs text-text-tertiary">
              {t('bathroomEstimator.vanityLightsNote', { fallback: 'Typically 1-2 fixtures above or beside mirror' })}
            </p>
          </div>

          <ToggleCheckbox
            checked={options.lighting.ceilingLight}
            onChange={(checked) => handleNestedChange('lighting', 'ceilingLight', checked)}
            label={t('bathroomEstimator.ceilingLight', { fallback: 'Ceiling Light Fixture' })}
            description={t('bathroomEstimator.ceilingLightNote', { fallback: 'Central overhead lighting' })}
          />

          <ToggleCheckbox
            checked={options.lighting.exhaustFan}
            onChange={(checked) => handleNestedChange('lighting', 'exhaustFan', checked)}
            label={t('bathroomEstimator.exhaustFan', { fallback: 'Exhaust Fan with Light' })}
            description={t('bathroomEstimator.exhaustFanNote', { fallback: 'Combination fan/light unit' })}
          />
        </div>
      </Card>

      {/* Electrical Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-dewalt-yellow" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('bathroomEstimator.electrical', { fallback: 'Electrical' })}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gfciOutlets">
              {t('bathroomEstimator.gfciOutlets', { fallback: 'GFCI Outlets' })} <span className="text-status-error">*</span>
            </Label>
            <Input
              id="gfciOutlets"
              type="number"
              min="1"
              max="4"
              value={options.gfciOutlets}
              onChange={(e) => handleChange('gfciOutlets', parseInt(e.target.value) || 1)}
              placeholder="2"
            />
            <p className="text-xs text-text-tertiary">
              {t('bathroomEstimator.gfciNote', { fallback: 'Code requires GFCI protection for all bathroom outlets (typically 1-2 outlets)' })}
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-status-warning/10 rounded-lg border border-status-warning/30">
            <Info className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
            <p className="text-xs text-text-secondary">
              {t('bathroomEstimator.electricalCodeTip', { 
                fallback: 'Code Tip: All outlets within 6\' of water source must be GFCI protected. Minimum 20A circuit required.' 
              })}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}


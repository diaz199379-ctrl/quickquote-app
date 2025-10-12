'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KitchenDimensions } from '@/lib/estimator/KitchenMaterialCalculator'
import { useI18n } from '@/lib/i18n/context'
import { Calculator, Grid3x3, Layers, AlertCircle } from 'lucide-react'
import { ToggleCheckbox } from '@/components/ui/toggle-checkbox'

interface KitchenDimensionsFormProps {
  dimensions: KitchenDimensions
  onChange: (dimensions: KitchenDimensions) => void
}

export default function KitchenDimensionsForm({ dimensions, onChange }: KitchenDimensionsFormProps) {
  const { t } = useI18n()

  const handleChange = (field: keyof KitchenDimensions, value: any) => {
    onChange({ ...dimensions, [field]: value })
  }

  const floorArea = dimensions.length * dimensions.width

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.kitchenDimensions', { fallback: 'Kitchen Dimensions' })}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {t('kitchenEstimator.dimensionsHelper', { fallback: 'Measure the overall kitchen space' })}
        </p>
      </div>

      {/* Basic Dimensions */}
      <Card className="p-4 bg-background-secondary">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="length" className="text-text-secondary">
              {t('kitchenEstimator.length', { fallback: 'Length (feet)' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <Input
              id="length"
              type="number"
              min="6"
              max="40"
              value={dimensions.length || ''}
              onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
              className="mt-1"
              placeholder="12"
            />
            <p className="text-xs text-text-tertiary mt-1">
              {t('kitchenEstimator.typicalLength', { fallback: 'Typical: 10-20 feet' })}
            </p>
          </div>

          <div>
            <Label htmlFor="width" className="text-text-secondary">
              {t('kitchenEstimator.width', { fallback: 'Width (feet)' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <Input
              id="width"
              type="number"
              min="6"
              max="30"
              value={dimensions.width || ''}
              onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
              className="mt-1"
              placeholder="12"
            />
            <p className="text-xs text-text-tertiary mt-1">
              {t('kitchenEstimator.typicalWidth', { fallback: 'Typical: 10-15 feet' })}
            </p>
          </div>

          <div>
            <Label htmlFor="ceilingHeight" className="text-text-secondary">
              {t('kitchenEstimator.ceilingHeight', { fallback: 'Ceiling Height (feet)' })}
            </Label>
            <Input
              id="ceilingHeight"
              type="number"
              min="7"
              max="12"
              value={dimensions.ceilingHeight || 8}
              onChange={(e) => handleChange('ceilingHeight', parseFloat(e.target.value) || 8)}
              className="mt-1"
              placeholder="8"
            />
            <p className="text-xs text-text-tertiary mt-1">
              {t('kitchenEstimator.standardHeight', { fallback: 'Standard: 8 feet' })}
            </p>
          </div>
        </div>

        {/* Calculated Area */}
        {dimensions.length > 0 && dimensions.width > 0 && (
          <div className="mt-4 p-3 bg-dewalt-yellow/10 border border-dewalt-yellow/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-dewalt-yellow" />
              <span className="text-sm font-semibold text-text-primary">
                {t('kitchenEstimator.totalArea', { fallback: 'Total Kitchen Area:' })} 
                <span className="text-dewalt-yellow ml-2">{floorArea.toFixed(0)} sq ft</span>
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Cabinet Dimensions */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          {t('kitchenEstimator.cabinetDimensions', { fallback: 'Cabinet Dimensions' })}
        </h3>
        <Card className="p-4 bg-background-secondary">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="upperCabinets" className="text-text-secondary">
                {t('kitchenEstimator.upperCabinets', { fallback: 'Upper Cabinets (linear feet)' })}
                <span className="text-accent-orange ml-1">*</span>
              </Label>
              <Input
                id="upperCabinets"
                type="number"
                min="0"
                max="100"
                value={dimensions.upperCabinetLinearFeet || ''}
                onChange={(e) => handleChange('upperCabinetLinearFeet', parseFloat(e.target.value) || 0)}
                className="mt-1"
                placeholder="12"
              />
              <p className="text-xs text-text-tertiary mt-1">
                {t('kitchenEstimator.measureWallLength', { fallback: 'Measure along wall length' })}
              </p>
            </div>

            <div>
              <Label htmlFor="lowerCabinets" className="text-text-secondary">
                {t('kitchenEstimator.lowerCabinets', { fallback: 'Lower Cabinets (linear feet)' })}
                <span className="text-accent-orange ml-1">*</span>
              </Label>
              <Input
                id="lowerCabinets"
                type="number"
                min="0"
                max="100"
                value={dimensions.lowerCabinetLinearFeet || ''}
                onChange={(e) => handleChange('lowerCabinetLinearFeet', parseFloat(e.target.value) || 0)}
                className="mt-1"
                placeholder="12"
              />
              <p className="text-xs text-text-tertiary mt-1">
                {t('kitchenEstimator.includesBaseUnits', { fallback: 'Includes base units and island' })}
              </p>
            </div>
          </div>

          {/* Cabinet measurement tip */}
          <div className="mt-4 p-3 bg-status-info/10 border border-status-info/30 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-status-info flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                {t('kitchenEstimator.cabinetTip', { fallback: 'Tip: Measure the total wall length where cabinets will be installed. Don\'t subtract for appliances or gaps.' })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Countertop Dimensions */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          {t('kitchenEstimator.countertopDimensions', { fallback: 'Countertop Dimensions' })}
        </h3>
        <Card className="p-4 bg-background-secondary">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="countertopSqft" className="text-text-secondary">
                {t('kitchenEstimator.countertopArea', { fallback: 'Countertop Area (sq ft)' })}
                <span className="text-accent-orange ml-1">*</span>
              </Label>
              <Input
                id="countertopSqft"
                type="number"
                min="0"
                max="500"
                value={dimensions.countertopSquareFeet || ''}
                onChange={(e) => handleChange('countertopSquareFeet', parseFloat(e.target.value) || 0)}
                className="mt-1"
                placeholder="30"
              />
              <p className="text-xs text-text-tertiary mt-1">
                {t('kitchenEstimator.countertopHelper', { fallback: 'Measure length × width of all counters' })}
              </p>
            </div>

            <div>
              <Label htmlFor="overhang" className="text-text-secondary">
                {t('kitchenEstimator.overhang', { fallback: 'Overhang (inches)' })}
              </Label>
              <Input
                id="overhang"
                type="number"
                min="0"
                max="12"
                value={dimensions.countertopOverhang || 1}
                onChange={(e) => handleChange('countertopOverhang', parseFloat(e.target.value) || 1)}
                className="mt-1"
                placeholder="1"
              />
              <p className="text-xs text-text-tertiary mt-1">
                {t('kitchenEstimator.standardOverhang', { fallback: 'Standard: 1 inch, Island: 12 inches' })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Backsplash */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.backsplash', { fallback: 'Backsplash' })}
        </h3>
        <Card className="p-4 bg-background-secondary">
          <div className="space-y-4">
            <ToggleCheckbox
              checked={dimensions.hasBacksplash}
              onChange={(checked) => handleChange('hasBacksplash', checked)}
              label={t('kitchenEstimator.includeBacksplash', { fallback: 'Include Backsplash' })}
            />

            {dimensions.hasBacksplash && (
              <div>
                <Label htmlFor="backsplashSqft" className="text-text-secondary">
                  {t('kitchenEstimator.backsplashArea', { fallback: 'Backsplash Area (sq ft)' })}
                  <span className="text-accent-orange ml-1">*</span>
                </Label>
                <Input
                  id="backsplashSqft"
                  type="number"
                  min="0"
                  max="200"
                  value={dimensions.backsplashSquareFeet || ''}
                  onChange={(e) => handleChange('backsplashSquareFeet', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  placeholder="20"
                />
                <p className="text-xs text-text-tertiary mt-1">
                  {t('kitchenEstimator.backsplashHelper', { fallback: 'Typical height: 18" (1.5 ft) from counter' })}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Flooring */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          {t('kitchenEstimator.flooring', { fallback: 'Flooring' })}
        </h3>
        <Card className="p-4 bg-background-secondary">
          <ToggleCheckbox
            checked={dimensions.includeFlooring}
            onChange={(checked) => handleChange('includeFlooring', checked)}
            label={t('kitchenEstimator.includeFlooring', { fallback: 'Include New Flooring' })}
            description={`${t('kitchenEstimator.flooringNote', { fallback: 'Will use calculated floor area' })} (${floorArea.toFixed(0)} sq ft)`}
          />
        </Card>
      </div>
    </div>
  )
}


'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KitchenOptions } from '@/lib/estimator/KitchenMaterialCalculator'
import { useI18n } from '@/lib/i18n/context'
import { Package, Zap, Droplets, Paintbrush, AlertCircle, Lightbulb } from 'lucide-react'
import { ToggleCheckbox } from '@/components/ui/toggle-checkbox'

interface KitchenOptionsFormProps {
  options: KitchenOptions
  onChange: (options: KitchenOptions) => void
}

export default function KitchenOptionsForm({ options, onChange }: KitchenOptionsFormProps) {
  const { t } = useI18n()

  const handleChange = (field: keyof KitchenOptions, value: any) => {
    onChange({ ...options, [field]: value })
  }

  const handleNestedChange = (parent: keyof KitchenOptions, field: string, value: any) => {
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
      {/* Cabinets Section */}
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.cabinets', { fallback: 'Cabinets' })}
        </h2>

        <Card className="p-4 bg-background-secondary space-y-4">
          {/* Cabinet Style */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.cabinetStyle', { fallback: 'Cabinet Style' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { value: 'stock', label: 'Stock', desc: 'Most economical, standard sizes' },
                { value: 'semi-custom', label: 'Semi-Custom', desc: 'More options, better quality' },
                { value: 'custom', label: 'Custom', desc: 'Fully customizable, premium' }
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleChange('cabinetStyle', style.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    options.cabinetStyle === style.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="font-semibold text-text-primary">{style.label}</div>
                  <div className="text-xs text-text-tertiary mt-1">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cabinet Material */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.cabinetMaterial', { fallback: 'Cabinet Material' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { value: 'particle-board', label: 'Particle Board', desc: 'Budget-friendly option' },
                { value: 'plywood', label: 'Plywood', desc: 'Strong and durable' },
                { value: 'solid-wood', label: 'Solid Wood', desc: 'Premium, long-lasting' }
              ].map((material) => (
                <button
                  key={material.value}
                  onClick={() => handleChange('cabinetMaterial', material.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    options.cabinetMaterial === material.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="font-semibold text-text-primary">{material.label}</div>
                  <div className="text-xs text-text-tertiary mt-1">{material.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cabinet Finish */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.cabinetFinish', { fallback: 'Cabinet Finish' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { value: 'laminate', label: 'Laminate' },
                { value: 'paint', label: 'Paint' },
                { value: 'stain', label: 'Stain' }
              ].map((finish) => (
                <button
                  key={finish.value}
                  onClick={() => handleChange('cabinetFinish', finish.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    options.cabinetFinish === finish.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="font-semibold text-text-primary">{finish.label}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Countertops Section */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {t('kitchenEstimator.countertops', { fallback: 'Countertops' })}
        </h2>

        <Card className="p-4 bg-background-secondary space-y-4">
          {/* Countertop Material */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.countertopMaterial', { fallback: 'Countertop Material' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { value: 'laminate', label: 'Laminate', desc: '$20-50/sqft' },
                { value: 'granite', label: 'Granite', desc: '$50-100/sqft' },
                { value: 'quartz', label: 'Quartz', desc: '$60-150/sqft' },
                { value: 'marble', label: 'Marble', desc: '$75-250/sqft' },
                { value: 'butcher-block', label: 'Butcher Block', desc: '$40-100/sqft' },
                { value: 'concrete', label: 'Concrete', desc: '$75-150/sqft' }
              ].map((material) => (
                <button
                  key={material.value}
                  onClick={() => handleChange('countertopMaterial', material.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    options.countertopMaterial === material.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="font-semibold text-text-primary">{material.label}</div>
                  <div className="text-xs text-text-tertiary mt-1">{material.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Edge Profile */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.edgeProfile', { fallback: 'Edge Profile' })}
            </Label>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { value: 'standard', label: 'Standard' },
                { value: 'beveled', label: 'Beveled' },
                { value: 'bullnose', label: 'Bullnose' },
                { value: 'ogee', label: 'Ogee' }
              ].map((edge) => (
                <button
                  key={edge.value}
                  onClick={() => handleChange('countertopEdge', edge.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    options.countertopEdge === edge.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="text-sm font-semibold text-text-primary">{edge.label}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Backsplash Material */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {t('kitchenEstimator.backsplashMaterial', { fallback: 'Backsplash Material' })}
        </h2>

        <Card className="p-4 bg-background-secondary">
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'ceramic', label: 'Ceramic Tile' },
              { value: 'porcelain', label: 'Porcelain Tile' },
              { value: 'glass', label: 'Glass Tile' },
              { value: 'stone', label: 'Natural Stone' },
              { value: 'subway-tile', label: 'Subway Tile' }
            ].map((material) => (
              <button
                key={material.value}
                onClick={() => handleChange('backsplashMaterial', material.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  options.backsplashMaterial === material.value
                    ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                    : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                }`}
              >
                <div className="text-sm font-semibold text-text-primary">{material.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Flooring Material */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {t('kitchenEstimator.flooringMaterial', { fallback: 'Flooring Material' })}
        </h2>

        <Card className="p-4 bg-background-secondary">
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'vinyl', label: 'Vinyl Plank', desc: 'Budget-friendly, waterproof' },
              { value: 'laminate', label: 'Laminate', desc: 'Affordable, wood-look' },
              { value: 'hardwood', label: 'Hardwood', desc: 'Classic, requires care' },
              { value: 'tile', label: 'Ceramic Tile', desc: 'Durable, waterproof' },
              { value: 'lvp', label: 'LVP', desc: 'Premium vinyl, realistic' }
            ].map((material) => (
              <button
                key={material.value}
                onClick={() => handleChange('flooringMaterial', material.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  options.flooringMaterial === material.value
                    ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                    : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                }`}
              >
                <div className="font-semibold text-text-primary">{material.label}</div>
                <div className="text-xs text-text-tertiary mt-1">{material.desc}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Appliances */}
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.appliances', { fallback: 'Appliances' })}
        </h2>

        <Card className="p-4 bg-background-secondary">
          <div className="space-y-3">
            {[
              { key: 'refrigerator', label: 'Refrigerator' },
              { key: 'range', label: 'Range/Stove' },
              { key: 'microwave', label: 'Microwave' },
              { key: 'dishwasher', label: 'Dishwasher' },
              { key: 'rangeHood', label: 'Range Hood' }
            ].map((appliance) => (
              <ToggleCheckbox
                key={appliance.key}
                checked={options.appliances[appliance.key as keyof typeof options.appliances]}
                onChange={(checked) => handleNestedChange('appliances', appliance.key, checked)}
                label={appliance.label}
              />
            ))}
          </div>

          {options.appliances.range && (
            <div className="mt-4 p-3 bg-status-info/10 border border-status-info/30 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-status-info flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  {t('kitchenEstimator.rangeHoodRequired', { fallback: 'Code Requirement: Range hood required for proper kitchen ventilation' })}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Plumbing Fixtures */}
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.plumbingFixtures', { fallback: 'Plumbing Fixtures' })}
        </h2>

        <Card className="p-4 bg-background-secondary space-y-4">
          {/* Sink */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.sink', { fallback: 'Sink' })}
            </Label>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { value: 'none', label: 'None' },
                { value: 'single-bowl', label: 'Single Bowl' },
                { value: 'double-bowl', label: 'Double Bowl' },
                { value: 'farmhouse', label: 'Farmhouse' }
              ].map((sink) => (
                <button
                  key={sink.value}
                  onClick={() => handleChange('sink', sink.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    options.sink === sink.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="text-sm font-semibold text-text-primary">{sink.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Faucet */}
          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.faucet', { fallback: 'Faucet' })}
            </Label>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { value: 'none', label: 'None' },
                { value: 'standard', label: 'Standard' },
                { value: 'pulldown', label: 'Pull-Down' },
                { value: 'touchless', label: 'Touchless' }
              ].map((faucet) => (
                <button
                  key={faucet.value}
                  onClick={() => handleChange('faucet', faucet.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    options.faucet === faucet.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="text-sm font-semibold text-text-primary">{faucet.label}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Electrical & Lighting */}
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.electricalLighting', { fallback: 'Electrical & Lighting' })}
        </h2>

        <Card className="p-4 bg-background-secondary space-y-4">
          {/* Outlets */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gfciOutlets" className="text-text-secondary">
                {t('kitchenEstimator.gfciOutlets', { fallback: 'GFCI Outlets' })}
                <span className="text-accent-orange ml-1">*</span>
              </Label>
              <Input
                id="gfciOutlets"
                type="number"
                min="0"
                max="20"
                value={options.gfciOutlets || ''}
                onChange={(e) => handleChange('gfciOutlets', parseInt(e.target.value) || 0)}
                className="mt-1"
                placeholder="4"
              />
              <p className="text-xs text-text-tertiary mt-1">
                {t('kitchenEstimator.gfciRequired', { fallback: 'Required within 6 feet of water' })}
              </p>
            </div>

            <div>
              <Label htmlFor="standardOutlets" className="text-text-secondary">
                {t('kitchenEstimator.standardOutlets', { fallback: 'Standard Outlets' })}
              </Label>
              <Input
                id="standardOutlets"
                type="number"
                min="0"
                max="20"
                value={options.standardOutlets || ''}
                onChange={(e) => handleChange('standardOutlets', parseInt(e.target.value) || 0)}
                className="mt-1"
                placeholder="2"
              />
            </div>
          </div>

          {/* Lighting */}
          <div>
            <Label className="text-text-secondary mb-2 block flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {t('kitchenEstimator.lighting', { fallback: 'Lighting' })}
            </Label>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recessedLights" className="text-text-secondary text-sm">
                  {t('kitchenEstimator.recessedLights', { fallback: 'Recessed Lights' })}
                </Label>
                <Input
                  id="recessedLights"
                  type="number"
                  min="0"
                  max="20"
                  value={options.lighting.recessed || ''}
                  onChange={(e) => handleNestedChange('lighting', 'recessed', parseInt(e.target.value) || 0)}
                  className="mt-1"
                  placeholder="6"
                />
              </div>

              <div>
                <Label htmlFor="pendantLights" className="text-text-secondary text-sm">
                  {t('kitchenEstimator.pendantLights', { fallback: 'Pendant Lights' })}
                </Label>
                <Input
                  id="pendantLights"
                  type="number"
                  min="0"
                  max="10"
                  value={options.lighting.pendant || ''}
                  onChange={(e) => handleNestedChange('lighting', 'pendant', parseInt(e.target.value) || 0)}
                  className="mt-1"
                  placeholder="3"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group select-none mt-3">
              <input
                type="checkbox"
                checked={options.lighting.underCabinet}
                onChange={(e) => handleNestedChange('lighting', 'underCabinet', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-border-light bg-background-tertiary checked:bg-dewalt-yellow checked:border-dewalt-yellow focus:ring-3 focus:ring-dewalt-yellow/30 transition-all cursor-pointer hover:border-dewalt-yellow hover:scale-110"
              />
              <span className="text-sm font-medium text-text-primary group-hover:text-dewalt-yellow transition">
                {t('kitchenEstimator.underCabinetLighting', { fallback: 'Under-Cabinet LED Lighting' })}
              </span>
            </label>
          </div>
        </Card>
      </div>

      {/* Paint & Finish */}
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
          <Paintbrush className="w-5 h-5 text-dewalt-yellow" />
          {t('kitchenEstimator.paintFinish', { fallback: 'Paint & Finish' })}
        </h2>

        <Card className="p-4 bg-background-secondary space-y-3">
          <ToggleCheckbox
            checked={options.paintWalls}
            onChange={(checked) => handleChange('paintWalls', checked)}
            label={t('kitchenEstimator.paintWalls', { fallback: 'Paint Walls' })}
          />

          <ToggleCheckbox
            checked={options.paintCeiling}
            onChange={(checked) => handleChange('paintCeiling', checked)}
            label={t('kitchenEstimator.paintCeiling', { fallback: 'Paint Ceiling' })}
          />
        </Card>
      </div>

      {/* Additional Options */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {t('kitchenEstimator.additionalOptions', { fallback: 'Additional Options' })}
        </h2>

        <Card className="p-4 bg-background-secondary space-y-4">
          <ToggleCheckbox
            checked={options.includeDemolition}
            onChange={(checked) => handleChange('includeDemolition', checked)}
            label={t('kitchenEstimator.includeDemolition', { fallback: 'Include Demolition' })}
            description={t('kitchenEstimator.demolitionNote', { fallback: 'Remove existing cabinets, countertops, and flooring' })}
          />

          <div>
            <Label className="text-text-secondary mb-2 block">
              {t('kitchenEstimator.buildQuality', { fallback: 'Build Quality' })}
              <span className="text-accent-orange ml-1">*</span>
            </Label>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { 
                  value: 'standard', 
                  label: 'Standard', 
                  desc: 'Quality materials, code-compliant' 
                },
                { 
                  value: 'premium', 
                  label: 'Premium', 
                  desc: 'Upgraded fixtures and finishes' 
                }
              ].map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => handleChange('buildQuality', quality.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    options.buildQuality === quality.value
                      ? 'border-dewalt-yellow bg-dewalt-yellow/10'
                      : 'border-border-light bg-background-tertiary hover:border-dewalt-yellow/50'
                  }`}
                >
                  <div className="font-semibold text-text-primary">{quality.label}</div>
                  <div className="text-xs text-text-tertiary mt-1">{quality.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}


'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeckDimensions, StairSet } from '@/lib/estimator/MaterialCalculator'
import { Info, Plus, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface DeckDimensionsFormProps {
  dimensions: DeckDimensions
  onChange: (dimensions: DeckDimensions) => void
}

export default function DeckDimensionsForm({ dimensions, onChange }: DeckDimensionsFormProps) {
  const { t } = useI18n()
  const sqft = dimensions.length * dimensions.width

  // Initialize stairs array if needed
  const stairs = dimensions.stairs || []

  const handleChange = (field: keyof DeckDimensions, value: any) => {
    onChange({ ...dimensions, [field]: value })
  }

  // Stair management functions
  const addStairSet = () => {
    const newStair: StairSet = {
      id: `stair-${Date.now()}`,
      steps: Math.ceil(dimensions.height / 0.65), // Auto-calculate based on 7.75" riser height
      width: 3,
      location: 'front'
    }
    onChange({ 
      ...dimensions, 
      stairs: [...stairs, newStair],
      hasStairs: true 
    })
  }

  const updateStairSet = (id: string, updates: Partial<StairSet>) => {
    onChange({
      ...dimensions,
      stairs: stairs.map(stair => 
        stair.id === id ? { ...stair, ...updates } : stair
      )
    })
  }

  const removeStairSet = (id: string) => {
    const newStairs = stairs.filter(stair => stair.id !== id)
    onChange({
      ...dimensions,
      stairs: newStairs,
      hasStairs: newStairs.length > 0
    })
  }

  return (
    <div className="space-y-6">
      {/* Dimensions Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t('deckEstimator.deckDimensions')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="length">
              {t('deckEstimator.length')} <span className="text-status-error">*</span>
            </Label>
            <Input
              id="length"
              type="number"
              min="4"
              max="100"
              step="0.5"
              value={dimensions.length || ''}
              onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
              placeholder="20"
            />
            <p className="text-xs text-text-tertiary">{t('deckEstimator.typicalLength', { fallback: 'Typical: 12-24 feet' })}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">
              {t('deckEstimator.width')} <span className="text-status-error">*</span>
            </Label>
            <Input
              id="width"
              type="number"
              min="4"
              max="50"
              step="0.5"
              value={dimensions.width || ''}
              onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
              placeholder="12"
            />
            <p className="text-xs text-text-tertiary">{t('deckEstimator.typicalWidth', { fallback: 'Typical: 10-16 feet' })}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">
              {t('deckEstimator.height')} <span className="text-status-error">*</span>
            </Label>
            <Input
              id="height"
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={dimensions.height || ''}
              onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
              placeholder="2"
            />
            <p className="text-xs text-text-tertiary">{t('deckEstimator.offGround', { fallback: 'Off the ground' })}</p>
          </div>
        </div>

        {/* Square Footage Display */}
        {sqft > 0 && (
          <div className="bg-dewalt-yellow/10 border border-dewalt-yellow/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{t('deckEstimator.totalDeckArea', { fallback: 'Total Deck Area:' })}</span>
              <span className="text-2xl font-bold text-dewalt-yellow">{sqft.toFixed(1)} sqft</span>
            </div>
          </div>
        )}
      </Card>

      {/* Stairs Card - Multi-Stair Support */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{t('deckEstimator.stairs')}</h3>
          <Button
            type="button"
            onClick={addStairSet}
            variant="primary"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('deckEstimator.addStairs', { fallback: 'Add Stairs' })}
          </Button>
        </div>

        {stairs.length === 0 ? (
          <div className="text-center py-8 text-text-tertiary">
            <p className="text-sm">{t('deckEstimator.noStairs', { fallback: 'No stairs added yet. Click "Add Stairs" to begin.' })}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stairs.map((stair, index) => (
              <div 
                key={stair.id}
                className="p-4 border-2 border-border rounded-lg bg-background-secondary space-y-4"
              >
                {/* Header with remove button */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-primary flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-dewalt-yellow text-dewalt-black text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    {t('deckEstimator.stairSet', { fallback: 'Stair Set' })} {index + 1}
                  </h4>
                  <Button
                    type="button"
                    onClick={() => removeStairSet(stair.id)}
                    variant="ghost"
                    size="sm"
                    className="text-status-error hover:bg-status-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Location dropdown */}
                <div className="space-y-2">
                  <Label htmlFor={`location-${stair.id}`}>
                    {t('deckEstimator.stairLocation', { fallback: 'Location' })}
                  </Label>
                  <select
                    id={`location-${stair.id}`}
                    value={stair.location || 'front'}
                    onChange={(e) => updateStairSet(stair.id, { location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
                  >
                    <option value="front">{t('deckEstimator.front', { fallback: 'Front' })}</option>
                    <option value="back">{t('deckEstimator.back', { fallback: 'Back' })}</option>
                    <option value="left">{t('deckEstimator.left', { fallback: 'Left' })}</option>
                    <option value="right">{t('deckEstimator.right', { fallback: 'Right' })}</option>
                  </select>
                </div>

                {/* Steps and Width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`steps-${stair.id}`}>
                      {t('deckEstimator.numberOfSteps')} <span className="text-status-error">*</span>
                    </Label>
                    <Input
                      id={`steps-${stair.id}`}
                      type="number"
                      min="1"
                      max="20"
                      value={stair.steps}
                      onChange={(e) => updateStairSet(stair.id, { steps: parseInt(e.target.value) || 1 })}
                      placeholder="3"
                    />
                    <p className="text-xs text-text-tertiary">{t('deckEstimator.basedOnHeight', { fallback: 'Based on deck height' })}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`width-${stair.id}`}>
                      {t('deckEstimator.stairWidth')} <span className="text-status-error">*</span>
                    </Label>
                    <Input
                      id={`width-${stair.id}`}
                      type="number"
                      min="2"
                      max="10"
                      step="0.5"
                      value={stair.width}
                      onChange={(e) => updateStairSet(stair.id, { width: parseFloat(e.target.value) || 3 })}
                      placeholder="3"
                    />
                    <p className="text-xs text-text-tertiary">{t('deckEstimator.minWidth', { fallback: 'Minimum 36" recommended' })}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-2 p-3 bg-status-info/10 rounded-lg">
              <Info className="w-4 h-4 text-status-info mt-0.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary">
                {t('deckEstimator.codeTip', { fallback: 'Code tip: Maximum riser height is typically 7.75", minimum tread depth is 10"' })}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Railing Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{t('deckEstimator.railing')}</h3>
          <button
            type="button"
            onClick={() => {
              const newValue = !dimensions.hasRailing
              onChange({
                ...dimensions,
                hasRailing: newValue,
                railingSides: newValue ? (dimensions.railingSides || ['front', 'left', 'right']) : undefined
              })
            }}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all select-none active:scale-95',
              dimensions.hasRailing
                ? 'border-dewalt-yellow bg-dewalt-yellow text-dewalt-black shadow-sm'
                : 'border-border bg-white text-text-primary hover:border-border-medium hover:bg-background-secondary'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded flex items-center justify-center transition-all',
              dimensions.hasRailing ? 'bg-dewalt-black' : 'bg-background-tertiary'
            )}>
              {dimensions.hasRailing && (
                <svg
                  className="w-4 h-4 text-dewalt-yellow"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-semibold">{t('deckEstimator.addRailing')}</span>
          </button>
        </div>

        {dimensions.hasRailing && (
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block text-base">{t('deckEstimator.selectSides')}</Label>
              <div className="grid grid-cols-2 gap-3">
                {['front', 'back', 'left', 'right'].map(side => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => {
                      const current = dimensions.railingSides || []
                      const updated = current.includes(side)
                        ? current.filter(s => s !== side)
                        : [...current, side]
                      onChange({
                        ...dimensions,
                        railingSides: updated
                      })
                    }}
                    className={cn(
                      'relative p-4 rounded-xl border-2 text-center transition-all select-none min-h-[88px]',
                      'active:scale-[0.97] flex flex-col items-center justify-center gap-2',
                      dimensions.railingSides?.includes(side)
                        ? 'border-dewalt-yellow bg-dewalt-yellow/10 shadow-md'
                        : 'border-border hover:border-border-medium hover:bg-background-secondary'
                    )}
                  >
                    {/* Checkmark Circle */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      dimensions.railingSides?.includes(side)
                        ? 'bg-dewalt-yellow scale-100'
                        : 'bg-background-tertiary scale-90 opacity-50'
                    )}>
                      {dimensions.railingSides?.includes(side) && (
                        <svg
                          className="w-6 h-6 text-dewalt-black"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={cn(
                      'text-sm font-semibold capitalize transition-colors',
                      dimensions.railingSides?.includes(side)
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    )}>
                      {t(`deckEstimator.${side}`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-status-warning/10 rounded-lg">
              <Info className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary">
                {t('deckEstimator.railingCode', { fallback: 'Building code: Railing required for decks more than 30" above grade' })}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Visual Preview */}
      {sqft > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('deckEstimator.visualPreview', { fallback: 'Visual Preview' })}</h3>
          <div className="flex items-center justify-center p-8 bg-background-secondary rounded-lg">
            <div className="relative" style={{ width: '300px', height: '200px' }}>
              {/* Deck */}
              <div 
                className="absolute border-4 border-dewalt-yellow bg-dewalt-yellow/20 rounded-lg"
                style={{
                  width: `${Math.min(dimensions.length / dimensions.width * 150, 280)}px`,
                  height: '150px',
                  left: '50%',
                  top: '20px',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dewalt-yellow">{sqft.toFixed(0)}</div>
                    <div className="text-xs text-text-tertiary">sqft</div>
                  </div>
                </div>
                
                {/* Railing indicators */}
                {dimensions.hasRailing && dimensions.railingSides?.map(side => (
                  <div
                    key={side}
                    className="absolute bg-dewalt-yellow"
                    style={{
                      ...(side === 'front' ? { bottom: 0, left: 0, right: 0, height: '4px' } :
                         side === 'back' ? { top: 0, left: 0, right: 0, height: '4px' } :
                         side === 'left' ? { left: 0, top: 0, bottom: 0, width: '4px' } :
                         { right: 0, top: 0, bottom: 0, width: '4px' })
                    }}
                  />
                ))}
              </div>

              {/* Stairs indicator */}
              {dimensions.hasStairs && (
                <div 
                  className="absolute w-12 h-8 border-2 border-accent-orange bg-accent-orange/20 rounded"
                  style={{
                    left: '50%',
                    bottom: '0',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="text-xs text-center text-accent-orange font-semibold mt-1.5">
                    {dimensions.stairSteps} {t('deckEstimator.steps', { fallback: 'steps' })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-center text-text-tertiary mt-4">
            {t('deckEstimator.previewNote', { fallback: 'Simplified 2D representation • Not to scale' })}
          </p>
        </Card>
      )}
    </div>
  )
}


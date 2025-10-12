'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PricingResult } from '@/lib/estimator/PriceFetcher'
import { DeckDimensions, DeckOptions } from '@/lib/estimator/MaterialCalculator'
import { KitchenDimensions, KitchenOptions } from '@/lib/estimator/KitchenMaterialCalculator'
import { BathroomDimensions, BathroomOptions } from '@/lib/estimator/BathroomMaterialCalculator'
import { Edit2, Download, Share2, AlertCircle, CheckCircle2, Save, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import PDFPreview from './PDFPreview'
import PriceComparison from './PriceComparison'
import { EstimatePDFData } from '@/lib/pdf/EstimatePDFTemplate'
import { useI18n } from '@/lib/i18n/context'

interface EstimateReviewProps {
  dimensions: DeckDimensions | KitchenDimensions | BathroomDimensions | any
  options: DeckOptions | KitchenOptions | BathroomOptions | any
  pricing: PricingResult | null
  isLoading: boolean
  onEdit: (step: number) => void
  onSave: () => void
  onExportPDF?: () => void
  onShare?: () => void
  projectType?: 'deck' | 'kitchen' | 'bathroom' | string
}

export default function EstimateReview({
  dimensions,
  options,
  pricing,
  isLoading,
  onEdit,
  onSave,
  onExportPDF,
  onShare,
  projectType = 'deck'
}: EstimateReviewProps) {
  const { t } = useI18n()
  const [markup, setMarkup] = useState(20) // 20% markup
  const [laborRate, setLaborRate] = useState(65)
  const [laborHours, setLaborHours] = useState(pricing?.laborHours || 0)
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [showPriceComparison, setShowPriceComparison] = useState(false)

  const calculateTotal = () => {
    if (!pricing) return 0
    const materialsTotal = pricing.subtotal
    const laborTotal = laborHours * laborRate
    const subtotal = materialsTotal + laborTotal
    const markupAmount = subtotal * (markup / 100)
    return Math.ceil(subtotal + markupAmount)
  }

  const sqft = dimensions.length * dimensions.width

  const handleExportPDF = () => {
    setShowPDFPreview(true)
  }

  // Get project-specific title
  const getProjectTitle = () => {
    if (projectType === 'kitchen') {
      return t('kitchenEstimator.review.kitchenEstimate', { fallback: 'Kitchen Estimate' })
    }
    if (projectType === 'bathroom') {
      return t('bathroomEstimator.title', { fallback: 'Bathroom Estimate' })
    }
    return t('deckEstimator.review.deckEstimate', { fallback: 'Deck Estimate' })
  }

  const getProjectTypeName = () => {
    if (projectType === 'kitchen') return 'Kitchen Remodel'
    if (projectType === 'bathroom') return 'Bathroom Remodel'
    return 'Deck Construction'
  }

  // Prepare PDF data
  const pdfData: EstimatePDFData | null = pricing ? {
    projectName: getProjectTitle(),
    clientName: undefined,
    address: undefined,
    zipCode: '90210', // TODO: Get from user profile or project
    projectType: getProjectTypeName(),
    dimensions,
    options,
    pricing,
    laborHours,
    laborRate,
    markup,
    companyName: 'Your Company Name', // TODO: Get from user profile
    companyPhone: '(555) 123-4567', // TODO: Get from user profile
    companyEmail: 'contact@yourcompany.com', // TODO: Get from user profile
    customNotes: undefined,
  } : null

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-dewalt-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{t('deckEstimator.review.calculatingTitle', { fallback: 'Calculating Materials & Pricing...' })}</h3>
        <p className="text-sm text-text-secondary">{t('deckEstimator.review.calculatingDesc', { fallback: 'Using AI to fetch current market prices' })}</p>
      </div>
    )
  }

  if (!pricing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-status-error mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">{t('deckEstimator.review.errorTitle', { fallback: 'Unable to Generate Estimate' })}</h3>
        <p className="text-sm text-text-secondary mb-4">{t('deckEstimator.review.errorDesc', { fallback: 'Please check your inputs and try again' })}</p>
        <Button onClick={() => onEdit(1)}>{t('common.back')}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="bg-gradient-to-r from-dewalt-yellow/10 to-transparent border-dewalt-yellow/30">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">{getProjectTitle()}</h2>
              <p className="text-text-secondary">
                {dimensions.length}' × {dimensions.width}' = {sqft.toFixed(0)} sqft {projectType === 'kitchen' ? 'kitchen' : 'deck'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span className="text-text-tertiary">{t('deckEstimator.review.materialsCalculated', { fallback: 'Materials calculated' })}</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span className="text-text-tertiary">{t('deckEstimator.review.pricingFetched', { fallback: 'Pricing fetched' })}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-tertiary mb-1">{t('deckEstimator.review.totalEstimate', { fallback: 'Total Estimate' })}</p>
              <p className="text-4xl font-bold text-dewalt-yellow">${calculateTotal().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimensions Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {projectType === 'kitchen' 
              ? t('kitchenEstimator.dimensions', { fallback: 'Dimensions' })
              : t('deckEstimator.dimensions')
            }
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit2 className="w-4 h-4 mr-2" />
            {t('common.edit')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text-tertiary">{t('deckEstimator.review.lengthLabel', { fallback: 'Length:' })}</span>
              <span className="ml-2 font-semibold text-text-primary">{dimensions.length}'</span>
            </div>
            <div>
              <span className="text-text-tertiary">{t('deckEstimator.review.widthLabel', { fallback: 'Width:' })}</span>
              <span className="ml-2 font-semibold text-text-primary">{dimensions.width}'</span>
            </div>
            {projectType === 'kitchen' ? (
              <>
                {dimensions.ceilingHeight && (
                  <div>
                    <span className="text-text-tertiary">{t('kitchenEstimator.ceilingHeight', { fallback: 'Ceiling:' })}</span>
                    <span className="ml-2 font-semibold text-text-primary">{dimensions.ceilingHeight}'</span>
                  </div>
                )}
                <div>
                  <span className="text-text-tertiary">{t('deckEstimator.review.areaLabel', { fallback: 'Area:' })}</span>
                  <span className="ml-2 font-semibold text-text-primary">{sqft.toFixed(0)} sqft</span>
                </div>
                {dimensions.upperCabinetLinearFeet > 0 && (
                  <div>
                    <span className="text-text-tertiary">{t('kitchenEstimator.upperCabinets', { fallback: 'Upper Cabinets:' })}</span>
                    <span className="ml-2 font-semibold text-text-primary">{dimensions.upperCabinetLinearFeet} lin ft</span>
                  </div>
                )}
                {dimensions.lowerCabinetLinearFeet > 0 && (
                  <div>
                    <span className="text-text-tertiary">{t('kitchenEstimator.lowerCabinets', { fallback: 'Lower Cabinets:' })}</span>
                    <span className="ml-2 font-semibold text-text-primary">{dimensions.lowerCabinetLinearFeet} lin ft</span>
                  </div>
                )}
                {dimensions.countertopSquareFeet > 0 && (
                  <div>
                    <span className="text-text-tertiary">{t('kitchenEstimator.countertopArea', { fallback: 'Countertops:' })}</span>
                    <span className="ml-2 font-semibold text-text-primary">{dimensions.countertopSquareFeet} sqft</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <span className="text-text-tertiary">{t('deckEstimator.review.heightLabel', { fallback: 'Height:' })}</span>
                  <span className="ml-2 font-semibold text-text-primary">{dimensions.height}'</span>
                </div>
                <div>
                  <span className="text-text-tertiary">{t('deckEstimator.review.areaLabel', { fallback: 'Area:' })}</span>
                  <span className="ml-2 font-semibold text-text-primary">{sqft.toFixed(0)} sqft</span>
                </div>
                {dimensions.hasStairs && (
                  <>
                    {dimensions.stairs && dimensions.stairs.length > 0 ? (
                      <div className="col-span-2">
                        <span className="text-text-tertiary">{t('deckEstimator.stairs')}:</span>
                        <div className="ml-2 mt-2 space-y-2">
                          {dimensions.stairs.map((stair: any, index: number) => (
                            <div key={stair.id} className="text-sm font-semibold text-text-primary">
                              <span className="inline-block w-5 h-5 rounded-full bg-dewalt-yellow text-dewalt-black text-xs text-center leading-5 mr-2">
                                {index + 1}
                              </span>
                              {stair.location && <span className="capitalize">{stair.location}</span>}
                              {' - '}{stair.steps} steps × {stair.width}' wide
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-text-tertiary">{t('deckEstimator.stairs')}:</span>
                          <span className="ml-2 font-semibold text-text-primary">{dimensions.stairSteps} {t('deckEstimator.steps')}</span>
                        </div>
                        <div>
                          <span className="text-text-tertiary">{t('deckEstimator.stairWidth')}:</span>
                          <span className="ml-2 font-semibold text-text-primary">{dimensions.stairWidth}'</span>
                        </div>
                      </>
                    )}
                  </>
                )}
                {dimensions.hasRailing && (
                  <div className="col-span-2">
                    <span className="text-text-tertiary">{t('deckEstimator.railing')}:</span>
                    <span className="ml-2 font-semibold text-text-primary capitalize">
                      {dimensions.railingSides?.map((side: string) => t(`deckEstimator.${side}`)).join(', ')}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {projectType === 'kitchen' 
              ? t('kitchenEstimator.options', { fallback: 'Options' })
              : t('deckEstimator.options')
            }
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit2 className="w-4 h-4 mr-2" />
            {t('common.edit')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {projectType === 'kitchen' ? (
              <>
                <div>
                  <span className="text-text-tertiary block mb-1">{t('kitchenEstimator.cabinets', { fallback: 'Cabinets' })}</span>
                  <span className="font-semibold text-text-primary capitalize">
                    {options.cabinetStyle?.replace('-', ' ')} {options.cabinetMaterial?.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">{t('kitchenEstimator.countertops', { fallback: 'Countertops' })}</span>
                  <span className="font-semibold text-text-primary capitalize">
                    {options.countertopMaterial?.replace('-', ' ')}
                  </span>
                </div>
                {options.backsplashMaterial && (
                  <div>
                    <span className="text-text-tertiary block mb-1">{t('kitchenEstimator.backsplash', { fallback: 'Backsplash' })}</span>
                    <span className="font-semibold text-text-primary capitalize">
                      {options.backsplashMaterial.replace('-', ' ')}
                    </span>
                  </div>
                )}
                {options.flooringMaterial && (
                  <div>
                    <span className="text-text-tertiary block mb-1">{t('kitchenEstimator.flooring', { fallback: 'Flooring' })}</span>
                    <span className="font-semibold text-text-primary capitalize">
                      {options.flooringMaterial.replace('-', ' ')}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-text-tertiary block mb-1">{t('kitchenEstimator.buildQuality', { fallback: 'Build Quality' })}</span>
                  <span className="font-semibold text-text-primary capitalize">{options.buildQuality}</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-text-tertiary block mb-1">{t('deckEstimator.summaryDecking')}</span>
                  <span className="font-semibold text-text-primary capitalize">
                    {options.deckingMaterial?.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">{t('deckEstimator.summaryFraming')}</span>
                  <span className="font-semibold text-text-primary capitalize">
                    {options.framingMaterial}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">{t('deckEstimator.summarySpacing')}</span>
                  <span className="font-semibold text-text-primary">{options.joistSpacing}"</span>
                </div>
                {options.railingStyle && (
                  <div>
                    <span className="text-text-tertiary block mb-1">{t('deckEstimator.railingStyle')}:</span>
                    <span className="font-semibold text-text-primary capitalize">{options.railingStyle}</span>
                  </div>
                )}
                <div>
                  <span className="text-text-tertiary block mb-1">{t('deckEstimator.summaryQuality')}</span>
                  <span className="font-semibold text-text-primary capitalize">{t(`deckEstimator.quality.${options.buildQuality}`)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Material List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('estimates.materialsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary">{t('pdf.category')}</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary">{t('estimates.item')}</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-text-primary">{t('estimates.quantity')}</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary">{t('estimates.unit')}</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-text-primary">{t('estimates.unitPrice')}</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-text-primary">{t('common.total')}</th>
                </tr>
              </thead>
              <tbody>
                {pricing.materials.map((material, index) => (
                  <tr key={`${material.category}-${material.name}-${index}`} className="border-b border-border-light hover:bg-background-secondary">
                    <td className="py-3 px-2 text-sm text-text-tertiary">{material.category}</td>
                    <td className="py-3 px-2">
                      <div className="text-sm font-medium text-text-primary">{material.name}</div>
                      {material.description && (
                        <div className="text-xs text-text-tertiary">{material.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-text-primary">{material.quantity}</td>
                    <td className="py-3 px-2 text-sm text-text-tertiary">{material.unit}</td>
                    <td className="py-3 px-2 text-right text-sm text-text-primary">
                      ${material.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-sm font-semibold text-text-primary">
                      ${material.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {pricing.materials.map((material, index) => (
              <div key={`mobile-${material.category}-${material.name}-${index}`} className="p-4 border border-border-light rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-text-tertiary mb-1">{material.category}</div>
                    <div className="font-medium text-text-primary">{material.name}</div>
                    {material.description && (
                      <div className="text-xs text-text-tertiary mt-1">{material.description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border-light mt-2">
                  <div className="text-sm text-text-tertiary">
                    {material.quantity} {material.unit} × ${material.unitPrice.toFixed(2)}
                  </div>
                  <div className="text-lg font-bold text-text-primary">
                    ${material.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex justify-between items-center py-3 border-t border-border mt-4">
            <span className="font-semibold text-text-primary">{t('pdf.materialsSubtotal')}:</span>
            <span className="text-xl font-bold text-text-primary">
              ${pricing.subtotal.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Labor & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('pdf.finalPricing')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Labor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background-secondary rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">{t('estimates.laborHours')}</label>
              <Input
                type="number"
                min="0"
                value={laborHours}
                onChange={(e) => setLaborHours(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">{t('estimates.laborRate')}</label>
              <Input
                type="number"
                min="0"
                value={laborRate}
                onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">{t('deckEstimator.review.laborTotal', { fallback: 'Labor Total' })}</label>
              <div className="h-10 flex items-center px-3 bg-background-tertiary rounded-lg font-semibold text-text-primary">
                ${(laborHours * laborRate).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Markup */}
          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">{t('estimates.markup')} (%)</label>
              <span className="text-sm font-semibold text-dewalt-yellow">{markup}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={markup}
              onChange={(e) => setMarkup(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-dewalt-yellow"
            />
            <div className="flex justify-between text-xs text-text-tertiary mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Final Total */}
          <div className="space-y-2 pt-4 border-t-2 border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-tertiary">{t('estimates.materials')}:</span>
              <span className="font-medium text-text-primary">${pricing.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-tertiary">{t('estimates.labor')}:</span>
              <span className="font-medium text-text-primary">${(laborHours * laborRate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-tertiary">{t('estimates.markup')} ({markup}%):</span>
              <span className="font-medium text-text-primary">
                ${(((pricing.subtotal + (laborHours * laborRate)) * markup) / 100).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-xl font-bold text-text-primary">{t('deckEstimator.review.totalEstimate')}:</span>
              <span className="text-3xl font-bold text-dewalt-yellow">
                ${calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-status-warning/10 border-status-warning/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <p className="font-semibold text-text-primary mb-1">{t('deckEstimator.review.disclaimer', { fallback: 'Pricing Disclaimer' })}</p>
              <p>{pricing.disclaimer}</p>
              <p className="mt-2">
                {t('deckEstimator.review.confidenceLevel', { fallback: 'Confidence Level:' })} <span className={cn(
                  "font-semibold",
                  pricing.confidence === 'high' ? 'text-status-success' :
                  pricing.confidence === 'medium' ? 'text-status-warning' :
                  'text-status-error'
                )}>{pricing.confidence.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onSave} className="flex-1" size="lg">
          <Save className="w-5 h-5 mr-2" />
          {t('estimates.saveEstimate')}
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => setShowPriceComparison(!showPriceComparison)} 
          className="flex-1"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          {showPriceComparison ? 'Hide' : 'Compare'} Prices
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleExportPDF} 
          className="flex-1"
          data-tour="export-pdf"
        >
          <Download className="w-5 h-5 mr-2" />
          {t('estimates.exportPDF')}
        </Button>
        {onShare && (
          <Button variant="secondary" onClick={onShare}>
            <Share2 className="w-5 h-5 mr-2" />
            {t('deckEstimator.review.share', { fallback: 'Share' })}
          </Button>
        )}
      </div>

      {/* Price Comparison */}
      {showPriceComparison && pricing && (
        <div className="mt-6">
          <PriceComparison
            materials={pricing.materials.map((m, idx) => ({
              id: m.id || `material-${idx}`,
              name: m.name,
              category: m.category,
              unit: m.unit || 'each',
              quantity: m.quantity,
              currentPrice: m.unitPrice
            }))}
            zipCode="90210" // TODO: Get from user profile
            userId="demo-user" // TODO: Get from auth context
            onPriceSelect={(materialId, price, source) => {
              console.log(`Selected ${source} price $${price} for material ${materialId}`)
              // TODO: Update pricing in parent component
            }}
            onClose={() => setShowPriceComparison(false)}
          />
        </div>
      )}

      {/* PDF Preview Modal */}
      {pdfData && (
        <PDFPreview
          isOpen={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          estimateData={pdfData}
        />
      )}
    </div>
  )
}


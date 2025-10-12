/**
 * Price Comparison Component
 * Displays material prices from multiple sources with comparison features
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, ChevronUp, TrendingUp, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import PriceSourceBadge from './PriceSourceBadge'
import PriceHistory from './PriceHistory'
import { PriceAggregator, AggregatedPrice, PriceSource } from '@/lib/pricing/priceAggregator'

interface Material {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  currentPrice?: number
}

interface PriceComparisonProps {
  materials: Material[]
  zipCode: string
  userId: string
  onPriceSelect?: (materialId: string, selectedPrice: number, source: string) => void
  onClose?: () => void
}

export default function PriceComparison({
  materials,
  zipCode,
  userId,
  onPriceSelect,
  onClose
}: PriceComparisonProps) {
  const [loading, setLoading] = useState(true)
  const [aggregatedPrices, setAggregatedPrices] = useState<Map<string, AggregatedPrice>>(new Map())
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null)
  const [autoSelectLowest, setAutoSelectLowest] = useState(false)
  const [showHistory, setShowHistory] = useState<string | null>(null)

  useEffect(() => {
    loadPrices()
  }, [materials])

  const loadPrices = async () => {
    setLoading(true)
    try {
      const aggregator = new PriceAggregator(userId, zipCode)
      
      const materialData = materials.map(m => ({
        name: m.name,
        category: m.category,
        unit: m.unit
      }))

      const results = await aggregator.aggregateMultiplePrices(materialData)
      
      const priceMap = new Map<string, AggregatedPrice>()
      results.forEach((result, index) => {
        priceMap.set(materials[index].id, result)
      })

      setAggregatedPrices(priceMap)

      // Auto-select lowest prices if enabled
      if (autoSelectLowest) {
        results.forEach((result, index) => {
          const material = materials[index]
          if (onPriceSelect && result.sources.length > 0) {
            const lowestSource = result.sources[0]
            onPriceSelect(material.id, lowestSource.price, lowestSource.source_name)
          }
        })
      }
    } catch (error) {
      console.error('Failed to load prices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceSelect = (materialId: string, price: number, source: string) => {
    if (onPriceSelect) {
      onPriceSelect(materialId, price, source)
    }
  }

  const toggleMaterialExpand = (materialId: string) => {
    setExpandedMaterial(expandedMaterial === materialId ? null : materialId)
  }

  const calculateSavings = (sources: PriceSource[]) => {
    if (sources.length < 2) return null
    const highest = Math.max(...sources.map(s => s.price))
    const lowest = Math.min(...sources.map(s => s.price))
    const savings = highest - lowest
    const percentage = (savings / highest) * 100
    return { amount: savings, percentage }
  }

  if (loading) {
    return (
      <Card className="bg-background-secondary border-border">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-dewalt-yellow border-t-transparent rounded-full animate-spin" />
            <p className="text-text-tertiary">Comparing prices from multiple sources...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-background-secondary border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-text-primary">Price Comparison</CardTitle>
              <p className="text-sm text-text-tertiary mt-1">
                Compare prices from multiple sources to get the best deal
              </p>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Auto-select toggle */}
          <div className="mt-4 p-3 bg-background-tertiary rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-lowest"
                checked={autoSelectLowest}
                onChange={(e) => setAutoSelectLowest(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-border-light bg-background-tertiary checked:bg-dewalt-yellow checked:border-dewalt-yellow focus:ring-3 focus:ring-dewalt-yellow/30 transition-all cursor-pointer"
              />
              <label htmlFor="auto-lowest" className="text-sm font-medium text-text-primary cursor-pointer">
                Always use lowest price automatically
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadPrices}
              className="text-dewalt-yellow hover:bg-dewalt-yellow/10"
            >
              Refresh Prices
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Materials List */}
      {materials.map((material) => {
        const aggregated = aggregatedPrices.get(material.id)
        if (!aggregated) return null

        const isExpanded = expandedMaterial === material.id
        const savings = calculateSavings(aggregated.sources)
        const isShowingHistory = showHistory === material.id

        return (
          <Card key={material.id} className="bg-background-secondary border-border overflow-hidden">
            {/* Material Header */}
            <div
              className="p-4 cursor-pointer hover:bg-background-tertiary transition-colors"
              onClick={() => toggleMaterialExpand(material.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-text-primary">{material.name}</h3>
                    <span className="text-xs text-text-tertiary">
                      {material.quantity} {material.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-sm text-text-tertiary">
                      Best Price: <span className="text-dewalt-yellow font-bold">${aggregated.best_price.toFixed(2)}</span>
                      <span className="text-text-tertiary">/{material.unit}</span>
                    </div>
                    {savings && savings.percentage > 5 && (
                      <div className="flex items-center gap-1 text-green-500 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        Save ${savings.amount.toFixed(2)} ({savings.percentage.toFixed(0)}%)
                      </div>
                    )}
                    <div className="text-xs text-text-tertiary">
                      {aggregated.sources.length} {aggregated.sources.length === 1 ? 'source' : 'sources'}
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-text-tertiary" /> : <ChevronDown className="w-5 h-5 text-text-tertiary" />}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-border">
                {/* Price Sources */}
                <div className="p-4 space-y-3">
                  {aggregated.sources.length === 0 ? (
                    <div className="text-center py-8 text-text-tertiary">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No pricing data available for this material</p>
                    </div>
                  ) : (
                    aggregated.sources.map((source, index) => {
                      const isBestPrice = index === 0
                      const totalCost = source.price * material.quantity

                      return (
                        <div
                          key={`${source.source_name}-${index}`}
                          className={cn(
                            'p-4 rounded-lg border-2 transition-all',
                            isBestPrice
                              ? 'border-green-500 bg-green-500/5'
                              : 'border-border bg-background-tertiary'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <PriceSourceBadge 
                                  source={source.source_name}
                                  supplierName={source.supplier_name}
                                />
                                {isBestPrice && (
                                  <div className="flex items-center gap-1 text-green-500 text-xs font-semibold">
                                    <Check className="w-4 h-4" />
                                    Best Price
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-xs text-text-tertiary">Unit Price</div>
                                  <div className="text-lg font-bold text-text-primary">
                                    ${source.price.toFixed(2)}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-text-tertiary">Total Cost</div>
                                  <div className="text-lg font-bold text-text-primary">
                                    ${totalCost.toFixed(2)}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-text-tertiary">Confidence</div>
                                  <div className={cn(
                                    'text-sm font-semibold',
                                    source.confidence === 'high' ? 'text-green-500' :
                                    source.confidence === 'medium' ? 'text-yellow-500' :
                                    'text-orange-500'
                                  )}>
                                    {source.confidence.toUpperCase()}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-text-tertiary">Last Updated</div>
                                  <div className="text-sm text-text-primary">
                                    {new Date(source.last_updated).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </div>
                              </div>

                              {source.notes && (
                                <div className="text-xs text-text-tertiary italic">
                                  {source.notes}
                                </div>
                              )}
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePriceSelect(material.id, source.price, source.source_name)}
                              className="ml-4"
                            >
                              Use This Price
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Price History Toggle */}
                <div className="border-t border-border p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(isShowingHistory ? null : material.id)}
                    className="w-full text-dewalt-yellow hover:bg-dewalt-yellow/10"
                  >
                    {isShowingHistory ? 'Hide' : 'Show'} Price History & Trends
                  </Button>
                </div>

                {/* Price History Chart */}
                {isShowingHistory && (
                  <div className="border-t border-border p-4">
                    <PriceHistory
                      materialName={material.name}
                      currentPrice={aggregated.best_price}
                      zipCode={zipCode}
                      userId={userId}
                    />
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}

      {/* Summary */}
      {materials.length > 0 && (
        <Card className="bg-background-secondary border-border">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-tertiary">Total Materials Compared</div>
                <div className="text-2xl font-bold text-text-primary">{materials.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-tertiary">Potential Savings</div>
                <div className="text-2xl font-bold text-green-500">
                  ${Array.from(aggregatedPrices.values())
                    .reduce((sum, agg) => {
                      const material = materials.find(m => aggregatedPrices.get(m.id) === agg)
                      if (!material || agg.sources.length < 2) return sum
                      const highest = Math.max(...agg.sources.map(s => s.price))
                      const lowest = Math.min(...agg.sources.map(s => s.price))
                      return sum + ((highest - lowest) * material.quantity)
                    }, 0)
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


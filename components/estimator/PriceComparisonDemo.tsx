/**
 * Price Comparison Demo
 * Example implementation showing how to use the price comparison feature
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PriceComparison from './PriceComparison'
import { DollarSign, Info } from 'lucide-react'

// Sample materials data
const sampleMaterials = [
  {
    id: 'lumber-1',
    name: '2x6 Pressure Treated Lumber (8ft)',
    category: 'Lumber',
    unit: 'each',
    quantity: 50,
    currentPrice: 12.50
  },
  {
    id: 'concrete-1',
    name: 'Concrete Mix (80lb bag)',
    category: 'Foundation',
    unit: 'bags',
    quantity: 30,
    currentPrice: 8.99
  },
  {
    id: 'screws-1',
    name: 'Deck Screws (5lb box)',
    category: 'Fasteners',
    unit: 'boxes',
    quantity: 5,
    currentPrice: 45.00
  },
  {
    id: 'decking-1',
    name: 'Composite Decking Board (12ft)',
    category: 'Decking',
    unit: 'each',
    quantity: 100,
    currentPrice: 32.00
  },
  {
    id: 'railing-1',
    name: 'Aluminum Railing Section (6ft)',
    category: 'Railing',
    unit: 'sections',
    quantity: 20,
    currentPrice: 85.00
  }
]

export default function PriceComparisonDemo() {
  const [showComparison, setShowComparison] = useState(false)
  const [materials, setMaterials] = useState(sampleMaterials)
  const [selectedPrices, setSelectedPrices] = useState<Map<string, { price: number; source: string }>>(new Map())

  const handlePriceSelect = (materialId: string, price: number, source: string) => {
    // Update the selected price for this material
    setSelectedPrices(prev => new Map(prev).set(materialId, { price, source }))
    
    // Update the material's current price
    setMaterials(prev => prev.map(m => 
      m.id === materialId ? { ...m, currentPrice: price } : m
    ))
    
    console.log(`Price updated for ${materialId}: $${price} from ${source}`)
  }

  const calculateTotal = () => {
    return materials.reduce((sum, m) => sum + (m.currentPrice * m.quantity), 0)
  }

  const calculateSavings = () => {
    let originalTotal = 0
    let optimizedTotal = 0

    materials.forEach(m => {
      originalTotal += m.currentPrice * m.quantity
      const selected = selectedPrices.get(m.id)
      optimizedTotal += (selected?.price || m.currentPrice) * m.quantity
    })

    return originalTotal - optimizedTotal
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Header */}
      <Card className="bg-gradient-to-r from-dewalt-yellow/10 to-transparent border-dewalt-yellow/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-dewalt-yellow" />
            Price Comparison Demo
          </CardTitle>
          <p className="text-text-tertiary mt-2">
            Click "Compare Prices" to see how contractors can find the best deals on materials
          </p>
        </CardHeader>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <p className="font-semibold text-text-primary mb-2">How it works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Compares prices from multiple sources (User Custom, AI Estimates, Cached Prices)</li>
                <li>Highlights the best price with confidence ratings</li>
                <li>Shows price history and trends over time</li>
                <li>Allows one-click price selection to update your estimate</li>
                <li>Calculates potential savings automatically</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Materials</CardTitle>
          <p className="text-sm text-text-tertiary">Sample deck construction estimate</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {materials.map(material => {
              const selected = selectedPrices.get(material.id)
              return (
                <div 
                  key={material.id}
                  className="flex items-center justify-between p-3 bg-background-secondary rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{material.name}</div>
                    <div className="text-sm text-text-tertiary">
                      {material.quantity} {material.unit} × ${material.currentPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-text-primary">
                      ${(material.currentPrice * material.quantity).toFixed(2)}
                    </div>
                    {selected && (
                      <div className="text-xs text-green-500">
                        {selected.source.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-text-primary">Estimate Total:</span>
              <span className="font-bold text-dewalt-yellow">${calculateTotal().toFixed(2)}</span>
            </div>
            {calculateSavings() > 0 && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-green-500">Potential Savings:</span>
                <span className="font-bold text-green-500">${calculateSavings().toFixed(2)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowComparison(!showComparison)}
          size="lg"
          className="gap-3 text-lg px-8 py-6"
        >
          <DollarSign className="w-6 h-6" />
          {showComparison ? 'Hide' : 'Compare'} Prices
        </Button>
      </div>

      {/* Price Comparison Component */}
      {showComparison && (
        <PriceComparison
          materials={materials}
          zipCode="90210"
          userId="demo-user-123"
          onPriceSelect={handlePriceSelect}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-background-secondary rounded-lg">
              <h3 className="font-semibold text-text-primary mb-2">🎯 Multi-Source Pricing</h3>
              <p className="text-sm text-text-tertiary">
                Compare prices from AI estimates, cached market data, and your custom saved prices.
              </p>
            </div>
            <div className="p-4 bg-background-secondary rounded-lg">
              <h3 className="font-semibold text-text-primary mb-2">📊 Price History</h3>
              <p className="text-sm text-text-tertiary">
                View 30/60/90-day price trends with charts and get alerted to significant changes.
              </p>
            </div>
            <div className="p-4 bg-background-secondary rounded-lg">
              <h3 className="font-semibold text-text-primary mb-2">✅ Confidence Ratings</h3>
              <p className="text-sm text-text-tertiary">
                Every price comes with a confidence rating so you know which sources to trust.
              </p>
            </div>
            <div className="p-4 bg-background-secondary rounded-lg">
              <h3 className="font-semibold text-text-primary mb-2">💰 Automatic Savings</h3>
              <p className="text-sm text-text-tertiary">
                See potential savings and automatically select the lowest price across all materials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


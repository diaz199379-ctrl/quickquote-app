/**
 * Price Aggregator
 * Fetches and compares prices from multiple sources
 */

import { createClient } from '@/lib/supabase/client'

export interface PriceSource {
  source_name: 'user_custom' | 'cached' | 'ai_estimate' | 'supplier_api'
  price: number
  confidence: 'high' | 'medium' | 'low'
  last_updated: string
  available: boolean
  notes?: string
  supplier_name?: string
}

export interface AggregatedPrice {
  material_name: string
  material_category: string
  unit: string
  sources: PriceSource[]
  best_price: number
  price_range: {
    min: number
    max: number
    average: number
  }
  recommendation: {
    source: string
    reason: string
  }
}

export class PriceAggregator {
  private supabase = createClient()
  private userId: string
  private zipCode: string

  constructor(userId: string, zipCode: string) {
    this.userId = userId
    this.zipCode = zipCode
  }

  /**
   * Aggregate prices from all available sources for a single material
   */
  async aggregatePrices(materialName: string, category: string, unit: string): Promise<AggregatedPrice> {
    const sources: PriceSource[] = []

    // 1. Check for user custom prices (highest priority)
    const customPrice = await this.getUserCustomPrice(materialName)
    if (customPrice) {
      sources.push({
        source_name: 'user_custom',
        price: customPrice.price,
        confidence: 'high',
        last_updated: customPrice.updated_at,
        available: true,
        notes: customPrice.notes || 'Your saved price'
      })
    }

    // 2. Check for recent cached prices (less than 7 days old)
    const cachedPrices = await this.getCachedPrices(materialName)
    sources.push(...cachedPrices)

    // 3. If no recent data, get AI estimation
    if (sources.length === 0 || this.needsAIEstimate(sources)) {
      const aiPrice = await this.getAIEstimate(materialName, category, unit)
      if (aiPrice) {
        sources.push(aiPrice)
        // Cache the AI result
        await this.cachePrice(materialName, category, unit, aiPrice.price, 'ai_estimate')
      }
    }

    // Calculate price statistics
    const prices = sources.filter(s => s.available).map(s => s.price)
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length
    }

    // Sort sources by price (lowest first)
    sources.sort((a, b) => a.price - b.price)

    // Determine recommendation
    const recommendation = this.getRecommendation(sources, priceRange)

    return {
      material_name: materialName,
      material_category: category,
      unit: unit,
      sources: sources,
      best_price: priceRange.min,
      price_range: priceRange,
      recommendation: recommendation
    }
  }

  /**
   * Aggregate prices for multiple materials at once
   */
  async aggregateMultiplePrices(materials: Array<{ name: string; category: string; unit: string }>): Promise<AggregatedPrice[]> {
    const results = await Promise.all(
      materials.map(m => this.aggregatePrices(m.name, m.category, m.unit))
    )
    return results
  }

  /**
   * Get user's custom price override
   */
  private async getUserCustomPrice(materialName: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_material_overrides')
        .select('*')
        .eq('user_id', this.userId)
        .eq('material_name', materialName)
        .eq('zip_code', this.zipCode)
        .single()

      if (error) return null
      return data
    } catch {
      return null
    }
  }

  /**
   * Get cached prices from database (less than 7 days old)
   */
  private async getCachedPrices(materialName: string): Promise<PriceSource[]> {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data, error } = await this.supabase
        .from('material_prices')
        .select('*')
        .eq('material_name', materialName)
        .eq('zip_code', this.zipCode)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(3)

      if (error || !data) return []

      return data.map(item => ({
        source_name: item.source_type || 'cached',
        price: item.unit_price,
        confidence: item.confidence || 'medium',
        last_updated: item.created_at,
        available: true,
        notes: item.notes,
        supplier_name: item.supplier_name
      }))
    } catch {
      return []
    }
  }

  /**
   * Get AI price estimate using OpenAI
   */
  private async getAIEstimate(materialName: string, category: string, unit: string): Promise<PriceSource | null> {
    try {
      // In a real app, this would call your OpenAI pricing API endpoint
      const response = await fetch('/api/pricing/ai-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_name: materialName,
          category: category,
          unit: unit,
          zip_code: this.zipCode
        })
      })

      if (!response.ok) return null

      const data = await response.json()

      return {
        source_name: 'ai_estimate',
        price: data.estimated_price,
        confidence: data.confidence || 'medium',
        last_updated: new Date().toISOString(),
        available: true,
        notes: data.notes || 'AI-powered market estimate'
      }
    } catch (error) {
      console.error('AI estimate failed:', error)
      return null
    }
  }

  /**
   * Cache price to database
   */
  private async cachePrice(
    materialName: string,
    category: string,
    unit: string,
    price: number,
    sourceType: string
  ): Promise<void> {
    try {
      await this.supabase.from('material_prices').insert({
        material_name: materialName,
        material_category: category,
        unit: unit,
        unit_price: price,
        zip_code: this.zipCode,
        source_type: sourceType,
        confidence: 'medium',
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to cache price:', error)
    }
  }

  /**
   * Check if we need a fresh AI estimate
   */
  private needsAIEstimate(sources: PriceSource[]): boolean {
    // If only user custom price, get AI for comparison
    if (sources.length === 1 && sources[0].source_name === 'user_custom') {
      return true
    }
    return false
  }

  /**
   * Get pricing recommendation
   */
  private getRecommendation(sources: PriceSource[], priceRange: any): { source: string; reason: string } {
    if (sources.length === 0) {
      return { source: 'none', reason: 'No pricing data available' }
    }

    const lowestPrice = sources[0]
    const customPrice = sources.find(s => s.source_name === 'user_custom')

    // Recommend user custom if it's within 10% of lowest
    if (customPrice && customPrice.price <= lowestPrice.price * 1.1) {
      return {
        source: 'user_custom',
        reason: 'Your saved price is competitive and reliable'
      }
    }

    // Recommend lowest price with high confidence
    const highConfidenceLow = sources.find(s => s.confidence === 'high')
    if (highConfidenceLow) {
      return {
        source: highConfidenceLow.source_name,
        reason: 'Best price with high confidence rating'
      }
    }

    // Default to lowest price
    return {
      source: lowestPrice.source_name,
      reason: 'Lowest available price'
    }
  }

  /**
   * Get price history for a material
   */
  async getPriceHistory(materialName: string, days: number = 30): Promise<Array<{ date: string; price: number; source: string }>> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from('material_prices')
        .select('created_at, unit_price, source_type')
        .eq('material_name', materialName)
        .eq('zip_code', this.zipCode)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error || !data) return []

      return data.map(item => ({
        date: item.created_at,
        price: item.unit_price,
        source: item.source_type
      }))
    } catch {
      return []
    }
  }
}


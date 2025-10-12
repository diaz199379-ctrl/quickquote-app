import { MaterialItem } from './MaterialCalculator'

export interface PricedMaterial extends MaterialItem {
  unitPrice: number
  totalPrice: number
  confidence: 'high' | 'medium' | 'low'
  priceNotes?: string
  lastUpdated: string
}

export interface PricingResult {
  materials: PricedMaterial[]
  subtotal: number
  estimatedLabor: number
  laborHours: number
  total: number
  zipCode: string
  pricingDate: string
  confidence: 'high' | 'medium' | 'low'
  disclaimer: string
}

export class PriceFetcher {
  private apiKey: string
  private zipCode: string

  constructor(zipCode: string = '00000') {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    this.zipCode = zipCode
  }

  async fetchPricing(materials: MaterialItem[]): Promise<PricingResult> {
    try {
      // In a real app, check Supabase cache first
      const cachedPrices = await this.checkCache(materials)
      
      if (cachedPrices.length === materials.length) {
        return this.buildResult(cachedPrices)
      }

      // Fetch prices from OpenAI for uncached materials
      const uncachedMaterials = materials.filter(m => 
        !cachedPrices.find(c => c.id === m.id)
      )

      if (this.apiKey && uncachedMaterials.length > 0) {
        const aiPrices = await this.fetchFromOpenAI(uncachedMaterials)
        const allPrices = [...cachedPrices, ...aiPrices]
        
        // Cache the new prices
        await this.cachePrices(aiPrices)
        
        return this.buildResult(allPrices)
      } else {
        // Fall back to default pricing if no API key
        return this.buildResult(this.getDefaultPricing(materials))
      }
    } catch (error) {
      console.error('Error fetching pricing:', error)
      // Fall back to default pricing on error
      return this.buildResult(this.getDefaultPricing(materials))
    }
  }

  private async fetchFromOpenAI(materials: MaterialItem[]): Promise<PricedMaterial[]> {
    const prompt = this.buildPrompt(materials)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a construction material pricing expert with access to current market rates. Always respond with valid JSON only, no additional text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No response from OpenAI')
      }

      // Parse JSON response
      const pricing = JSON.parse(content)
      
      return pricing.materials.map((item: any) => ({
        ...materials.find(m => m.id === item.material_id || m.name === item.material_name)!,
        unitPrice: parseFloat(item.unit_price),
        totalPrice: parseFloat(item.total_price),
        confidence: item.confidence || 'medium',
        priceNotes: item.notes,
        lastUpdated: new Date().toISOString()
      }))
    } catch (error) {
      console.error('OpenAI fetch error:', error)
      throw error
    }
  }

  private buildPrompt(materials: MaterialItem[]): string {
    const materialList = materials.map(m => 
      `- ${m.name}: ${m.quantity} ${m.unit}${m.description ? ` (${m.description})` : ''}`
    ).join('\n')

    return `You are a construction material pricing expert. Provide current pricing for the following materials in ZIP code ${this.zipCode}. 

Materials needed:
${materialList}

Return your response in the following JSON format (no additional text):
{
  "materials": [
    {
      "material_id": "unique-id",
      "material_name": "Material Name",
      "quantity": number,
      "unit": "unit type",
      "unit_price": number,
      "total_price": number,
      "confidence": "high|medium|low",
      "notes": "any relevant pricing notes"
    }
  ]
}

Base prices on current 2025 market rates for the ${this.zipCode} area. Include wholesale contractor pricing, not retail. Consider bulk discounts for large quantities.`
  }

  private getDefaultPricing(materials: MaterialItem[]): PricedMaterial[] {
    // Default pricing fallback based on material type
    const priceMap: Record<string, number> = {
      // Decking (per sqft)
      'Pressure-Treated Pine Decking': 3.50,
      'Cedar Decking': 6.00,
      'Composite Decking (Trex-style)': 8.50,
      'PVC Decking': 10.00,
      
      // Framing (per piece)
      '2x8': 12.00,
      '2x10': 15.00,
      '2x12': 18.00,
      '6x6': 35.00,
      '4x4': 18.00,
      
      // Concrete
      'Concrete Mix (80lb bags)': 5.50,
      '12" Concrete Footing Forms': 8.00,
      
      // Fasteners
      'Deck Screws': 45.00, // per box
      'Galvanized Joist Hangers': 2.50, // each
      'Lag Bolts': 1.50, // each
      
      // Misc
      'Galvanized Ledger Flashing': 12.00, // per linear foot
      'Stainless Steel Cable Railing Kit': 250.00, // per kit
    }

    return materials.map(material => {
      // Find matching price or estimate based on size
      let unitPrice = 0
      
      for (const [key, price] of Object.entries(priceMap)) {
        if (material.name.includes(key)) {
          unitPrice = price
          break
        }
      }

      // If no match, estimate based on category
      if (unitPrice === 0) {
        if (material.category === 'Decking') unitPrice = 5.00
        else if (material.category === 'Framing') unitPrice = 12.00
        else if (material.category === 'Structure') unitPrice = 30.00
        else if (material.category === 'Foundation') unitPrice = 6.00
        else if (material.category === 'Fasteners') unitPrice = 40.00
        else if (material.category === 'Stairs') unitPrice = 25.00
        else if (material.category === 'Railing') unitPrice = 15.00
        else unitPrice = 10.00
      }

      const totalPrice = unitPrice * material.quantity

      return {
        ...material,
        unitPrice,
        totalPrice,
        confidence: 'medium' as const,
        priceNotes: 'Estimated wholesale contractor pricing',
        lastUpdated: new Date().toISOString()
      }
    })
  }

  private calculateLaborEstimate(materials: PricedMaterial[], complexity: 'simple' | 'moderate' | 'complex'): { hours: number, cost: number } {
    // Estimate labor based on project complexity
    const baseHoursPerSqft = {
      'simple': 0.5,
      'moderate': 0.75,
      'complex': 1.0
    }

    // Find decking material to get square footage
    const deckingItem = materials.find(m => m.category === 'Decking')
    const sqft = deckingItem?.quantity || 200 // default

    const hours = sqft * baseHoursPerSqft[complexity]
    const laborRate = 65 // $65/hour contractor rate
    const cost = hours * laborRate

    return { hours: Math.ceil(hours), cost: Math.ceil(cost) }
  }

  private buildResult(pricedMaterials: PricedMaterial[]): PricingResult {
    const subtotal = pricedMaterials.reduce((sum, m) => sum + m.totalPrice, 0)
    
    // Estimate labor (in a real app, this would come from MaterialList complexity)
    const labor = this.calculateLaborEstimate(pricedMaterials, 'moderate')
    
    const total = subtotal + labor.cost

    // Determine overall confidence
    const confidenceScores = { 'high': 3, 'medium': 2, 'low': 1 }
    const avgConfidence = pricedMaterials.reduce((sum, m) => 
      sum + confidenceScores[m.confidence], 0
    ) / pricedMaterials.length

    const overallConfidence: 'high' | 'medium' | 'low' = 
      avgConfidence >= 2.5 ? 'high' : avgConfidence >= 1.5 ? 'medium' : 'low'

    return {
      materials: pricedMaterials,
      subtotal: Math.ceil(subtotal),
      estimatedLabor: Math.ceil(labor.cost),
      laborHours: labor.hours,
      total: Math.ceil(total),
      zipCode: this.zipCode,
      pricingDate: new Date().toISOString(),
      confidence: overallConfidence,
      disclaimer: 'Prices are estimates based on current market rates and may vary. Final costs depend on supplier, location, and market conditions. Material prices updated: ' + new Date().toLocaleDateString()
    }
  }

  private async checkCache(materials: MaterialItem[]): Promise<PricedMaterial[]> {
    // In a real app, query Supabase material_prices table
    // For now, return empty array to always fetch fresh prices
    return []
  }

  private async cachePrices(prices: PricedMaterial[]): Promise<void> {
    // In a real app, insert/update Supabase material_prices table
    // For now, this is a no-op
    console.log('Caching prices:', prices.length, 'items')
  }
}


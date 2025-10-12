export interface StairSet {
  id: string
  steps: number
  width: number // feet
  location?: string // e.g., 'front', 'back', 'left', 'right'
}

export interface DeckDimensions {
  length: number // feet
  width: number // feet
  height: number // feet off ground
  hasStairs: boolean
  stairs?: StairSet[] // Support multiple stair sets
  // Legacy fields for backward compatibility
  stairSteps?: number
  stairWidth?: number
  hasRailing: boolean
  railingSides?: string[] // 'front', 'back', 'left', 'right'
}

export interface DeckOptions {
  deckingMaterial: 'pressure-treated' | 'cedar' | 'composite' | 'pvc'
  framingMaterial: 'pressure-treated' | 'cedar'
  joistSpacing: 12 | 16 | 24 // inches
  railingStyle?: 'wood' | 'metal' | 'composite' | 'cable'
  buildQuality: 'standard' | 'premium'
}

export interface MaterialItem {
  id: string
  category: string
  name: string
  quantity: number
  unit: string
  description?: string
  notes?: string
}

export interface MaterialList {
  items: MaterialItem[]
  sqft: number
  complexity: 'simple' | 'moderate' | 'complex'
}

export class DeckMaterialCalculator {
  private dimensions: DeckDimensions
  private options: DeckOptions
  private wasteFactor = 1.15 // 15% waste

  constructor(dimensions: DeckDimensions, options: DeckOptions) {
    this.dimensions = dimensions
    this.options = options
  }

  calculate(): MaterialList {
    const items: MaterialItem[] = []
    const sqft = this.dimensions.length * this.dimensions.width

    // 1. Decking boards
    items.push(...this.calculateDecking())

    // 2. Framing (joists, beams, rim joists)
    items.push(...this.calculateFraming())

    // 3. Posts and footings
    items.push(...this.calculatePostsAndFootings())

    // 4. Ledger board and flashing
    items.push(...this.calculateLedger())

    // 5. Fasteners
    items.push(...this.calculateFasteners())

    // 6. Stairs (if applicable)
    if (this.dimensions.hasStairs && this.dimensions.stairSteps) {
      items.push(...this.calculateStairs())
    }

    // 7. Railing (if applicable)
    if (this.dimensions.hasRailing) {
      items.push(...this.calculateRailing())
    }

    return {
      items,
      sqft,
      complexity: this.calculateComplexity()
    }
  }

  private calculateDecking(): MaterialItem[] {
    const sqft = this.dimensions.length * this.dimensions.width
    const adjustedSqft = sqft * this.wasteFactor

    const deckingItem: MaterialItem = {
      id: 'decking-boards',
      category: 'Decking',
      name: this.getDeckingMaterialName(),
      quantity: Math.ceil(adjustedSqft),
      unit: 'sqft',
      description: `${this.dimensions.length}' x ${this.dimensions.width}' deck surface`,
      notes: 'Includes 15% waste factor'
    }

    return [deckingItem]
  }

  private calculateFraming(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // Calculate number of joists needed
    const joistSpacing = this.options.joistSpacing / 12 // convert to feet
    const numJoists = Math.ceil(this.dimensions.length / joistSpacing) + 1
    
    // Joist length (span the width)
    const joistLength = this.getClosestLumberLength(this.dimensions.width)
    
    items.push({
      id: 'joists',
      category: 'Framing',
      name: `2x8 ${this.getFramingMaterialName()} Joists`,
      quantity: numJoists,
      unit: 'each',
      description: `${joistLength}' joists at ${this.options.joistSpacing}" OC`,
      notes: `Spanning ${this.dimensions.width}' width`
    })

    // Rim joists (perimeter)
    const rimJoistLength = (this.dimensions.length * 2) + (this.dimensions.width * 2)
    items.push({
      id: 'rim-joists',
      category: 'Framing',
      name: `2x8 ${this.getFramingMaterialName()} Rim Joists`,
      quantity: Math.ceil(rimJoistLength / 8), // 8' boards
      unit: 'each',
      description: 'Perimeter rim joists',
      notes: `Total linear feet: ${Math.ceil(rimJoistLength)}'`
    })

    // Beams (2 beams for most decks)
    const numBeams = Math.ceil(this.dimensions.width / 8) // beam every 8 feet
    items.push({
      id: 'beams',
      category: 'Framing',
      name: `2x10 ${this.getFramingMaterialName()} Beams`,
      quantity: numBeams * Math.ceil(this.dimensions.length / 10),
      unit: 'each',
      description: 'Support beams',
      notes: 'Double 2x10 beam configuration'
    })

    return items
  }

  private calculatePostsAndFootings(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // Calculate number of posts (typically 6-8' spacing)
    const postsPerBeam = Math.ceil(this.dimensions.length / 6)
    const numBeams = Math.ceil(this.dimensions.width / 8)
    const totalPosts = postsPerBeam * numBeams
    
    // Post length (height + 2' for footing + 6" above deck)
    const postLength = this.getClosestLumberLength(this.dimensions.height + 2.5)
    
    items.push({
      id: 'posts',
      category: 'Structure',
      name: `6x6 ${this.getFramingMaterialName()} Posts`,
      quantity: totalPosts,
      unit: 'each',
      description: `${postLength}' posts for ${this.dimensions.height}' deck height`,
      notes: `${totalPosts} posts at 6' spacing`
    })

    // Concrete footings
    items.push({
      id: 'concrete',
      category: 'Foundation',
      name: 'Concrete Mix (80lb bags)',
      quantity: totalPosts * 3, // ~3 bags per footing
      unit: 'bags',
      description: '12" diameter x 36" deep footings',
      notes: 'Code-compliant frost depth'
    })

    // Footing forms
    items.push({
      id: 'footing-forms',
      category: 'Foundation',
      name: '12" Concrete Footing Forms',
      quantity: totalPosts,
      unit: 'each',
      description: 'Cardboard tube forms',
      notes: '36" length'
    })

    return items
  }

  private calculateLedger(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    items.push({
      id: 'ledger-board',
      category: 'Framing',
      name: `2x8 ${this.getFramingMaterialName()} Ledger Board`,
      quantity: Math.ceil(this.dimensions.length / 8),
      unit: 'each',
      description: 'Attaches deck to house',
      notes: `${this.dimensions.length}' total length`
    })

    items.push({
      id: 'ledger-flashing',
      category: 'Waterproofing',
      name: 'Galvanized Ledger Flashing',
      quantity: Math.ceil(this.dimensions.length),
      unit: 'lnft',
      description: 'Protects house from water damage',
      notes: 'Code-required flashing'
    })

    return items
  }

  private calculateFasteners(): MaterialItem[] {
    const items: MaterialItem[] = []
    const sqft = this.dimensions.length * this.dimensions.width
    
    // Deck screws (for decking boards)
    const screwsPerSqft = 2.5 // approximate
    items.push({
      id: 'deck-screws',
      category: 'Fasteners',
      name: 'Deck Screws (5lb box)',
      quantity: Math.ceil((sqft * screwsPerSqft) / 1000), // ~1000 screws per 5lb box
      unit: 'boxes',
      description: 'Exterior grade deck screws',
      notes: this.options.deckingMaterial === 'composite' ? 'Composite-rated screws' : 'Standard deck screws'
    })

    // Joist hangers
    const numJoists = Math.ceil(this.dimensions.length / (this.options.joistSpacing / 12))
    items.push({
      id: 'joist-hangers',
      category: 'Fasteners',
      name: 'Galvanized Joist Hangers (2x8)',
      quantity: numJoists * 2, // both ends
      unit: 'each',
      description: 'Heavy-duty joist hangers',
      notes: 'Includes hanger nails'
    })

    // Lag bolts (for ledger)
    items.push({
      id: 'lag-bolts',
      category: 'Fasteners',
      name: '1/2" x 6" Galvanized Lag Bolts',
      quantity: Math.ceil(this.dimensions.length / 16) * 16, // every 16"
      unit: 'each',
      description: 'Ledger board attachment',
      notes: 'Code-compliant spacing'
    })

    return items
  }

  private calculateStairs(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // Support both new array format and legacy single stair format
    const stairSets = this.dimensions.stairs && this.dimensions.stairs.length > 0
      ? this.dimensions.stairs
      : (this.dimensions.stairSteps && this.dimensions.stairWidth)
        ? [{ id: 'stair-1', steps: this.dimensions.stairSteps, width: this.dimensions.stairWidth, location: 'front' }]
        : []
    
    if (stairSets.length === 0) return items
    
    // Calculate materials for each stair set
    stairSets.forEach((stairSet, index) => {
      const { steps, width, location } = stairSet
      const setNumber = index + 1
      const locationText = location ? ` (${location})` : ''
      
      // Stringers (2x12) - typically 3 for standard stairs
      items.push({
        id: `stair-stringers-${setNumber}`,
        category: 'Stairs',
        name: `2x12 ${this.getFramingMaterialName()} Stringers${locationText}`,
        quantity: 3,
        unit: 'each',
        description: `${steps}-step staircase support`,
        notes: `${width}' wide stairs - Set ${setNumber}`
      })

      // Treads
      items.push({
        id: `stair-treads-${setNumber}`,
        category: 'Stairs',
        name: this.getDeckingMaterialName() + ` Stair Treads${locationText}`,
        quantity: steps,
        unit: 'sets',
        description: 'Stair tread boards',
        notes: `${width}' wide per step - Set ${setNumber}`
      })

      // Risers (if not open)
      if (this.options.buildQuality === 'premium') {
        items.push({
          id: `stair-risers-${setNumber}`,
          category: 'Stairs',
          name: `1x8 ${this.getFramingMaterialName()} Risers${locationText}`,
          quantity: steps,
          unit: 'each',
          description: 'Closed riser boards',
          notes: `Premium enclosed stairs - Set ${setNumber}`
        })
      }
    })

    return items
  }

  private calculateRailing(): MaterialItem[] {
    const items: MaterialItem[] = []
    const sides = this.dimensions.railingSides || []
    
    // Calculate linear feet of railing
    let railingLength = 0
    sides.forEach(side => {
      if (side === 'front' || side === 'back') {
        railingLength += this.dimensions.length
      } else {
        railingLength += this.dimensions.width
      }
    })

    // Add stair railing if applicable
    if (this.dimensions.hasStairs && this.dimensions.stairSteps) {
      railingLength += (this.dimensions.stairSteps * 1.2) * 2 // both sides
    }

    // Railing posts (every 6')
    const numPosts = Math.ceil(railingLength / 6) + sides.length // corner posts
    items.push({
      id: 'railing-posts',
      category: 'Railing',
      name: this.getRailingPostName(),
      quantity: numPosts,
      unit: 'each',
      description: 'Railing support posts',
      notes: '6\' spacing, code-compliant'
    })

    // Top rail
    items.push({
      id: 'top-rail',
      category: 'Railing',
      name: this.getRailingName() + ' Top Rail',
      quantity: Math.ceil(railingLength / 8),
      unit: 'each',
      description: 'Top horizontal rail',
      notes: `${Math.ceil(railingLength)}' total length`
    })

    // Bottom rail
    items.push({
      id: 'bottom-rail',
      category: 'Railing',
      name: this.getRailingName() + ' Bottom Rail',
      quantity: Math.ceil(railingLength / 8),
      unit: 'each',
      description: 'Bottom horizontal rail',
      notes: `${Math.ceil(railingLength)}' total length`
    })

    // Balusters (if not cable railing)
    if (this.options.railingStyle !== 'cable') {
      const balustersPerFoot = 2.5 // 4" spacing
      items.push({
        id: 'balusters',
        category: 'Railing',
        name: this.getRailingName() + ' Balusters',
        quantity: Math.ceil(railingLength * balustersPerFoot),
        unit: 'each',
        description: 'Vertical balusters',
        notes: '4" spacing, code-compliant'
      })
    } else {
      // Cable railing kit
      items.push({
        id: 'cable-railing',
        category: 'Railing',
        name: 'Stainless Steel Cable Railing Kit',
        quantity: Math.ceil(railingLength / 8),
        unit: 'kits',
        description: 'Cable railing system',
        notes: `${Math.ceil(railingLength)}' total length`
      })
    }

    return items
  }

  // Helper methods
  private getDeckingMaterialName(): string {
    const map = {
      'pressure-treated': 'Pressure-Treated Pine Decking',
      'cedar': 'Cedar Decking',
      'composite': 'Composite Decking (Trex-style)',
      'pvc': 'PVC Decking'
    }
    return map[this.options.deckingMaterial]
  }

  private getFramingMaterialName(): string {
    return this.options.framingMaterial === 'cedar' ? 'Cedar' : 'Pressure-Treated'
  }

  private getRailingName(): string {
    if (!this.options.railingStyle) return 'Wood'
    
    const map = {
      'wood': 'Pressure-Treated Wood',
      'metal': 'Aluminum',
      'composite': 'Composite',
      'cable': 'Cable'
    }
    return map[this.options.railingStyle]
  }

  private getRailingPostName(): string {
    if (this.options.railingStyle === 'metal') {
      return 'Aluminum Railing Posts (42")'
    } else if (this.options.railingStyle === 'composite') {
      return 'Composite Railing Posts (42")'
    } else {
      return '4x4 Pressure-Treated Railing Posts (42")'
    }
  }

  private getClosestLumberLength(feet: number): number {
    const standardLengths = [8, 10, 12, 14, 16, 18, 20]
    return standardLengths.find(length => length >= feet) || Math.ceil(feet)
  }

  private calculateComplexity(): 'simple' | 'moderate' | 'complex' {
    let score = 0
    
    // Size factor
    const sqft = this.dimensions.length * this.dimensions.width
    if (sqft > 400) score += 2
    else if (sqft > 200) score += 1
    
    // Height factor
    if (this.dimensions.height > 6) score += 2
    else if (this.dimensions.height > 3) score += 1
    
    // Features
    if (this.dimensions.hasStairs) score += 1
    if (this.dimensions.hasRailing) score += 1
    if (this.options.deckingMaterial === 'composite' || this.options.deckingMaterial === 'pvc') score += 1
    if (this.options.railingStyle === 'cable' || this.options.railingStyle === 'metal') score += 1
    
    if (score >= 6) return 'complex'
    if (score >= 3) return 'moderate'
    return 'simple'
  }
}


/**
 * Bathroom Material Calculator
 * Calculates all materials needed for a bathroom remodel
 * Based on IRC codes and industry standards for wet areas
 */

export interface BathroomDimensions {
  length: number // feet
  width: number // feet
  ceilingHeight?: number // feet, default 8
  
  // Scope
  scope: 'full-gut' | 'standard-remodel' | 'surface-update'
  
  // Additional features
  hasVentilation: boolean
  ventilationUpgrade?: boolean
  hasWindow: boolean
  windowReplacement?: boolean
}

export interface BathroomOptions {
  // Vanity
  vanitySize: 30 | 36 | 48 | 60 // inches
  vanitySinkType: 'single' | 'double'
  
  // Toilet
  toiletType: 'standard' | 'comfort-height' | 'wall-mounted'
  
  // Shower/Tub Configuration
  showerTubConfig: 'tub-surround' | 'walk-in-shower' | 'tub-and-shower'
  
  // Wall Finish
  wallFinish: 'tile' | 'paint-only' | 'panel-wainscoting'
  tileHeight?: number // feet, for partial tile walls
  
  // Floor Finish
  floorFinish: 'ceramic-tile' | 'porcelain-tile' | 'vinyl-plank' | 'natural-stone'
  
  // Quality Level
  buildQuality: 'standard' | 'premium'
  
  // Lighting
  lighting: {
    vanityLights: number
    ceilingLight: boolean
    exhaustFan: boolean
  }
  
  // Electrical
  gfciOutlets: number
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

export interface BathroomMaterialList {
  items: MaterialItem[]
  totalSquareFootage: number
  estimatedLaborHours: number
  demolitionHours?: number
}

export class BathroomMaterialCalculator {
  private dimensions: BathroomDimensions
  private options: BathroomOptions
  private wasteFactor = 1.15 // 15% waste for tile (higher due to cuts/wet area)
  private itemCounter = 0

  constructor(dimensions: BathroomDimensions, options: BathroomOptions) {
    this.dimensions = dimensions
    this.options = options
  }

  calculate(): BathroomMaterialList {
    const items: MaterialItem[] = []
    
    const floorArea = this.dimensions.length * this.dimensions.width
    const ceilingHeight = this.dimensions.ceilingHeight || 8
    
    // Demolition (if full gut or standard remodel)
    if (this.dimensions.scope !== 'surface-update') {
      items.push(...this.calculateDemolition())
    }
    
    // Rough-in plumbing and electrical (full gut only)
    if (this.dimensions.scope === 'full-gut') {
      items.push(...this.calculateRoughIn())
    }
    
    // Waterproofing & cement board (wet areas)
    if (this.dimensions.scope !== 'surface-update') {
      items.push(...this.calculateWaterproofing())
    }
    
    // Flooring
    items.push(...this.calculateFlooring(floorArea))
    
    // Wall finish
    items.push(...this.calculateWallFinish(floorArea, ceilingHeight))
    
    // Shower/Tub
    items.push(...this.calculateShowerTub())
    
    // Vanity & Sink
    items.push(...this.calculateVanity())
    
    // Toilet
    items.push(...this.calculateToilet())
    
    // Lighting & Electrical
    items.push(...this.calculateElectrical())
    
    // Ventilation
    if (this.dimensions.hasVentilation || this.options.lighting.exhaustFan) {
      items.push(...this.calculateVentilation(floorArea))
    }
    
    // Window (if applicable)
    if (this.dimensions.hasWindow && this.dimensions.windowReplacement) {
      items.push(...this.calculateWindow())
    }
    
    // Accessories & Hardware
    items.push(...this.calculateAccessories())
    
    const estimatedLaborHours = this.calculateLaborHours(floorArea)
    const demolitionHours = this.dimensions.scope !== 'surface-update' ? this.calculateDemolitionHours() : 0
    
    return {
      items,
      totalSquareFootage: floorArea,
      estimatedLaborHours,
      demolitionHours
    }
  }

  private generateId(category: string, name: string): string {
    return `${category.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}-${this.itemCounter++}`
  }

  private calculateDemolition(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    if (this.dimensions.scope === 'full-gut') {
      items.push({
        id: this.generateId('Demolition', 'Complete Demo & Disposal'),
        category: 'Demolition',
        name: 'Complete Demo & Disposal',
        quantity: 1,
        unit: 'job',
        notes: 'All fixtures, tile, drywall to studs'
      })
    } else if (this.dimensions.scope === 'standard-remodel') {
      items.push({
        id: this.generateId('Demolition', 'Fixture & Surface Removal'),
        category: 'Demolition',
        name: 'Fixture & Surface Removal',
        quantity: 1,
        unit: 'job',
        notes: 'Remove fixtures and finish materials'
      })
    }
    
    items.push({
      id: this.generateId('Demolition', 'Dumpster Rental'),
      category: 'Demolition',
      name: 'Dumpster Rental',
      quantity: 1,
      unit: 'unit',
      notes: '10-yard dumpster'
    })
    
    return items
  }

  private calculateRoughIn(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    items.push({
      id: this.generateId('Rough-In', 'Plumbing Rough-In Materials'),
      category: 'Rough-In',
      name: 'Plumbing Rough-In Materials',
      quantity: 1,
      unit: 'set',
      notes: 'PEX/Copper supply lines, drain pipes, valves'
    })
    
    items.push({
      id: this.generateId('Rough-In', 'Electrical Rough-In Materials'),
      category: 'Rough-In',
      name: 'Electrical Rough-In Materials',
      quantity: 1,
      unit: 'set',
      notes: 'Wire, boxes, circuit breakers'
    })
    
    return items
  }

  private calculateWaterproofing(): MaterialItem[] {
    const items: MaterialItem[] = []
    const ceilingHeight = this.dimensions.ceilingHeight || 8
    
    // Calculate wet area square footage
    let wetAreaSqft = 0
    
    // Shower/tub area (estimate 60 sqft for surround)
    if (this.options.showerTubConfig === 'tub-surround') {
      wetAreaSqft += 60
    } else if (this.options.showerTubConfig === 'walk-in-shower') {
      wetAreaSqft += 80 // More area for walk-in
    } else {
      wetAreaSqft += 120 // Both tub and shower
    }
    
    wetAreaSqft = Math.ceil(wetAreaSqft * 1.10) // 10% waste for cement board
    
    items.push({
      id: this.generateId('Waterproofing', 'Cement Backer Board'),
      category: 'Waterproofing',
      name: 'Cement Backer Board (1/2")',
      quantity: wetAreaSqft,
      unit: 'sq ft',
      notes: 'For wet areas - code required'
    })
    
    items.push({
      id: this.generateId('Waterproofing', 'Waterproof Membrane'),
      category: 'Waterproofing',
      name: 'Waterproof Membrane',
      quantity: wetAreaSqft,
      unit: 'sq ft',
      notes: 'RedGard or similar liquid membrane'
    })
    
    items.push({
      id: this.generateId('Waterproofing', 'Waterproofing Accessories'),
      category: 'Waterproofing',
      name: 'Waterproofing Accessories',
      quantity: 1,
      unit: 'set',
      notes: 'Tape, sealant, corners'
    })
    
    return items
  }

  private calculateFlooring(floorArea: number): MaterialItem[] {
    const items: MaterialItem[] = []
    
    const floorMaterialMap = {
      'ceramic-tile': 'Ceramic Floor Tile',
      'porcelain-tile': 'Porcelain Floor Tile',
      'vinyl-plank': 'Luxury Vinyl Plank (LVP)',
      'natural-stone': 'Natural Stone Floor Tile'
    }
    
    const material = floorMaterialMap[this.options.floorFinish]
    const sqft = Math.ceil(floorArea * this.wasteFactor)
    
    items.push({
      id: this.generateId('Flooring', material),
      category: 'Flooring',
      name: material,
      quantity: sqft,
      unit: 'sq ft',
      notes: this.options.buildQuality === 'premium' ? 'Premium grade' : 'Standard grade'
    })
    
    // Tile installation materials
    if (this.options.floorFinish.includes('tile') || this.options.floorFinish.includes('stone')) {
      items.push({
        id: this.generateId('Flooring', 'Floor Tile Mortar'),
        category: 'Flooring',
        name: 'Floor Tile Mortar (Thinset)',
        quantity: Math.ceil(sqft / 50),
        unit: 'bags',
        notes: '50 lb bags'
      })
      
      items.push({
        id: this.generateId('Flooring', 'Floor Grout'),
        category: 'Flooring',
        name: 'Floor Grout',
        quantity: Math.ceil(sqft / 100),
        unit: 'bags',
        notes: 'Sanded grout, 25 lb bags'
      })
      
      items.push({
        id: this.generateId('Flooring', 'Grout Sealer'),
        category: 'Flooring',
        name: 'Grout Sealer',
        quantity: 1,
        unit: 'bottle',
        notes: 'Penetrating sealer'
      })
    }
    
    // Underlayment for vinyl
    if (this.options.floorFinish === 'vinyl-plank') {
      items.push({
        id: this.generateId('Flooring', 'Underlayment'),
        category: 'Flooring',
        name: 'Underlayment',
        quantity: sqft,
        unit: 'sq ft',
        notes: 'Moisture barrier'
      })
    }
    
    return items
  }

  private calculateWallFinish(floorArea: number, ceilingHeight: number): MaterialItem[] {
    const items: MaterialItem[] = []
    const perimeter = (this.dimensions.length + this.dimensions.width) * 2
    
    if (this.options.wallFinish === 'tile') {
      // Full or partial tile walls
      const tileHeight = this.options.tileHeight || ceilingHeight
      const tileWallArea = Math.ceil(perimeter * tileHeight * this.wasteFactor)
      
      items.push({
        id: this.generateId('Wall Tile', 'Wall Tile'),
        category: 'Wall Tile',
        name: this.options.buildQuality === 'premium' ? 'Premium Wall Tile' : 'Standard Wall Tile',
        quantity: tileWallArea,
        unit: 'sq ft',
        notes: `${tileHeight}' height`
      })
      
      items.push({
        id: this.generateId('Wall Tile', 'Wall Tile Mortar'),
        category: 'Wall Tile',
        name: 'Wall Tile Mortar (Thinset)',
        quantity: Math.ceil(tileWallArea / 50),
        unit: 'bags',
        notes: '50 lb bags'
      })
      
      items.push({
        id: this.generateId('Wall Tile', 'Wall Grout'),
        category: 'Wall Tile',
        name: 'Wall Grout',
        quantity: Math.ceil(tileWallArea / 100),
        unit: 'bags',
        notes: 'Unsanded for wall joints'
      })
      
      // If partial tile, add paint for upper walls
      if (this.options.tileHeight && this.options.tileHeight < ceilingHeight) {
        const paintArea = perimeter * (ceilingHeight - this.options.tileHeight)
        const gallons = Math.ceil(paintArea / 350)
        
        items.push({
          id: this.generateId('Paint', 'Wall Paint'),
          category: 'Paint',
          name: 'Wall Paint (Above Tile)',
          quantity: gallons,
          unit: 'gallons',
          notes: 'Semi-gloss finish'
        })
      }
    } else if (this.options.wallFinish === 'paint-only') {
      const wallArea = perimeter * ceilingHeight
      const gallons = Math.ceil(wallArea / 350)
      
      items.push({
        id: this.generateId('Paint', 'Wall Paint'),
        category: 'Paint',
        name: 'Bathroom Wall Paint',
        quantity: gallons,
        unit: 'gallons',
        notes: 'Mildew-resistant, semi-gloss'
      })
      
      items.push({
        id: this.generateId('Paint', 'Primer'),
        category: 'Paint',
        name: 'Primer',
        quantity: Math.ceil(gallons / 2),
        unit: 'gallons',
        notes: 'Moisture-resistant primer'
      })
      
      items.push({
        id: this.generateId('Paint', 'Ceiling Paint'),
        category: 'Paint',
        name: 'Ceiling Paint',
        quantity: Math.ceil(floorArea / 350),
        unit: 'gallons',
        notes: 'Flat finish'
      })
    } else if (this.options.wallFinish === 'panel-wainscoting') {
      const wainscotHeight = 3.5 // Standard wainscoting height
      const wainscotArea = perimeter * wainscotHeight
      
      items.push({
        id: this.generateId('Wainscoting', 'Beadboard Panels'),
        category: 'Wainscoting',
        name: 'Beadboard Wainscoting Panels',
        quantity: Math.ceil(wainscotArea * 1.10),
        unit: 'sq ft'
      })
      
      items.push({
        id: this.generateId('Wainscoting', 'Chair Rail Molding'),
        category: 'Wainscoting',
        name: 'Chair Rail Molding',
        quantity: Math.ceil(perimeter),
        unit: 'linear ft'
      })
      
      // Paint above wainscoting
      const paintArea = perimeter * (ceilingHeight - wainscotHeight)
      items.push({
        id: this.generateId('Paint', 'Wall Paint'),
        category: 'Paint',
        name: 'Wall Paint (Above Wainscoting)',
        quantity: Math.ceil(paintArea / 350),
        unit: 'gallons',
        notes: 'Semi-gloss finish'
      })
    }
    
    return items
  }

  private calculateShowerTub(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    const configMap = {
      'tub-surround': 'Bathtub with Surround Kit',
      'walk-in-shower': 'Walk-In Shower Kit',
      'tub-and-shower': 'Bathtub + Separate Shower Enclosure'
    }
    
    const config = this.options.showerTubConfig
    const quality = this.options.buildQuality === 'premium' ? ' (Premium)' : ''
    
    if (config === 'tub-surround') {
      const tubName = 'Bathtub (60" Standard)' + quality
      items.push({
        id: this.generateId('Fixtures', tubName),
        category: 'Fixtures',
        name: tubName,
        quantity: 1,
        unit: 'unit',
        notes: 'Acrylic or fiberglass'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Tub/Shower Valve'),
        category: 'Fixtures',
        name: 'Tub/Shower Valve Kit' + quality,
        quantity: 1,
        unit: 'set',
        notes: 'Pressure-balance valve (code required)'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Tub Spout & Showerhead'),
        category: 'Fixtures',
        name: 'Tub Spout & Showerhead' + quality,
        quantity: 1,
        unit: 'set'
      })
    } else if (config === 'walk-in-shower') {
      items.push({
        id: this.generateId('Fixtures', 'Shower Base/Pan'),
        category: 'Fixtures',
        name: 'Shower Base/Pan (36" x 48")' + quality,
        quantity: 1,
        unit: 'unit',
        notes: 'Acrylic or tile-ready'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Shower Door'),
        category: 'Fixtures',
        name: 'Frameless Glass Shower Door' + quality,
        quantity: 1,
        unit: 'unit',
        notes: '3/8" tempered glass'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Shower Valve'),
        category: 'Fixtures',
        name: 'Shower Valve Kit' + quality,
        quantity: 1,
        unit: 'set',
        notes: 'Thermostatic mixing valve'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Showerhead & Trim'),
        category: 'Fixtures',
        name: 'Showerhead & Trim Kit' + quality,
        quantity: 1,
        unit: 'set'
      })
    } else {
      // Both tub and shower
      const tubName = 'Bathtub (60" Standard)' + quality
      items.push({
        id: this.generateId('Fixtures', tubName),
        category: 'Fixtures',
        name: tubName,
        quantity: 1,
        unit: 'unit'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Tub/Shower Valve'),
        category: 'Fixtures',
        name: 'Tub/Shower Valve Kit' + quality,
        quantity: 1,
        unit: 'set'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Shower Base/Pan'),
        category: 'Fixtures',
        name: 'Shower Base/Pan (36" x 36")' + quality,
        quantity: 1,
        unit: 'unit'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Shower Door'),
        category: 'Fixtures',
        name: 'Glass Shower Door' + quality,
        quantity: 1,
        unit: 'unit'
      })
      
      items.push({
        id: this.generateId('Fixtures', 'Shower Valve'),
        category: 'Fixtures',
        name: 'Shower Valve Kit' + quality,
        quantity: 1,
        unit: 'set'
      })
    }
    
    return items
  }

  private calculateVanity(): MaterialItem[] {
    const items: MaterialItem[] = []
    const quality = this.options.buildQuality === 'premium' ? ' (Premium)' : ''
    
    const vanityName = `${this.options.vanitySize}" Vanity Cabinet${quality}`
    items.push({
      id: this.generateId('Vanity', vanityName),
      category: 'Vanity',
      name: vanityName,
      quantity: 1,
      unit: 'unit',
      notes: this.options.vanitySinkType === 'double' ? 'Double sink ready' : 'Single sink'
    })
    
    const counterName = `${this.options.vanitySize}" Vanity Top${quality}`
    items.push({
      id: this.generateId('Vanity', counterName),
      category: 'Vanity',
      name: counterName,
      quantity: 1,
      unit: 'unit',
      notes: this.options.buildQuality === 'premium' ? 'Quartz or granite' : 'Cultured marble'
    })
    
    const sinkQty = this.options.vanitySinkType === 'double' ? 2 : 1
    const sinkName = 'Undermount Sink' + quality
    items.push({
      id: this.generateId('Vanity', sinkName),
      category: 'Vanity',
      name: sinkName,
      quantity: sinkQty,
      unit: 'unit',
      notes: 'Porcelain'
    })
    
    const faucetName = 'Bathroom Faucet' + quality
    items.push({
      id: this.generateId('Vanity', faucetName),
      category: 'Vanity',
      name: faucetName,
      quantity: sinkQty,
      unit: 'unit',
      notes: 'Widespread or centerset'
    })
    
    items.push({
      id: this.generateId('Vanity', 'Vanity Mirror'),
      category: 'Vanity',
      name: `${this.options.vanitySize}" Vanity Mirror`,
      quantity: 1,
      unit: 'unit',
      notes: this.options.buildQuality === 'premium' ? 'Framed with LED lighting' : 'Standard frameless'
    })
    
    return items
  }

  private calculateToilet(): MaterialItem[] {
    const items: MaterialItem[] = []
    const quality = this.options.buildQuality === 'premium' ? ' (Premium)' : ''
    
    const toiletTypeMap = {
      'standard': 'Standard Height Toilet',
      'comfort-height': 'Comfort Height Toilet (ADA)',
      'wall-mounted': 'Wall-Mounted Toilet'
    }
    
    const toiletName = toiletTypeMap[this.options.toiletType] + quality
    items.push({
      id: this.generateId('Fixtures', toiletName),
      category: 'Fixtures',
      name: toiletName,
      quantity: 1,
      unit: 'unit',
      notes: 'Dual-flush, WaterSense certified'
    })
    
    if (this.options.toiletType === 'wall-mounted') {
      items.push({
        id: this.generateId('Fixtures', 'In-Wall Carrier System'),
        category: 'Fixtures',
        name: 'In-Wall Toilet Carrier System',
        quantity: 1,
        unit: 'unit',
        notes: 'Required for wall-mounted toilet'
      })
    }
    
    items.push({
      id: this.generateId('Fixtures', 'Toilet Installation Kit'),
      category: 'Fixtures',
      name: 'Toilet Installation Kit',
      quantity: 1,
      unit: 'set',
      notes: 'Wax ring, bolts, supply line'
    })
    
    return items
  }

  private calculateElectrical(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // GFCI outlets (code required in bathrooms)
    if (this.options.gfciOutlets > 0) {
      items.push({
        id: this.generateId('Electrical', 'GFCI Outlets'),
        category: 'Electrical',
        name: 'GFCI Outlets (20A)',
        quantity: this.options.gfciOutlets,
        unit: 'outlets',
        notes: 'Code required near water sources'
      })
    }
    
    // Vanity lights
    if (this.options.lighting.vanityLights > 0) {
      const lightName = this.options.buildQuality === 'premium' 
        ? 'Premium Vanity Light Fixtures' 
        : 'Standard Vanity Light Fixtures'
      items.push({
        id: this.generateId('Electrical', lightName),
        category: 'Electrical',
        name: lightName,
        quantity: this.options.lighting.vanityLights,
        unit: 'fixtures',
        notes: 'LED, moisture-rated'
      })
    }
    
    // Ceiling light
    if (this.options.lighting.ceilingLight) {
      items.push({
        id: this.generateId('Electrical', 'Ceiling Light Fixture'),
        category: 'Electrical',
        name: 'Ceiling Light Fixture',
        quantity: 1,
        unit: 'fixture',
        notes: 'LED, moisture-rated'
      })
    }
    
    // Wiring materials
    if (this.dimensions.scope !== 'surface-update') {
      items.push({
        id: this.generateId('Electrical', 'Electrical Wiring Materials'),
        category: 'Electrical',
        name: 'Electrical Wiring Materials',
        quantity: 1,
        unit: 'set',
        notes: 'Wire, boxes, switches, plates'
      })
    }
    
    return items
  }

  private calculateVentilation(floorArea: number): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // Calculate required CFM (1 CFM per square foot minimum, or 50 CFM minimum)
    const requiredCFM = Math.max(50, Math.ceil(floorArea))
    
    const fanName = this.options.buildQuality === 'premium'
      ? `Premium Exhaust Fan (${requiredCFM}+ CFM)`
      : `Exhaust Fan (${requiredCFM} CFM)`
      
    items.push({
      id: this.generateId('Ventilation', fanName),
      category: 'Ventilation',
      name: fanName,
      quantity: 1,
      unit: 'unit',
      notes: this.options.buildQuality === 'premium' 
        ? 'Ultra-quiet with humidity sensor'
        : 'Code-compliant, ENERGY STAR'
    })
    
    items.push({
      id: this.generateId('Ventilation', 'Vent Duct & Termination'),
      category: 'Ventilation',
      name: 'Vent Duct & Exterior Termination',
      quantity: 1,
      unit: 'set',
      notes: 'Rigid or flex duct, damper, exterior cap'
    })
    
    return items
  }

  private calculateWindow(): MaterialItem[] {
    const items: MaterialItem[] = []
    const quality = this.options.buildQuality === 'premium' ? ' (Premium)' : ''
    
    items.push({
      id: this.generateId('Window', 'Bathroom Window'),
      category: 'Window',
      name: 'Bathroom Window Replacement' + quality,
      quantity: 1,
      unit: 'unit',
      notes: this.options.buildQuality === 'premium' 
        ? 'Vinyl, double-pane, obscured glass' 
        : 'Vinyl, obscured glass'
    })
    
    items.push({
      id: this.generateId('Window', 'Window Trim & Casing'),
      category: 'Window',
      name: 'Window Trim & Casing',
      quantity: 1,
      unit: 'set',
      notes: 'Interior and exterior trim'
    })
    
    return items
  }

  private calculateAccessories(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    items.push({
      id: this.generateId('Accessories', 'Towel Bar Set'),
      category: 'Accessories',
      name: 'Towel Bar Set',
      quantity: 1,
      unit: 'set',
      notes: this.options.buildQuality === 'premium' ? 'Brushed nickel or chrome' : 'Standard chrome'
    })
    
    items.push({
      id: this.generateId('Accessories', 'Toilet Paper Holder'),
      category: 'Accessories',
      name: 'Toilet Paper Holder',
      quantity: 1,
      unit: 'unit'
    })
    
    items.push({
      id: this.generateId('Accessories', 'Robe Hook'),
      category: 'Accessories',
      name: 'Robe Hook',
      quantity: 2,
      unit: 'unit'
    })
    
    items.push({
      id: this.generateId('Accessories', 'Caulk & Sealant'),
      category: 'Accessories',
      name: 'Bathroom Caulk & Sealant',
      quantity: 4,
      unit: 'tubes',
      notes: 'Mildew-resistant silicone'
    })
    
    items.push({
      id: this.generateId('Accessories', 'Construction Adhesive'),
      category: 'Accessories',
      name: 'Construction Adhesive',
      quantity: 2,
      unit: 'tubes'
    })
    
    return items
  }

  private calculateLaborHours(floorArea: number): number {
    let hours = 0
    
    // Base hours by scope
    if (this.dimensions.scope === 'full-gut') {
      hours += 80 // Full gut renovation
    } else if (this.dimensions.scope === 'standard-remodel') {
      hours += 50 // Standard remodel
    } else {
      hours += 20 // Surface update
    }
    
    // Tile work (walls and floors)
    if (this.options.wallFinish === 'tile') {
      const ceilingHeight = this.dimensions.ceilingHeight || 8
      const tileHeight = this.options.tileHeight || ceilingHeight
      const perimeter = (this.dimensions.length + this.dimensions.width) * 2
      const wallTileArea = perimeter * tileHeight
      hours += wallTileArea / 8 // 8 sqft per hour for wall tile
    }
    
    if (this.options.floorFinish.includes('tile')) {
      hours += floorArea / 10 // 10 sqft per hour for floor tile
    }
    
    // Shower/tub installation
    if (this.options.showerTubConfig === 'tub-and-shower') {
      hours += 16 // Both installations
    } else {
      hours += 8 // Single installation
    }
    
    // Vanity installation
    hours += 6
    
    // Toilet installation
    hours += 3
    
    // Ventilation
    if (this.dimensions.hasVentilation) {
      hours += 4
    }
    
    // Window replacement
    if (this.dimensions.hasWindow && this.dimensions.windowReplacement) {
      hours += 4
    }
    
    // Premium quality adds detail time
    if (this.options.buildQuality === 'premium') {
      hours *= 1.15
    }
    
    return Math.ceil(hours)
  }

  private calculateDemolitionHours(): number {
    if (this.dimensions.scope === 'full-gut') {
      return 12 // Full demo
    } else if (this.dimensions.scope === 'standard-remodel') {
      return 6 // Partial demo
    }
    return 0
  }
}


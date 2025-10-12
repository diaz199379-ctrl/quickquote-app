/**
 * Kitchen Material Calculator
 * Calculates all materials needed for a kitchen remodel
 * Based on IRC codes and industry standards
 */

export interface KitchenDimensions {
  length: number // feet
  width: number // feet
  ceilingHeight?: number // feet, default 8
  
  // Cabinets
  upperCabinetLinearFeet: number
  lowerCabinetLinearFeet: number
  
  // Countertops
  countertopSquareFeet: number
  countertopOverhang?: number // inches, default 1
  
  // Backsplash
  hasBacksplash: boolean
  backsplashSquareFeet?: number
  
  // Flooring
  includeFlooring: boolean
}

export interface KitchenOptions {
  // Cabinet Options
  cabinetStyle: 'stock' | 'semi-custom' | 'custom'
  cabinetMaterial: 'particle-board' | 'plywood' | 'solid-wood'
  cabinetFinish: 'laminate' | 'paint' | 'stain'
  
  // Countertop Options
  countertopMaterial: 'laminate' | 'granite' | 'quartz' | 'marble' | 'butcher-block' | 'concrete'
  countertopEdge?: 'standard' | 'beveled' | 'bullnose' | 'ogee'
  
  // Backsplash Options
  backsplashMaterial?: 'ceramic' | 'porcelain' | 'glass' | 'stone' | 'subway-tile'
  
  // Flooring Options
  flooringMaterial?: 'vinyl' | 'laminate' | 'hardwood' | 'tile' | 'lvp'
  
  // Appliances (checkboxes)
  appliances: {
    refrigerator: boolean
    range: boolean
    microwave: boolean
    dishwasher: boolean
    rangeHood: boolean
  }
  
  // Fixtures & Updates
  sink: 'none' | 'single-bowl' | 'double-bowl' | 'farmhouse'
  faucet: 'none' | 'standard' | 'pulldown' | 'touchless'
  
  lighting: {
    recessed: number // number of lights
    pendant: number
    underCabinet: boolean
  }
  
  // Electrical & Plumbing
  gfciOutlets: number
  standardOutlets: number
  
  // Paint & Finish
  paintWalls: boolean
  paintCeiling: boolean
  
  // Demolition
  includeDemolition: boolean
  
  // Build Quality
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

export interface KitchenMaterialList {
  items: MaterialItem[]
  totalSquareFootage: number
  estimatedLaborHours: number
  demolitionHours?: number
}

export class KitchenMaterialCalculator {
  private dimensions: KitchenDimensions
  private options: KitchenOptions
  private wasteFactor = 1.10 // 10% waste for most materials
  private itemCounter = 0 // For generating unique IDs

  constructor(dimensions: KitchenDimensions, options: KitchenOptions) {
    this.dimensions = dimensions
    this.options = options
  }

  calculate(): KitchenMaterialList {
    const items: MaterialItem[] = []
    
    // Calculate floor area
    const floorArea = this.dimensions.length * this.dimensions.width
    
    // Add demolition if needed
    if (this.options.includeDemolition) {
      items.push(...this.calculateDemolition())
    }
    
    // Calculate cabinets
    items.push(...this.calculateCabinets())
    
    // Calculate countertops
    items.push(...this.calculateCountertops())
    
    // Calculate backsplash
    if (this.dimensions.hasBacksplash && this.dimensions.backsplashSquareFeet) {
      items.push(...this.calculateBacksplash())
    }
    
    // Calculate flooring
    if (this.dimensions.includeFlooring) {
      items.push(...this.calculateFlooring(floorArea))
    }
    
    // Calculate appliances
    items.push(...this.calculateAppliances())
    
    // Calculate plumbing
    items.push(...this.calculatePlumbing())
    
    // Calculate electrical
    items.push(...this.calculateElectrical())
    
    // Calculate paint
    items.push(...this.calculatePaint(floorArea))
    
    // Calculate hardware and accessories
    items.push(...this.calculateHardwareAndAccessories())
    
    // Calculate labor hours
    const estimatedLaborHours = this.calculateLaborHours()
    const demolitionHours = this.options.includeDemolition ? this.calculateDemolitionHours() : 0
    
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
    
    items.push({
      id: this.generateId('Demolition', 'Cabinet Removal & Disposal'),
      category: 'Demolition',
      name: 'Cabinet Removal & Disposal',
      quantity: this.dimensions.upperCabinetLinearFeet + this.dimensions.lowerCabinetLinearFeet,
      unit: 'linear ft',
      notes: 'Includes disposal fees'
    })
    
    items.push({
      id: this.generateId('Demolition', 'Countertop Removal & Disposal'),
      category: 'Demolition',
      name: 'Countertop Removal & Disposal',
      quantity: this.dimensions.countertopSquareFeet,
      unit: 'sq ft'
    })
    
    if (this.dimensions.includeFlooring) {
      items.push({
        id: this.generateId('Demolition', 'Flooring Removal'),
        category: 'Demolition',
        name: 'Flooring Removal',
        quantity: this.dimensions.length * this.dimensions.width,
        unit: 'sq ft'
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

  private calculateCabinets(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    const cabinetStyleMap = {
      'stock': 'Stock',
      'semi-custom': 'Semi-Custom',
      'custom': 'Custom'
    }
    
    const cabinetMaterialMap = {
      'particle-board': 'Particle Board',
      'plywood': 'Plywood',
      'solid-wood': 'Solid Wood'
    }
    
    const style = cabinetStyleMap[this.options.cabinetStyle]
    const material = cabinetMaterialMap[this.options.cabinetMaterial]
    
    // Upper cabinets
    const upperCabinetName = `Upper Cabinets - ${style} (${material})`
    items.push({
      id: this.generateId('Cabinets', upperCabinetName),
      category: 'Cabinets',
      name: upperCabinetName,
      quantity: this.dimensions.upperCabinetLinearFeet,
      unit: 'linear ft',
      notes: `${this.options.cabinetFinish} finish`
    })
    
    // Lower cabinets
    const lowerCabinetName = `Lower Cabinets - ${style} (${material})`
    items.push({
      id: this.generateId('Cabinets', lowerCabinetName),
      category: 'Cabinets',
      name: lowerCabinetName,
      quantity: this.dimensions.lowerCabinetLinearFeet,
      unit: 'linear ft',
      notes: `${this.options.cabinetFinish} finish`
    })
    
    // Cabinet hardware
    const totalCabinets = Math.ceil((this.dimensions.upperCabinetLinearFeet + this.dimensions.lowerCabinetLinearFeet) / 3) // Avg 3ft per cabinet
    const totalHardware = totalCabinets * 2 // Avg 2 handles/knobs per cabinet
    
    items.push({
      id: this.generateId('Cabinets', 'Cabinet Hardware (Handles/Knobs)'),
      category: 'Cabinets',
      name: 'Cabinet Hardware (Handles/Knobs)',
      quantity: totalHardware,
      unit: 'pieces',
      notes: this.options.buildQuality === 'premium' ? 'Premium quality' : 'Standard quality'
    })
    
    // Cabinet installation materials
    items.push({
      id: this.generateId('Cabinets', 'Cabinet Installation Hardware'),
      category: 'Cabinets',
      name: 'Cabinet Installation Hardware',
      quantity: 1,
      unit: 'set',
      notes: 'Screws, shims, anchors'
    })
    
    return items
  }

  private calculateCountertops(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    const countertopMaterialMap = {
      'laminate': 'Laminate',
      'granite': 'Granite',
      'quartz': 'Quartz',
      'marble': 'Marble',
      'butcher-block': 'Butcher Block',
      'concrete': 'Concrete'
    }
    
    const material = countertopMaterialMap[this.options.countertopMaterial]
    const edge = this.options.countertopEdge || 'standard'
    
    const item0Name = `${material} Countertop`
    items.push({
      id: this.generateId('Countertops', item0Name),
      category: 'Countertops',
      name: item0Name,
      quantity: Math.ceil(this.dimensions.countertopSquareFeet * this.wasteFactor),
      unit: 'sq ft',
      notes: `${edge} edge profile`
    })
    
    // Countertop installation materials
    if (['granite', 'quartz', 'marble'].includes(this.options.countertopMaterial)) {
      items.push({
      id: this.generateId('Countertops', 'Stone Countertop Fabrication & Installation'),
      category: 'Countertops',
      name: 'Stone Countertop Fabrication & Installation',
        quantity: 1,
        unit: 'job',
        notes: 'Includes cutting, edging, sealing'
      })
    }
    
    if (this.options.countertopMaterial === 'laminate') {
      items.push({
      id: this.generateId('Countertops', 'Laminate Installation Materials'),
      category: 'Countertops',
      name: 'Laminate Installation Materials',
        quantity: 1,
        unit: 'set',
        notes: 'Adhesive, backer strips, end caps'
      })
    }
    
    // Sink cutout
    if (this.options.sink !== 'none') {
      items.push({
      id: this.generateId('Countertops', 'Sink Cutout'),
      category: 'Countertops',
      name: 'Sink Cutout',
        quantity: 1,
        unit: 'cutout',
        notes: 'Professional cutting and polishing'
      })
    }
    
    return items
  }

  private calculateBacksplash(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    if (!this.options.backsplashMaterial || !this.dimensions.backsplashSquareFeet) {
      return items
    }
    
    const materialMap = {
      'ceramic': 'Ceramic Tile',
      'porcelain': 'Porcelain Tile',
      'glass': 'Glass Tile',
      'stone': 'Natural Stone',
      'subway-tile': 'Subway Tile'
    }
    
    const material = materialMap[this.options.backsplashMaterial]
    const sqft = Math.ceil(this.dimensions.backsplashSquareFeet * this.wasteFactor)
    
    items.push({
      id: this.generateId('Backsplash', material),
      category: 'Backsplash',
      name: material,
      quantity: sqft,
      unit: 'sq ft'
    })
    
    items.push({
      id: this.generateId('Backsplash', 'Tile Adhesive (Thinset)'),
      category: 'Backsplash',
      name: 'Tile Adhesive (Thinset)',
      quantity: Math.ceil(sqft / 50), // 50 sqft per bag
      unit: 'bags',
      notes: '50 lb bags'
    })
    
    items.push({
      id: this.generateId('Backsplash', 'Grout'),
      category: 'Backsplash',
      name: 'Grout',
      quantity: Math.ceil(sqft / 100), // 100 sqft per bag
      unit: 'bags',
      notes: '25 lb bags, sanded'
    })
    
    items.push({
      id: this.generateId('Backsplash', 'Grout Sealer'),
      category: 'Backsplash',
      name: 'Grout Sealer',
      quantity: 1,
      unit: 'bottle',
      notes: 'Penetrating sealer'
    })
    
    return items
  }

  private calculateFlooring(floorArea: number): MaterialItem[] {
    const items: MaterialItem[] = []
    
    if (!this.options.flooringMaterial) {
      return items
    }
    
    const materialMap = {
      'vinyl': 'Vinyl Plank',
      'laminate': 'Laminate',
      'hardwood': 'Hardwood',
      'tile': 'Ceramic/Porcelain Tile',
      'lvp': 'Luxury Vinyl Plank (LVP)'
    }
    
    const material = materialMap[this.options.flooringMaterial]
    const sqft = Math.ceil(floorArea * this.wasteFactor)
    
    items.push({
      id: this.generateId('Flooring', material),
      category: 'Flooring',
      name: material,
      quantity: sqft,
      unit: 'sq ft'
    })
    
    // Underlayment for certain materials
    if (['vinyl', 'laminate', 'lvp'].includes(this.options.flooringMaterial)) {
      items.push({
      id: this.generateId('Flooring', 'Underlayment'),
      category: 'Flooring',
      name: 'Underlayment',
        quantity: sqft,
        unit: 'sq ft',
        notes: 'Moisture barrier'
      })
    }
    
    // Tile installation materials
    if (this.options.flooringMaterial === 'tile') {
      items.push({
      id: this.generateId('Flooring', 'Floor Tile Adhesive'),
      category: 'Flooring',
      name: 'Floor Tile Adhesive',
        quantity: Math.ceil(sqft / 50),
        unit: 'bags'
      })
      
      items.push({
      id: this.generateId('Flooring', 'Floor Grout'),
      category: 'Flooring',
      name: 'Floor Grout',
        quantity: Math.ceil(sqft / 100),
        unit: 'bags'
      })
    }
    
    // Transition strips and trim
    const perimeter = (this.dimensions.length + this.dimensions.width) * 2
    items.push({
      id: this.generateId('Flooring', 'Transition Strips & Trim'),
      category: 'Flooring',
      name: 'Transition Strips & Trim',
      quantity: Math.ceil(perimeter),
      unit: 'linear ft'
    })
    
    return items
  }

  private calculateAppliances(): MaterialItem[] {
    const items: MaterialItem[] = []
    const appliances = this.options.appliances
    
    if (appliances.refrigerator) {
      const refrigeratorName = this.options.buildQuality === 'premium' ? 'Refrigerator (Premium)' : 'Refrigerator (Standard)'
      items.push({
        id: this.generateId('Appliances', refrigeratorName),
        category: 'Appliances',
        name: refrigeratorName,
        quantity: 1,
        unit: 'unit'
      })
    }
    
    if (appliances.range) {
      const rangeName = this.options.buildQuality === 'premium' ? 'Range/Stove (Premium)' : 'Range/Stove (Standard)'
      items.push({
        id: this.generateId('Appliances', rangeName),
        category: 'Appliances',
        name: rangeName,
        quantity: 1,
        unit: 'unit'
      })
    }
    
    if (appliances.microwave) {
      items.push({
      id: this.generateId('Appliances', 'Microwave'),
      category: 'Appliances',
      name: 'Microwave',
        quantity: 1,
        unit: 'unit',
        notes: 'Over-range or countertop'
      })
    }
    
    if (appliances.dishwasher) {
      const dishwasherName = this.options.buildQuality === 'premium' ? 'Dishwasher (Premium)' : 'Dishwasher (Standard)'
      items.push({
        id: this.generateId('Appliances', dishwasherName),
        category: 'Appliances',
        name: dishwasherName,
        quantity: 1,
        unit: 'unit'
      })
    }
    
    if (appliances.rangeHood) {
      items.push({
      id: this.generateId('Appliances', 'Range Hood'),
      category: 'Appliances',
      name: 'Range Hood',
        quantity: 1,
        unit: 'unit',
        notes: 'Required for proper ventilation'
      })
    }
    
    return items
  }

  private calculatePlumbing(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    const sinkMap = {
      'single-bowl': 'Single Bowl Kitchen Sink',
      'double-bowl': 'Double Bowl Kitchen Sink',
      'farmhouse': 'Farmhouse Sink'
    }
    
    const faucetMap = {
      'standard': 'Standard Kitchen Faucet',
      'pulldown': 'Pull-Down Kitchen Faucet',
      'touchless': 'Touchless Kitchen Faucet'
    }
    
    if (this.options.sink !== 'none') {
      const quality = this.options.buildQuality === 'premium' ? ' (Premium)' : ''
      const sinkName = sinkMap[this.options.sink] + quality
      items.push({
        id: this.generateId('Plumbing', sinkName),
        category: 'Plumbing',
        name: sinkName,
        quantity: 1,
        unit: 'unit'
      })
    }
    
    if (this.options.faucet !== 'none') {
      const quality = this.options.buildQuality === 'premium' ? ' (Premium)' : ''
      const faucetName = faucetMap[this.options.faucet] + quality
      items.push({
        id: this.generateId('Plumbing', faucetName),
        category: 'Plumbing',
        name: faucetName,
        quantity: 1,
        unit: 'unit'
      })
    }
    
    // Plumbing connections
    if (this.options.sink !== 'none' || this.options.faucet !== 'none') {
      items.push({
      id: this.generateId('Plumbing', 'Plumbing Installation Kit'),
      category: 'Plumbing',
      name: 'Plumbing Installation Kit',
        quantity: 1,
        unit: 'set',
        notes: 'Supply lines, drain assembly, P-trap'
      })
    }
    
    // Dishwasher hookup
    if (this.options.appliances.dishwasher) {
      items.push({
      id: this.generateId('Plumbing', 'Dishwasher Installation Kit'),
      category: 'Plumbing',
      name: 'Dishwasher Installation Kit',
        quantity: 1,
        unit: 'set',
        notes: 'Water supply line, drain hose'
      })
    }
    
    return items
  }

  private calculateElectrical(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // GFCI outlets (required near water sources)
    if (this.options.gfciOutlets > 0) {
      items.push({
      id: this.generateId('Electrical', 'GFCI Outlets'),
      category: 'Electrical',
      name: 'GFCI Outlets',
        quantity: this.options.gfciOutlets,
        unit: 'outlets',
        notes: 'Code-required near sinks'
      })
    }
    
    // Standard outlets
    if (this.options.standardOutlets > 0) {
      items.push({
      id: this.generateId('Electrical', 'Standard Outlets'),
      category: 'Electrical',
      name: 'Standard Outlets',
        quantity: this.options.standardOutlets,
        unit: 'outlets'
      })
    }
    
    // Recessed lighting
    if (this.options.lighting.recessed > 0) {
      items.push({
      id: this.generateId('Electrical', 'Recessed LED Lights'),
      category: 'Electrical',
      name: 'Recessed LED Lights',
        quantity: this.options.lighting.recessed,
        unit: 'fixtures'
      })
    }
    
    // Pendant lighting
    if (this.options.lighting.pendant > 0) {
      items.push({
      id: this.generateId('Electrical', 'Pendant Light Fixtures'),
      category: 'Electrical',
      name: 'Pendant Light Fixtures',
        quantity: this.options.lighting.pendant,
        unit: 'fixtures'
      })
    }
    
    // Under-cabinet lighting
    if (this.options.lighting.underCabinet) {
      items.push({
      id: this.generateId('Electrical', 'Under-Cabinet LED Lighting'),
      category: 'Electrical',
      name: 'Under-Cabinet LED Lighting',
        quantity: this.dimensions.lowerCabinetLinearFeet,
        unit: 'linear ft',
        notes: 'Low-profile LED strips'
      })
    }
    
    // Electrical wiring materials
    if (this.options.gfciOutlets + this.options.standardOutlets + 
        this.options.lighting.recessed + this.options.lighting.pendant > 0) {
      items.push({
      id: this.generateId('Electrical', 'Electrical Wiring & Materials'),
      category: 'Electrical',
      name: 'Electrical Wiring & Materials',
        quantity: 1,
        unit: 'set',
        notes: 'Wire, boxes, switches, plates'
      })
    }
    
    // Appliance circuits
    if (this.options.appliances.range || this.options.appliances.dishwasher) {
      items.push({
      id: this.generateId('Electrical', 'Appliance Circuit Installation'),
      category: 'Electrical',
      name: 'Appliance Circuit Installation',
        quantity: 1,
        unit: 'set',
        notes: 'Dedicated 20A circuits for appliances'
      })
    }
    
    return items
  }

  private calculatePaint(floorArea: number): MaterialItem[] {
    const items: MaterialItem[] = []
    
    const ceilingHeight = this.dimensions.ceilingHeight || 8
    const perimeter = (this.dimensions.length + this.dimensions.width) * 2
    const wallArea = perimeter * ceilingHeight
    const ceilingArea = floorArea
    
    if (this.options.paintWalls) {
      const gallonsWall = Math.ceil(wallArea / 350) // 350 sqft per gallon
      items.push({
      id: this.generateId('Paint & Finish', 'Wall Paint'),
      category: 'Paint & Finish',
      name: 'Wall Paint',
        quantity: gallonsWall,
        unit: 'gallons',
        notes: 'Semi-gloss or satin finish'
      })
      
      items.push({
      id: this.generateId('Paint & Finish', 'Wall Primer'),
      category: 'Paint & Finish',
      name: 'Wall Primer',
        quantity: Math.ceil(gallonsWall / 2),
        unit: 'gallons'
      })
    }
    
    if (this.options.paintCeiling) {
      const gallonsCeiling = Math.ceil(ceilingArea / 350)
      items.push({
      id: this.generateId('Paint & Finish', 'Ceiling Paint'),
      category: 'Paint & Finish',
      name: 'Ceiling Paint',
        quantity: gallonsCeiling,
        unit: 'gallons',
        notes: 'Flat finish'
      })
    }
    
    if (this.options.paintWalls || this.options.paintCeiling) {
      items.push({
      id: this.generateId('Paint & Finish', 'Painting Supplies'),
      category: 'Paint & Finish',
      name: 'Painting Supplies',
        quantity: 1,
        unit: 'set',
        notes: 'Brushes, rollers, tape, drop cloths'
      })
    }
    
    return items
  }

  private calculateHardwareAndAccessories(): MaterialItem[] {
    const items: MaterialItem[] = []
    
    // Caulk and sealant
    items.push({
      id: this.generateId('Hardware & Accessories', 'Caulk & Sealant'),
      category: 'Hardware & Accessories',
      name: 'Caulk & Sealant',
      quantity: 3,
      unit: 'tubes',
      notes: 'Kitchen & bath silicone'
    })
    
    // Construction adhesive
    items.push({
      id: this.generateId('Hardware & Accessories', 'Construction Adhesive'),
      category: 'Hardware & Accessories',
      name: 'Construction Adhesive',
      quantity: 2,
      unit: 'tubes'
    })
    
    // Miscellaneous hardware
    items.push({
      id: this.generateId('Hardware & Accessories', 'Miscellaneous Hardware'),
      category: 'Hardware & Accessories',
      name: 'Miscellaneous Hardware',
      quantity: 1,
      unit: 'set',
      notes: 'Screws, anchors, brackets'
    })
    
    return items
  }

  private calculateLaborHours(): number {
    let hours = 0
    
    // Cabinet installation: 2-3 hours per cabinet
    const totalCabinets = (this.dimensions.upperCabinetLinearFeet + this.dimensions.lowerCabinetLinearFeet) / 3
    hours += totalCabinets * 2.5
    
    // Countertop installation
    if (['granite', 'quartz', 'marble'].includes(this.options.countertopMaterial)) {
      hours += 8 // Professional installation
    } else {
      hours += this.dimensions.countertopSquareFeet / 10 // 10 sqft per hour
    }
    
    // Backsplash
    if (this.dimensions.hasBacksplash && this.dimensions.backsplashSquareFeet) {
      hours += this.dimensions.backsplashSquareFeet / 8 // 8 sqft per hour
    }
    
    // Flooring
    if (this.dimensions.includeFlooring) {
      const floorArea = this.dimensions.length * this.dimensions.width
      hours += floorArea / 15 // 15 sqft per hour average
    }
    
    // Appliances: 1-2 hours each
    const applianceCount = Object.values(this.options.appliances).filter(Boolean).length
    hours += applianceCount * 1.5
    
    // Plumbing: 4-6 hours for sink and faucet
    if (this.options.sink !== 'none' || this.options.faucet !== 'none') {
      hours += 5
    }
    
    // Electrical: 1 hour per outlet/light
    hours += this.options.gfciOutlets + this.options.standardOutlets
    hours += this.options.lighting.recessed + this.options.lighting.pendant
    if (this.options.lighting.underCabinet) {
      hours += 4
    }
    
    // Painting
    if (this.options.paintWalls || this.options.paintCeiling) {
      const floorArea = this.dimensions.length * this.dimensions.width
      hours += floorArea / 20 // 20 sqft per hour
    }
    
    // Premium quality adds time for detail work
    if (this.options.buildQuality === 'premium') {
      hours *= 1.2
    }
    
    return Math.ceil(hours)
  }

  private calculateDemolitionHours(): number {
    let hours = 8 // Base demolition time
    
    // Additional hours for flooring removal
    if (this.dimensions.includeFlooring) {
      const floorArea = this.dimensions.length * this.dimensions.width
      hours += floorArea / 50 // 50 sqft per hour
    }
    
    return Math.ceil(hours)
  }
}


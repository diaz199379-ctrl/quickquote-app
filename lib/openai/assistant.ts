import { AIMessage, AIContext, AIAssistantConfig, AISuggestion } from '@/types/ai'

export class AIAssistant {
  private apiKey: string
  private defaultConfig: AIAssistantConfig

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    this.defaultConfig = {
      model: 'gpt-3.5-turbo', // Using GPT-3.5 Turbo (available to all users)
      temperature: 0.7,
      maxTokens: 500,
      enableStream: true
    }
  }

  private buildSystemPrompt(context: AIContext): string {
    const { projectType, zipCode, dimensions, materials, budget } = context

    let prompt = `You are an expert construction assistant for QuickQuote AI, helping professional contractors with their projects.

Your expertise includes:
- Building code compliance (IRC 2021 standards)
- Material selection and specifications
- Installation best practices
- Cost optimization strategies
- Safety requirements and OSHA guidelines
- Load calculations and structural requirements

Current Project Context:
${projectType ? `- Project Type: ${projectType}` : ''}
${zipCode ? `- Location: ZIP ${zipCode}` : ''}
${dimensions?.length && dimensions?.width ? `- Dimensions: ${dimensions.length}' × ${dimensions.width}' (${dimensions.sqft?.toFixed(0)} sqft)` : ''}
${dimensions?.height ? `- Height: ${dimensions.height}' off ground` : ''}
${materials?.deckingMaterial ? `- Decking: ${materials.deckingMaterial}` : ''}
${materials?.framingMaterial ? `- Framing: ${materials.framingMaterial}` : ''}
${materials?.railingStyle ? `- Railing: ${materials.railingStyle}` : ''}
${budget ? `- Budget: $${budget.toLocaleString()}` : ''}

Guidelines:
- Provide concise, actionable advice
- Reference specific code sections when relevant
- Always remind users to verify with local building officials
- If uncertain, say so and suggest where to find authoritative info
- Consider regional variations (climate, soil conditions, local codes)
- Prioritize safety and code compliance
- Suggest cost-effective alternatives when appropriate

Keep responses under 200 words unless asked for detailed explanations.`

    return prompt
  }

  async sendMessage(
    messages: AIMessage[],
    context: AIContext,
    config?: AIAssistantConfig
  ): Promise<AIMessage> {
    // If no API key, use fallback knowledge base
    if (!this.apiKey) {
      return this.getFallbackResponse(messages[messages.length - 1].content, context)
    }

    const finalConfig = { ...this.defaultConfig, ...config }

    try {
      const systemPrompt = this.buildSystemPrompt(context)
      
      const apiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages
          .filter(m => m.role !== 'system')
          .map(m => ({
            role: m.role,
            content: m.content
          }))
      ]

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: finalConfig.model,
          messages: apiMessages,
          temperature: finalConfig.temperature,
          max_tokens: finalConfig.maxTokens,
          stream: false // For simplicity, not using streaming in this implementation
        })
      })

      if (!response.ok) {
        const error = await response.json()
        // If quota exceeded, use fallback
        if (error.error?.code === 'insufficient_quota' || response.status === 429) {
          return this.getFallbackResponse(messages[messages.length - 1].content, context)
        }
        throw new Error(error.error?.message || 'Failed to get AI response')
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No response from AI')
      }

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('AI Assistant error:', error)
      // Try fallback on any error
      return this.getFallbackResponse(messages[messages.length - 1].content, context)
    }
  }

  private getFallbackResponse(question: string, context: AIContext): AIMessage {
    const questionLower = question.toLowerCase()
    let response = ''

    // Footing depth questions
    if (questionLower.includes('footing') && (questionLower.includes('deep') || questionLower.includes('depth'))) {
      response = `**Footing Depth Guidelines:**

For most residential decks, footings should extend below the frost line to prevent heaving. Common depths by region:

• **Cold climates** (Northern states): 42-48 inches
• **Moderate climates**: 30-36 inches  
• **Warm climates** (Southern states): 18-24 inches

${context.zipCode ? `For ZIP ${context.zipCode}, check with your local building department for exact frost line depth.` : 'Check your local building code for exact frost line depth in your area.'}

**Standard footing specs:**
• Diameter: 12 inches minimum
• Concrete: 3,000 PSI mix
• Rebar: Optional but recommended for high decks

⚠️ Always verify with your local building official before digging!`
    }
    
    // Joist spacing questions
    else if (questionLower.includes('joist') && questionLower.includes('spacing')) {
      response = `**Joist Spacing Recommendations:**

Standard joist spacing depends on your decking material:

• **Pressure-treated/Cedar:** 16" on-center (most common)
• **Composite decking:** Check manufacturer specs (usually 12-16")
• **PVC decking:** Often requires 12" spacing

${context.materials?.deckingMaterial ? `\n**For your ${context.materials.deckingMaterial} decking:**\n` : ''}
${context.materials?.deckingMaterial === 'composite' ? '• 16" on-center is typical\n• Some brands allow 24" for diagonal installation\n• Always verify with manufacturer warranty' : ''}
${context.materials?.deckingMaterial === 'pvc' ? '• 12" on-center recommended\n• PVC expands/contracts more than other materials' : ''}
${context.materials?.deckingMaterial === 'pressure-treated' || context.materials?.deckingMaterial === 'cedar' ? '• 16" on-center is standard\n• Can use 24" for 2x6 boards\n• 12" gives sturdiest feel' : ''}

**Code requirement:** IRC requires joists sized to support 50 PSF live load + 10 PSF dead load.`
    }
    
    // Beam size questions
    else if (questionLower.includes('beam') && (questionLower.includes('size') || questionLower.includes('need'))) {
      const span = context.dimensions?.width || 12
      response = `**Beam Sizing for Your Deck:**

${context.dimensions?.width ? `For a ${context.dimensions.width}' span:\n\n` : ''}**Common beam options:**

• **Double 2x8:** Spans up to 8 feet
• **Double 2x10:** Spans up to 10 feet  
• **Double 2x12:** Spans up to 12 feet
• **Triple 2x10:** Spans up to 13 feet

${span > 10 ? '⚠️ Your span may require triple beams or engineered lumber (LVL).\n\n' : ''}**Post spacing:**
• 6-8 feet apart typical
• Closer spacing allows smaller beams

**Material:** ${context.materials?.framingMaterial || 'Pressure-treated'} #2 grade or better

💡 For spans over 12', consider engineered lumber (LVL beams) for better performance and less bounce.

📋 Always verify with IRC span tables or a structural engineer for your specific loading.`
    }
    
    // Code/railing questions
    else if (questionLower.includes('code') || questionLower.includes('requirement') || questionLower.includes('railing')) {
      response = `**Key Building Code Requirements (IRC 2021):**

**Guardrails (Railing):**
• Required for decks >30" above grade
• Height: 36" minimum (42" for commercial)
• Balusters: Maximum 4" spacing
• Must withstand 200 lbs load at top rail

${context.dimensions?.height ? `\n**Your deck (${context.dimensions.height}' high):** ${context.dimensions.height > 2.5 ? '✅ Railing REQUIRED' : '⚠️ Railing recommended for safety'}\n` : ''}
**Stairs:**
• Max riser: 7.75"
• Min tread: 10"
• Handrail required: >4 risers
• Handrail height: 34-38"

**Structural:**
• Live load: 50 PSF
• Ledger: 1/2" lag bolts every 16"
• Flashing required over ledger
• Footings: Below frost line

⚠️ Local codes may be more restrictive - always check with your building department!`
    }
    
    // Material selection
    else if (questionLower.includes('material') && (questionLower.includes('choose') || questionLower.includes('best') || questionLower.includes('select'))) {
      response = `**Decking Material Comparison:**

**Pressure-Treated Pine** ($$)
✅ Most economical
✅ Readily available
❌ Requires annual maintenance
❌ Can warp/split over time

**Cedar** ($$$)
✅ Natural beauty
✅ Naturally rot-resistant
✅ Minimal chemicals
❌ Higher cost
❌ Needs sealing every 2-3 years

**Composite** ($$$$)
✅ Low maintenance
✅ 25-year warranties typical
✅ Won't rot or splinter
❌ Higher upfront cost
❌ Can get hot in sun

**PVC** ($$$$$)
✅ Waterproof
✅ Longest lifespan
✅ Best stain resistance
❌ Most expensive
❌ Limited color options

${context.materials?.deckingMaterial ? `\n**You selected ${context.materials.deckingMaterial}** - good choice!` : '\n💡 Best value: Composite for long-term, PT Pine for budget builds.'}

🔥 Pro tip: Spend more on structure (posts, beams), save on decking surface if budget is tight.`
    }
    
    // Generic construction advice
    else {
      response = `I can help with construction questions! Try asking about:

• **Footings:** "How deep should footings be?"
• **Joists:** "What joist spacing should I use?"
• **Beams:** "What size beams do I need?"
• **Codes:** "What are the code requirements?"
• **Materials:** "Which decking material is best?"
• **Stairs:** "How do I calculate stair rise and run?"

Or ask any specific question about your deck project!

${context.dimensions?.sqft ? `\n**Your project:** ${context.dimensions.sqft.toFixed(0)} sqft deck` : ''}
${context.dimensions?.height ? ` at ${context.dimensions.height}' height` : ''}

📚 **Note:** Using built-in knowledge base (OpenAI API not configured). Responses are based on IRC 2021 and industry best practices.`
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response + '\n\n---\n*Always verify with local building officials before starting construction.*',
      timestamp: new Date()
    }
  }

  private createErrorMessage(message: string): AIMessage {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `⚠️ Error: ${message}`,
      timestamp: new Date()
    }
  }

  generateSuggestions(context: AIContext): AISuggestion[] {
    const suggestions: AISuggestion[] = []

    // Height-based code suggestions
    if (context.dimensions?.height && context.dimensions.height > 2.5) {
      suggestions.push({
        id: 'railing-required',
        type: 'code',
        title: 'Railing Required by Code',
        message: `Decks more than 30" (2.5') above grade require guardrails per IRC R312. Your deck is ${context.dimensions.height}' high.`,
        priority: 'high',
        dismissible: false
      })
    }

    // Material suggestions based on context
    if (context.materials?.deckingMaterial === 'pressure-treated') {
      suggestions.push({
        id: 'maintenance-tip',
        type: 'tip',
        title: 'Low Maintenance Alternative',
        message: 'Consider composite decking for 25-year warranties and minimal maintenance. Initial cost is higher but saves time and money long-term.',
        priority: 'low',
        dismissible: true
      })
    }

    // Composite with close joist spacing
    if (context.materials?.deckingMaterial === 'composite') {
      suggestions.push({
        id: 'joist-spacing',
        type: 'warning',
        title: 'Check Joist Spacing',
        message: 'Most composite decking requires 16" on-center joist spacing. Verify with manufacturer specifications to avoid warranty issues.',
        priority: 'medium',
        dismissible: true
      })
    }

    // Budget-based suggestions
    if (context.budget && context.dimensions?.sqft) {
      const pricePerSqft = context.budget / context.dimensions.sqft
      
      if (pricePerSqft < 15) {
        suggestions.push({
          id: 'budget-warning',
          type: 'warning',
          title: 'Budget May Be Tight',
          message: `At $${pricePerSqft.toFixed(2)}/sqft, this budget is on the lower end for quality deck construction. Consider value engineering or phasing the project.`,
          priority: 'medium',
          dismissible: true
        })
      } else if (pricePerSqft > 50) {
        suggestions.push({
          id: 'premium-budget',
          type: 'info',
          title: 'Premium Budget Detected',
          message: `At $${pricePerSqft.toFixed(2)}/sqft, you have room for premium materials, upgraded features, or enhanced finishes.`,
          priority: 'low',
          dismissible: true
        })
      }
    }

    // Seasonal suggestions (simplified - in production, check actual season)
    const month = new Date().getMonth()
    if (month >= 10 || month <= 2) { // Winter months
      suggestions.push({
        id: 'winter-construction',
        type: 'info',
        title: 'Winter Construction Considerations',
        message: 'Cold weather can affect concrete curing and wood moisture content. Plan for proper protection and follow cold-weather construction practices.',
        priority: 'low',
        dismissible: true
      })
    }

    return suggestions
  }

  // Quick question templates contractors commonly ask
  getQuickQuestions(context: AIContext): string[] {
    const questions = [
      'What joist spacing should I use for this deck?',
      'How deep should the footings be in my area?',
      'What size beams do I need for this span?',
      'Are there any special code requirements for this height?',
      'What\'s the best material choice for this project?',
    ]

    if (context.materials?.deckingMaterial === 'composite') {
      questions.push('What are the installation requirements for composite decking?')
    }

    if (context.dimensions?.height && context.dimensions.height > 6) {
      questions.push('Do I need an engineer\'s stamp for this deck height?')
    }

    return questions
  }
}

// Singleton instance
let assistantInstance: AIAssistant | null = null

export function getAIAssistant(): AIAssistant {
  if (!assistantInstance) {
    assistantInstance = new AIAssistant()
  }
  return assistantInstance
}


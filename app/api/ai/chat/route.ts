/**
 * AI Assistant Chat API Route
 * Secure server-side endpoint that uses DeepSeek AI
 * 
 * This route:
 * - Keeps API keys secure on the server
 * - Uses DeepSeek for 95% cost savings
 * - Provides construction-specific expertise
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize DeepSeek client (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
})

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  context?: {
    projectType?: string
    zipCode?: string
    dimensions?: Record<string, any>
    materials?: Record<string, any>
    budget?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key is configured
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI service not configured',
          fallback: true 
        },
        { status: 503 }
      )
    }

    const body: ChatRequest = await request.json()
    const { messages, context } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      )
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context || {})

    // Prepare messages for DeepSeek
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.role !== 'system')
    ]

    // Call DeepSeek API
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from DeepSeek')
    }

    return NextResponse.json({
      content,
      timestamp: new Date().toISOString(),
      source: 'deepseek'
    })

  } catch (error: any) {
    console.error('AI Chat API Error:', error)
    
    // Return error with fallback flag
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get AI response',
        fallback: true,
        details: error.response?.data || null
      },
      { status: error.response?.status || 500 }
    )
  }
}

function buildSystemPrompt(context: ChatRequest['context']): string {
  const { projectType, zipCode, dimensions, materials, budget } = context || {}

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


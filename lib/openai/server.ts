/**
 * DeepSeek Server-Side API Wrapper (OpenAI-Compatible)
 * 
 * SECURITY: This module ensures DeepSeek API keys never reach the client
 * ⚠️  NEVER import this in client-side code!
 * ⚠️  Only use in API routes and server components
 * ⚠️  Environment variable DEEPSEEK_API_KEY must NOT have NEXT_PUBLIC_ prefix
 * 
 * Usage:
 * - Price estimation (70-95% cheaper than OpenAI!)
 * - Material suggestions
 * - Project description generation
 * - Cost prediction
 * 
 * Why DeepSeek?
 * - OpenAI-compatible API (drop-in replacement)
 * - 20x cheaper than GPT-3.5 (~$0.0001 vs $0.002 per 1K tokens)
 * - Excellent quality for construction/estimating tasks
 * - Fast response times
 */

import OpenAI from 'openai'

// Validate environment variable
if (!process.env.DEEPSEEK_API_KEY) {
  console.warn(
    '⚠️  DEEPSEEK_API_KEY not set. AI features will not work. ' +
    'Add it to your .env.local file. Get your key at: https://platform.deepseek.com'
  )
}

/**
 * DeepSeek client instance (OpenAI-compatible, server-side only)
 */
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1', // DeepSeek API endpoint
})

/**
 * Check if DeepSeek is configured
 */
export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY)
}

/**
 * Ensure server-side execution
 */
function assertServerSide(functionName: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      `${functionName} can only be called server-side. ` +
      'This function uses the DeepSeek API key which must never be exposed to the client.'
    )
  }
}

/**
 * Estimate material price using DeepSeek AI
 * 
 * @param material - Material name
 * @param category - Material category
 * @param unit - Unit of measurement
 * @param zipCode - Location zip code
 * @returns Estimated price with confidence level
 */
export async function estimateMaterialPrice(
  material: string,
  category: string,
  unit: string,
  zipCode: string
): Promise<{
  unitPrice: number
  confidence: 'high' | 'medium' | 'low'
  notes: string
}> {
  assertServerSide('estimateMaterialPrice')
  
  if (!isOpenAIConfigured()) {
    throw new Error('DeepSeek API key is not configured')
  }

  const prompt = `
You are a construction material pricing expert. Provide a realistic unit price estimate for the following material.
Consider typical contractor pricing (not retail) for the given location.

Material: ${material}
Category: ${category}
Unit: ${unit}
Location (Zip Code): ${zipCode}

Provide the response in JSON format:
{
  "unitPrice": number,
  "confidence": "high" | "medium" | "low",
  "notes": "Brief explanation of pricing factors"
}

Example:
{
  "unitPrice": 12.75,
  "confidence": "high",
  "notes": "Based on current market rates for treated lumber in the Midwest. Prices may vary by supplier."
}

Ensure the unitPrice is a number and confidence is one of: high, medium, low.
Do not include any text outside the JSON object.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek's flagship model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('DeepSeek returned empty response')
    }

    const parsed = JSON.parse(content)
    
    // Validate response structure
    if (
      typeof parsed.unitPrice !== 'number' ||
      !['high', 'medium', 'low'].includes(parsed.confidence) ||
      typeof parsed.notes !== 'string'
    ) {
      throw new Error('Invalid response format from DeepSeek')
    }

    return {
      unitPrice: parsed.unitPrice,
      confidence: parsed.confidence,
      notes: parsed.notes,
    }
  } catch (error: any) {
    console.error('DeepSeek API Error:', error.message)
    throw new Error(`Failed to estimate price: ${error.message}`)
  }
}

/**
 * Generate project suggestions using DeepSeek AI
 * 
 * @param projectType - Type of project
 * @param dimensions - Project dimensions
 * @param budget - Optional budget constraint
 * @returns AI-generated suggestions
 */
export async function generateProjectSuggestions(
  projectType: string,
  dimensions: Record<string, any>,
  budget?: number
): Promise<{
  suggestions: string[]
  recommendations: string[]
  warnings: string[]
}> {
  assertServerSide('generateProjectSuggestions')
  
  if (!isOpenAIConfigured()) {
    throw new Error('DeepSeek API key is not configured')
  }

  const prompt = `
You are a construction expert. Analyze this project and provide helpful suggestions.

Project Type: ${projectType}
Dimensions: ${JSON.stringify(dimensions, null, 2)}
${budget ? `Budget: $${budget.toLocaleString()}` : ''}

Provide response in JSON format:
{
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "warnings": ["warning 1", "warning 2", ...]
}

Include:
- suggestions: Material or design suggestions
- recommendations: Best practices and code requirements
- warnings: Potential issues or concerns

Limit to 3-5 items per category.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek's flagship model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('DeepSeek returned empty response')
    }

    const parsed = JSON.parse(content)
    
    return {
      suggestions: parsed.suggestions || [],
      recommendations: parsed.recommendations || [],
      warnings: parsed.warnings || [],
    }
  } catch (error: any) {
    console.error('DeepSeek API Error:', error.message)
    throw new Error(`Failed to generate suggestions: ${error.message}`)
  }
}

/**
 * Generate project description using DeepSeek AI
 * 
 * @param projectType - Type of project
 * @param dimensions - Project dimensions
 * @param materials - List of materials
 * @returns AI-generated description
 */
export async function generateProjectDescription(
  projectType: string,
  dimensions: Record<string, any>,
  materials: string[]
): Promise<string> {
  assertServerSide('generateProjectDescription')
  
  if (!isOpenAIConfigured()) {
    throw new Error('DeepSeek API key is not configured')
  }

  const prompt = `
Generate a professional project description for a client estimate.

Project Type: ${projectType}
Dimensions: ${JSON.stringify(dimensions, null, 2)}
Materials: ${materials.join(', ')}

Write a 2-3 paragraph description that:
1. Summarizes the scope of work
2. Highlights key features and materials
3. Sounds professional and client-friendly

Keep it concise and actionable.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek's flagship model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('DeepSeek returned empty response')
    }

    return content.trim()
  } catch (error: any) {
    console.error('DeepSeek API Error:', error.message)
    throw new Error(`Failed to generate description: ${error.message}`)
  }
}

/**
 * Get DeepSeek usage statistics (for monitoring)
 */
export async function getOpenAIUsage() {
  assertServerSide('getOpenAIUsage')
  
  if (!isOpenAIConfigured()) {
    return { configured: false, tokensUsed: 0 }
  }

  // Note: DeepSeek doesn't provide a direct usage API in the SDK
  // You would need to track this in your database or use DeepSeek dashboard
  return {
    configured: true,
    message: 'Check DeepSeek dashboard for usage statistics at https://platform.deepseek.com',
  }
}

export { openai }


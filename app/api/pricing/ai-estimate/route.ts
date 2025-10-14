/**
 * AI Price Estimation API Endpoint
 * Uses DeepSeek (OpenAI-compatible) to estimate material prices based on market data
 * 
 * Why DeepSeek?
 * - 20x cheaper than OpenAI GPT-3.5 (~$0.0001 vs $0.002 per 1K tokens)
 * - OpenAI-compatible API (drop-in replacement)
 * - Excellent quality for construction/estimating tasks
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1', // DeepSeek API endpoint
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { material_name, category, unit, zip_code } = body

    if (!material_name || !category || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Construct prompt for OpenAI
    const prompt = `As a construction material pricing expert, provide a current market price estimate for the following material:

Material: ${material_name}
Category: ${category}
Unit: ${unit}
Location Zip Code: ${zip_code || 'General US market'}

Provide your response in the following JSON format:
{
  "estimated_price": <number>,
  "confidence": "<high|medium|low>",
  "price_range": {
    "low": <number>,
    "high": <number>
  },
  "notes": "<brief explanation of pricing factors>"
}

Consider factors like:
- Current market conditions
- Regional pricing variations
- Material quality
- Typical supplier pricing
- Seasonal variations

Response must be valid JSON only, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek's flagship model
      messages: [
        {
          role: 'system',
          content: 'You are a construction material pricing expert. Provide accurate, current market price estimates based on your knowledge. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent estimates
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from DeepSeek')
    }

    const priceData = JSON.parse(responseText)

    return NextResponse.json({
      estimated_price: priceData.estimated_price,
      confidence: priceData.confidence || 'medium',
      price_range: priceData.price_range,
      notes: priceData.notes || 'AI-powered market estimate (DeepSeek)',
      source: 'deepseek',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI price estimation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to estimate price',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


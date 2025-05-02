import { AIService } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import * as validators from './validators'

// Handle POST request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, apiKey } = body

    if (!service || !apiKey) {
      return NextResponse.json(
        { error: { message: 'Missing service or apiKey in request', code: 'MISSING_PARAMS' } },
        { status: 400 }
      )
    }

    let result

    // Validate based on the service type
    switch (service as AIService) {
      case 'openai':
        result = await validators.validateOpenAIKey(apiKey)
        break
      case 'claude':
        result = await validators.validateClaudeKey(apiKey)
        break
      case 'gemini':
        result = await validators.validateGeminiKey(apiKey)
        break
      case 'mistral':
        result = await validators.validateMistralKey(apiKey)
        break
      case 'xai':
        result = await validators.validateXAIKey(apiKey)
        break
      case 'deepseek':
        result = await validators.validateDeepSeekKey(apiKey)
        break
      default:
        return NextResponse.json(
          { error: { message: `Validation for ${service} not implemented`, code: 'NOT_IMPLEMENTED' } },
          { status: 501 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { isValid: false, error: { message: 'Server error', code: 'SERVER_ERROR' } },
      { status: 500 }
    )
  }
}

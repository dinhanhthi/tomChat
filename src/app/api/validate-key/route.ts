import { AIService } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'

// Validate OpenAI API key
async function validateOpenAIKey(apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      responseData = null
    }

    return {
      isValid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    }
  } catch (error) {
    console.error('Error validating OpenAI key:', error)
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown server error',
        code: 'SERVER_ERROR'
      }
    }
  }
}

// Validate Claude (Anthropic) API key
async function validateClaudeKey(apiKey: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    })

    // Read response body for detailed error info
    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      responseData = null
    }

    return {
      isValid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    }
  } catch (error) {
    console.error('Error validating Claude key:', error)
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown server error',
        code: 'SERVER_ERROR'
      }
    }
  }
}

// Validate Gemini API key
async function validateGeminiKey(apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)

    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      responseData = null
    }

    return {
      isValid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    }
  } catch (error) {
    console.error('Error validating Gemini key:', error)
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown server error',
        code: 'SERVER_ERROR'
      }
    }
  }
}

// Validate Mistral API key
async function validateMistralKey(apiKey: string) {
  try {
    const response = await fetch('https://api.mistral.ai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      responseData = null
    }

    return {
      isValid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    }
  } catch (error) {
    console.error('Error validating Mistral key:', error)
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown server error',
        code: 'SERVER_ERROR'
      }
    }
  }
}

// Validate xAI/Grok API key
async function validateXAIKey(apiKey: string) {
  try {
    // X.AI API might have a different endpoint - update this when accurate information is available
    const response = await fetch('https://api.x.ai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      responseData = null
    }

    return {
      isValid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    }
  } catch (error) {
    console.error('Error validating xAI key:', error)
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown server error',
        code: 'SERVER_ERROR'
      }
    }
  }
}

// Validate DeepSeek API key
async function validateDeepSeekKey(apiKey: string) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      responseData = null
    }

    return {
      isValid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    }
  } catch (error) {
    console.error('Error validating DeepSeek key:', error)
    return {
      isValid: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown server error',
        code: 'SERVER_ERROR'
      }
    }
  }
}

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
        result = await validateOpenAIKey(apiKey)
        break
      case 'claude':
        result = await validateClaudeKey(apiKey)
        break
      case 'gemini':
        result = await validateGeminiKey(apiKey)
        break
      case 'mistral':
        result = await validateMistralKey(apiKey)
        break
      case 'xai':
        result = await validateXAIKey(apiKey)
        break
      case 'deepseek':
        result = await validateDeepSeekKey(apiKey)
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

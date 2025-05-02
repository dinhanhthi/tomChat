// Validate OpenAI API key
export async function validateOpenAIKey(apiKey: string) {
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
export async function validateClaudeKey(apiKey: string) {
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
export async function validateGeminiKey(apiKey: string) {
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
export async function validateMistralKey(apiKey: string) {
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
export async function validateXAIKey(apiKey: string) {
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
export async function validateDeepSeekKey(apiKey: string) {
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

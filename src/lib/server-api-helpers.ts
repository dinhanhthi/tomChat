import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { createXai } from '@ai-sdk/xai'
import { AIService } from './models'

// Create a custom OpenAI client with a specific API key
export function createCustomOpenAI(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  return createOpenAI({
    apiKey
  })
}

// Create a custom Claude client with a specific API key
export function createCustomClaude(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  return createAnthropic({
    apiKey
  })
}

// Create a custom Gemini client with a specific API key
export function createCustomGemini(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  return createGoogleGenerativeAI({
    apiKey
  })
}

// Create a custom Mistral client with a specific API key
export function createCustomMistral(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  return createMistral({
    apiKey
  })
}

// Create a custom xAI client with a specific API key
export function createCustomXAI(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  return createXai({
    apiKey
  })
}

// Create a custom DeepSeek client with a specific API key
export function createCustomDeepSeek(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  return createDeepSeek({
    apiKey
  })
}

// Get an appropriate client based on the service type
export function getServiceClient(service: AIService, apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  switch (service) {
    case 'openai':
      return createCustomOpenAI(apiKey)
    case 'claude':
      return createCustomClaude(apiKey)
    case 'gemini':
      return createCustomGemini(apiKey)
    case 'mistral':
      return createCustomMistral(apiKey)
    case 'xai':
      return createCustomXAI(apiKey)
    case 'deepseek':
      return createCustomDeepSeek(apiKey)
    default:
      throw new Error(`Unsupported service: ${service}`)
  }
}

// Check if the API key is valid
export function isValidApiKey(apiKey: string | null | undefined): apiKey is string {
  return typeof apiKey === 'string' && apiKey.trim() !== ''
}

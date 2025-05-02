'use client'

import { createOpenAI } from '@ai-sdk/openai'
import { AIService } from './models'

// Function to get API key from localStorage for a specific service
export function getApiKey(service: AIService): string | null {
  // Only run on client side
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(`${service}_api_key`)
}

// Create a custom OpenAI client with a specific API key
export function createCustomOpenAI(apiKey: string) {
  return createOpenAI({
    apiKey
  })
}

// Get the appropriate OpenAI instance based on the service
export function getServiceClient(service: AIService) {
  const apiKey = getApiKey(service)

  if (!apiKey) {
    throw new Error(`API key for ${service} is not set`)
  }

  return createCustomOpenAI(apiKey)
}

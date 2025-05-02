import { getServiceInfoFromModelId } from '@/lib/models'
import { getServiceClient, isValidApiKey } from '@/lib/server-api-helpers'
import { streamText } from 'ai'
import * as validators from '../validate-key/validators'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, apiKey, model = 'gpt-4o-mini' } = await req.json()

  console.log(`👉👉👉 apiKey: `, apiKey)
  console.log(`👉👉👉 model: `, model)

  // /* ###Thi */ console.log(`👉👉👉 messages: `, inspect(messages, { showHidden: true, depth: null, colors: true }))

  // Check if API key is provided
  if (!isValidApiKey(apiKey)) {
    return new Response(
      JSON.stringify({
        error: 'API key is required. Please set your API key in the Admin page.'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Get the service info for the model
    const serviceInfo = getServiceInfoFromModelId(model)
    /* ###Thi */ console.log(`👉👉👉 serviceInfo.key: `, serviceInfo?.key)
    if (!serviceInfo) {
      return new Response(
        JSON.stringify({
          error: `Unknown model: ${model}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate the API key for the specific service
    let validationResult
    switch (serviceInfo.key) {
      case 'openai':
        validationResult = await validators.validateOpenAIKey(apiKey)
        break
      case 'claude':
        validationResult = await validators.validateClaudeKey(apiKey)
        break
      case 'gemini':
        validationResult = await validators.validateGeminiKey(apiKey)
        break
      case 'mistral':
        validationResult = await validators.validateMistralKey(apiKey)
        break
      case 'xai':
        validationResult = await validators.validateXAIKey(apiKey)
        break
      case 'deepseek':
        validationResult = await validators.validateDeepSeekKey(apiKey)
        break
      default:
        return new Response(
          JSON.stringify({
            error: `Service validation for ${serviceInfo.key} not implemented`
          }),
          {
            status: 501,
            headers: { 'Content-Type': 'application/json' }
          }
        )
    }

    if (!validationResult.isValid) {
      return new Response(
        JSON.stringify({
          error: `Invalid API key for ${serviceInfo.name}: ${validationResult.error?.message || validationResult.statusText}`
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    try {
      // Create the appropriate client based on the service type
      const client = getServiceClient(serviceInfo.key, apiKey)

      // Create the model instance with the appropriate model ID
      const modelInstance = client.chat(model)

      // Stream the response
      const result = streamText({
        model: modelInstance,
        messages
      })

      return result.toDataStreamResponse()
    } catch (error) {
      // Handle service-specific errors
      if (error instanceof Error) {
        return new Response(
          JSON.stringify({
            error: error.message
          }),
          {
            status: 501,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

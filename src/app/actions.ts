'use server'

import { getServiceClient, isValidApiKey } from '@/lib/server-api-helpers'
import { generateText } from 'ai'
import { getServiceInfoFromModelId } from '../lib/models'

export async function generateTitleFromUserMessage(text: string, apiKey: string, modelId: string) {
  if (!isValidApiKey(apiKey)) {
    throw new Error('API key is required to generate a title. Please set your API key in the Admin page.')
  }

  try {
    const serviceInfo = getServiceInfoFromModelId(modelId)
    if (!serviceInfo) {
      throw new Error('Unknown model: ' + modelId)
    }
    const client = getServiceClient(serviceInfo.key, apiKey)
    const modelInstance = client.languageModel(modelId)
    const { text: title } = await generateText({
      model: modelInstance,
      prompt: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 60 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons
      - the title should be a summary of the user's message
      - do not use quotes or colons
      Here is the user's message:
      ${text}
      `
    })

    return title
  } catch (error) {
    console.error('Error generating title:', error)
    throw error
  }
}

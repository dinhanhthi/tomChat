'use server'

import { createCustomOpenAI, isValidApiKey } from '@/lib/server-api-helpers'
import { generateText } from 'ai'

export async function generateTitleFromUserMessage(text: string, apiKey: string) {
  // Validate the API key
  if (!isValidApiKey(apiKey)) {
    throw new Error('API key is required to generate a title. Please set your API key in the Admin page.')
  }

  try {
    // Create a custom OpenAI client with the provided API key
    const openaiClient = createCustomOpenAI(apiKey).chat('gpt-4o-mini')

    const { text: title } = await generateText({
      model: openaiClient,
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 60 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify({ role: 'user', content: text })
    })

    return title
  } catch (error) {
    console.error('Error generating title:', error)
    throw error
  }
}

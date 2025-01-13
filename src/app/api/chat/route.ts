import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const reqBody = await req.json()
  const { messages, apiKey } = reqBody
  // /* ###Thi */ console.log(`👉👉👉 messages: `, messages)
  // /* ###Thi */ console.log(`👉👉👉 apiKey: `, apiKey);
  /* ###Thi */ console.log(`👉👉👉 reqBody: `, reqBody)

  const openai = createOpenAI({
    apiKey
  })

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages
  })

  return result.toDataStreamResponse()
}

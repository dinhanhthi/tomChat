import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

/**
 * It's different from useChat() of AI SDK.
 */
export const useChatClient = (chatId: string, includeMessage?: boolean) => {
  const chat = useLiveQuery(async () => (chatId ? await db.chats.get(chatId) : undefined), [chatId])

  const messages =
    includeMessage && chatId
      ? useLiveQuery(
          async () => (await db.messages.where('chatId')?.equals(chatId)?.sortBy('createdAt')) ?? [],
          [chatId]
        )
      : []

  return { chat, messages }
}

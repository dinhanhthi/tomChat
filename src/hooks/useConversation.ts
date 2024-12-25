import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export const useConversation = (chatId: string, includeMessage?: boolean) => {
  const conversation = useLiveQuery(async () => (chatId ? await db.conversations.get(chatId) : undefined), [chatId])

  const messages =
    includeMessage && chatId
      ? useLiveQuery(
          async () => (await db.messages.where('chatId')?.equals(chatId)?.sortBy('createdAt')) ?? [],
          [chatId]
        )
      : []

  return { conversation, messages }
}

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export const useConversation = (chatId: string, includeMessage?: boolean) => {
  const conversation = useLiveQuery(async () => await db.conversations.get(chatId), [chatId])

  const messages = includeMessage
    ? useLiveQuery(
        async () => (await db.messages.where('chatId')?.equals(chatId)?.sortBy('createdAt')) ?? [],
        [chatId]
      )
    : []

  return { conversation, messages }
}

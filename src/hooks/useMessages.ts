import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export const useMessages = (chatId: string) => {
  const messages = useLiveQuery(
    () => db.messages.where('chatId').equals(chatId).sortBy('createdAt'),
    // .toArray(),
    [chatId]
  )

  return { messages }
}

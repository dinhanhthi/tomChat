import { db } from '@/db/database'
import { Collection } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { Chat } from '../interface'

export const useChats = ({
  onlyArchived,
  limit,
  tagName
}: {
  onlyArchived?: boolean
  limit?: number
  tagName?: string
}) => {
  const chats = useLiveQuery(async () => {
    const chatTable = db.chats
    let filteredChats: Collection<Chat, string, Chat>

    if (tagName) {
      filteredChats = chatTable.where('tags').anyOfIgnoreCase(tagName)
    } else {
      filteredChats = onlyArchived
      ? chatTable.where('archived').equals('true')
      : chatTable.where('archived').equals('false')
    }

    if (limit) {
      filteredChats = filteredChats.limit(limit)
    }

    const _chats = (await filteredChats.toArray()).sort((a, b) => {
      const dateA = new Date(a['updatedAt']).getTime()
      const dateB = new Date(b['updatedAt']).getTime()
      return dateB - dateA
    })

    return _chats
  }, [onlyArchived, tagName, limit])

  return { chats }
}

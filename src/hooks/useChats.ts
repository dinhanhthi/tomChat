import { db } from '@/db/database'
import { Collection } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { Chat } from '../interface'
import { NO_TAG } from '../lib/constants'

export const useChats = ({
  onlyArchived,
  alsoArchived,
  limit,
  tagName
}: {
  onlyArchived?: boolean
  alsoArchived?: boolean
  limit?: number
  tagName?: string
}) => {
  const chats = useLiveQuery(async () => {
    const chatTable = db.chats
    let filteredChats: Collection<Chat, string, Chat>

    if (tagName) {
      if (tagName !== NO_TAG) {
        filteredChats = chatTable.where('tags').anyOfIgnoreCase(tagName)
      } else {
        filteredChats = chatTable.where('hasNoTag').equals(1)
      }
    } else {
      // filteredChats = onlyArchived
      //   ? chatTable.where('archived').equals('true')
      //   : alsoArchived
      //     ? chatTable.where('archived').anyOf(['true', 'false'])
      //     : chatTable.where('archived').equals('false')
      filteredChats = onlyArchived
        ? chatTable.where('archived').equals('true')
        : chatTable.where('archived').anyOf(['true', 'false'])
    }

    filteredChats = filteredChats.and(chat => (alsoArchived ? true : chat.archived === 'false'))

    if (limit) {
      filteredChats = filteredChats.limit(limit)
    }

    const _chats = (await filteredChats.toArray()).sort((a, b) => {
      const dateA = new Date(a['updatedAt']).getTime()
      const dateB = new Date(b['updatedAt']).getTime()
      return dateB - dateA
    })

    return _chats
  }, [onlyArchived, alsoArchived, tagName, limit])

  return { chats }
}

import { db } from '@/db/database'
import { useLiveQuery } from 'dexie-react-hooks'
import { SidebarFilter } from './useFilterSettings'

export const useChats = ({
  sidebarFilter,
  limit,
  includeArchived = false
}: {
  sidebarFilter?: SidebarFilter
  limit?: number
  includeArchived?: boolean
}) => {
  const chats = useLiveQuery(async () => {
    const chatTable = db.chats

    let filteredChats = sidebarFilter?.showArchived
      ? chatTable.where('archived').equals('true')
      : includeArchived
        ? chatTable
        : chatTable.where('archived').equals('false')

    if (limit) {
      filteredChats = filteredChats.limit(limit)
    }

    const _chats = (await filteredChats.toArray()).sort((a, b) => {
      const dateA = new Date(a['updatedAt']).getTime()
      const dateB = new Date(b['updatedAt']).getTime()
      return dateB - dateA
    })

    return _chats
  }, [sidebarFilter])

  return { chats }
}

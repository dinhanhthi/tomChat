import { db } from '@/db/database'
import { useLiveQuery } from 'dexie-react-hooks'
import FlexSearch, { Id } from 'flexsearch'
import { useEffect, useState } from 'react'
import { Chat } from '../interface'

export type SearchableChat = Partial<Chat>

interface FilterSettings {
  showPinned?: boolean
  showArchived?: boolean
  sortByCreatedDate?: boolean
}

export const useChats = (searchQuery = '', settings?: FilterSettings) => {
  const [searchIndex, setSearchIndex] = useState<FlexSearch.Document<SearchableChat>>()
  const [searchResults, setSearchResults] = useState<Chat[]>()

  const chats = useLiveQuery(async () => {
    const chatTable = db.chats
    
    const filteredChats = chatTable.filter(conv => {
      if (!settings?.showArchived && conv.archived) return false;
      if (!settings?.showPinned && conv.pinned) return false;
      return true;
    })

    // Apply sorting and get results
    const sortBy = settings?.sortByCreatedDate ? 'createdAt' : 'updatedAt'
    const _chats = (await filteredChats.toArray()).sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime()
      const dateB = new Date(b[sortBy]).getTime()
      return dateB - dateA
    })

    // Fetch messages for each chat
    return await Promise.all(
      _chats.map(async chat => ({
        ...chat,
        messages: await db.messages.where('chatId').equals(chat.id).toArray()
      }))
    )
  }, [settings])

  useEffect(() => {
    if (!chats) return

    const index = new FlexSearch.Document<SearchableChat>({
      document: {
        id: 'id',
        index: ['title', 'messages.content']
      },
      tokenize: 'full'
    })

    chats.forEach(chat => {
      index.add({
        id: chat.id,
        title: chat.title,
        messages: chat.messages
      })
    })

    setSearchIndex(index)
  }, [chats])

  useEffect(() => {
    if (!searchIndex || !chats || !searchQuery) {
      setSearchResults(undefined)
      return
    }

    const results = searchIndex.search(searchQuery, {
      enrich: true,
      suggest: true
    })

    const matchedIds = new Set<Id>(results.flatMap(result => result.result))

    setSearchResults(chats.filter(chat => matchedIds.has(chat.id)))
  }, [searchQuery, searchIndex, chats])

  return {
    chats: searchQuery ? searchResults : chats
  }
}

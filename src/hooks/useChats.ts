import { db } from '@/db/database'
import { useLiveQuery } from 'dexie-react-hooks'
import FlexSearch, { Id } from 'flexsearch'
import { useEffect, useState } from 'react'
import { Chat } from '../interface'

export type SearchableChat = Partial<Chat>

export const useChats = (searchQuery = '') => {
  const [searchIndex, setSearchIndex] = useState<FlexSearch.Document<SearchableChat>>()
  const [searchResults, setSearchResults] = useState<Chat[]>()

  const chats = useLiveQuery(async () => {
    const _chats = await db.chats.orderBy('updatedAt').reverse().toArray()
    const chatsWithMessages = await Promise.all(
      _chats.map(async chat => ({
        ...chat,
        messages: await db.messages.where('chatId').equals(chat.id).toArray()
      }))
    )
    return chatsWithMessages
  })

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

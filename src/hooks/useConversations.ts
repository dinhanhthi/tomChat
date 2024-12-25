import { db } from '@/db/database'
import { useLiveQuery } from 'dexie-react-hooks'
import FlexSearch, { Id } from 'flexsearch'
import { useEffect, useState } from 'react'
import { Conversation } from '../interface'

export type SearchableConversation = Partial<Conversation>

export const useConversations = (searchQuery = '') => {
  const [searchIndex, setSearchIndex] = useState<FlexSearch.Document<SearchableConversation>>()
  const [searchResults, setSearchResults] = useState<Conversation[]>()

  const conversations = useLiveQuery(async () => {
    const convs = await db.conversations.orderBy('updatedAt').reverse().toArray()
    const convsWithMessages = await Promise.all(
      convs.map(async conv => ({
        ...conv,
        messages: await db.messages.where('chatId').equals(conv.id).toArray()
      }))
    )
    return convsWithMessages
  })

  useEffect(() => {
    if (!conversations) return

    const index = new FlexSearch.Document<SearchableConversation>({
      document: {
        id: 'id',
        index: ['title', 'messages.content']
      },
      tokenize: 'full'
    })

    conversations.forEach(conv => {
      index.add({
        id: conv.id,
        title: conv.title,
        messages: conv.messages
      })
    })

    setSearchIndex(index)
  }, [conversations])

  useEffect(() => {
    if (!searchIndex || !conversations || !searchQuery) {
      setSearchResults(undefined)
      return
    }

    const results = searchIndex.search(searchQuery, {
      enrich: true,
      suggest: true
    })

    const matchedIds = new Set<Id>(results.flatMap(result => result.result))

    setSearchResults(conversations.filter(conv => matchedIds.has(conv.id)))
  }, [searchQuery, searchIndex, conversations])

  return {
    conversations: searchQuery ? searchResults : conversations
  }
}

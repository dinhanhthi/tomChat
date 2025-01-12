import { db } from '@/db/database'
import { Chat } from '@/interface'
import { Message } from 'ai'
import { useLiveQuery } from 'dexie-react-hooks'
import MiniSearch from 'minisearch'
import { useMemo, useState } from 'react'

interface SearchDocument {
  id: string
  title: string
  messageContent: string
  messageId: string
  chatId: string
  matchedField: 'title' | 'messageContent'
  role: Message['role']
}

export const useSearchChats = (searchQuery: string = '') => {
  const chats = useLiveQuery(async () => {
    const _chats = await db.chats.toArray()
    return await Promise.all(
      _chats.map(async chat => ({
        ...chat,
        messages: await db.messages.where('chatId').equals(chat.id).toArray()
      }))
    )
  }, [])

  const [miniSearch] = useState(
    () =>
      new MiniSearch<SearchDocument>({
        fields: ['title', 'messageContent'],
        storeFields: ['id', 'messageId', 'chatId', 'title', 'updatedAt', 'archived', 'icon'],
        tokenize: (string, _fieldName) => string.split(/\s+/),
        searchOptions: {
          boost: { title: 2 },
          fuzzy: false
        }
      })
  )

  const documents = useMemo(() => {
    if (!chats) return []
    const docs = chats.flatMap(chat => [
      {
        id: `${chat.id}-title`,
        title: chat.title,
        messageContent: '',
        messageId: '',
        updatedAt: chat.updatedAt,
        icon: chat.icon,
        chatId: chat.id,
        matchedField: 'title' as SearchDocument['matchedField'],
        role: '' as SearchDocument['role'],
        archived: chat.archived
      },
      ...chat.messages.map(msg => ({
        id: `${chat.id}-${msg.id}`,
        title: chat.title,
        messageContent: msg.content,
        messageId: msg.id,
        updatedAt: chat.updatedAt,
        icon: chat.icon,
        chatId: chat.id,
        matchedField: 'messageContent' as SearchDocument['matchedField'],
        role: msg.role as SearchDocument['role'],
        archived: chat.archived
      }))
    ])
    miniSearch.removeAll()
    miniSearch.addAll(docs)
    return docs
  }, [chats, miniSearch])

  const results = useMemo(() => {
    if (!chats || !searchQuery.trim()) return []

    const searchResults = miniSearch.search(searchQuery, {
      prefix: true,
      combineWith: 'AND'
    })

    const terms = searchResults.flatMap(r => r.terms)
    const escapedTerms = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const termRegex = new RegExp(`(${escapedTerms.join('|')})`, 'gi')

    function truncateAroundMatch(termRegex: RegExp, text?: string): string {
      if (!text) return ''

      const matches = [...text.matchAll(termRegex)]
      if (!matches.length) return text.slice(0, 200)

      const words = text.split(/\s+/)
      const ranges: [number, number][] = matches.map(match => {
        const start = match.index!
        let charCount = 0
        let wordIndex = 0

        for (let i = 0; i < words.length; i++) {
          if (charCount + words[i].length + 1 > start) {
            wordIndex = i
            break
          }
          charCount += words[i].length + 1
        }

        const startWord = Math.max(0, wordIndex - 6)
        const endWord = Math.min(words.length, wordIndex + 10)
        return [startWord, endWord]
      })

      const mergedRanges: [number, number][] = []
      for (const [start, end] of ranges) {
        if (mergedRanges.length && mergedRanges[mergedRanges.length - 1][1] >= start - 1) {
          mergedRanges[mergedRanges.length - 1][1] = Math.max(mergedRanges[mergedRanges.length - 1][1], end)
        } else {
          mergedRanges.push([start, end])
        }
      }

      const snippets = mergedRanges.map(([start, end]) =>
        words.slice(start, end).join(' ').replace(termRegex, '<x-mark>$1</x-mark>')
      )

      return '...' + snippets.join('...')
    }

    const groupedResults = searchResults.reduce(
      (acc, result) => {
        if (!acc[result.chatId]) {
          acc[result.chatId] = []
        }

        const doc = documents.find(d => d.id === result.id)
        if (doc) {
          const highlightedContent = truncateAroundMatch(termRegex, doc.messageContent)
          const highlightedTitle = termRegex.test(doc.title) ? doc.title.replace(termRegex, '<x-mark>$1</x-mark>') : ''
          acc[result.chatId].push({
            ...result,
            title: doc.title,
            icon: doc.icon,
            archived: doc.archived,
            updatedAt: doc.updatedAt,
            highlightedContent,
            highlightedTitle,
            messageId: doc.messageId
          })
        }

        return acc
      },
      {} as Record<string, Array<any>>
    )

    return Object.values(groupedResults).map(chatResults => {
      if (chatResults.length === 1) return chatResults[0]
      const assistantMessage = chatResults.find(r => documents.find(d => d.id === r.id)?.role === 'assistant')
      return assistantMessage || chatResults[0]
    })
  }, [searchQuery, documents, miniSearch, chats])

  const foundChats: Chat[] = results.map(
    result =>
      new Chat({
        id: result.chatId,
        title: result.title,
        icon: result.icon,
        archived: result.archived,
        updatedAt: result.updatedAt,
        searchResult: {
          messageId: result.messageId,
          highlightedTitle: result.highlightedTitle,
          highlightedContent: result.highlightedContent
        }
      })
  )

  return { searchChats: searchQuery.trim() ? foundChats : [] }
}

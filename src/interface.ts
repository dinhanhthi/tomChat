import { Message } from 'ai'

export class Chat {
  id: string
  title: string
  icon?: string
  description?: string
  messages?: Message[]
  createdAt?: Date
  updatedAt: Date
  usage?: Usage
  pinned: 'true' | 'false'
  archived: 'true' | 'false'
  searchResult?: {
    messageId?: string
    highlightedTitle?: string
    highlightedContent: string
  }

  constructor(partial?: Partial<Chat>) {
    const now = new Date()
    this.id = partial?.id ?? crypto.randomUUID()
    this.title = partial?.title ?? 'New Chat'
    this.icon = partial?.icon
    this.description = partial?.description
    this.messages = partial?.messages ?? []
    this.createdAt = partial?.createdAt ?? now
    this.updatedAt = partial?.updatedAt ?? now
    this.usage = partial?.usage
    this.pinned = partial?.pinned ?? 'false'
    this.archived = partial?.archived ?? 'false'
    this.searchResult = partial?.searchResult
  }
}

export interface exMessage extends Message {
  chatId?: string // optional because the message from LLM doesn't have this prop
  usage?: Usage
  favorite?: 'true' | 'false' // Because Dexie's IndexableType is not compatible with boolean, undefined, or null (https://dexie.org/docs/Indexable-Type)
}

export interface Usage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

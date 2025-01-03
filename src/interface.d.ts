import { Message } from 'ai'

export interface Chat {
  id: string
  title: string
  icon?: string
  description?: string
  messages?: Message[]
  messageContents?: string[] // used for search indexing
  createdAt: Date
  updatedAt: Date
  usage?: Usage
  pinned: 'true' | 'false' // Because Dexie's IndexableType is not compatible with boolean, undefined, or null (https://dexie.org/docs/Indexable-Type)
  archived: 'true' | 'false' // Because Dexie's IndexableType is not compatible with boolean, undefined, or null (https://dexie.org/docs/Indexable-Type)
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

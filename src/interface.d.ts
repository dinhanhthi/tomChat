import { Message } from 'ai'

export interface Conversation {
  id: string
  title: string
  icon?: string
  description?: string
  messages?: Message[]
  createdAt: Date
  updatedAt: Date
  usage?: Usage
  favorite?: boolean
  archived?: boolean
}

export interface exMessage extends Message {
  chatId: string
  usage?: Usage
}

export interface Usage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}
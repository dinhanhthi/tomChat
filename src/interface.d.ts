import { Message } from 'ai'

export interface SidebarConversation {
  icon: string
  content: string
}

export interface Conversation {
  id: string
  title: string
  description?: string
  messages?: Message[]
  createdAt: Date
  updatedAt: Date
  usage?: Usage
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
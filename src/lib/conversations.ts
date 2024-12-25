import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/database'
import { exMessage } from '../interface'

export const getConversation = async (chatId: string) => {
  return await db.conversations.get(chatId)
}

export const createConversation = async (title: string, chatId?: string) => {
  const id = chatId ?? uuidv4()
  const now = new Date()

  await db.conversations.add({
    id,
    title,
    createdAt: now,
    updatedAt: now
  })

  return id
}

export const addMessage = async (chatId: string, message: exMessage) => {
  if (!message.id) {
    message.id = uuidv4()
  }
  if (!message.chatId && chatId) {
    message.chatId = chatId
  }
  await db.messages.add(message)
  await db.conversations.update(chatId, {
    updatedAt: new Date()
  })
  return message
}

export const getMessages = async (chatId: string) => {
  const messages = await db.messages.where('chatId').equals(chatId).sortBy('createdAt')
  return messages ?? []
}

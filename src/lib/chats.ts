import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/database'
import { Chat, exMessage } from '../interface'

export const getChat = async (chatId: string) => {
  return await db.chats.get(chatId)
}

export const createChat = async (title: string, chatId?: string) => {
  const id = chatId ?? uuidv4()
  const now = new Date()

  await db.chats.add({
    id,
    title,
    createdAt: now,
    updatedAt: now
  })

  return id
}

export const removeChat = async (chatId: string) => {
  await db.chats.delete(chatId)
  await db.messages.where('chatId').equals(chatId).delete()
  return chatId
}

export const updateChatMetadata = async (chatId: string, metadata: Partial<Chat>) => {
  return await db.chats.update(chatId, metadata)
}

export const addMessage = async (chatId: string, message: exMessage) => {
  if (!message.id) {
    message.id = uuidv4()
  }
  if (!message.chatId && chatId) {
    message.chatId = chatId
  }
  await db.messages.add(message)
  await db.chats.update(chatId, {
    updatedAt: new Date()
  })
  return message
}

export const getMessages = async (chatId: string) => {
  const messages = await db.messages.where('chatId').equals(chatId).sortBy('createdAt')
  return messages ?? []
}

export async function toggleChatStatus(id: string, field: 'pinned' | 'archived', value: boolean) {
  return await db.chats.update(id, { [field]: value })
}

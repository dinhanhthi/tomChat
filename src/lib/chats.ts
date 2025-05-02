import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/database'
import { Chat, exMessage } from '../interface'
import { DEFAULT_MODEL_ID } from './models'

// CHATS ---------------------------------------------------------

export const getChat = async (chatId: string) => {
  return await db.chats.get(chatId)
}

export const createChat = async (title: string, chatId?: string, model?: string) => {
  const id = chatId ?? uuidv4()
  // Use provided model, or get from localStorage, or use DEFAULT_MODEL_ID
  const defaultModel = model || localStorage.getItem('default_model_id') || DEFAULT_MODEL_ID
  await db.chats.add(new Chat({ id, title, model: defaultModel }))
  return id
}

export const removeChat = async (chatId: string) => {
  await db.chats.delete(chatId)
  await db.messages.where('chatId').equals(chatId).delete()
  return chatId
}

export async function toggleChatStatus(id: string, field: 'pinned' | 'archived', value: 'true' | 'false') {
  return await db.chats.update(id, { [field]: value })
}

export async function updateChatMeta<K extends keyof Chat>(chatId: string, field: K, value: Chat[K]) {
  return await db.chats.update(chatId, { [field]: value })
}

// MESSAGES ---------------------------------------------------------

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

// ADMIN

export async function bulkUpdateChatProperty(field: keyof Chat, value: any) {
  const chatsToUpdate = await db.chats.toArray()

  if (!chatsToUpdate.length) {
    toast.info('No chats found!')
    return
  }

  await db.chats.bulkUpdate(
    chatsToUpdate.map(chat => ({
      key: chat.id,
      changes: { [field]: value }
    }))
  )

  toast.success(`Bulk updated ${field} property!`)
}

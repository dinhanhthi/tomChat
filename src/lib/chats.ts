import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/database'
import { Chat, exMessage } from '../interface'

// CHATS ---------------------------------------------------------

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
    updatedAt: now,
    pinned: 'false',
    archived: 'false'
  })

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

export async function updateChatMeta(id: string, field: keyof Chat, value: string) {
  return await db.chats.update(id, { [field]: value })
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

export async function updateMessageFavoriteStatus(id: string, value: 'true' | 'false') {
  return await db.messages.update(id, { favorite: value })
}

// DEV ONLY ---------------------------------------------------------

export async function updateMissingArchivedChats() {
  const chatsToUpdate = await db.chats.filter(chat => !chat.archived).toArray()

  if (!chatsToUpdate.length) {
    toast.info('No missing archived chats found!')
    return
  }

  await db.chats.bulkUpdate(
    chatsToUpdate.map(chat => ({
      key: chat.id,
      changes: { archived: 'false' }
    }))
  )

  toast.success('Updated missing archived chats!')
}

export async function updateMissingPinnedChats() {
  const chatsToUpdate = await db.chats
    .filter(chat => !chat.pinned || !['true', 'false'].includes(chat.pinned))
    .toArray()

  if (!chatsToUpdate.length) {
    toast.info('No missing pinned chats found!')
    return
  }

  await db.chats.bulkUpdate(
    chatsToUpdate.map(chat => ({
      key: chat.id,
      changes: { pinned: 'false' }
    }))
  )

  toast.success('Updated missing pinned chats!')
}

import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { useDbLoading } from '../components/pglite-wrapper'
import { DbType } from '../db/db'
import { Chat, Message } from '../db/schema'

const getDbInstance = (providedDb?: any) => {
  if (providedDb) return providedDb
  const { db } = useDbLoading()
  return db
}

// CHATS ---------------------------------------------------------

export const getChat = async (chatId: string, db?: any) => {
  const dbInstance = getDbInstance(db)
  const result = await dbInstance.select().from(dbInstance.schema.chats).where(eq(dbInstance.schema.chats.id, chatId))
  if (result.length === 0) return null
  return result[0]
}

export const getConversation = async (conversationId: string, db?: any) => {
  const dbInstance = getDbInstance(db)
  const result = await dbInstance
    .select()
    .from(dbInstance.schema.conversations)
    .where(eq(dbInstance.schema.conversations.id, conversationId))
  if (result.length === 0) return null
  return result[0]
}

export const createChat = async (props: { title: string; chatId?: string; conversationId?: string; db?: DbType }) => {
  const { title, chatId: chatIdInput, conversationId: convIdInput, db } = props
  /* ###Thi */ console.log(`👉👉👉 createChat() called with title ${title} and chatId ${chatIdInput}`)
  const dbInstance = getDbInstance(db)
  const chatId = chatIdInput ?? uuidv4()
  const conversationId = convIdInput ?? uuidv4()

  // Create chat first to satisfy foreign key constraint
  await dbInstance.insert(dbInstance.schema.chats).values({
    id: chatId,
    title,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  /* ###Thi */ console.log(`👉👉👉 Done creating a chat in table chats, chatId: ${chatId}`)

  // Then create conversation that references the chat
  await dbInstance.insert(dbInstance.schema.conversations).values({
    id: conversationId,
    chatId: chatId,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  /* ###Thi */ console.log(
    `👉👉👉 Done creating a conversation in table conversations, conversationId: ${conversationId}`
  )

  return chatId
}

export const removeChat = async (chatId: string, db?: any) => {
  const dbInstance = getDbInstance(db)
  await dbInstance.delete(dbInstance.schema.messages).where(eq(dbInstance.schema.messages.chatId, chatId))
  await dbInstance.delete(dbInstance.schema.chats).where(eq(dbInstance.schema.chats.id, chatId))
  return chatId
}

export async function toggleChatStatus(id: string, field: 'pinned' | 'archived', value: boolean, db?: any) {
  const dbInstance = getDbInstance(db)
  await dbInstance
    .update(dbInstance.schema.chats)
    .set({ [field]: value })
    .where(eq(dbInstance.schema.chats.id, id))
}

export async function updateChatMeta<K extends keyof Chat>(chatId: string, field: K, value: Chat[K], db?: any) {
  const dbInstance = getDbInstance(db)
  await dbInstance
    .update(dbInstance.schema.chats)
    .set({ [field]: value })
    .where(eq(dbInstance.schema.chats.id, chatId))
}

// CONVERSATIONS ---------------------------------------------------------
export const getConversationsByChatId = async (chatId: string, db?: any) => {
  const dbInstance = getDbInstance(db)
  return await dbInstance
    .select()
    .from(dbInstance.schema.conversations)
    .where(eq(dbInstance.schema.conversations.chatId, chatId))
    .orderBy(dbInstance.schema.conversations.updatedAt)
}

// MESSAGES ---------------------------------------------------------

export const addMessage = async (props: {
  message: Message
  db?: DbType
  chatId?: string
  conversationId?: string
}) => {
  const { message, db, chatId: chatIdInput, conversationId: convIdInput } = props
  /* ###Thi */ console.log(`👉👉👉 addMessage() called with conversationId: ${message.conversationId}`)
  const dbInstance = getDbInstance(db)
  const messageId = message.id ?? uuidv4()
  const conversationId = message.conversationId ?? convIdInput

  // Get the chat ID from the conversation
  const chatId =
    chatIdInput ??
    (
      await dbInstance
        .select()
        .from(dbInstance.schema.conversations)
        .where(eq(dbInstance.schema.conversations.id, conversationId))
    )?.[0]?.chatId

  const newMessage = {
    ...message,
    id: messageId
  }

  /* ###Thi */ console.log(`👉👉👉 newMessage: `, newMessage)

  await dbInstance.insert(dbInstance.schema.messages).values(newMessage)

  // Update conversation's updatedAt
  await dbInstance
    .update(dbInstance.schema.conversations)
    .set({ updatedAt: new Date() })
    .where(eq(dbInstance.schema.conversations.id, conversationId))

  // Update chat's updatedAt
  await dbInstance
    .update(dbInstance.schema.chats)
    .set({ updatedAt: new Date() })
    .where(eq(dbInstance.schema.chats.id, chatId))

  /* ###Thi */ console.log(`👉👉👉 done`)

  return newMessage
}

export const getMessages = async (conversationId: string, db?: any) => {
  const dbInstance = getDbInstance(db)
  return await dbInstance
    .select()
    .from(dbInstance.schema.messages)
    .where(eq(dbInstance.schema.messages.conversationId, conversationId))
    .orderBy(dbInstance.schema.messages.createdAt)
}

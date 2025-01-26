import { relations, sql } from 'drizzle-orm'
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

// Models table
export const models = pgTable('models', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  service: text('service').notNull(), // e.g., 'openai', 'anthropic'
  context: integer('context').notNull(), // context window size
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

// Tags table
export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  colorHex: text('color_hex').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

// Chats table
export const chats = pgTable('chats', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  icon: text('icon'),
  description: text('description'),
  pinned: boolean('pinned').default(false),
  archived: boolean('archived').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
  totalTokens: integer('total_tokens').default(0)
})

// Chat-Tags junction table (many-to-many)
export const chatTags = pgTable(
  'chat_tags',
  {
    chatId: text('chat_id').references(() => chats.id, { onDelete: 'cascade' }),
    tagId: text('tag_id').references(() => tags.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.chatId, table.tagId] })]
)

// Conversations table
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  chatId: text('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  modelId: text('model_id').references(() => models.id),
  totalTokens: integer('total_tokens').default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`)
})

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  modelId: text('model_id').references(() => models.id),
  role: text('role').notNull(), // 'user', 'assistant', 'system'
  content: text('content').notNull(),
  promptTokens: integer('prompt_tokens').default(0),
  completionTokens: integer('completion_tokens').default(0),
  totalTokens: integer('total_tokens').default(0),
  favorite: boolean('favorite').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

// Define relationships
export const chatsRelations = relations(chats, ({ many }) => ({
  conversations: many(conversations), // This defines that one chat has many conversations
  chatTags: many(chatTags)
}))

export const conversationsRelations = relations(conversations, ({ many, one }) => ({
  chat: one(chats, {
    // This defines that one conversation belongs to one chat
    fields: [conversations.chatId],
    references: [chats.id]
  }),
  model: one(models, {
    fields: [conversations.modelId],
    references: [models.id]
  }),
  messages: many(messages)
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id]
  }),
  model: one(models, {
    fields: [messages.modelId],
    references: [models.id]
  })
}))

export const chatTagsRelations = relations(chatTags, ({ one }) => ({
  chat: one(chats, {
    fields: [chatTags.chatId],
    references: [chats.id]
  }),
  tag: one(tags, {
    fields: [chatTags.tagId],
    references: [tags.id]
  })
}))

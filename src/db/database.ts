import Dexie from 'dexie'
import { Chat, exMessage } from '../interface'

export class ChatDatabase extends Dexie {
  chats!: Dexie.Table<Chat, string>
  messages!: Dexie.Table<exMessage, string>

  constructor() {
    super('ChatDatabase')

    this.version(1).stores({
      chats: 'id, title, description, messages, createdAt, updatedAt, usage',
      messages: 'id, content, role, createdAt, chatId, usage'
    })

    this.chats = this.table('chats')
    this.messages = this.table('messages')
  }
}

export const db = new ChatDatabase()

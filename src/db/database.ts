import Dexie from 'dexie'
import { Chat, exMessage } from '../interface'

export class ChatDatabase extends Dexie {
  chats!: Dexie.Table<Chat, string>
  messages!: Dexie.Table<exMessage, string>

  constructor() {
    super('ChatDatabase')

    this.version(4).stores({
      chats: 'id, title, description, pinned, archived, *tags',
      messages: 'id, content, chatId'
    })

    this.chats = this.table('chats')
    this.messages = this.table('messages')
  }
}

export const db = new ChatDatabase()

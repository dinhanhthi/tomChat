import Dexie from 'dexie'
import { Chat, exMessage } from '../interface'

export class ChatDatabase extends Dexie {
  chats!: Dexie.Table<Chat, string>
  messages!: Dexie.Table<exMessage, string>

  constructor() {
    super('ChatDatabase')

    this.version(3).stores({
      chats: 'id, title, description, pinned, archived, *messageContents',
      messages: 'id, content, chatId'
    })

    this.chats = this.table('chats')
    this.messages = this.table('messages')

    this.chats.hook('creating', (_primKey, obj, _transaction) => {
      obj.messageContents = obj.messages?.map(m => m.content)
    })
  }
}

export const db = new ChatDatabase()

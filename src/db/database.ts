import Dexie from 'dexie';
import { Conversation, exMessage } from '../interface';

export class ChatDatabase extends Dexie {
  conversations!: Dexie.Table<Conversation, string>;
  messages!: Dexie.Table<exMessage, string>;

  constructor() {
    super('ChatDatabase');

    this.version(1).stores({
      conversations: 'id, title, description, messages, createdAt, updatedAt, usage',
      messages: 'id, content, role, createdAt, chatId, usage'
    });

    this.conversations = this.table('conversations');
    this.messages = this.table('messages');
  }
}

export const db = new ChatDatabase();
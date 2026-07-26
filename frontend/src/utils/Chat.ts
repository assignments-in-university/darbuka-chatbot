import { reactive } from 'vue';

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  createdAt: Date;
}

interface UnparsedMessage {
  id: string;
  message: string;
  isUser: boolean;
  createdAt: string;
}

interface ChatData {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

interface UnparsedChatData {
  id: string;
  name: string;
  messages: UnparsedMessage[];
  createdAt: string;
}

export class Chat {
  private chat: ChatData = reactive({
    id: '',
    messages: [],
    name: '',
    createdAt: new Date(),
  });

  constructor(options: { name: string });
  constructor(options: { id: string });
  constructor(options: { name: string; id: string }) {
    if (options.id) {
      const chat = this.getChatFromStorage(options.id);
      if (!chat) throw Error('Chat ID does not exist or is invalid JSON.');
      this.chat = chat;
    }

    if (options.name) {
      this.chat.id = crypto.randomUUID();
      this.chat.name = options.name;
    }
  }

  private getChatFromStorage(id: string): ChatData | null {
    const data = localStorage.getItem(id);

    if (data) {
      try {
        // Attempt to parse
        const unparsedChat: UnparsedChatData = JSON.parse(data);

        // Create empty instance to fill up
        const parsedChat: ChatData = {
          id: '',
          name: '',
          messages: [],
          createdAt: new Date(),
        };

        // Set id
        parsedChat.id = id;

        // Parse message dates
        parsedChat.messages = unparsedChat.messages.map((m) => {
          const { createdAt, ...msg } = m;
          const parsedCreatedAt = new Date(m.createdAt);
          return {
            createdAt: parsedCreatedAt,
            ...msg,
          };
        });

        // Parse chat date
        parsedChat.createdAt = new Date(unparsedChat.createdAt);

        return parsedChat;
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  private saveChatInStorage(chat: ChatData) {
    const { id, ...data } = chat;
    const stringified = JSON.stringify(data);
    localStorage.setItem(id, stringified);
  }

  public getMessages() {
    return this.chat.messages;
  }

  public updateChatName(options: { name: string; noSave?: boolean }) {
    this.chat.name = options.name;

    if (options.noSave) return;
    this.save();
  }

  public newMessage(options: { text: string; isUser: boolean; noSave?: boolean }) {
    const message = {
      id: crypto.randomUUID(),
      message: options.text,
      isUser: options.isUser,
      createdAt: new Date(),
    };

    this.chat.messages.push(message);
    if (options.noSave) return;

    this.save();
  }

  public deleteMessageAndOnwards(options: { messageId: string; noSave?: boolean }) {
    const idx = this.chat.messages.findIndex((m) => m.id === options.messageId);
    if (idx === -1) return;

    this.chat.messages.splice(idx);
    if (options.noSave) return;

    this.save();
  }

  public save() {
    this.saveChatInStorage(this.chat);
  }

  public exportMessagesCsv() {
    const csvLines = ['id,message,isUser,createdAt'];

    for (const msg of this.chat.messages) {
      const line = `${msg.id},${msg.message},${msg.isUser},${msg.createdAt}`;
      csvLines.push(line);
    }

    return csvLines.join('\n');
  }
}

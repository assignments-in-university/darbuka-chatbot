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
  isLearningMode: boolean;
  messages: Message[];
  createdAt: Date;
}

interface UnparsedChatData {
  id: string;
  name: string;
  isLearningMode: boolean;
  messages: UnparsedMessage[];
  createdAt: string;
}

export class Chat {
  private chat: ChatData = reactive({
    id: '',
    messages: [],
    name: '',
    isLearningMode: false,
    createdAt: new Date(),
  });

  private areMessagesLoaded: boolean;

  constructor(options: { name: string; isLearningMode: boolean });
  constructor(options: { id: string; skipMessagesLoad?: boolean });
  constructor(options: { name: string; id: string; isLearningMode: boolean; skipMessagesLoad?: boolean }) {
    if (options.id) {
      const chat = this.getChatFromStorage(options.id, options.skipMessagesLoad);
      if (!chat) throw Error('Chat ID does not exist or is invalid JSON.');

      this.chat = chat;

      this.areMessagesLoaded = !options.skipMessagesLoad;
      return;
    }

    if (options.name) {
      this.chat.id = crypto.randomUUID();
      this.chat.name = options.name;
      this.chat.isLearningMode = options.isLearningMode;
    }
    this.areMessagesLoaded = true;
  }

  private getChatFromStorage(id: string, skipMessagesLoad?: boolean): ChatData | null {
    const data = localStorage.getItem(id);

    if (data) {
      try {
        // Attempt to parse
        const unparsedChat: UnparsedChatData = JSON.parse(data);

        // Create empty instance to fill up
        const parsedChat: ChatData = {
          id: '',
          name: '',
          isLearningMode: false,
          messages: [],
          createdAt: new Date(),
        };

        // Set chat details
        parsedChat.id = id;
        parsedChat.name = unparsedChat.name;
        parsedChat.isLearningMode = unparsedChat.isLearningMode;
        parsedChat.createdAt = new Date(unparsedChat.createdAt);

        if (!skipMessagesLoad) {
          // Parse and set chat message dates
          parsedChat.messages = unparsedChat.messages.map((m) => {
            const { createdAt, ...msg } = m;
            const parsedCreatedAt = new Date(m.createdAt);
            return {
              createdAt: parsedCreatedAt,
              ...msg,
            };
          });
        }

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
    if (!this.areMessagesLoaded) return [];
    return this.chat.messages;
  }

  public getChatId() {
    return this.chat.id;
  }

  public getChatName() {
    return this.chat.name;
  }

  public isInLearningMode() {
    return this.chat.isLearningMode;
  }

  public getChatCreatedAt() {
    return this.chat.createdAt;
  }

  public updateChatName(options: { name: string; noSave?: boolean }) {
    if (!this.areMessagesLoaded) return;

    this.chat.name = options.name;
    if (options.noSave) return;
    this.save();
  }

  public newMessage(options: { text: string; isUser: boolean; noSave?: boolean }) {
    if (!this.areMessagesLoaded) return;

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
    if (!this.areMessagesLoaded) return;

    const idx = this.chat.messages.findIndex((m) => m.id === options.messageId);
    if (idx === -1) return;

    this.chat.messages.splice(idx);
    if (options.noSave) return;

    this.save();
  }

  public save() {
    if (!this.areMessagesLoaded) return;
    this.saveChatInStorage(this.chat);
  }

  public exportMessagesCsv() {
    if (!this.areMessagesLoaded) return '';
    const csvLines = ['id,message,isUser,createdAt'];

    for (const msg of this.chat.messages) {
      const values = [msg.id, msg.message, msg.isUser, msg.createdAt.toISOString()];
      const escapedValues = [];

      for (const value of values) {
        let stringVal = String(value);
        stringVal = stringVal.replace(/"/g, '""');

        if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n') || stringVal.includes('\r')) {
          stringVal = `"${stringVal}"`;
        }

        escapedValues.push(stringVal);
      }

      const line = escapedValues.join(',');
      csvLines.push(line);
    }

    return csvLines.join('\n');
  }
}

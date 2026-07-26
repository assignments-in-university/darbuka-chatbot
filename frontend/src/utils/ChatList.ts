import { reactive } from 'vue';

export class ChatList {
  private state = reactive<{ list: string[] }>({ list: [] });

  constructor() {
    this.load();
  }

  private load() {
    const chatList = localStorage.getItem('chatList');
    if (!chatList) {
      return localStorage.setItem('chatList', JSON.stringify([]));
    }

    try {
      const list = JSON.parse(chatList) as string[];
      this.state.list = list;
    } catch (e) {
      console.log(e);
      throw Error('List in local storage is corrupted.');
    }
  }

  public save() {
    const str = JSON.stringify(this.state.list);
    localStorage.setItem('chatList', str);
  }

  public addChat(id: string) {
    if (this.state.list.includes(id)) {
      return;
    }

    this.state.list.push(id);
    this.save();
  }

  public deleteChat(id: string) {
    this.state.list = this.state.list.filter((i) => i === id);
    this.save();
  }

  public getChats() {
    return this.state.list.slice();
  }
}

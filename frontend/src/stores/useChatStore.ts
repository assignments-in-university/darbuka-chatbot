import { computed, reactive, ref } from 'vue';

// State
const state = reactive<{ name: string; id: string | null }>({ name: 'New Chat', id: null });

// Getters
export const chatName = computed(() => state.name);
export const chatId = computed(() => state.id);

// Setters
export const updateChatName = (name: string) => {
  state.name = name;
};

export const resetChatName = () => {
  state.name = 'New Chat';
};

export const setChatId = (id: string) => {
  state.id = id;
};

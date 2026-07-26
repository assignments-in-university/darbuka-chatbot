import { computed, ref } from 'vue';

const state = ref('New Chat');

export const chatName = computed(() => state.value);

export const updateChatName = (name: string) => {
  state.value = name;
};

export const resetChatName = () => {
  state.value = 'New Chat';
};

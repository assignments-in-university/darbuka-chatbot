<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import Message from './Message.vue';
import Export from '@/assets/icons/Export.vue';
import UpArrow from '@/assets/icons/UpArrow.vue';
import { Chat } from '@/utils/Chat.js';
import { useRouter } from 'vue-router';
import { chatName, resetChatName, setChatId, updateChatName } from '@/stores/useChatStore.js';
import { ChatList } from '@/utils/ChatList.js';
import { AnimatePresence, motion } from 'motion-v';
import { Settings } from '@/utils/Settings.js';

const props = defineProps<{
  chatList: ChatList;
  settings: Settings;
}>();

// VUE
const router = useRouter();

// CHAT
const contentArea = ref<HTMLElement | null>(null);
const chat = ref<Chat | null>(null);
const message = ref('');
const errorMessage = ref('');
const awaitingResponse = ref(false);

// TEXT AREA RESIZING
const isFocused = ref(false);
const textArea = ref<HTMLTextAreaElement | null>(null);
const canSendMessage = ref(false);

const resizeTextarea = () => {
  if (!textArea.value) return;
  const MAX_HEIGHT = 140;

  // If the box is empty, immediately clamp it back to the single-line baseline
  if (!textArea.value.value) {
    textArea.value.style.height = '46px';
    return;
  }

  // Check if text is growing or shrinking
  // If scrollHeight is larger than the current height AND less than max, expand it
  if (textArea.value.scrollHeight > textArea.value.clientHeight && textArea.value.scrollHeight <= MAX_HEIGHT) {
    textArea.value.style.height = textArea.value.scrollHeight + 'px';
  }
};

const updateMessageSendingStatus = () => {
  canSendMessage.value = (message.value.length || -1) > 0;
};

const updateTextArea = () => {
  resizeTextarea();
  updateMessageSendingStatus();
};

const handleDownload = () => {
  if (!chat.value) return;
  const csvContent = chat.value.exportMessagesCsv();
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${chat.value.getChatName()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const sendMessage = async (e: KeyboardEvent | null) => {
  if (!chat.value || !contentArea.value) return;
  if (e) {
    if (e.shiftKey) return;
    e.preventDefault();
  }

  // Update chat name if needed
  if (chat.value.getChatName() !== chatName.value) {
    chat.value.updateChatName({ name: chatName.value });
  }

  // Add the chat to the chat list
  props.chatList.addChat(chat.value.getChatId());

  // Write user message
  chat.value.newMessage({
    text: message.value,
    isUser: true,
  });

  // Update awaiting response
  awaitingResponse.value = true;

  // Wait until tick is completed to load new message before scrolling down
  await nextTick();
  contentArea.value.scrollTo({ top: contentArea.value.scrollHeight });

  // Empty textarea and resize it
  const msgCopy = message.value.slice();
  message.value = '';
  updateTextArea();

  // Begin fetching response
  try {
    const res = await fetch('http://localhost:3000/chatbot/ask?isPredefined=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        message: msgCopy,
      }),
    });

    const jsonRes = await res.json();
    if (!jsonRes || !jsonRes?.message || !jsonRes.message.length) {
      throw Error('Could not parse json response from server.');
    }

    // Write down reply
    chat.value.newMessage({
      text: jsonRes.message as string,
      isUser: false,
    });
  } catch (e) {
    console.log(e);
    errorMessage.value = 'An error occurred, please refresh and try again.';
  } finally {
    awaitingResponse.value = false;
  }

  // Update router
  router.push(`/chat/${chat.value.getChatId()}`);
};

// Update the chat name
watch(chatName, (name) => {
  if (!chat.value) return;
  chat.value.updateChatName({ name });
});

const loadChat = async () => {
  const { id } = router.currentRoute.value.params;
  const isNewChat = !(id && !Array.isArray(id));

  try {
    if (isNewChat) {
      chat.value = new Chat({ name: chatName.value });
      setChatId(chat.value.getChatId());
      resetChatName();
    } else {
      chat.value = new Chat({ id });
      setChatId(id);
      updateChatName(chat.value.getChatName());
      props.chatList.save();

      await nextTick();
      contentArea?.value?.scrollTo({ top: contentArea.value.scrollHeight });
    }
  } catch (e) {
    console.log(e);
    errorMessage.value = 'Could not initialize chat from memory. Please try a different chat or make a new one.';
    return;
  }

  // Only continue to load welcome message if this is a new chat
  if (!isNewChat) return;

  // Load welcome message
  try {
    const res = await fetch('http://localhost:3000/chatbot/welcome?isPredefined=true', { method: 'GET' });
    const json = await res.json();
    const welcomeMsg = json?.message || '';

    if (welcomeMsg.length === 0) {
      throw Error('Empty welcome message.');
    }

    chat.value.newMessage({
      text: json?.message as string,
      isUser: false,
      noSave: true,
    });
  } catch (e) {
    console.log(e);
    errorMessage.value = 'An error occurred, please refresh and try again.';
  }
};

watch(() => router.currentRoute.value.params.id, loadChat);

const predefinedMessages = ['How old is the darbuka?', 'Who invented the drum?', 'Is it easy to play it?'];

const updateChatWithPredefinedMessage = (idx: number) => {
  message.value = predefinedMessages[idx] || '';
  updateTextArea();

  textArea.value?.focus();
};

onMounted(async () => {
  if (!props.settings.getDetails().isLoaded) {
    return router.push('/settings');
  }

  await loadChat();
});
</script>

<template>
  <div class="w-full">
    <!-- CONTENT -->
    <div class="h-[calc(100svh-230px)] relative w-full">
      <div
        class="overflow-y-auto h-full w-4/5 mx-auto flex flex-col gap-y-10 pr-4 scrollbar-thumb-emerald overflow-x-hidden"
        ref="contentArea"
      >
        <Message
          v-if="!errorMessage && chat?.getMessages().length === 0"
          :data="{ message: 'loading...' }"
          :is-user="false"
          :is-skeleton="true"
        ></Message>
        <Message :data="message" :is-user="message.isUser" v-for="message in chat?.getMessages()"></Message>
        <Message v-if="awaitingResponse" :data="{ message: 'loading...' }" :is-user="false" :is-skeleton="true"></Message>
        <Message v-if="errorMessage" :data="{ message: errorMessage }" :is-user="false" :is-error="true"></Message>
      </div>

      <div
        class="absolute -bottom-2 h-6 bg-linear-to-b from-transparent to-neutral-950 z-10 w-4/5 left-1/2 -translate-x-[calc(50%+16px)]"
      ></div>
    </div>

    <AnimatePresence>
      <motion.div
        class="p-2 w-[calc(80%-25px)] flex items-center justify-center flex-wrap absolute left-1/2 -translate-x-1/2 gap-2 z-100"
        v-if="chat?.getMessages().length === 1 && message.length === 0"
        :initial="{ bottom: 80, opacity: 0 }"
        :animate="{ bottom: 144, opacity: 1 }"
        :exit="{ bottom: 80 }"
      >
        <div
          v-for="(msg, idx) in predefinedMessages"
          class="text-neutral-400 text-sm px-4 py-1.5 bg-neutral-900 rounded-md hover:bg-emerald hover:text-black group duration-150 cursor-pointer"
          @click="updateChatWithPredefinedMessage(idx)"
        >
          {{ msg }}
        </div>
      </motion.div>
    </AnimatePresence>

    <!-- INPUT -->
    <motion.div
      class="bg-neutral-800 p-2 w-[calc(80%-25px)] rounded-lg flex flex-col items-center absolute left-1/2 -translate-x-1/2 shadow-[0px_0px_40px_3px] shadow-transparent gap-y-2 z-100 border border-transparent transition-shadow duration-500"
      :class="{ 'shadow-verdant/20': isFocused }"
      :initial="{ bottom: 0, opacity: 0 }"
      :animate="{ bottom: 32, opacity: 1 }"
    >
      <textarea
        ref="textArea"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
        @input="updateTextArea"
        v-model="message"
        placeholder="Ask anything Darbuka-related..."
        class="text-sm w-full whitespace-pre-wrap wrap-break-word outline-0 p-3 resize-none rounded-lg bg-coal border border-transparent duration-150 font-secondary transition-all"
        type="textarea"
        wrap="soft"
        rows="1"
        :class="{ 'border-verdant!': isFocused }"
        @keydown.enter="sendMessage"
      ></textarea>
      <div class="w-full flex">
        <div class="flex-1">
          <div
            class="w-max flex gap-x-2 text-sm font-primary items-center px-4 py-1.5 bg-neutral-900 rounded-md hover:bg-emerald hover:text-black group duration-150 cursor-pointer"
            @click="handleDownload"
          >
            <Export class="size-4.5 stroke-white group-hover:stroke-black duration-150"></Export>
            <span>Export CSV</span>
          </div>
        </div>

        <div
          class="rounded-md size-8 cursor-pointer flex items-center justify-center bg-neutral-900 duration-150 pointer-events-none"
          :class="{ 'bg-emerald! pointer-events-auto!': canSendMessage }"
          @click="sendMessage(null)"
        >
          <UpArrow class="stroke-neutral-500 duration-150" :class="{ 'stroke-black!': canSendMessage }"></UpArrow>
        </div>
      </div>
    </motion.div>
  </div>
</template>

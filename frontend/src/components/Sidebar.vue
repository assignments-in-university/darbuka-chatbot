<script setup lang="ts">
import Drum from '@/assets/icons/Drum.vue';
import Gear from '@/assets/icons/Gear.vue';
import Help from '@/assets/icons/Help.vue';
import Learn from '@/assets/icons/Learn.vue';
import MessageIcon from '@/assets/icons/Message.vue';
import { chatName } from '@/stores/useChatStore';
import { Chat } from '@/utils/Chat';
import { ChatList } from '@/utils/ChatList';
import { Settings } from '@/utils/Settings';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  chatList: ChatList;
  settings: Settings;
}>();

const route = useRoute();

const chats = ref(props.chatList.getChats().map((id) => new Chat({ id, skipMessagesLoad: true })));

watch(
  [route, chatName],
  () => {
    chats.value = props.chatList.getChats().map((id) => new Chat({ id, skipMessagesLoad: true }));
  },
  { flush: 'post' },
);

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});
</script>

<template>
  <nav class="w-72 border-r border-r-[#3F3F46]/30 h-svh bg-coal text-white flex flex-col">
    <!-- TOP -->
    <div class="h-16 flex items-center px-4 gap-x-4 mb-4">
      <div class="aspect-square w-12 rounded-md border-3 border-emerald">
        <img src="../assets/images/logo.jpg" alt="Logo" class="rounded-md" />
      </div>
      <div>
        <h1 class="text-lg font-primary uppercase">Sout</h1>
        <h2 class="text-emerald text-sm font-tertiary uppercase">Darbuka Chatbot</h2>
      </div>
    </div>

    <!-- NEW CHAT -->
    <div class="px-4 mb-2">
      <div
        class="px-2 py-1.5 bg-verdant text-black rounded-md flex items-center gap-x-1 duration-150 cursor-pointer"
        @click="$router.push('/chat/new')"
      >
        <MessageIcon class="fill-black"></MessageIcon>
        <span class="font-primary uppercase">New Chat</span>
      </div>
    </div>

    <!-- COURSE -->
    <div class="px-4">
      <div
        class="px-2 py-1.5 border border-verdant hover:bg-verdant/20 text-verdant rounded-md flex items-center gap-x-1 duration-150 cursor-pointer"
        :class="{ 'bg-verdant/20': $route.fullPath === '/course' }"
        @click="$router.push('/course')"
      >
        <Learn class="fill-verdant"></Learn>
        <span class="font-primary uppercase">Darbuka Course</span>
      </div>
    </div>

    <!-- ALL CHATS -->
    <h2 class="px-4 font-tertiary text-sm mt-6 mb-2">All Chats</h2>
    <div class="h-90 relative mb-auto">
      <div class="px-4 flex flex-col gap-y-2.5 max-h-84 overflow-y-auto scrollbar-thumb-emerald!">
        <div
          class="text-sm px-2 py-1.5 bg-neutral-900 rounded-md duration-100 cursor-pointer group last:mb-6 border border-transparent hover:border-emerald flex items-center"
          :class="{ 'border-emerald!': $route.params.id === chat.getChatId() }"
          v-for="chat in chats"
          @click="$router.push(`/chat/${chat.getChatId()}`)"
        >
          <span
            class="font-primary text-neutral-300 group-hover:text-white duration-100 mr-auto max-w-40 overflow-clip text-ellipsis text-nowrap"
            :class="{ 'text-white!': $route.params.id === chat.getChatId() }"
          >
            {{ chat.getChatName() }}
          </span>
          <span class="font-tertiary text-xs text-neutral-500">{{ dateFormatter.format(chat.getChatCreatedAt()) }}</span>
        </div>
        <div class="font-tertiary text-sm px-2 py-2 bg-neutral-900 rounded-md" v-if="chats.length === 0">
          No chats to display. Try starting one first?
        </div>
      </div>
      <div class="absolute bottom-6 w-72 h-6 bg-linear-to-b from-transparent to-coal z-100"></div>
    </div>

    <!-- VISUALIZER AND SETTINGS -->
    <div class="px-4 space-y-2">
      <RouterLink
        to="/visualizer"
        class="px-2 py-2 hover:bg-neutral-900 rounded-md flex items-center gap-x-2 duration-100 cursor-pointer group"
      >
        <Drum class="size-6 p-0.5 stroke-neutral-300 group-hover:stroke-white duration-100"></Drum>
        <span class="font-primary text-neutral-300 group-hover:text-white duration-100 uppercase">Visualizer</span>
      </RouterLink>
      <RouterLink
        to="/settings"
        class="px-2 py-2 hover:bg-neutral-900 rounded-md flex items-center gap-x-2 duration-100 cursor-pointer group"
      >
        <Gear class="size-6 stroke-1 stroke-neutral-300 group-hover:stroke-white duration-100"></Gear>
        <span class="font-primary text-neutral-300 group-hover:text-white duration-100 uppercase">Settings</span>
      </RouterLink>
    </div>

    <!-- PROFILE -->
    <div class="p-4">
      <hr class="border-t border-[#3F3F46]/50 mb-3" />
      <div class="flex gap-x-4 items-center">
        <div class="size-10 rounded-full border-verdant border-2">
          <img src="" alt="" class="rounded-full" />
        </div>
        <div class="flex flex-col">
          <h2 class="font-primary text-sm">{{ settings.getDetails().name || 'N/A' }}</h2>
          <span class="text-xs font-tertiary text-emerald">{{ settings.getDetails().skillLevel || 'N/A' }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

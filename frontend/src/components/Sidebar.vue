<script setup lang="ts">
import Drum from '@/assets/icons/Drum.vue';
import Gear from '@/assets/icons/Gear.vue';
import Learn from '@/assets/icons/Learn.vue';
import MessageIcon from '@/assets/icons/Message.vue';
import X from '@/assets/icons/X.vue';
import { chatName } from '@/stores/useChatStore';
import { Chat } from '@/utils/Chat';
import { ChatList } from '@/utils/ChatList';
import { Settings } from '@/utils/Settings';
import { AnimatePresence, motion } from 'motion-v';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  chatList: ChatList;
  settings: Settings;
  isSidebarOpen: boolean;
}>();

const emit = defineEmits<{
  'toggle-sidebar': [];
}>();

const route = useRoute();
const router = useRouter();

const isWindowMd = ref(false);

const chats = ref(props.chatList.getChats().map((id) => new Chat({ id, skipMessagesLoad: true })));

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});

watch(
  [route, chatName],
  () => {
    chats.value = props.chatList.getChats().map((id) => new Chat({ id, skipMessagesLoad: true }));
  },
  { flush: 'post' },
);

const handleResize = () => {
  isWindowMd.value = window.innerWidth < 768;
};

const goToNewChat = () => {
  router.push(`/chat/new`);
  emit('toggle-sidebar');
};

const goToCourse = () => {
  router.push(`/course`);
  emit('toggle-sidebar');
};

const goToChat = (chat: Chat) => {
  router.push(`/chat/${chat.getChatId()}`);
  emit('toggle-sidebar');
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <motion.nav
    class="w-72 border-r border-r-[#3F3F46]/30 fixed z-1000 h-svh bg-coal text-white flex flex-col overflow-hidden duration-300"
    :class="{ '-translate-x-full': !isSidebarOpen && isWindowMd }"
  >
    <!-- TOP -->
    <div class="h-16 flex items-center px-4 gap-x-4 mb-4 min-w-72">
      <div class="aspect-square w-12 rounded-md border-3 border-emerald">
        <img src="../assets/images/logo.jpg" alt="Logo" class="rounded-md" />
      </div>
      <div class="mr-auto">
        <h1 class="text-lg font-primary uppercase">Sout</h1>
        <h2 class="text-emerald text-sm font-tertiary uppercase">Darbuka Chatbot</h2>
      </div>
      <div
        class="p-1.5 border border-emerald rounded-md flex items-center justify-center hover:bg-emerald/20 duration-100 cursor-pointer"
        @click="emit('toggle-sidebar')"
        v-if="isWindowMd"
      >
        <X class="stroke-emerald size-4"></X>
      </div>
    </div>

    <!-- NEW CHAT -->
    <div class="px-4 mb-2 min-w-72">
      <div
        class="px-2 py-1.5 bg-verdant text-black rounded-md flex items-center gap-x-1 duration-150 cursor-pointer"
        @click="goToNewChat"
      >
        <MessageIcon class="fill-black"></MessageIcon>
        <span class="font-primary uppercase">New Chat</span>
      </div>
    </div>

    <!-- COURSE -->
    <div class="px-4 min-w-72">
      <div
        class="px-2 py-1.5 border border-verdant hover:bg-verdant/20 text-verdant rounded-md flex items-center gap-x-1 duration-150 cursor-pointer"
        :class="{ 'bg-verdant/20': $route.fullPath === '/course' }"
        @click="goToCourse"
      >
        <Learn class="fill-verdant"></Learn>
        <span class="font-primary uppercase">Darbuka Course</span>
      </div>
    </div>

    <!-- ALL CHATS -->
    <h2 class="px-4 font-tertiary text-sm mt-6 mb-2 min-w-72">All Chats</h2>
    <div class="h-90 relative mb-auto min-w-72">
      <div class="px-4 flex flex-col gap-y-2.5 max-h-84 overflow-y-auto scrollbar-thumb-emerald!">
        <div
          class="text-sm px-2 py-1.5 bg-neutral-900 rounded-md duration-100 cursor-pointer group last:mb-6 border border-transparent hover:border-emerald flex items-center"
          :class="{ 'border-emerald!': $route.params.id === chat.getChatId() }"
          v-for="chat in chats"
          @click="goToChat(chat as Chat)"
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
    <div class="px-4 space-y-2 min-w-72">
      <RouterLink
        to="/visualizer"
        @click="emit('toggle-sidebar')"
        class="px-2 py-2 hover:bg-neutral-900 rounded-md flex items-center gap-x-2 duration-100 cursor-pointer group"
      >
        <Drum class="size-6 p-0.5 stroke-neutral-300 group-hover:stroke-white duration-100"></Drum>
        <span class="font-primary text-neutral-300 group-hover:text-white duration-100 uppercase">Visualizer</span>
      </RouterLink>
      <RouterLink
        to="/settings"
        @click="emit('toggle-sidebar')"
        class="px-2 py-2 hover:bg-neutral-900 rounded-md flex items-center gap-x-2 duration-100 cursor-pointer group"
      >
        <Gear class="size-6 stroke-1 stroke-neutral-300 group-hover:stroke-white duration-100"></Gear>
        <span class="font-primary text-neutral-300 group-hover:text-white duration-100 uppercase">Settings</span>
      </RouterLink>
    </div>

    <!-- PROFILE -->
    <div class="p-4 min-w-72">
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
  </motion.nav>

  <!-- OVERLAY FOR WHEN SIDEBAR IS OPEN -->
  <AnimatePresence>
    <motion.div
      class="fixed inset-0 bg-black/30 z-500 backdrop-blur-sm"
      v-if="isSidebarOpen && isWindowMd"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
    ></motion.div>
  </AnimatePresence>
</template>

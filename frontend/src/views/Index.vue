<script setup lang="ts">
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import { ChatList } from '@/utils/ChatList';
import { Settings } from '@/utils/Settings';
import { motion } from 'motion-v';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const chatList = new ChatList();
const settings = new Settings();

const isSidebarOpen = ref(false);

const router = useRouter();

onMounted(() => {
  const details = settings.getDetails();
  if (details.areSettingsLoaded && details.isCourseLoaded) {
    return router.push('/chat/new');
  } else {
    return router.push('/settings');
  }
});
</script>

<template>
  <div class="flex w-full">
    <Sidebar
      :chat-list="chatList"
      :settings="settings"
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    ></Sidebar>
    <motion.main class="ml-auto w-full md:w-[calc(100%-288px)] duration-300">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></Header>

      <div
        class="text-white bg-neutral-950 h-[calc(100vh-64px)] p-4 relative bg-[repeating-radial-gradient(var(--color-neutral-900)_0,var(--color-neutral-900)_1px,transparent_1px,transparent_100%)] bg-size-[20px_20px]"
      >
        <RouterView :chat-list="chatList" :settings="settings" class="h-full"></RouterView>
      </div>
    </motion.main>
  </div>
</template>

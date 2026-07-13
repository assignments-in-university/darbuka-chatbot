<script setup lang="ts">
import { ref } from 'vue';

import Header from '@/components/Header.vue';
import Input from '@/components/Input.vue';
import Sidebar from '@/components/Sidebar.vue';

const sidebarOpen = ref(true);
</script>

<template>
  <div class="min-h-screen bg-[#090b10] text-white">
    <Sidebar :open="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />

    <main
      class="relative min-h-screen flex flex-col justify-between transition-all duration-300"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'"
    >
      <div class="flex-1 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <Header />
      </div>

      <Input />
    </main>
  </div>
</template>

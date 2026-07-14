<script setup lang="ts">
import Gear from '@/assets/icons/Gear.vue';
import Help from '@/assets/icons/Help.vue';

</script>

<template>
  <header class="h-16 w-full bg-black text-white flex items-center px-4 border-b border-b-[#3F3F46]/60">
    <h1 class="font-primary flex-1">Main Chatbot</h1>
    <div class="flex gap-x-2 px-3 py-1 rounded-full border border-neutral-900 items-center mr-4">
      <div class="rounded-full size-2 bg-emerald animate-pulse"></div>
      <span class="text-sm text-neutral-400">Network Online</span>
    </div>

    <div class="flex items-center gap-x-4">
      <Gear class="stroke-neutral-400 size-6"></Gear>
      <Help class="fill-neutral-400 size-5"></Help>
    </div>
  </header>
</template>

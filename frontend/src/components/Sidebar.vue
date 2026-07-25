<script setup lang="ts">
import Gear from '@/assets/icons/Gear.vue';
import Help from '@/assets/icons/Help.vue';
import MessageIcon from '@/assets/icons/Message.vue';
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
    <div class="px-4">
      <div class="px-2 py-2 bg-verdant text-black rounded-md flex items-center gap-x-1 duration-150 cursor-pointer">
        <MessageIcon class="fill-black"></MessageIcon>
        <span class="font-primary uppercase">New Chat</span>
      </div>
    </div>

    <!-- ALL CHATS -->
    <h2 class="px-4 font-tertiary text-sm mt-6 mb-2">All Chats</h2>
    <div class="h-90 relative mb-auto">
      <div class="px-4 flex flex-col gap-y-2 max-h-84 overflow-y-auto scrollbar-thumb-emerald!">
        <div class="px-2 py-2 hover:bg-neutral-900 rounded-md duration-100 cursor-pointer group last:mb-6">
          <span class="font-primary text-neutral-300 group-hover:text-white duration-100">recent chat 1</span>
        </div>
        <div class="px-2 py-2 hover:bg-neutral-900 rounded-md duration-100 cursor-pointer group last:mb-6">
          <span class="font-primary text-neutral-300 group-hover:text-white duration-100">recent chat 2</span>
        </div>
        <div class="px-2 py-2 hover:bg-neutral-900 rounded-md duration-100 cursor-pointer group last:mb-6">
          <span class="font-primary text-neutral-300 group-hover:text-white duration-100">recent chat 3</span>
        </div>
      </div>
      <div class="absolute bottom-6 w-72 h-6 bg-linear-to-b from-transparent to-coal z-100"></div>
    </div>

    <!-- HELP AND SETTINGS -->
    <div class="px-4 space-y-2">
      <div class="px-2 py-2 hover:bg-neutral-900 rounded-md flex items-center gap-x-2 duration-100 cursor-pointer group">
        <Help class="size-6 p-0.5 fill-neutral-300 group-hover:fill-white duration-100"></Help>
        <span class="font-primary text-neutral-300 group-hover:text-white duration-100 uppercase">Help</span>
      </div>
      <div class="px-2 py-2 hover:bg-neutral-900 rounded-md flex items-center gap-x-2 duration-100 cursor-pointer group">
        <Gear class="size-6 stroke-1 stroke-neutral-300 group-hover:stroke-white duration-100"></Gear>
        <span class="font-primary text-neutral-300 group-hover:text-white duration-100 uppercase">Settings</span>
      </div>
    </div>

    <!-- PROFILE -->
    <div class="p-4">
      <hr class="border-t border-[#3F3F46]/50 mb-3" />
      <div class="flex gap-x-4 items-center">
        <div class="size-10 rounded-full border-verdant border-2">
          <img src="" alt="" class="rounded-full" />
        </div>
        <div class="flex flex-col">
          <h2 class="font-primary text-sm">Some User Name</h2>
          <span class="text-xs font-tertiary text-emerald">Occupation</span>
        </div>
      </div>
    </div>
  </nav>
</template>

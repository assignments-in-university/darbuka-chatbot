<script setup lang="ts">
import Drum from '@/assets/icons/Drum.vue';
import Gear from '@/assets/icons/Gear.vue';
import Help from '@/assets/icons/Help.vue';
import Tick from '@/assets/icons/Tick.vue';
import { chatName, updateChatName } from '@/stores/useChatStore';
import { computed, ref, watch } from 'vue';

const input = ref(chatName.value);
const canSave = computed(() => input.value !== chatName.value);
const notSaved = ref(false);
const isConfirmed = ref(false);

const save = () => {
  notSaved.value = false;
  updateChatName(input.value);
  isConfirmed.value = true;
  window.setTimeout(() => (isConfirmed.value = false), 1500);
};

const updateInput = () => {
  if (canSave.value) {
    notSaved.value = true;
  }
};

watch(chatName, (newName) => {
  if (newName !== input.value) {
    input.value = newName;
  }
});
</script>

<template>
  <header class="h-16 w-full bg-black text-white flex items-center px-4 border-b border-b-[#3F3F46]/60">
    <div class="flex-1 flex items-end">
      <input
        class="mr-4 font-primary w-64 px-2 py-1.5 outline-none border rounded-md focus:border-emerald border-neutral-700 duration-100"
        :class="{ 'border-rose-500': notSaved }"
        v-model="input"
        @focusout="updateInput"
      />
      <button
        class="text-xs border border-neutral-700 px-2 py-1.5 rounded-md font-primary text-neutral-700 cursor-pointer duration-150 flex gap-x-1"
        :class="{ 'pointer-events-none': !canSave, 'bg-emerald text-black border-transparent': canSave }"
        @click="save"
      >
        Save{{ isConfirmed ? 'd' : '' }}
        <Tick class="size-4 stroke-neutral-700" v-if="isConfirmed"></Tick>
      </button>
    </div>
    <div class="flex gap-x-2 px-3 py-1 rounded-full border border-neutral-900 items-center mr-4">
      <div class="rounded-full size-2 bg-emerald animate-pulse"></div>
      <span class="text-sm text-neutral-400">Network Online</span>
    </div>

    <div class="flex items-center gap-x-4">
      <Gear class="stroke-neutral-400 size-6 cursor-pointer" @click="$router.push('/settings')"></Gear>
      <Drum class="stroke-neutral-400 size-5 cursor-pointer" @click="$router.push('/visualizer')"></Drum>
    </div>
  </header>
</template>

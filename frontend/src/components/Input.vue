<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  send: [message: string];
}>();

const message = ref('');

function handleSend() {
  const text = message.value.trim();
  if (!text) return;

  emit('send', text);
  message.value = '';
}
</script>

<template>
  <div class="mt-6 px-6 flex w-full justify-center sm:px-0">
    <div class="w-full max-w-270">
      <form
        @submit.prevent="handleSend"
        class="flex w-full items-center gap-3 rounded-[1.75rem] border border-neutral-800 bg-[#0d111a]/95 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <input
          v-model="message"
          type="text"
          placeholder="Whisper to the cosmos..."
          class="h-14 flex-1 rounded-3xl border border-neutral-800 bg-[#101820] px-5 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-vibrant-green focus:ring-2 focus:ring-vibrant-green/20"
        />

        <button
          type="submit"
          class="inline-flex h-14 min-w-14 items-center justify-center rounded-3xl bg-vibrant-green px-5 text-black transition hover:bg-[#d9e86f]"
        >
          ➤
        </button>
      </form>

      <div class="mt-3 flex justify-center text-xs uppercase tracking-[0.35em] text-neutral-500">
        <span class="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#3ddc49]" />
        SYSTEM ACTIVE
      </div>
    </div>
  </div>
</template>

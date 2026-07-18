<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Message from './Message.vue';

// --------------------
// TEXT AREA RESIZING
// --------------------
const isFocused = ref(false);
const textArea = ref<HTMLTextAreaElement | null>(null);

const welcomeMessage = ref<{ message: string }>({ message: '' });
const errorMessage = ref('');

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

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/chatbot/welcome?isPredefined=true', { method: 'GET' });
    const json = await res.json();
    const welcomeMsg = json?.message || '';

    if (welcomeMsg.length === 0) {
      throw Error('Empty welcome message.');
    }

    welcomeMessage.value = json;
  } catch (e) {
    console.log(e);
    errorMessage.value = 'An error occurred, please refresh and try again.';
  }
});
</script>

<template>
  <div class="w-full">
    <!-- CONTENT -->
    <div class="h-[calc(100svh-192px)] relative w-full">
      <div class="overflow-y-scroll h-full w-4/5 mx-auto flex flex-col gap-y-10 pr-4 scrollbar-thumb-emerald">
        <Message :data="welcomeMessage" :is-user="false"></Message>
      </div>

      <div
        class="absolute bottom-0 h-6 bg-linear-to-b from-transparent to-black z-10 w-4/5 left-1/2 -translate-x-[calc(50%+16px)]"
      ></div>
    </div>

    <!-- INPUT -->
    <div
      class="bg-neutral-800 p-2 w-[calc(80%-25px)] rounded-lg flex flex-col items-center absolute bottom-8 left-1/2 -translate-x-1/2 shadow-[0px_0px_40px_3px] shadow-transparent duration-500 gap-y-2 z-100 border border-transparent"
      :class="{ 'shadow-verdant/20': isFocused }"
    >
      <textarea
        ref="textArea"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
        @input="resizeTextarea"
        placeholder="Ask anything Darbuka-related..."
        class="text-sm w-full whitespace-pre-wrap wrap-break-word outline-0 p-3 resize-none rounded-lg bg-coal border border-transparent duration-150 font-secondary transition-all"
        type="textarea"
        wrap="soft"
        rows="1"
        :class="{ 'border-verdant!': isFocused }"
      ></textarea>
      <div class="w-full flex">
        <!-- ----------------------- -->
        <!-- POTENTIAL TOGGLE SWITCH -->
        <!-- ----------------------- -->
        <!-- <div class="flex text-sm relative rounded-md overflow-hidden font-tertiary bg-coal">
        <div
          class="py-1 px-2 w-36 z-10 duration-300 cursor-pointer flex items-center justify-center"
          :class="{ 'text-coal': activeMode === 'text' }"
          @click="activeMode = 'text'"
        >
          <Text :class="{ 'stroke-coal': activeMode === 'text' }"></Text>
          <span>Text Mode</span>
        </div>
        <div
          class="py-1 px-2 w-36 z-10 duration-300 cursor-pointer flex items-center justify-center gap-x-1"
          :class="{ 'text-coal': activeMode === 'drum' }"
          @click="activeMode = 'drum'"
        >
          <Drum class="size-5" :class="{ 'stroke-coal': activeMode === 'drum' }"></Drum>
          <span> Drum Mode </span>
        </div>
        <div
          class="bg-verdant w-36 absolute h-full duration-300 left-0"
          :style="activeMode === 'drum' ? 'left: 144px' : ''"
        ></div>
      </div> -->
      </div>
    </div>
  </div>
</template>

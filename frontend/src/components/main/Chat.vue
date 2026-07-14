<script setup lang="ts">
import { ref } from 'vue';

// --------------------
// TEXT AREA RESIZING
// --------------------
const isFocused = ref(false);
const textArea = ref<HTMLTextAreaElement | null>(null);

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
</script>

<template>
  <!-- CONTENT -->
  <div class="h-[calc(100svh-192px)] relative">
    <div class="overflow-y-scroll p-4 h-full">lorem*500</div>

    <div class="absolute bottom-0 h-6 bg-linear-to-b from-transparent to-black z-10 w-full"></div>
  </div>

  <!-- INPUT -->
  <div
    class="bg-neutral-800 p-2 w-4/5 rounded-lg flex flex-col items-center mx-auto absolute bottom-8 left-1/2 -translate-x-1/2 shadow-[0px_0px_40px_3px] shadow-transparent duration-500 gap-y-2 z-100 border border-transparent"
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
</template>

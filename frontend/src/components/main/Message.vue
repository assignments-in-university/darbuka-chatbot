<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue';
import Tick from '@/assets/icons/Tick.vue';
import { motion } from 'motion-v';
import { computed, ref } from 'vue';

const props = defineProps<{
  data: { message: string };
  isUser: boolean;
  isError?: boolean;
  isSkeleton?: boolean;
}>();

const isCopied = ref(false);

// Split message into paragraphs, and trim all words inside a paragraph to a maximum of 50 letters
const paragraphs = computed(() =>
  props.data.message.split('\n\n').map((p) => {
    const trimmedWords = [];
    const words = p.split(' ');
    for (const word of words) {
      if (word.length > 50) {
        trimmedWords.push(word.slice(0, 50));
        continue;
      }
      trimmedWords.push(word);
    }

    return trimmedWords.join(' ');
  }),
);

const copyText = async () => {
  await navigator.clipboard.writeText(props.data.message);
  isCopied.value = true;

  window.setTimeout(() => (isCopied.value = false), 2500);
  return;
};

const LOAD_DURATION = 0.3;
</script>

<template>
  <div class="last:mb-6" v-if="isSkeleton">
    <motion.div
      class="flex gap-x-2 items-end max-w-max"
      :class="{ 'flex-row-reverse ml-auto': isUser }"
      :initial="{ opacity: 0, x: isUser ? 100 : -100, y: isUser ? -10 : 10, scale: 0 }"
      :animate="{ opacity: 1, x: 0, y: 0, scale: 1 }"
      :transition="{ duration: LOAD_DURATION, ease: 'backOut', y: { delay: isUser ? 0 : 0.03 }, x: { delay: isUser ? 0.03 : 0 } }"
    >
      <div class="size-12 rounded-xl overflow-hidden border-emerald border">
        <img src="../../assets/images/logo.jpg" alt="logo" />
      </div>
      <div
        class="w-24 bg-neutral-900 p-3 rounded-xl space-y-4 font-primary duration-150 border border-transparent min-h-14.5 flex items-center"
      >
        <div class="flex size-full justify-around">
          <motion.div
            v-for="idx in 3"
            :key="idx"
            class="rounded-full size-3.5 bg-neutral-700"
            :animate="{ y: [0, -3, 0] }"
            :transition="{
              duration: 0.6,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.1,
              delay: idx * 0.15 + LOAD_DURATION,
            }"
          ></motion.div>
        </div>
      </div>
    </motion.div>
  </div>
  <motion.div
    v-else
    class="last:mb-6"
    :initial="{ opacity: 0, x: isUser ? 100 : -100, y: isUser ? -10 : 10 }"
    :animate="{ opacity: 1, x: 0, y: 0 }"
    :transition="{ duration: LOAD_DURATION, ease: 'backOut', y: { delay: isUser ? 0 : 0.03 }, x: { delay: isUser ? 0.03 : 0 } }"
  >
    <div class="flex gap-x-2 items-end" :class="{ 'flex-row-reverse': isUser }">
      <div class="size-12 rounded-xl overflow-hidden border-emerald border">
        <img src="../../assets/images/logo.jpg" alt="logo" />
      </div>
      <div
        class="w-7/10 bg-neutral-900 p-4 rounded-xl space-y-4 font-primary duration-150 border border-transparent overflow-hidden"
        :class="{ 'border-emerald! border-dashed': isUser, 'border-rose-500! text-rose-500 border-dashed': isError }"
      >
        <p v-for="paragraph in paragraphs" class="w-full">{{ paragraph }}</p>
      </div>
    </div>

    <div class="flex gap-x-1 mt-2 w-7/10 items-end ml-14 justify-end" v-if="!isUser">
      <Tick class="stroke-emerald size-6" v-if="isCopied"></Tick>
      <Copy class="fill-neutral-700 hover:fill-emerald duration-150 cursor-pointer size-6" @click="copyText" v-else></Copy>
    </div>
  </motion.div>
</template>

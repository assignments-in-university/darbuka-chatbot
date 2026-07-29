<script setup lang="ts">
import Learn from '@/assets/icons/Learn.vue';
import Message from '@/assets/icons/Message.vue';
import UpArrow from '@/assets/icons/UpArrow.vue';
import { motion } from 'motion-v';
</script>

<template>
  <div class="size-full relative p-4">
    <div
      class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-128 bg-emerald/10 rounded-full blur-3xl animate-pulse"
    ></div>

    <div class="relative z-10">
      <div class="mb-10">
        <motion.h1
          class="text-4xl text-emerald font-primary font-semibold text-center mb-4"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
        >
          Choose The Chat Type
        </motion.h1>
        <motion.p
          class="max-w-3/5 text-center mx-auto font-primary text-neutral-300"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.1 }"
        >
          Select the chat type which determines how you and the chatbot interact. Each type provides its own unique experience.
        </motion.p>
      </div>

      <div class="flex gap-4 font-primary">
        <motion.div
          class="w-full bg-neutral-800/80 rounded-md border border-neutral-700 p-10 duration-150 transition-colors group hover:border-emerald"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ delay: 0.2 }"
        >
          <div
            class="size-14 rounded-md flex items-center justify-center bg-neutral-700 border border-neutral-600 mb-4 group-hover:border-emerald duration-150"
          >
            <Message class="fill-emerald size-8"></Message>
          </div>
          <h2 class="text-2xl font-semibold mb-2">Normal Mode</h2>
          <p class="text-neutral-300 leading-relaxed mb-10">
            Speak freely with the AI guide in an open-ended conversational workspace. Perfect for casual brainstorming, quick
            questions, or general assistance without structured constraints.
          </p>

          <button
            class="w-full py-2 bg-emerald rounded-md text-lg text-black font-medium flex items-center justify-center gap-x-2 cursor-pointer"
            @click="$router.push('/chat?isLearningMode=false')"
          >
            Start Chatting
            <UpArrow class="rotate-90"></UpArrow>
          </button>
        </motion.div>
        <motion.div
          class="w-full bg-neutral-800/80 rounded-md border border-neutral-700 p-10 duration-150 transition-colors group hover:border-emerald"
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ delay: 0.3 }"
        >
          <div
            class="size-14 rounded-md flex items-center justify-center bg-neutral-700 border border-neutral-600 mb-4 group-hover:border-emerald duration-150"
          >
            <Learn class="fill-emerald size-8"></Learn>
          </div>
          <h2 class="text-2xl font-semibold mb-2">Learning Mode</h2>
          <p class="text-neutral-300 leading-relaxed mb-10">
            Speak freely with the AI guide in an open-ended conversational workspace. Perfect for casual brainstorming, quick
            questions, or general assistance without structured constraints.
          </p>

          <button
            class="w-full py-2 border border-emerald rounded-md text-lg text-emerald font-medium flex items-center justify-center gap-x-2 cursor-pointer hover:bg-emerald/15 duration-150"
            @click="$router.push('/chat?isLearningMode=true')"
          >
            Start Learning
            <UpArrow class="rotate-90 stroke-emerald"></UpArrow>
          </button>
        </motion.div>
      </div>
    </div>
  </div>
</template>

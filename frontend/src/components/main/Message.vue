<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue';
import { computed } from 'vue';

const props = defineProps<{
  data: { message: string };
  isUser: boolean;
}>();

const paragraphs = computed(() => props.data.message.split('\n\n'));
</script>

<template>
  <div class="last:mb-6">
    <div class="flex gap-x-2 items-end" :class="{ 'flex-row-reverse': isUser }">
      <div class="size-12 rounded-xl overflow-hidden border-emerald border">
        <img src="../../assets/images/logo.jpg" alt="logo" />
      </div>
      <div
        class="w-3/5 bg-neutral-900 p-4 rounded-xl space-y-4 font-primary duration-150 border border-transparent"
        :class="{ 'border-emerald! border-dashed': isUser }"
      >
        <p v-for="paragraph in paragraphs" class="w-full">{{ paragraph }}</p>
      </div>
    </div>

    <div class="flex gap-x-1 mt-2 w-3/5 items-end ml-14 justify-end" v-if="!isUser">
      <Copy class="fill-neutral-700 hover:fill-emerald duration-150 cursor-pointer size-6"></Copy>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();
</script>

<template>
  <aside
    :class="[
      'fixed md:fixed left-0 top-0 h-screen bg-[#0D0D0D] border-r border-neutral-800 text-gray-300 flex flex-col transition-all duration-300 z-50',
      open ? 'w-64' : 'w-20',
    ]"
  >
    <!-- Toggle -->
    <div class="flex justify-end p-3">
      <button @click="emit('toggle')" class="text-gray-400 hover:text-white text-lg">☰</button>
    </div>

    <!-- Logo -->
    <div class="px-5" :class="open ? '' : 'flex justify-center px-0'">
      <div class="flex items-center" :class="open ? 'gap-3' : 'justify-center'">
        <div class="w-10 h-10 rounded-md bg-vibrant-green flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>

        <div v-if="open">
          <h1 class="font-semibold text-white">Desert Whisper</h1>

          <p class="text-[10px] tracking-[3px] uppercase text-vibrant-green">Dusk Core Active</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 px-3 space-y-3">
      <button
        class="w-full bg-vibrant-green rounded-md py-3 text-black font-semibold flex items-center transition"
        :class="open ? 'gap-3 px-4' : 'justify-center'"
      >
        <span class="text-gray-400">➕</span>

        <span v-if="open"> New Chat </span>
      </button>

      <button
        class="w-full py-3 rounded-md hover:bg-neutral-800 flex items-center"
        :class="open ? 'gap-3 px-4' : 'justify-center'"
      >
        <svg class="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.07881 5.06891C8.87414 1.27893 15.0438 1.31923 18.8623 5.13778C22.6825 8.95797 22.7212 15.1313 18.9263 18.9262C15.1314 22.7211 8.95805 22.6824 5.13786 18.8622C2.87401 16.5984 1.93916 13.5099 2.34059 10.5812C2.39684 10.1708 2.77512 9.88377 3.18549 9.94002C3.59587 9.99627 3.88295 10.3745 3.8267 10.7849C3.48672 13.2652 4.27794 15.881 6.19852 17.8016C9.443 21.0461 14.6665 21.0646 17.8656 17.8655C21.0647 14.6664 21.0461 9.44292 17.8017 6.19844C14.5588 2.95561 9.33901 2.93539 6.13947 6.12957L6.88717 6.13333C7.30138 6.13541 7.63547 6.47288 7.63339 6.88709C7.63131 7.3013 7.29384 7.63539 6.87963 7.63331L4.33408 7.62052C3.92281 7.61845 3.58993 7.28556 3.58786 6.8743L3.57507 4.32874C3.57299 3.91454 3.90708 3.57707 4.32129 3.57498C4.7355 3.5729 5.07297 3.907 5.07505 4.32121L5.07881 5.06891ZM12 7.24992C12.4142 7.24992 12.75 7.58571 12.75 7.99992V11.6893L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0302C14.7374 15.3231 14.2626 15.3231 13.9697 15.0302L11.25 12.3106V7.99992C11.25 7.58571 11.5858 7.24992 12 7.24992Z"
            fill="currentColor"
          />
        </svg>

        <span v-if="open"> History </span>
      </button>

      <button
        class="w-full py-3 rounded-md hover:bg-neutral-800 flex items-center"
        :class="open ? 'gap-3 px-4' : 'justify-center'"
      >
        <span class="text-gray-400">📚</span>

        <span v-if="open"> Collections </span>
      </button>
    </div>

    <div class="flex-1"></div>

    <!-- Bottom -->

    <div class="px-3 pb-5 space-y-3">
      <div
        class="bg-vibrant-green rounded-md py-3 flex items-center text-black"
        :class="open ? 'justify-between px-4' : 'justify-center'"
      >
        <div class="flex items-center gap-2">
          <svg
            class="text-gray-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.81818 22L6.81822 19.143C6.51904 16.1656 3.00001 14.5717 3.00001 10.0004C3 5.42914 5.72738 1.94374 11.1819 2.00069C15.1094 2.04169 18.8182 4.28632 18.8182 8.8576L21 12.286C21 14.5717 18.8182 14.5717 18.8182 14.5717C18.8182 14.5717 19.3636 20.2858 14.4545 20.2858L14.4545 22"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 12C12.1046 12 13 11.1046 13 10C13 8.89543 12.1046 8 11 8C10.6357 8 10.2942 8.09739 10 8.26756C9.4022 8.61337 9 9.25972 9 10C9 10.7403 9.4022 11.3866 10 11.7324C10.2942 11.9026 10.6357 12 11 12Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 13C12.6569 13 14 11.6569 14 10C14 8.34315 12.6569 7 11 7C9.34315 7 8 8.34315 8 10C8 11.6569 9.34315 13 11 13Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-dasharray="0.3 2"
            />
          </svg>

          <span v-if="open"> Learning Mode </span>
        </div>

        <div v-if="open" class="w-8 h-5 rounded-full bg-[#8fa619] relative">
          <div class="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-black" />
        </div>
      </div>

      <button
        class="w-full py-3 rounded-md hover:bg-neutral-800 flex items-center"
        :class="open ? 'gap-3 px-4' : 'justify-center'"
      >
        <!--
category: System
tags: [cog, edit, gear, preferences, tools]
version: "1.0"
unicode: "eb20"
-->
        <svg
          class="text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
          />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>

        <span v-if="open"> Settings </span>
      </button>

      <button
        class="w-full py-3 rounded-md hover:bg-neutral-800 flex items-center"
        :class="open ? 'gap-3 px-4' : 'justify-center'"
      >
        <svg class="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.83834 14.1056 10.6796 13.3353 11.1354C13.1385 11.2518 12.9761 11.3789 12.8703 11.5036C12.7675 11.6246 12.75 11.7036 12.75 11.75V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V11.75C11.25 11.2441 11.4715 10.8336 11.7266 10.533C11.9786 10.236 12.2929 10.0092 12.5715 9.84439C12.9044 9.64739 13.125 9.28655 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
            fill="currentColor"
          />
        </svg>

        <span v-if="open"> Support </span>
      </button>

      <div class="border-t border-neutral-800 pt-4">
        <div class="flex items-center" :class="open ? 'gap-3' : 'justify-center'">
          <img src="https://placehold.co/40x40" class="w-9 h-9 rounded-full" />

          <span v-if="open" class="text-white text-sm"> Astra Nova </span>
        </div>
      </div>
    </div>
  </aside>
</template>

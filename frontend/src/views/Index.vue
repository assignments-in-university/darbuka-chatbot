<script setup lang="ts">
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
</script>

<template>
  <div class="flex w-full">
    <Sidebar></Sidebar>
    <main class="flex-1">
      <Header></Header>

      <div class="text-white bg-neutral-950 h-[calc(100%-64px)] p-4 relative bg-[repeating-radial-gradient(var(--color-neutral-900)_0,var(--color-neutral-900)_1px,transparent_1px,transparent_100%)] bg-size-[20px_20px]">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>

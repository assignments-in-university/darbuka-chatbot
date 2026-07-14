<script setup lang="ts">
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
</script>

<template>
  <div class="flex w-full">
    <Sidebar></Sidebar>
    <main class="flex-1">
      <Header></Header>

      <div class="text-white bg-black h-[calc(100%-64px)] p-4 relative">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>

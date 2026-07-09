<script setup lang="ts">
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
</script>

<template>
  <div class="flex w-full">
    <Sidebar></Sidebar>
    <main class="flex-1">
      <Header></Header>

      <div>Content area goes here</div>
    </main>
  </div>
</template>

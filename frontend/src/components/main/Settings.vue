<script setup lang="ts">
import { Settings } from '@/utils/Settings';
import { motion } from 'motion-v';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  settings: Settings;
}>();

const router = useRouter();

interface SettingsForm {
  name: string;
  gender: 'male' | 'female' | '';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

const form = reactive<SettingsForm>({
  ...props.settings.getDetails(),
});

const saveSettings = () => {
  // Validate form
  if (!form.name || !form.gender || !form.skillLevel) {
    alert('Please fill in all fields');
    return;
  }

  props.settings.updateDetails({
    name: form.name,
    gender: form.gender,
    skillLevel: form.skillLevel,
  });

  router.push('/chat');
};
</script>

<template>
  <div class="h-full w-3/4 xl:w-1/2 mx-auto flex flex-col gap-y-4">
    <div class="space-y-2 text-center">
      <motion.h1
        class="text-4xl font-primary text-emerald font-semibold"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        >User Settings</motion.h1
      >
      <motion.p
        class="font-secondary"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.1 }"
        >Configure your interface and AI interactions</motion.p
      >
    </div>

    <motion.form
      @submit.prevent="saveSettings"
      class="space-y-6 p-4 bg-neutral-900 rounded-md border border-neutral-700"
      :initial="{ opacity: 0, x: -10 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ delay: 0.2 }"
    >
      <!-- Name Field -->
      <div class="flex flex-col gap-y-3">
        <label for="name" class="max-w-max text-xs font-medium font-tertiary uppercase">Display Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Enter your name..."
          class="w-full px-4 py-2 border border-emerald/25 rounded-lg focus:border-emerald outline-none duration-100 font-primary text-sm"
        />
      </div>

      <!-- Gender Field -->
      <div class="flex flex-col gap-y-3">
        <label class="max-w-max text-xs font-medium font-tertiary uppercase">Gender Identity</label>
        <div class="flex gap-x-4 font-primary text-sm">
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': form.gender === 'male' }"
          >
            <input v-model="form.gender" type="radio" value="male" class="appearance-none" />
            <span class="ml-2">Male</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': form.gender === 'female' }"
          >
            <input v-model="form.gender" type="radio" value="female" class="appearance-none" />
            <span class="ml-2">Female</span>
          </label>
        </div>
      </div>

      <!-- Skill Level Field -->
      <div class="flex flex-col gap-y-3 mb-10">
        <label class="max-w-max text-xs font-medium font-tertiary uppercase">Skill Level</label>
        <div class="flex gap-x-4 font-primary text-sm">
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': form.skillLevel === 'beginner' }"
          >
            <input v-model="form.skillLevel" type="radio" value="beginner" class="appearance-none" />
            <span class="ml-2">Beginner</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': form.skillLevel === 'intermediate' }"
          >
            <input v-model="form.skillLevel" type="radio" value="intermediate" class="appearance-none" />
            <span class="ml-2">Intermediate</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': form.skillLevel === 'advanced' }"
          >
            <input v-model="form.skillLevel" type="radio" value="advanced" class="appearance-none" />
            <span class="ml-2">Advanced</span>
          </label>
        </div>
      </div>

      <!-- Save Button -->
      <button type="submit" class="w-full bg-emerald font-primary rounded-md py-1.5 text-black cursor-pointer">Save</button>
    </motion.form>

    <div class="font-primary text-center">
      <motion.h3 class="mt-4 mb-1" :initial="{ opacity: 0, x: -10 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.3 }"
        >Settings Note:</motion.h3
      >
      <motion.p
        class="text-sm text-neutral-300"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.4 }"
      >
        Your information is used to provide better, more accurate responses. These fields are required to be filled before working
        with the chatbot.
      </motion.p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/assets/icons/Spinner.vue';
import { Settings } from '@/utils/Settings';
import { motion } from 'motion-v';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  settings: Settings;
}>();

const router = useRouter();

const isSettingsPage = ref(true);
const isLoading = ref(false);

interface SettingsForm {
  name: string;
  gender: 'male' | 'female' | '';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

interface GoalsForm {
  goal:
    | 'Learn traditional rhythms'
    | 'Learn about the history and culture'
    | 'Understand how the darbuka works'
    | 'Just explore and have fun'
    | '';
  timeLimit: '10-15 minutes' | '20-30 minutes' | '30-60 minutes' | '60 minutes +' | '';
}

const settingsForm = reactive<SettingsForm>({
  ...props.settings.getDetails(),
});

const goalsForm = reactive<GoalsForm>({
  ...props.settings.getDetails(),
});

const saveSettings = () => {
  // Validate form
  if (!settingsForm.name || !settingsForm.gender || !settingsForm.skillLevel) {
    alert('Please fill in all fields');
    return;
  }

  props.settings.updateDetails({
    name: settingsForm.name,
    gender: settingsForm.gender,
    skillLevel: settingsForm.skillLevel,
  });

  isSettingsPage.value = false;
};

const saveGoalsAndGenerateCourse = async () => {
  // Validate form
  if (!goalsForm.goal || !goalsForm.timeLimit || !settingsForm.skillLevel) {
    alert('Please fill in all fields in both forms.');
    return;
  }

  props.settings.updateDetails({
    goal: goalsForm.goal,
    timeLimit: goalsForm.timeLimit,
  });

  isLoading.value = true;
  await props.settings.generateCourse();
  isLoading.value = false;

  if (props.settings.getDetails().isCourseLoaded) {
    router.push('/course');
  }
};
</script>

<template>
  <div class="h-full w-3/4 xl:w-1/2 mx-auto flex flex-col gap-y-4">
    <div class="space-y-2 text-center" v-if="isSettingsPage">
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
        >Configure your interface and AI interactions.</motion.p
      >
    </div>
    <div class="space-y-2 text-center" v-else>
      <motion.h1
        class="text-4xl font-primary text-emerald font-semibold"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        >Course Generation</motion.h1
      >
      <motion.p
        class="font-secondary"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.1 }"
        >Generate a course based on your preferences and goals.</motion.p
      >
    </div>

    <motion.form
      @submit.prevent="saveSettings"
      class="space-y-6 p-4 bg-neutral-900 rounded-md border border-neutral-700"
      :initial="{ opacity: 0, x: -10 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ delay: 0.2 }"
      v-if="isSettingsPage"
    >
      <!-- Name Field -->
      <div class="flex flex-col gap-y-3">
        <label for="name" class="max-w-max text-xs font-medium font-tertiary uppercase">Display Name</label>
        <input
          id="name"
          v-model="settingsForm.name"
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
            :class="{ 'bg-emerald/20! border-emerald! text-white': settingsForm.gender === 'male' }"
          >
            <input v-model="settingsForm.gender" type="radio" value="male" class="appearance-none" />
            <span class="ml-2">Male</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': settingsForm.gender === 'female' }"
          >
            <input v-model="settingsForm.gender" type="radio" value="female" class="appearance-none" />
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
            :class="{ 'bg-emerald/20! border-emerald! text-white': settingsForm.skillLevel === 'beginner' }"
          >
            <input v-model="settingsForm.skillLevel" type="radio" value="beginner" class="appearance-none" />
            <span class="ml-2">Beginner</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': settingsForm.skillLevel === 'intermediate' }"
          >
            <input v-model="settingsForm.skillLevel" type="radio" value="intermediate" class="appearance-none" />
            <span class="ml-2">Intermediate</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': settingsForm.skillLevel === 'advanced' }"
          >
            <input v-model="settingsForm.skillLevel" type="radio" value="advanced" class="appearance-none" />
            <span class="ml-2">Advanced</span>
          </label>
        </div>
      </div>

      <!-- Save Button -->
      <button type="submit" class="w-full bg-emerald font-primary rounded-md py-1.5 text-black cursor-pointer">
        Save and Continue
      </button>
    </motion.form>

    <motion.form
      @submit.prevent="saveGoalsAndGenerateCourse"
      :initial="{ opacity: 0, x: -10 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ delay: 0.2 }"
      class="space-y-6 p-4 bg-neutral-900 rounded-md border border-neutral-700 overflow-y-auto max-h-88.25 scrollbar-thumb-emerald"
      v-else
    >
      <div class="flex flex-col gap-y-3 mb-10">
        <label class="max-w-max text-xs font-medium font-tertiary uppercase">Learning Goal</label>
        <div class="flex flex-col gap-4 font-primary text-sm">
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.goal === 'Learn traditional rhythms' }"
          >
            <input v-model="goalsForm.goal" type="radio" value="Learn traditional rhythms" class="appearance-none" />
            <span class="ml-2">Learn traditional rhythms</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.goal === 'Learn about the history and culture' }"
          >
            <input v-model="goalsForm.goal" type="radio" value="Learn about the history and culture" class="appearance-none" />
            <span class="ml-2">Learn about the history and culture</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.goal === 'Understand how the darbuka works' }"
          >
            <input v-model="goalsForm.goal" type="radio" value="Understand how the darbuka works" class="appearance-none" />
            <span class="ml-2">Understand how the darbuka works</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.goal === 'Just explore and have fun' }"
          >
            <input v-model="goalsForm.goal" type="radio" value="Just explore and have fun" class="appearance-none" />
            <span class="ml-2">Just explore and have fun</span>
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-y-3 mb-10">
        <label class="max-w-max text-xs font-medium font-tertiary uppercase">Time Available to Learn</label>
        <div class="flex flex-col gap-4 font-primary text-sm">
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.timeLimit === '10-15 minutes' }"
          >
            <input v-model="goalsForm.timeLimit" type="radio" value="10-15 minutes" class="appearance-none" />
            <span class="ml-2">10-15 minutes per day</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.timeLimit === '20-30 minutes' }"
          >
            <input v-model="goalsForm.timeLimit" type="radio" value="20-30 minutes" class="appearance-none" />
            <span class="ml-2">20-30 minutes per day</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.timeLimit === '30-60 minutes' }"
          >
            <input v-model="goalsForm.timeLimit" type="radio" value="30-60 minutes" class="appearance-none" />
            <span class="ml-2">30-60 minutes per day</span>
          </label>
          <label
            class="cursor-pointer flex items-center w-full py-2 rounded-md justify-center border border-transparent duration-100 text-neutral-500 bg-neutral-800"
            :class="{ 'bg-emerald/20! border-emerald! text-white': goalsForm.timeLimit === '60 minutes +' }"
          >
            <input v-model="goalsForm.timeLimit" type="radio" value="60 minutes +" class="appearance-none" />
            <span class="ml-2">60 minutes + per day</span>
          </label>
        </div>
      </div>

      <!-- Save Button -->
      <button
        type="submit"
        class="w-full bg-emerald font-primary rounded-md py-1.5 text-black cursor-pointer flex items-center justify-center gap-x-2"
        :class="{ 'bg-emerald/80!': isLoading }"
      >
        <span>Save and Generate Course</span>
        <spinner class="stroke-black animate-spin" v-if="isLoading"></spinner>
      </button>
    </motion.form>

    <div class="p-2 flex gap-x-4 font-primary text-center">
      <motion.div
        class="cursor-pointer w-full px-4 py-1.5 rounded-md border-neutral-700 border bg-neutral-800 hover:bg-emerald/20 hover:text-emerald hover:border-emerald duration-100 transition-colors"
        :class="{ 'text-emerald! border-emerald! bg-emerald/20!': isSettingsPage }"
        @click="isSettingsPage = true"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.3 }"
      >
        Settings
      </motion.div>
      <motion.div
        class="cursor-pointer w-full px-4 py-1.5 rounded-md border-neutral-700 border bg-neutral-800 hover:bg-emerald/20 hover:text-emerald hover:border-emerald duration-100 transition-colors"
        :class="{ 'text-emerald! border-emerald! bg-emerald/20!': !isSettingsPage }"
        @click="isSettingsPage = false"
        :initial="{ opacity: 0, x: 10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.3 }"
      >
        Course Generation
      </motion.div>
    </div>

    <div class="font-primary text-center" v-if="isSettingsPage">
      <motion.h3 class="mt-4 mb-1" :initial="{ opacity: 0, x: -10 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.4 }">
        Settings Note:
      </motion.h3>
      <motion.p
        class="text-sm text-neutral-300"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.5 }"
      >
        You are required to fill up this information before gaining access to normal and learning chats. Your information is used
        to provide personalized answers.
      </motion.p>
    </div>

    <div class="font-primary text-center" v-else>
      <motion.h3 class="mt-4 mb-1" :initial="{ opacity: 0, x: -10 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.4 }">
        Course Generation Note:
      </motion.h3>
      <motion.p
        class="text-sm text-neutral-300"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: 0.5 }"
      >
        You are required to fill up this information before gaining access to learning chats. Your information is used to provide
        personalized answers.
      </motion.p>
    </div>
  </div>
</template>

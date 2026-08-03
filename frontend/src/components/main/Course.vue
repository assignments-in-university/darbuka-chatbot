<script setup lang="ts">
import Lock from '@/assets/icons/Lock.vue';
import Spinner from '@/assets/icons/Spinner.vue';
import Tick from '@/assets/icons/Tick.vue';
import { Settings } from '@/utils/Settings';
import { motion } from 'motion-v';
import { computed, ref } from 'vue';

const props = defineProps<{
  settings: Settings;
}>();

const isLoading = ref(false);

const course = computed(() => props.settings.getDetails().course);
const currentLessonId = computed(() => props.settings.getDetails().currentLessonId);
const totalCourseDuration = computed(() => course.value?.lessons.reduce((acc, val) => val.estimatedMinutes + acc, 0) || 0);

const updateCurrentLesson = (currentLessonId: number) => {
  props.settings.updateDetails({ currentLessonId });
};

const generateCourse = async () => {
  isLoading.value = true;
  await props.settings.generateCourse();
  isLoading.value = false;
};
</script>

<template>
  <!-- -------------------- -->
  <!-- COURSE NOT GENERATED -->
  <!-- -------------------- -->
  <div class="size-full flex items-center justify-center text-center font-primary" v-if="!settings.getDetails().isCourseLoaded">
    <motion.div
      class="p-10 bg-neutral-900 rounded-md border border-neutral-800"
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
    >
      <motion.div
        class="text-4xl font-semibold text-verdant flex flex-col items-center gap-4 mb-4"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.1 }"
      >
        <div class="p-4 rounded-md border border-neutral-700 bg-neutral-800">
          <Lock class="stroke-verdant size-10"></Lock>
        </div>
        <h2>Generate a Course First</h2>
      </motion.div>
      <motion.p
        class="text-lg max-w-2xl mb-6"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.2 }"
      >
        To get started and view your course, generate one first by going to the filling up your settings and pressing "Generate
        Course" afterwards.
      </motion.p>
      <motion.button
        class="cursor-pointer text-lg rounded-md px-10 py-1.5 bg-verdant text-black font-medium"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.3 }"
        @click="$router.push('/settings')"
      >
        Go To Settings
      </motion.button>
    </motion.div>
  </div>

  <!-- -------------- -->
  <!-- COURSE DETAILS -->
  <!-- -------------- -->
  <div class="w-full h-[calc(100vh-96px)] overflow-y-auto scrollbar-thumb-emerald p-4" v-else>
    <motion.div
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      class="w-full rounded-md border border-neutral-800 bg-neutral-900 p-10 relative overflow-hidden group hover:border-emerald duration-150 bg-[repeating-radial-gradient(var(--color-neutral-700)_0,var(--color-neutral-700)_1px,transparent_1px,transparent_100%)] bg-size-[20px_20px] mb-10 transition-colors"
    >
      <div class="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-4 font-primary">
        <motion.span
          class="px-4 py-1 bg-emerald/10 border border-emerald rounded-md text-emerald"
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ delay: 0.1 }"
        >
          {{ totalCourseDuration }} minutes of learning
        </motion.span>
        <motion.span
          class="hidden sm:block"
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ delay: 0.2 }"
        >
          >
        </motion.span>
        <motion.span
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ delay: 0.3 }"
          class="italic"
        >
          {{ course?.lessons.length }} Lessons
        </motion.span>
      </div>
      <motion.h2
        class="font-primary lg:max-w-1/2 text-3xl sm:text-4xl font-medium mb-4 text-emerald"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.1 }"
      >
        {{ course?.title }}
      </motion.h2>
      <motion.p
        class="font-primary lg:max-w-1/2 text-lg font-medium text-neutral-300"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.2 }"
      >
        {{ course?.description }}
      </motion.p>

      <div class="absolute size-72 -rotate-10 -right-24 -bottom-20 opacity-5 group-hover:opacity-10 duration-150 select-none">
        <img src="../../assets/images/logo.jpg" alt="" class="size-full object-fill" />
      </div>
    </motion.div>

    <div class="flex gap-x-4 lg:px-10 md:max-w-3xl mx-auto">
      <motion.div
        class="w-24 hidden sm:block"
        :initial="{ height: 0 }"
        :animate="{ height: 'auto' }"
        :transition="{ delay: 0.2, duration: 1 }"
      >
        <div class="w-1 bg-neutral-700 rounded-full h-full mx-auto"></div>
      </motion.div>
      <div class="w-full space-y-4 sm:space-y-24 py-10">
        <motion.div
          class="relative font-primary bg-neutral-900 p-4 rounded-md border border-neutral-800 cursor-pointer hover:border-emerald duration-150 transition-colors"
          :class="{ 'border-emerald!': currentLessonId === lesson.id }"
          :initial="{ x: 10, opacity: 0 }"
          :animate="{ x: 0, opacity: 1 }"
          :transition="{ delay: idx * 0.05 }"
          @click="updateCurrentLesson(lesson.id)"
          v-for="(lesson, idx) in course?.lessons"
          :key="lesson.title + idx"
        >
          <div class="flex gap-2 mb-2 flex-wrap sm:flex-nowrap">
            <span
              class="px-3 py-0.5 text-emerald-500 bg-emerald-500/20 border border-emerald-500 rounded-md capitalize sm:hidden flex gap-x-2 items-center"
              v-if="currentLessonId === lesson.id"
            >
              <div class="size-2 rounded-full bg-emerald-500"></div>
              Current Lesson
            </span>
            <span
              class="px-3 py-0.5 text-black bg-emerald-500 rounded-md capitalize sm:hidden flex gap-x-1 items-center"
              v-if="idx < (course?.lessons?.findIndex((l) => l.id === currentLessonId) as number)"
            >
              <Tick class="size-5"></Tick>
              Completed
            </span>
            <span
              class="px-3 py-0.5 text-white bg-neutral-800 rounded-md capitalize sm:hidden flex gap-x-1 items-center border border-neutral-700"
              v-else
              v-if="idx > (course?.lessons?.findIndex((l) => l.id === currentLessonId) as number)"
            >
              <Lock class="stroke-white size-5"></Lock>
              To Be Completed
            </span>
            <span class="px-4 py-0.5 text-black bg-emerald rounded-md capitalize">
              {{ lesson.difficulty }}
            </span>
            <span class="px-4 py-0.5 text-emerald bg-emerald/15 border border-emerald rounded-md capitalize">
              {{ lesson.estimatedMinutes }} minutes
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-medium text-verdant mb-4">{{ lesson.title }}</h3>
          <p>{{ lesson.description }}</p>

          <!-- Is Completed Indicator -->
          <div
            class="absolute size-12 md:size-16 border-2 border-emerald bg-emerald rounded-full top-1/2 -translate-y-1/2 left-0 -translate-x-[calc(100%+34px)] md:-translate-x-[calc(100%+26px)] shadow-[0px_0px_20px_10px] shadow-verdant/10 hidden sm:flex items-center justify-center duration-150 transition-colors"
            :class="{
              'border-emerald': currentLessonId === lesson.id,
              'bg-coal!': idx >= (course?.lessons?.findIndex((l) => l.id === currentLessonId) as number),
              'border-neutral-700': idx > (course?.lessons?.findIndex((l) => l.id === currentLessonId) as number),
            }"
          >
            <Tick class="size-10" v-if="idx < (course?.lessons?.findIndex((l) => l.id === currentLessonId) as number)"></Tick>
            <Lock
              class="size-8 stroke-emerald"
              v-if="idx > (course?.lessons?.findIndex((l) => l.id === currentLessonId) as number)"
            ></Lock>
            <div class="size-5 rounded-full bg-emerald" v-if="currentLessonId === lesson.id"></div>
          </div>
        </motion.div>
      </div>
    </div>

    <button
      class="w-full md:max-w-2xl font-primary bg-emerald text-black px-4 py-2 rounded-md mt-12 mx-auto font-medium cursor-pointer flex gap-x-2 justify-center items-center duration-150 transition-all"
      :class="{ 'bg-emerald/20! pointer-events-none': isLoading }"
      @click="generateCourse"
    >
      <span>Regenerate Course</span>
      <Spinner class="animate-spin size-5" v-if="isLoading"></Spinner>
    </button>
  </div>
</template>

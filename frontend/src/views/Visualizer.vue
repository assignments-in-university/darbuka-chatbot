<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnimatePresence, motion } from 'motion-v';
import UpArrow from '@/assets/icons/UpArrow.vue';
import Audio from '@/assets/icons/Audio.vue';
import Mute from '@/assets/icons/Mute.vue';

const canvas = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let animationId = 0;

interface CameraView {
  name: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const views: CameraView[] = [
  {
    name: 'Head',
    position: new THREE.Vector3(-2.76, 3.72, -1.87),
    target: new THREE.Vector3(0, 0, 0),
  },

  {
    name: 'Body',
    position: new THREE.Vector3(2.35, 1.68, -4.07),
    target: new THREE.Vector3(0, 0, 0),
  },

  {
    name: 'Base',
    position: new THREE.Vector3(4.95, -0.618, -0.282),
    target: new THREE.Vector3(0, 0, 0),
  },
];

const currentView = ref(-1);

function goToView(index: number) {
  const view = views[index]!;

  animateCamera(view.position, view.target);

  controls.target.copy(view.target);

  controls.update();
}

function nextView() {
  currentView.value++;

  if (currentView.value >= views.length) currentView.value = 0;

  goToView(currentView.value);
}

function previousView() {
  currentView.value--;

  if (currentView.value < 0) currentView.value = views.length - 1;

  goToView(currentView.value);
}

function animateCamera(destination: THREE.Vector3, target: THREE.Vector3) {
  const start = camera.position.clone();
  const startTarget = controls.target.clone();

  let progress = 0;

  function easeInOut(t: number) {
    return t * t * (3 - 2 * t);
  }

  function move() {
    progress = Math.min(progress + 0.03, 1);

    const eased = easeInOut(progress);

    camera.position.lerpVectors(start, destination, eased);
    controls.target.lerpVectors(startTarget, target, eased);

    controls.update();

    if (progress < 1) {
      requestAnimationFrame(move);
    }
  }

  move();
}

onMounted(() => {
  scene = new THREE.Scene();

  scene.background = null;

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);

  camera.position.set(0, 2, -5);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value!,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  const ambient = new THREE.AmbientLight(0xffffff, 2);

  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 3);

  directional.position.set(5, 10, 7);

  scene.add(directional);

  const loader = new GLTFLoader();

  loader.load('/models/drum.glb', (gltf) => {
    const model = gltf.scene;

    model.scale.setScalar(15);

    model.rotateY(-1.67);
    const box = new THREE.Box3().setFromObject(model);

    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);

    scene.add(model);

    window.addEventListener('keydown', handleKey);
  });

  function handleKey(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      nextView();
    }

    if (event.key === 'ArrowLeft') {
      previousView();
    }
  }

  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;

  controls.dampingFactor = 0.05;

  controls.enablePan = false;

  controls.minDistance = 4;

  controls.maxDistance = 5;

  controls.addEventListener('start', updateCameraView);

  animate();
});

function animate() {
  animationId = requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  console.log(camera.position);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCameraView() {
  currentView.value = -1;
}

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(true);

const toggleAudio = () => {
  if (!audio.value) return;
  if (audio.value.paused) {
    audio.value.play();
    isPlaying.value = true;
  } else {
    audio.value.pause();
    isPlaying.value = false;
  }
};

watch(currentView, (v) => console.log(v));

window.addEventListener('resize', onResize);

onUnmounted(() => {
  cancelAnimationFrame(animationId);

  window.removeEventListener('resize', onResize);

  controls.removeEventListener('start', updateCameraView);
  controls.dispose();

  renderer.dispose();
});
</script>

<template>
  <div
    class="relative w-screen h-screen overflow-hidden bg-coal bg-[repeating-radial-gradient(var(--color-neutral-800)_0,var(--color-neutral-800)_1px,transparent_1px,transparent_100%)] bg-size-[20px_20px] font-primary"
  >
    <canvas ref="canvas" class="cursor-grab active:cursor-grabbing"></canvas>

    <!-- --------- -->
    <!-- DRUM HEAD -->
    <!-- --------- -->
    <AnimatePresence>
      <div v-if="currentView === 0">
        <!-- LABEL -->
        <div class="absolute left-11/20 top-3/20 w-3/20">
          <svg viewBox="0 0 148 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M11 6.00001L147 6.00001L147 45"
              stroke="#566511"
              :initial="{ pathLength: 0 }"
              :animate="{ pathLength: 1 }"
              :exit="{ pathLength: 0 }"
            />
            <motion.path
              d="M11 5.5C11 8.53757 8.53757 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0C8.53757 0 11 2.46243 11 5.5ZM0.75333 5.5C0.75333 8.12151 2.87849 10.2467 5.5 10.2467C8.12151 10.2467 10.2467 8.12151 10.2467 5.5C10.2467 2.87849 8.12151 0.75333 5.5 0.75333C2.87849 0.75333 0.75333 2.87849 0.75333 5.5Z"
              class="fill-black"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
            <motion.circle
              cx="5.5"
              cy="5.5"
              r="2.5"
              class="fill-black"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
          </svg>
        </div>

        <!-- CONTENT -->
        <div class="absolute top-1/4 left-2/3">
          <motion.h2
            class="text-emerald font-semibold text-3xl mb-2"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 10 }"
            :transition="{ delay: 0.1 }"
            >The Drum Head</motion.h2
          >
          <div class="space-y-2 text-neutral-300 w-80">
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.2 }"
              >The darbuka drum head is the vital striking surface stretched across the top of the goblet-shaped
              instrument.</motion.p
            >
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.3 }"
              >It is crafted from traditional animal skins like goat or fish, or modern synthetic plastic materials.</motion.p
            >
            <!-- -2.76, 3.72, -1.87 -->
          </div>
        </div>
      </div>
    </AnimatePresence>

    <!-- --------- -->
    <!-- DRUM BODY -->
    <!-- --------- -->
    <AnimatePresence>
      <div v-if="currentView === 1">
        <!-- LABEL -->
        <div class="absolute left-6/20 top-6/20 w-3/20 -scale-x-100">
          <svg viewBox="0 0 148 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M11 6.00001L147 6.00001L147 45"
              stroke="#566511"
              :initial="{ pathLength: 0 }"
              :animate="{ pathLength: 1 }"
              :exit="{ pathLength: 0 }"
            />
            <motion.path
              d="M11 5.5C11 8.53757 8.53757 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0C8.53757 0 11 2.46243 11 5.5ZM0.75333 5.5C0.75333 8.12151 2.87849 10.2467 5.5 10.2467C8.12151 10.2467 10.2467 8.12151 10.2467 5.5C10.2467 2.87849 8.12151 0.75333 5.5 0.75333C2.87849 0.75333 0.75333 2.87849 0.75333 5.5Z"
              class="fill-emerald"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
            <motion.circle
              cx="5.5"
              cy="5.5"
              r="2.5"
              class="fill-emerald"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
          </svg>
        </div>

        <!-- CONTENT -->
        <div class="absolute top-2/5 left-1/10 text-right">
          <motion.h2
            class="text-emerald font-semibold text-3xl mb-2"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 10 }"
            :transition="{ delay: 0.1 }"
            >The Darbuka Body</motion.h2
          >
          <div class="space-y-2 text-neutral-300 w-80">
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.2 }"
              >The darbuka has a hollow, goblet-shaped body that helps project its sound.</motion.p
            >
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.3 }"
              >Traditional versions are made of clay, while modern ones often use metals like aluminum.</motion.p
            >
            <!-- 2.35, 1.68, -4.07 -->
          </div>
        </div>

        <!-- LABEL (NECK) -->
        <div class="absolute left-21/40 top-11/20 w-3/20">
          <svg viewBox="0 0 148 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M11 6.00001L147 6.00001"
              stroke="#566511"
              :initial="{ pathLength: 0 }"
              :animate="{ pathLength: 1 }"
              :exit="{ pathLength: 0 }"
            />
            <motion.path
              d="M11 5.5C11 8.53757 8.53757 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0C8.53757 0 11 2.46243 11 5.5ZM0.75333 5.5C0.75333 8.12151 2.87849 10.2467 5.5 10.2467C8.12151 10.2467 10.2467 8.12151 10.2467 5.5C10.2467 2.87849 8.12151 0.75333 5.5 0.75333C2.87849 0.75333 0.75333 2.87849 0.75333 5.5Z"
              class="fill-emerald"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
            <motion.circle
              cx="5.5"
              cy="5.5"
              r="2.5"
              class="fill-emerald"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
          </svg>
        </div>

        <!-- CONTENT (NECK) -->
        <div class="absolute top-5/10 left-7/10">
          <motion.h2
            class="text-emerald font-semibold text-3xl mb-2"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 10 }"
            :transition="{ delay: 0.1 }"
            >The Darbuka Neck</motion.h2
          >
          <div class="space-y-2 text-neutral-300 w-80">
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.2 }"
              >This narrow section of the drum is called the waist or the neck.</motion.p
            >
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.3 }"
              >Its narrow shape affects the way air travels through the drum, which significantly effects the sounds
              produced.</motion.p
            >
            <!-- 2.35, 1.68, -4.07 -->
          </div>
        </div>
      </div>
    </AnimatePresence>

    <!-- --------- -->
    <!-- DRUM BASE -->
    <!-- --------- -->
    <AnimatePresence>
      <div v-if="currentView === 2">
        <!-- LABEL -->
        <div class="absolute left-11/20 top-13/20 w-3/20 -scale-y-100">
          <svg viewBox="0 0 148 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M11 6.00001L147 6.00001L147 45"
              stroke="#566511"
              :initial="{ pathLength: 0 }"
              :animate="{ pathLength: 1 }"
              :exit="{ pathLength: 0 }"
            />
            <motion.path
              d="M11 5.5C11 8.53757 8.53757 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0C8.53757 0 11 2.46243 11 5.5ZM0.75333 5.5C0.75333 8.12151 2.87849 10.2467 5.5 10.2467C8.12151 10.2467 10.2467 8.12151 10.2467 5.5C10.2467 2.87849 8.12151 0.75333 5.5 0.75333C2.87849 0.75333 0.75333 2.87849 0.75333 5.5Z"
              class="fill-emerald"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
            <motion.circle
              cx="5.5"
              cy="5.5"
              r="2.5"
              class="fill-emerald"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :exit="{ scale: 0 }"
            />
          </svg>
        </div>

        <!-- CONTENT -->
        <div class="absolute top-9/20 left-13/20">
          <motion.h2
            class="text-emerald font-semibold text-3xl mb-2"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 10 }"
            :transition="{ delay: 0.1 }"
            >The Drum Base</motion.h2
          >
          <div class="space-y-2 text-neutral-300 w-80">
            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ delay: 0.2 }"
              >The base of the drum is flared outwards to allow sound to escape clearly, as well as to help stabilize the drum on
              your leg.</motion.p
            >
            <!-- 0.89, -0.94, 4.82 -->
          </div>
        </div>
      </div>
    </AnimatePresence>

    <button
      @click="$router.push('/')"
      class="absolute top-5 left-5 z-20 bg-emerald/20 text-white border border-emerald rounded-md px-4 py-1.5 shadow flex items-center gap-x-1 cursor-pointer duration-100 hover:bg-emerald/40"
    >
      <UpArrow class="-rotate-90 size-5 stroke-white"></UpArrow>
      <span>Back To Chatbot</span>
    </button>

    <audio src="audios/darbuka.mp3" autoplay ref="audio"></audio>
    <div
      class="absolute top-5 right-5 z-20 bg-emerald/20 text-white border border-emerald rounded-md size-10 flex items-center justify-center aspect-square cursor-pointer"
      @click="toggleAudio"
    >
      <Audio class="size-5 stroke-emerald" v-if="isPlaying"></Audio>
      <Mute class="size-5 stroke-emerald" v-else></Mute>
    </div>

    <div class="absolute bottom-5 right-5 z-20 flex items-center gap-2">
      <p class="text-white w-40">Use the arrow keys to navigate views.</p>
      <div
        class="bg-emerald/20 text-white border border-emerald rounded-md size-10 flex items-center justify-center aspect-square animate-pulse cursor-pointer"
        @click="nextView"
      >
        <UpArrow class="size-5 stroke-white -rotate-90"></UpArrow>
      </div>
      <div
        class="bg-emerald/20 text-white border border-emerald rounded-md size-10 flex items-center justify-center aspect-square animate-pulse cursor-pointer"
        @click="previousView"
      >
        <UpArrow class="size-5 stroke-white rotate-90"></UpArrow>
      </div>
    </div>
  </div>
</template>

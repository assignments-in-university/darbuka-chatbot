<script setup lang="ts">
import { ref } from 'vue';

const userMessage = ref('');
const selectedCategory = ref<string | null>(null);

const categories = [
  {
    id: 'rhythm',
    title: 'Explore rhythm & beats',
    description: 'Learn about maqam scales, time signatures, and Middle Eastern percussion traditions.',
    icon: '♫',
    tag: 'Music Theory',
  },
  {
    id: 'culture',
    title: 'Cultural Heritage',
    description: 'Discover stories, history, and context behind the darbuka and its music across cultures',
    icon: '🎼',
    tag: 'Culture',
  },
  {
    id: 'learning',
    title: 'Learning resources',
    description: 'Get curated lessons, technique breakdowns, and practice routines for all skill levels.',
    icon: '📚',
    tag: 'Education',
  },
  {
    id: 'practice',
    title: 'Practice with me',
    description: 'Work through exercises, get feedback, and build your rhythmic vocabulary step by step',
    icon: '🎙️',
    tag: 'Practice',
  },
];

const quickActions = [
  'What is darbuka?',
  'Teach me a rhythm',
  'History of the goblet drum',
  'Maqam scales explained',
  'Play a pattern',
];

const recentChats = ['What is a darbuka?', 'Maqam scales intro', 'Doum tek kat patterns', 'Rythm of Baladi'];

const handleCategoryClick = (categoryId: string) => {
  selectedCategory.value = categoryId;
};

const handleQuickAction = (action: string) => {
  userMessage.value = action;
};

const handleSendMessage = () => {
  if (userMessage.value.trim()) {
    console.log('Sending:', userMessage.value);
    userMessage.value = '';
  }
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#f5ede3]">
    <!-- Sidebar -->
    <div class="w-[220px] bg-[#efe5d8] border-r border-[#d4c4b0] flex flex-col px-3 py-4 flex-shrink-0">
      <div class="text-[#c97d4a] text-[18px] font-bold px-2 pb-4">
        Darbuka <span class="text-[#999999] text-[13px] font-normal ml-1">AI</span>
      </div>

      <button
        class="bg-[#c97d4a] text-white rounded-lg px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between mb-5 cursor-pointer border-none"
      >
        New chat <span class="text-lg">›</span>
      </button>

      <div class="text-[#999999] text-[10px] font-semibold tracking-widest uppercase px-2 mb-2">Recent Chats</div>
      <div
        v-for="(chat, i) in recentChats"
        :key="i"
        class="text-[#888888] text-[12px] px-2 py-1.5 rounded-md cursor-pointer mb-0.5 hover:bg-[#e8dcc8] hover:text-[#333333] transition-colors"
      >
        {{ chat }}
      </div>
    </div>

    <!-- Main Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <div class="flex items-center justify-between px-5 py-3 bg-[#efe5d8] border-b border-[#d4c4b0] flex-shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-[#c97d4a] rounded-full flex items-center justify-center text-base">🎵</div>
          <div>
            <div class="text-[14px] font-semibold text-[#333333]">Darbuka AI</div>
            <div class="text-[11px] text-[#c97d4a] flex items-center gap-1">
              <span class="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
            </div>
          </div>
        </div>
        <button
          class="text-[#888888] bg-[#e8dcc8] border border-[#d4c4b0] rounded-md w-8 h-8 flex items-center justify-center cursor-pointer tracking-widest"
        >
          ···
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto flex flex-col items-center px-5 py-10">
        <div class="text-center mb-8">
          <h1 class="text-[28px] font-bold text-black m-0 mb-3 tracking-[-0.5px]">What would would you like to explore today?</h1>
          <p class="text-xs text-[#999999] max-w-150 leading-[1.6] m-0">
            Ask me anything about music, rhythm, or culture - I'm here to help you connect with deep tradition of the darbuka.
          </p>
        </div>

        <!-- Category Cards Grid -->
        <div class="grid grid-cols-2 gap-6 max-w-225 w-full mb-8 max-[768px]:grid-cols-1">
          <div
            v-for="category in categories"
            :key="category.id"
            class="bg-[#efe5d8] border-2 border-[#d4c4b0] rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col hover:border-[#c97d4a] hover:bg-[#e8dcc8]"
            :class="{ 'border-[#c97d4a] bg-[#e8dcc8]': selectedCategory === category.id }"
            @click="handleCategoryClick(category.id)"
          >
            <div class="text-[28px] mb-4 bg-[#c97d4a] w-12 h-12 rounded-lg flex items-center justify-center">
              {{ category.icon }}
            </div>
            <h3 class="text-[15px] font-semibold text-[#333333] m-0 mb-2 flex items-center gap-1">
              {{ category.title }} <span class="text-lg text-[#999999]">›</span>
            </h3>
            <p class="text-xs text-[#888888] m-0 mb-3 leading-normal flex-1">
              {{ category.description }}
            </p>
            <div
              class="inline-block bg-[#d99a4a] text-white px-3.5 py-1.5 rounded-[20px] text-[11px] font-semibold w-fit cursor-pointer transition-all duration-200 hover:bg-[#c97d4a] hover:scale-105"
            >
              {{ category.tag }}
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-3 justify-center max-w-175 mb-8 max-[768px]:flex-col">
          <button
            v-for="(action, index) in quickActions"
            :key="index"
            class="rounded-[20px] px-4 py-2 text-xs cursor-pointer transition-all duration-200 whitespace-nowrap max-[768px]:w-full"
            :class="
              action === 'Play a pattern'
                ? 'bg-[#d99a4a] text-white border border-[#d99a4a] hover:bg-[#c97d4a] hover:border-[#c97d4a]'
                : 'bg-white text-[#888888] border border-[#d4c4b0] hover:border-[#c97d4a] hover:text-[#c97d4a]'
            "
            @click="handleQuickAction(action)"
          >
            {{ action === 'Play a pattern' ? '▶ ' + action : action }}
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-full h-px bg-[#d4c4b0]"></div>

      <!-- Chat Input -->
      <div class="w-full px-5 py-3 bg-[#f5ede3]">
        <div class="flex items-center gap-2.5 bg-[#e8dcc8] rounded-[20px] px-3 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <textarea
            v-model="userMessage"
            rows="1"
            class="flex-1 border-none outline-none bg-transparent text-[13px] text-[#888888] px-2 py-0 resize-none leading-[1.4] overflow-y-auto placeholder:text-[#cccccc] self-center"
            placeholder="Ask me anything about music, rhythm, or culture..."
            @input="
              (e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
              }
            "
          ></textarea>
          <button
            class="bg-transparent border-none cursor-pointer text-base px-2 py-1.5 transition-transform duration-200 hover:scale-110 shrink-0 text-[#c97d4a]"
            @click="handleSendMessage"
          >
            ➤
          </button>
        </div>
        <p class="text-[10px] text-[#999999] text-center mt-2">Darbuka AI · powered by cultural knowledge</p>
      </div>
    </div>
  </div>
</template>

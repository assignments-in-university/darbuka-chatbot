import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Index.vue'),
      children: [
        // NEW CHAT
        {
          path: '/chat',
          component: () => import('../components/main/Chat.vue'),
        },
        {
          path: '/chat/new',
          component: () => import('../components/main/ChatType.vue'),
        },
        // EXISTING CHATS
        {
          path: '/chat/:id',
          component: () => import('../components/main/Chat.vue'),
        },
        {
          path: '/help',
          component: () => import('../components/main/Help.vue'),
        },
        {
          path: '/settings',
          component: () => import('../components/main/Settings.vue'),
        },
      ],
    },
  ],
});

export default router;

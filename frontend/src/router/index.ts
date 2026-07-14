import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Index.vue'),
      redirect: '/chat/new',
      children: [
        // DEFAULT ROUTE FOR NEW CHATS
        {
          path: '/chat',
          redirect: '/chat/new',
        },
        {
          path: '/chat/new',
          component: () => import('../components/main/Chat.vue'),
        },
        // EXISTING CHATS
        {
          path: '/chat/:id',
          component: () => import('../components/main/Chat.vue'),
        },
      ],
    },
  ],
});

export default router;

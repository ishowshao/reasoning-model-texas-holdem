import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HeadsUpRules from '../views/HeadsUpRules.vue'
import PlaybackView from '../views/PlaybackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/playback',
      name: 'playback',
      component: PlaybackView,
    },
    {
      path: '/heads-up-rules',
      name: 'heads-up-rules',
      component: HeadsUpRules,
    },
  ],
})

export default router

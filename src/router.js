import { createRouter, createWebHashHistory } from 'vue-router'

// meta.title = título do cabeçalho (sem título = cabeçalho escondido)
const routes = [
  { path: '/', name: 'inicio', component: () => import('./views/HomeView.vue') },
  { path: '/menu', component: () => import('./views/MenuView.vue'), meta: { title: 'Cartões de enfrentamento' } },
  { path: '/cartoes', component: () => import('./views/CardsView.vue'), meta: { title: 'Meus cartões' } },
  { path: '/biblioteca', component: () => import('./views/LibraryView.vue'), meta: { title: 'Biblioteca' } },
  { path: '/config', component: () => import('./views/SettingsView.vue'), meta: { title: 'Configurações' } },
  { path: '/respiracao', component: () => import('./views/BreathingView.vue'), meta: { title: 'Respiração 4-7-8' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]
const router = createRouter({ history: createWebHashHistory(), routes, scrollBehavior: () => ({ top: 0 }) })

export default router

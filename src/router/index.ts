import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/aluno',
      name: 'aluno',
      component: () => import('../views/AlunoView.vue'),
    },
    {
      path: '/curso',
      name: 'curso',
      component: () => import('../views/CursoView.vue'),
    },
    {
      path: '/disciplina',
      name: 'disciplina',
      component: () => import('../views/DisciplinaView.vue'),
    },
    {
      path: '/matricula',
      name: 'matricula',
      component: () => import('../views/MatriculaView.vue'),
    },
  ],
})

export default router

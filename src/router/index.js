import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import AuthLayout from '../views/AuthLayout.vue'
import SidebarLayout from '../views/SidebarLayout.vue'
import ProjectView from '../views/ProjectView.vue'
import TaskModal from '../views/TaskModal.vue'
import ErrorDisplayView from '../views/ErrorDisplayView.vue'

const routes = [
  {
  // Auth Layout
     path: '/auth',
     name: 'AuthLayout',
     component: AuthLayout,
     children: [
      {
        path: '',
        name: 'DefaultAuthRedirect',
        redirect: { name: 'RegisterView' }
      },
      {
        path: 'register',
        name: 'RegisterView',
        component: RegisterView,
        beforeEnter: () => {
          localStorage.removeItem('access_token')
          
        }
      },
      {
        path: 'login',
        name: 'LoginView',
        component: LoginView,
        beforeEnter: () => {
          localStorage.removeItem('access_token')
          
        }
      },
     ]
  },
  {
  // App Layout
    path: '/',
    name: 'SidebarLayout',
    component: SidebarLayout,
    children: [
      {
        path: '/',
        name: 'HomeView',
        component: HomeView,
        meta: { requiresAuth: true }
      },
      {
        path: '/:projectId',
        name: 'ProjectView',
        component: ProjectView,
        props: true,
        meta: { requiresAuth: true },
        children: [
          {
            path: 'task/:id/:taskIndex/:columnIndex',
            name: 'TaskModal',
            meta: { requiresAuth: true },
            component: TaskModal,
              props: true,
            }
        ]
      },
    ]
  },
  {
    path: '/error/:status',
    name: 'ErrorDisplayView',
    component: ErrorDisplayView,
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'ErrorDisplayView', params: { status: '404' } }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  base: process.env.NODE_ENV === 'production' ? '/project-manager/' : '/'
})

router.beforeEach((to) => {
  if(to.meta && to.meta.requiresAuth === true) {
    if(!localStorage.getItem('access_token')) {
      router.push({ name: 'RegisterView', query: { to: to.fullPath } })
    }
  }
})

export default router



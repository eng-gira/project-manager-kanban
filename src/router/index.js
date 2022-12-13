import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import AuthLayout from '../views/AuthLayout.vue'
import SidebarLayout from '../views/SidebarLayout.vue'
import ProjectView from '../views/ProjectView.vue'
import TaskModal from '../views/TaskModal.vue'

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
        component: RegisterView
      },
      {
        path: 'login',
        name: 'LoginView',
        component: LoginView
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
            path: 'task/:id/',
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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if(to.meta && to.meta.requiresAuth === true) {
    if(!localStorage.getItem('access_token')) {
      router.push({ name: 'RegisterView', query: { to: to.fullPath } })
    }
  }
})

export default router



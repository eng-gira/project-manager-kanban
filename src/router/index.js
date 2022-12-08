import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SidebarLayout from '../views/SidebarLayout.vue'
import ProjectView from '../views/ProjectView.vue'
import TaskModal from '../views/TaskModal.vue'

const routes = [
  // {
  // // Auth Layout
  //    path: 'auth',
  //    name: 'AuthLayout,
  //    children: [{
  //      // Login
  //      // Register
  //    }]
  // },
  {
  // App Layout
    path: '/',
    name: 'SidebarLayout',
    component: SidebarLayout,
    children: [{
      // path: '/:projectId',
      path: '/temp-proj-view',
      name: 'ProjectView',
      component: ProjectView,
      children: [
          {
            path: 'task/:id',
            name: 'TaskModal',
            component: TaskModal,
            props: true,
          }
      ]
    },
    ]
  },
  // {
  //   path: '/',
  //   name: 'ProjectView',
  //   component: ProjectView,
  //   children: [
  //     {
  //       path: 'task/:id',
  //       name: 'TaskModal',
  //       component: TaskModal,
  //       props: true,
  //     }
  //   ]
  // },
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

export default router

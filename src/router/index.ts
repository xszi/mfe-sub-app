import Layout from '@/layout/index.vue'
import { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/sub-app/home'
  },
  {
    path: '/sub-app/home',
    name: 'Layout',
    component: Layout
  }
]

export default routes

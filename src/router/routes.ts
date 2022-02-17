import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import NotFound from '@/views/constants/404.vue'
import NoAuth from '@/views/constants/403.vue'
import Login from '@/views/constants/Login.vue'
import Redirect from '@/views/constants/Redirect.vue'

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    component: Layout,
    meta: {
      title: '系统管理',
    },
    name: 'system',
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/async/system/Menu.vue'),
        meta: {
          title: '菜单管理',
        },
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/async/system/User.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/async/system/Role.vue'),
        meta: {
          title: '角色管理',
        },
      },
      {
        path: 'dept',
        name: 'dept',
        component: () => import('@/views/async/system/Dept.vue'),
        meta: {
          title: '部门管理',
        },
      },
    ],
  },
  {
    path: '/audit',
    component: Layout,
    meta: {
      title: '审批管理',
    },
    name: 'audit',
    children: [
      {
        path: 'leave',
        name: 'leave',
        component: () => import('@/views/async/audit/Leave.vue'),
        meta: {
          title: '休假申请',
        },
      },
      {
        path: 'approve',
        name: 'approve',
        component: () => import('@/views/async/audit/Approve.vue'),
        meta: {
          title: '待我审批',
        },
      },
    ],
  },
]

export const routes: Array<RouteRecordRaw> = [
  // ...asyncRoutes,
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/welcome',
    meta: {
      title: '首页',
    },
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/constants/Welcome.vue'),
        meta: {
          title: '欢迎使用Vue3-admin',
        },
      },
    ],
  },
  {
    path: '/exception',
    name: 'exception',
    component: Layout,
    redirect: '/exception/404',
    meta: {
      title: '异常',
    },
    children: [
      {
        path: '403',
        name: 'page403',
        component: NoAuth,
        meta: {
          title: '403',
        },
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'page404',
        component: NotFound,
        meta: {
          title: '404',
        },
      },
    ],
  },
  {
    path: '/redirect/:path(.*)*',
    name: 'redirect',
    component: Redirect,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录',
    },
  },
]

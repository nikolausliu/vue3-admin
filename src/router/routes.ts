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
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/async/system/Menu.vue'),
        meta: {
          title: '菜单管理',
        },
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/async/system/User.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/async/system/Role.vue'),
        meta: {
          title: '角色管理',
        },
      },
      {
        path: 'dept',
        name: 'Dept',
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
    children: [
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('@/views/async/audit/Leave.vue'),
        meta: {
          title: '休假申请',
        },
      },
      {
        path: 'approve',
        name: 'Approve',
        component: () => import('@/views/async/audit/Approve.vue'),
        meta: {
          title: '待我审批',
        },
      },
    ],
  },
]

export const routes: Array<RouteRecordRaw> = [
  ...asyncRoutes,
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

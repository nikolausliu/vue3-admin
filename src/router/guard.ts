import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { Router } from 'vue-router'
import { setTitle } from '@/utils/browser'
import { pathExist } from '@/router/menus'
import { getFirstRoutePath } from '@/utils'
import { useAppStore } from '@/pinia/modules/app'
import { useMenusStore } from '@/pinia/modules/menus'
import { getPiniaToken } from '@/utils/auth'

export function createGuard(router: Router): void {
  const appStore = useAppStore()
  const menusStore = useMenusStore()
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    appStore.setLoading(true)
    const token = getPiniaToken()
    if (!token && to.name !== 'login') {
      next({
        name: 'login',
      })
    }
    // 对 '' 和 '/' 单独处理（在路由里定义了redirect不起作用）
    const { path, name } = to
    const firstRoutePath = getFirstRoutePath()
    if (path === '' || path === '/') {
      next(firstRoutePath)
    }
    // 对无权限的路由跳转到403页面
    // const menus = menusStore.menus
    // const exist = pathExist(menus, path)
    // const whiteList = ['redirect', 'login', 'page403', 'page404']
    // if (!exist && !whiteList.includes((name || '') as string)) {
    //   next('/exception/403')
    // }
    // 正常跳转
    next()
  })

  router.afterEach((to) => {
    NProgress.done()
    setTitle(to.meta.title as string, import.meta.env.VITE_APP_TITLE as string)
    appStore.setLoading(false)
    appStore.setBackVisible(!!to.meta.isSubPage as boolean)
    appStore.setActivePath((to.meta.activePath as string) || to.path)
  })
}

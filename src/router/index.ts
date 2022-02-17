import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { createGuard } from './guard'
import { useMenusStore } from '@/pinia/modules/menus'
import { generateRoute } from '@/utils'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        top: 0,
      }
    }
  },
})

const menusStore = useMenusStore()
const loadAsyncRoutes = async () => {
  const menus = JSON.parse(JSON.stringify(menusStore.menus))
  const routes = generateRoute(menus)
  routes.forEach((route) => {
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    const url = `./../views/async/${route.component}.vue`
    route.component = () => import(url)
    router.addRoute('home', route)
  })
}
await loadAsyncRoutes()
createGuard(router)

export default router
